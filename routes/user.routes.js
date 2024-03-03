const { Router } = require("express");
const router = Router();
const {
  signIn,
  getUsers,
  signUp,
  updateUser,
  deleteUser,
  signOut,
  getUsersBySpecialty,
} = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth");
const { User } = require("../models/user.model");

router.post("/SignIn", signIn);
router.post("/SignUp", signUp);
router.post("/SignOut", signOut);
router.get("/", getUsers);
router.get("/specialty", getUsersBySpecialty);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/init-user", auth, async (req, res) => {
  const user = req.user;
  try {
    const dbUser = await User.findById(user.id);
    res.send(dbUser);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
