import cloudinary from "../config/cloudinary.js";
import productModel from "../models/productModel.js";
import fs from "fs";

/* =====================================================
   ADD PRODUCT (ADMIN)
   Route: POST /product/add
===================================================== */
export const addProduct = async (req, res) => {
  console.log("=== ADD PRODUCT START ===");
  
  try {
    // 1. Debug: Check Cloudinary initialization
    console.log("🔍 Cloudinary Check:");
    console.log("- Is cloudinary defined?", cloudinary ? "YES" : "NO");
    console.log("- cloudinary.uploader exists?", cloudinary?.uploader ? "YES" : "NO");
    console.log("- cloudinary.config:", cloudinary?.config ? "YES" : "NO");
    
    if (!cloudinary || !cloudinary.uploader) {
      throw new Error("Cloudinary is not properly initialized. Check your cloudinary.js config file.");
    }

    // 2. Validate request data
    if (!req.body.productData) {
      return res.status(400).json({
        success: false,
        message: "Product data is required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    console.log(`📁 Files received: ${req.files.length}`);
    console.log(`📦 Product data: ${req.body.productData}`);

    // 3. Parse product data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
      console.log("✅ Product data parsed:", productData);
    } catch (parseError) {
      console.error("❌ Failed to parse productData:", parseError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid product data format",
      });
    }

    // 4. Upload images to Cloudinary with better error handling
    console.log("☁️ Starting Cloudinary upload...");
    const imageUrls = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      console.log(`Uploading file ${i + 1}/${req.files.length}: ${file.originalname}`);
      
      try {
        // Check if file exists
        if (!fs.existsSync(file.path)) {
          console.error(`❌ File not found: ${file.path}`);
          continue;
        }

        // Upload to Cloudinary with timeout
        const uploadPromise = cloudinary.uploader.upload(file.path, {
          folder: "products",
          resource_type: "image",
        });

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Cloudinary upload timeout")), 30000);
        });

        const result = await Promise.race([uploadPromise, timeoutPromise]);
        
        console.log(`✅ Uploaded to Cloudinary: ${result.secure_url}`);
        imageUrls.push(result.secure_url);

        // Remove temp file
        try {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Deleted temp file: ${file.path}`);
        } catch (unlinkError) {
          console.error(`Failed to delete temp file ${file.path}:`, unlinkError.message);
        }

      } catch (uploadError) {
        console.error(`❌ Failed to upload ${file.originalname}:`, uploadError.message);
        
        // Clean up temp file even if upload failed
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError.message);
        }
        
        // If first image fails, we should probably stop
        if (i === 0) {
          throw new Error(`Failed to upload main image: ${uploadError.message}`);
        }
      }
    }

    // 5. Check if any images were uploaded
    if (imageUrls.length === 0) {
      throw new Error("No images were successfully uploaded to Cloudinary");
    }

    console.log("✅ All image URLs:", imageUrls);

    // 6. Create product in database
    console.log("💾 Creating product in database...");
    
    // Ensure product has required fields
    const productToCreate = {
      ...productData,
      images: imageUrls,
      // Also store first image separately for compatibility
      image: imageUrls[0],
      // Ensure required fields have defaults
      name: productData.name || "Unnamed Product",
      price: productData.price || 0,
      category: productData.category || "Uncategorized",
      stock: productData.stock || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
    };

    const product = await productModel.create(productToCreate);
    
    console.log("✅ Product created successfully. ID:", product._id);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: {
        _id: product._id,
        name: product.name,
        images: product.images,
        createdAt: product.createdAt,
      },
    });

  } catch (error) {
    console.error("❌ ADD PRODUCT ERROR:", error);
    console.error("Error stack:", error.stack);
    
    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`🗑️ Cleaned up temp file: ${file.path}`);
          }
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError.message);
        }
      });
    }

    // Provide helpful error message
    let errorMessage = "Failed to add product";
    
    if (error.message.includes("Cloudinary") || error.message.includes("upload")) {
      errorMessage = "Image upload failed. Please check Cloudinary configuration.";
    } else if (error.message.includes("validation")) {
      errorMessage = "Product validation failed: " + error.message;
    } else if (error.message.includes("timeout")) {
      errorMessage = "Upload took too long. Please try again with smaller images.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    console.log("=== ADD PRODUCT END ===");
  }
};

/* =====================================================
   LIST ALL PRODUCTS
   Route: GET /product/list
===================================================== */
export const listProduct = async (req, res) => {
  try {
    console.log("📋 Listing all products...");
    
    const products = await productModel.find({}).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${products.length} products`);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ LIST PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE PRODUCT
   Route: GET /product/:id
===================================================== */
export const singleProduct = async (req, res) => {
  try {
    console.log(`🔍 Fetching product: ${req.params.id}`);
    
    const product = await productModel.findById(req.params.id);

    if (!product) {
      console.log(`❌ Product not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`✅ Product found: ${product.name}`);
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ SINGLE PRODUCT ERROR:", error);
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

/* =====================================================
   CHANGE PRODUCT STOCK (ADMIN)
   Route: PUT /product/stock/:id
===================================================== */
export const changeStock = async (req, res) => {
  try {
    const { inStock } = req.body;

    if (typeof inStock !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "inStock must be a boolean value",
      });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Stock status updated",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

/* =====================================================
   TEST CLOUDINARY ENDPOINT
   Route: GET /product/test-cloudinary
===================================================== */
export const testCloudinary = async (req, res) => {
  try {
    console.log("🔧 Testing Cloudinary connection...");
    
    // Check if cloudinary is defined
    if (!cloudinary) {
      return res.json({
        success: false,
        message: "Cloudinary object is undefined",
      });
    }
    
    // Check if uploader exists
    if (!cloudinary.uploader) {
      return res.json({
        success: false,
        message: "cloudinary.uploader is undefined",
      });
    }
    
    // Try to ping Cloudinary
    try {
      const pingResult = await cloudinary.api.ping();
      console.log("✅ Cloudinary ping successful:", pingResult);
      
      return res.json({
        success: true,
        message: "Cloudinary is working!",
        ping: pingResult,
        cloudinary: {
          uploaderExists: true,
          apiExists: true,
          configExists: !!cloudinary.config,
        },
        env: {
          cloudName: process.env.CLDN_NAME ? "SET" : "MISSING",
          apiKey: process.env.CLDN_API_KEY ? "SET" : "MISSING",
          apiSecret: process.env.CLDN_SECRET_KEY ? "SET" : "MISSING",
        }
      });
    } catch (pingError) {
      console.error("❌ Cloudinary ping failed:", pingError);
      return res.json({
        success: false,
        message: "Cloudinary ping failed",
        error: pingError.message,
        env: {
          cloudName: process.env.CLDN_NAME,
          hasApiKey: !!process.env.CLDN_API_KEY,
          hasApiSecret: !!process.env.CLDN_SECRET_KEY,
        }
      });
    }
    
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE PRODUCT
   Route: DELETE /product/:id
===================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Extract public_id from Cloudinary URL
          if (imageUrl && imageUrl.includes('cloudinary.com')) {
            const parts = imageUrl.split('/');
            const filename = parts[parts.length - 1];
            const folder = parts[parts.length - 2];
            const publicId = `${folder}/${filename.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudErr) {
          console.error('Cloudinary delete error:', cloudErr.message);
        }
      }
    }

    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/* =====================================================
   UPDATE PRODUCT
   Route: PUT /product/:id
===================================================== */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Auto-set inStock based on stock value
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
      updateData.inStock = updateData.stock > 0;
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};