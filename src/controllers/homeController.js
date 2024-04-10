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
let getCRUD = (req, res) => {
  try {
    return res.render("./test/crud.ejs");
  } catch (error) {}
};
let postCRUD = async (req, res) => {
  try {
    // console.log(req.body);
    await CRUDServices.createNewUser(req.body);
    return res.send("add a new user");
  } catch (error) {}
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
};
