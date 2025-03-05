const express = require("express");



class requestRoutes {
    constructor(requestController) {
        this.router = express.Router();
        this.requestController = requestController;
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/userService/request/send/:status/:toUserID', (req,res,next)=>this.requestController.handleSendConnection(req,res,next));
        this.router.post('/userService/request/review/:status/:requestId', (req,res,next)=>this.requestController.handleReviewConnection(req,res,next));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = requestRoutes;
