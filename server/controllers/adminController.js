import jwt from "jsonwebtoken";

const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// 🔒 Rate limiting store (for production, use Redis or DB)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// ✅ Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const attempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: Date.now() };

    // Too many login attempts
    if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
      });
    }

    // ✅ Check credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      // Reset attempts on success
      loginAttempts.delete(clientIP);

      const token = jwt.sign(
        {
          email,
          role: "admin",
          timestamp: Date.now(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
          issuer: "your-app-name",
          subject: email,
        }
      );

      res.cookie("adminToken", token, cookieOption);

      return res.json({
        success: true,
        message: "Admin logged in successfully",
      });
    } else {
      // Increment failed attempts
      attempts.count++;
      attempts.lastAttempt = Date.now();
      loginAttempts.set(clientIP, attempts);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Middleware: Require admin authentication
export const requireAdminAuth = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// ✅ Check authentication status
export const isAdminAuth = async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      admin: { email: decoded.email },
    });
  } catch (error) {
    console.error("Auth check error:", error.message);
    return res.json({ success: false });
  }
};

// ✅ Admin logout (correct export name)
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      ...cookieOption,
      maxAge: 0, // expire immediately
    });

    return res.json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
