import React, { useContext, useState } from "react";
import { Upload, X, Tag, DollarSign, Grid, Star, Save, Package, Type, Hash, FileText } from "lucide-react";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(ShopContext);

  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "Serenity",
    sizes: [],
    stock: 100,
    popular: false,
  });
  const [loading, setLoading] = useState(false);

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const categoryOptions = ["Serenity", "Signature", "Oud", "Floral", "Citrus", "Home"];

  const handleSizeToggle = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const removeImage = (index) => setFiles(files.filter((_, i) => i !== index));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.category || files.length === 0) {
      toast.error("Please fill all required fields and upload at least one image");
      return;
    }

    if (form.offerPrice && parseFloat(form.offerPrice) >= parseFloat(form.price)) {
      toast.error("Offer price must be less than original price");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : parseFloat(form.price),
        sizes: form.sizes.length ? form.sizes : ["M"],
        inStock: form.stock > 0,
        stock: parseInt(form.stock),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      files.forEach((file) => file && formData.append("images", file));

      const { data } = await axios.post("/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Product added successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          offerPrice: "",
          category: "Serenity",
          sizes: [],
          stock: 100,
          popular: false,
        });
        setFiles([]);
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-0">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
              <p className="text-sm text-gray-600">Complete the form below to list a new product</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-full">{files.length}/4 images</span>
            <span className={`px-3 py-1 rounded-full ${files.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {files.length > 0 ? 'Ready' : 'No Images'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Full width */}
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          
          {/* Images Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-black rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Product Images</h2>
                <p className="text-sm text-gray-600">Upload up to 4 high-quality images</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${files[i] ? 'border-gray-900' : 'border-dashed border-gray-300'} transition-all hover:border-gray-900`}>
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const newFiles = [...files];
                          newFiles[i] = e.target.files[0];
                          setFiles(newFiles.filter(Boolean));
                        }
                      }}
                    />
                    {files[i] ? (
                      <>
                        <img
                          src={URL.createObjectURL(files[i])}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeImage(i); }}
                            className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {i === 0 && (
                          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center p-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          {i === 0 ? "Main Image *" : `Image ${i + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">Click to upload</p>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-black rounded-lg">
                    <Type className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <p className="text-sm text-gray-600">Essential product details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe your product in detail..."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Offer Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                        <input
                          type="number"
                          name="offerPrice"
                          value={form.offerPrice}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizes Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-black rounded-lg">
                    <Grid className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Available Sizes</h2>
                    <p className="text-sm text-gray-600">Select sizes available for this product</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-5 py-3 rounded-lg border-2 font-medium transition-all ${form.sizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-800"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  {form.sizes.length > 0
                    ? `Selected: ${form.sizes.join(", ")}`
                    : "No sizes selected"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Category & Stock Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-black rounded-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Category & Stock</h2>
                    <p className="text-sm text-gray-600">Product classification and inventory</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black bg-white"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 items-center gap-2">
                      <Hash className="w-4 h-4" /> Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
                      min="0"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Mark as Popular</p>
                        <p className="text-sm text-gray-600">Feature this product</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, popular: !prev.popular }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.popular ? "bg-black" : "bg-gray-300"
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.popular ? "translate-x-6" : "translate-x-1"
                        }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || !form.name || !form.description || !form.price || files.length === 0}
                    className="w-full py-3.5 bg-black text-white font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Add Product
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all fields?")) {
                        setForm({
                          name: "",
                          description: "",
                          price: "",
                          offerPrice: "",
                          category: "Serenity",
                          sizes: [],
                          stock: 100,
                          popular: false,
                        });
                        setFiles([]);
                        toast.success("Form cleared!");
                      }
                    }}
                    className="w-full py-3 border-2 border-gray-300 text-gray-800 font-medium rounded-lg hover:border-gray-800 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Clear All Fields
                  </button>
                </div>

                {/* Form Status */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-3">Form Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Images</span>
                      <span className={files.length > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {files.length > 0 ? "✓ Ready" : "✗ Required"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Basic Info</span>
                      <span className={form.name && form.description && form.price ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {form.name && form.description && form.price ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sizes</span>
                      <span className={form.sizes.length > 0 ? "text-green-600 font-medium" : "text-gray-600 font-medium"}>
                        {form.sizes.length > 0 ? `${form.sizes.length} selected` : "Optional"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200 mt-8 py-4 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All fields marked with * are required. Images will be uploaded to Cloudinary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;