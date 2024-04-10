import express from "express";
import homeController from "../controllers/homeController";
let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/get-crud", homeController.getCRUD);
  router.get("/create-crud", homeController.createCRUD);
  router.post("/add-crud", homeController.addCRUD);
  router.get("/edit-crud", homeController.editCRUD);
  router.post("/update-crud", homeController.updateCRUD);
  // rest api
  return app.use("/", router);
};
module.exports = initWebRoutes;
