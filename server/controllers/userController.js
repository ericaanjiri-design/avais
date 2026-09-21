import userModel from "../models/userModel.js"
import validator from "validator"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const cookieOption = {
  httpOnly: true,
  secure: process.env.APP_ENV === "production",  // ✅ use correct env name
  sameSite: process.env.APP_ENV === "production" ? "none" : "strict"
}

// 🧩 JWT middleware to verify cookie
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.json({ success: false, message: "No token found" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.json({ success: false, message: "Invalid or expired token" })
  }
}

// 🧩 REGISTER USER
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: "User already exists" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({ name, email, password: hashedPassword })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token, { ...cookieOption, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return res.json({
      success: true,
      user: { name: newUser.name, email: newUser.email },
      message: "Registration successful"
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// 🧩 LOGIN USER
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" }) // ✅ fixed
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token, { ...cookieOption, maxAge: 7 * 24 * 60 * 60 * 1000 })

    return res.json({
      success: true,
      user: { name: user.name, email: user.email },
      message: "Login successful"
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// 🧩 VERIFY USER SESSION
export const isAuth = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password")
    if (!user) return res.json({ success: false, message: "User not found" })

    return res.json({ success: true, user })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// 🧩 LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOption)
    res.json({ success: true, message: "Successfully logged out" })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}
