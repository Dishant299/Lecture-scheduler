const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing",
            });
        }

        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authenticating",
        });
    }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Something went wrong while checking authorization",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Something went wrong while checking authorization",
    });
  }
};