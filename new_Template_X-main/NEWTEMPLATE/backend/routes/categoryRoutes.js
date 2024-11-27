import express from "express";

import { CreateCategoryController, categoryControlller, deleteCategoryCOntroller, getCategoryProductCount, singleCategoryController, updateCategoryController } from './../controllers/categoryController.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


const router = express.Router()

//routes

router.post("/create-category",requireSignIn,isAdmin,CreateCategoryController);

//update category
router.put(
    "/update-category/:id",
    requireSignIn,
    isAdmin,
    updateCategoryController
  );

  //getALl category
  router.get("/get-category", categoryControlller);

  //single category
  router.get("/single-category/:slug", singleCategoryController);

  //delete category
  router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryCOntroller
  );

  router.get("/chart-data", getCategoryProductCount);
export default router