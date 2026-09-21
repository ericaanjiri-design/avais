import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // 🔹 Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }

    // 🔹 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    // 🔹 Attach user ID to request object
    req.userId = decoded.id;

    // ✅ Allow the request to continue
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please log in again.",
    });
  }
};

export default authUser;
