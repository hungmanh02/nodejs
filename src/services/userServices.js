import db from "../models/index";
import bcrypt from "bcryptjs";
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isUserExist = await checkUserEmail(email);
      if (isUserExist) {
        // user already exist
        let user = await db.User.findOne({
          attributes: {
            include: ["email", "password", "roleId"],
          },
          where: {
            email: email,
          },
          raw: true,
        });
        if (user) {
          // compare password
          let checkPassword = await bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            delete user.password;
            userData.errCode = 0;
            userData.errMessage = "Ok";
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
module.exports = {
  handleUserLogin: handleUserLogin,
};
