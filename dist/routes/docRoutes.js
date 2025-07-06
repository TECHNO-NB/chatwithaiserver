import express from "express";
import { jwtVerify } from "../middlewares/authMiddleware.js";
import { createNewDoc, deleteDocWithId, getAllDoc, } from "../controllers/docControllers.js";
import upload from "../middlewares/multerMiddleware.js";
const router = express.Router();
router.route("/all-doc").post(jwtVerify, getAllDoc);
router
    .route("/create-doc")
    .post(jwtVerify, upload.single("file"), createNewDoc);
router.route("/delete-doc/:docid").delete(jwtVerify, deleteDocWithId);
export default router;
