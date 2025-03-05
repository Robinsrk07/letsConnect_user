const { connections } = require("mongoose");
const{ConnectionError,NotFoundError}= require("../../errors/customError")
const mongoose = require('mongoose');


class Connections{
    constructor(userRepository,connectionRepository){
        this.userRepository = userRepository;
        this.ConnectionRepository = connectionRepository
    }

    async execute(userId){

        const [user,allConnections]=await Promise.all([
            this.userRepository.find(userId),
            this.ConnectionRepository.allconnections(userId)
        ])

        if(!user){
        throw new NotFoundError("user not found")
        }

        if(!allConnections ){
            throw new NotFoundError("connections not found")
        }
       

        const connectionsWithDetails  = allConnections.map((connection) => {  
            const isSender = connection.senderId.equals(userId);
            return isSender ? connection.receiverId._id: connection.senderId._id;

        });

        const friends = await this.userRepository.findByIds(connectionsWithDetails)
        console.log(friends)
        return friends;

    }
}

module.exports = Connections