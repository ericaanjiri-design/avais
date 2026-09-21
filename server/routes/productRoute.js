import express from "express";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import {
  addProduct,
  listProduct,
  singleProduct,
  changeStock,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authAdmin, upload.array("images", 5), addProduct);
productRouter.get("/list", listProduct);
productRouter.get("/:id", singleProduct);
productRouter.put("/stock/:id", changeStock);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
