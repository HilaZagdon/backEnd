const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utilities/jwt");

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });
      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
};

const signUp = async (req, res) => {
  try {
    const { fullName, email, password, role, specialty } = req.body; 
    const hash = await bcrypt.hash(password, 10);

    if (!["admin", "doctor", "patient"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = new User({
      fullName,
      email,
      password: hash,
      role,
      specialty,
    });
    newUser.id = newUser._id;
    await newUser.save();
    res.status(201).json({ newUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error" });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, password },
      { new: true }
    );
    res
      .status(200)
      .json({updatedUser});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).json({ error: "error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "error" });
  }
};


const signOut = async (req, res) => {
  try {

    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUsersBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.query;
    console.log("Specialty:", specialty); 
    if (!specialty) {
      return res.status(400).json({ error: "Specialty parameter is missing" });
    }
  
    const doctors = await User.find({role: "doctor" });
    console.log("Doctors:", doctors); 
    res.status(200).send(doctors);
  } catch (error) {
    console.error("Error searching for doctors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






module.exports = { signIn, signUp, getUsers, updateUser, deleteUser, signOut, getUsersBySpecialty  };
