import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { adminToken } = req.cookies;

    if (!adminToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in." 
      });
    }

    // Verify token with proper error handling
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    // Validate token structure
    if (!decoded || typeof decoded !== 'object') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format." 
      });
    }

    // Check for required fields
    if (!decoded.email || !decoded.role) {
      return res.status(401).json({ 
        success: false, 
        message: "Token missing required information." 
      });
    }

    // Verify admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Optional: Validate against specific admin email if needed
    if (process.env.ADMIN_EMAIL && decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Invalid admin credentials." 
      });
    }

    // Add admin info to request object
    req.admin = {
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid authentication token." 
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please log in again." 
      });
    }
    
    // Generic error for other JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed." 
      });
    }
    
    // For unexpected errors
    console.error("Unexpected auth error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication." 
    });
  }
};

export default authAdmin;