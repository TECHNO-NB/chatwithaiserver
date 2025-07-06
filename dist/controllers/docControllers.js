import { Doc } from "../models/docModel.js";
import { User } from "../models/userModels.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteCloudinaryFile, uploadToCloudinary, } from "../utils/cloudinary.js";
const getAllDoc = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(false, 401, "Unauthorized");
    }
    const allDoc = await Doc.find({ owner: _id });
    if (!allDoc) {
        throw new ApiError(false, 400, "Document not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(true, 200, "All doc fetch successfully", allDoc));
});
const createNewDoc = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(false, 401, "Unauthorized");
    }
    const isPremium = await User.findById(_id, {
        isPremium: true,
    });
    const allDoc = await Doc.find({ owner: _id });
    if (allDoc.length >= 3 && !isPremium) {
        throw new ApiError(false, 400, "You can only upload 3 documents");
    }
    const { title } = req.body;
    const filePath = req.file?.path;
    if (!title || !filePath) {
        throw new ApiError(false, 400, "Title is required");
    }
    const Cloudinary_url = await uploadToCloudinary(filePath);
    if (!Cloudinary_url) {
        throw new ApiError(false, 500, "Failed to upload file to cloudinary");
    }
    const newDoc = await Doc.create({
        title,
        file: Cloudinary_url?.url,
        owner: _id,
    });
    if (!newDoc) {
        throw new ApiError(false, 500, "Failed to create new document");
    }
    return res
        .status(200)
        .json(new ApiResponse(true, 200, "Doc create successfully", newDoc));
});
const deleteDocWithId = asyncHandler(async (req, res) => {
    const { docid } = req.params;
    const { docurl } = req.body;
    if (!docid || !docurl) {
        throw new ApiError(false, 400, "Document id and Document url is required");
    }
    const deleteDoc = await Doc.findByIdAndDelete(docid);
    if (!deleteDoc) {
        throw new ApiError(false, 404, "Document not found");
    }
    const deleteFileFromCloudinary = await deleteCloudinaryFile(docurl);
    if (!deleteFileFromCloudinary) {
        throw new ApiError(false, 500, "Failed to delete file from cloudinary");
    }
    return res
        .status(200)
        .json(new ApiResponse(true, 200, "Document delete successfully", deleteDoc));
});
export { getAllDoc, createNewDoc, deleteDocWithId };
