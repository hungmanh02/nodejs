import userServices from "../services/userServices";
import bcrypt from "bcryptjs";
// users
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; // ALL, SINGLE
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }
  let users = await userServices.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};
let handleLogin = async (req, res) => {
  let email = req.body.email;
  var password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await userServices.handleUserLogin(email, password);
  // 1. check email exist
  // 2. compare password
  // 3. return userInfor
  // 4. access_token: JWT json web token
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,

    user: userData.user ? userData.user : {},
  });
};
let handleCreateNewUser = async (req, res) => {
  let message = await userServices.createNewUser(req.body);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userServices.editUser(data);
  return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }

  let message = await userServices.deleteUser(req.body.id);
  return res.status(200).json(message);
};
// allcode
let handleGetAllCode = async (req, res) => {
  try {
    let allcodes = await userServices.getAllCodeService(req.query.type);
    console.log(allcodes);
    if (!req.query.type) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required paramaters !",
      });
    }
    return res.status(200).json({
      errCode: 0,
      errMessage: "Ok",
      data: allcodes.data,
    });
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from serve",
    });
  }
};
module.exports = {
  //users
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  //allcode
  handleGetAllCode: handleGetAllCode,
};
