const express = require("express");



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
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProfileRoutes;
