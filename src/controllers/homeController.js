import db from "../models/index";
import CRUDServices from "../services/CRUDservices";
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("./test/homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};
let getCRUD = async (req, res) => {
  let data = await CRUDServices.getAllUser();
  return res.render("./test/get-crud.ejs", {
    dataTable: data,
  });
};
let createCRUD = (req, res) => {
  try {
    return res.render("./test/crud.ejs");
  } catch (error) {}
};
let addCRUD = async (req, res) => {
  try {
    // console.log(req.body);
    await CRUDServices.createNewUser(req.body);
    return res.send("Create user success !");
  } catch (error) {}
};
let editCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDServices.getUserInfoById(userId);
    // check user data not found

    return res.render("./test/edit-crud.ejs", {
      userEdit: userData,
    });
  }
  return res.send("Users not found!");
};
let updateCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDServices.updateUserData(data);
  return res.render("./test/get-crud.ejs", {
    dataTable: allUser,
  });
};
let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDServices.deleteUserById(id);
    return res.send("delete success!");
  } else {
    return res.send("User not found");
  }
};
module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  createCRUD: createCRUD,
  addCRUD: addCRUD,
  editCRUD: editCRUD,
  updateCRUD: updateCRUD,
  deleteCRUD: deleteCRUD,
};
