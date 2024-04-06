import express from "express";

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};
// object : {
//     key:value
// }

module.exports = {
  getHomePage: getHomePage,
};
