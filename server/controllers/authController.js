const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    console.log("JWT_SECRET : ",process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
  console.log("registerUser Route")
  const { fullName, email, password, profileImageUrl } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
        .status(500)
        .json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message : "All fields are required"});
    }
    try {
        const user  = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message : "Invalid Credentials"});
        }
        res.status(200).json({
            id: user._id,
            user,
            token:generateToken(user._id),
        });
    } catch(err){ 
        res
            .status(500)
            .json({message: "Error registering User,",error:err.message});
    }
};

// Get User Info placeholder
exports.getUserInfo = async (req, res) => {
    try{
        const user =  await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        res.status(200).json(user);
    } catch(err){
        res
        .status(500)
        .json({message: "Error registration user", error:err.message});
    }
};
