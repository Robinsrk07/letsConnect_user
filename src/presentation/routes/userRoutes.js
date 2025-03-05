const express = require("express");



class userRoutes {
    constructor(userController) {
        this.router = express.Router();
        this.userController = userController;
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get('/userService/requests/received',(req,res,next)=>this.userController.handleRequestRecived(req,res,next));
        this.router.get("/userService/connection",(req,res,next)=>this.userController.handleAllconnections(req,res,next));
        this.router.get('/userService/feed',(req,res,next)=>this.userController.handleFeed(req,res,next));
    }
    getRouter() {
        return this.router;
    }
}

module.exports = userRoutes;
 