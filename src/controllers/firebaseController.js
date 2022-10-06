const admin = require("firebase-admin");

const auth = admin.initializeApp().auth();

const getAllUsersFromFirebase = async (req, res) => {
  try {
    let users = await auth.listUsers(200);
    res.json(users);
   // console.log(users);
  } catch (error) {
    return res.json({ message: error });
  }
};

const getUserByIdOfFirebase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json("No ID provided!");
    let user = await auth.getUser(id);
    return res.json(user);
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = {
  getUserByIdOfFirebase,
  getAllUsersFromFirebase,
};
