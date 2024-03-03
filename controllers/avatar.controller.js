
// const fs = require("fs");
// const path = require("path");

// const uploadAvatar = async (req, res) => {
//   try {
//     const avatar = req.file;

//     if (!avatar) {
//       return res.status(400).json({ message: "No avatar uploaded" });
//     }

//     const uploadDir = path.join(__dirname, "..", "uploads");
//     const avatarPath = path.join(uploadDir, avatar.filename);

//     fs.renameSync(avatar.path, avatarPath);

//     res.status(201).json({ avatarUrl: `/uploads/${avatar.filename}` });
//   } catch (error) {
//     console.error("Error uploading avatar:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   uploadAvatar,
// };
