import { Router } from "express";
import { updateProducts, validateProducts } from "../controllers/productController.js";
import upload from "../config/multer.js";

const routes = Router();

routes.put('/products/validate', upload.single('file'), validateProducts);
routes.put('/products/update', updateProducts);

export default routes;
