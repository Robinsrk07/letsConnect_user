const express = require("express");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() });



class ProfileRoutes {
    constructor(profileController) {
        this.router = express.Router();
        this.profileController = profileController;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post("/forgot-password",(req,res,next)=> this.profileController.handleForgotPassword(req,res,next));
        this.router.get('/userService/user',(req,res,next)=> this.profileController.handleGetUser(req,res,next));
        this.router.patch('/userService/profile/edit',(req,res,next)=>  this.profileController.handleProfileEdit(req,res,next));
        this.router.get('/userService/profile/view' ,(req,res,next)=>  this.profileController.handleProfileView(req,res,next));
        this.router.post("/upload-photo",upload.any(),(req,res,next)=>this.profileController.handlenewPhotoUpload(req,res,next))
        this.router.delete("/delete-photo/:photoUrl",(req,res,next)=>this.profileController.handleDeletePhoto(req,res,next))
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProfileRoutes;
