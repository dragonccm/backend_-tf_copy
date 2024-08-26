import express from 'express'
import {handleHome} from '../controller/homeController'

const router = express.Router();

const initWebRouter = (app) => {
    router.get("/", handleHome);
    // router.get("/user", homeController.handleCreateUser);
    // router.post("/user/create-user", homeController.handleCreateNewUser);
    // router.post("/delete-user/:id", homeController.handleDeleteUser);
    // router.post("/edit-user/", homeController.handleEditUser);
    // router.get("/edit-user/:id", homeController.handleEdit);
    return app.use("/", router);
}

export default initWebRouter;