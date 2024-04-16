import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";
import { raw } from "body-parser";
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isUserExist = await checkUserEmail(email);
      if (isUserExist) {
        // user already exist
        let user = await db.User.findOne({
          attributes: ["email", "password", "roleId"],
          where: {
            email: email,
          },
          raw: true,
        });
        if (user) {
          // compare password
          let checkPassword = await bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong pasword`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's isn't not found`;
        }
      } else {
        // return error
        userData.errCode = 1;
        userData.errMessage = `Your's Email ison't exist your system .Plz try other email`;
      }
      resolve(userData);
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
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          email: userEmail,
        },
      });
      if (!user) {
        resolve(false);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "ALL";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          attributes: {
            exclude: ["password"],
          },
          where: {
            id: userId,
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email is exist??
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used, Plz try another email",
        });
      } else {
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
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters !",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.fullName = data.fullName;
        user.phoneNumber = data.phoneNumber;
        user.address = data.address;
        // await db.User.save({
        //   fullName: data.fullName,
        //   phoneNumber: data.phoneNumber,
        //   address: data.address,
        // });
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Up data user success !",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found !",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        resolve({
          errCode: 1,
          errMessage: `The user isn't exisst`,
        });
      }
      await db.User.destroy({
        where: {
          id: userId,
        },
      });
      resolve({
        errCode: 0,
        errMessage: "The user is deleted",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  editUser: editUser,
  deleteUser: deleteUser,
};
