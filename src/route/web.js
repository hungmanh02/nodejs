import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/get-crud", homeController.getCRUD);
  router.get("/create-crud", homeController.createCRUD);
  router.post("/add-crud", homeController.addCRUD);
  router.get("/edit-crud", homeController.editCRUD);
  router.post("/update-crud", homeController.updateCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  //  api user
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.post("/api/login", userController.handleLogin);

  router.get("/api/allcode", userController.handleGetAllCode);
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  return app.use("/", router);
};
module.exports = initWebRoutes;
