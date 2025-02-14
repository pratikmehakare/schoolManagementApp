const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user:payload,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, gender, dob } = req.body;

    if (!name || !email || !password || !role || !gender || !dob) {
      return res.status(400).json({
        success: false,
        message: "All required fields are missing.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let profile;

    if (role === "Teacher") {
      profile = await Teacher.create({
        name,
        gender,
        dob,
        email
      });
    } else if (role === "Student") {
      profile = await Student.create({
        name,
        gender,
        dob,
        email,
      });
    }
    // For Admin, no separate profile is created.

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (profile) {
      userData.profileId = profile._id;
    }

    await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         if (!name || !email || !password || !role) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required.",
//             });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists.",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         await user.save();

//         return res.status(201).json({
//             success: true,
//             message: "User registered successfully.",
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };