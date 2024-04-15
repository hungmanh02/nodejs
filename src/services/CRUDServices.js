import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../models/index";
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        fullName: data.fullName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
        positionId: data.positionId,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.fullName = data.fullName;
        user.phoneNumber = data.phoneNumber;
        user.address = data.address;
        await user.save();
        let allUser = await db.User.findAll();
        resolve(allUser);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUserById = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userByid = await db.User.findOne({ where: { id: userId } });
      if (userByid) {
        await userByid.destroy();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
