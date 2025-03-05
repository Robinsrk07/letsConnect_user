const Connection = require("../../../doamin/entities/ConnectionRequest")
const IConnectionRequest = require("../../../application/interface/IConnectionRequest")
const ConnectionRequestModel = require("../../../infrastructure/dataBase/model/ConnectionRequestModel")
const mongoose = require('mongoose');


class ConnectionRepository extends IConnectionRequest{
    constructor(messageBroker) {
        super();
        this.messageBroker = messageBroker; // Inject message broker
    }


    async find(userId,toUserId){
     const connection = await ConnectionRequestModel.findOne({
        $or:[
            {senderId:userId,receiverId:toUserId},{senderId:toUserId,receiverId:userId}
           ]
     } )

     return connection?connection.toDomain():null
    }


    async findone(userId,requestId,status){
        console.log(userId,requestId,status)

         const connection = await ConnectionRequestModel.findOne({
            _id: new mongoose.Types.ObjectId(requestId),  // Ensure ObjectId type
            receiverId:userId,
            status:status
         })
         return connection?connection.toDomain():null
        }



    async requestRecived(userId){
   
        const connectionRequests = await ConnectionRequestModel.aggregate([
            {
                $match: { receiverId: new mongoose.Types.ObjectId(userId), status: "interested" }
            },
            {
                $lookup: {
                    from: "users",
                    let: { senderIdObj: "$senderId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toObjectId: "$userId" }, "$$senderIdObj"] } 
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                age: 1,
                                photoUrl: 1,
                                about: 1,
                                emailId: 1,
                                skills: 1
                            }
                        }
                    ],
                    as: "senderInfo"
                }
            },
            {
                $unwind: { path: "$senderInfo", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    senderId: 1,
                    receiverId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    senderInfo: 1
                }
            }
        ]);
    
        console.log(connectionRequests);
        return connectionRequests.length > 0 ? connectionRequests : [];
        }


        

        async save(userId, toUserId, status) {
            const connection = new ConnectionRequestModel({
                senderId: userId,
                receiverId: toUserId,
                status
            });
        
            const savedDocument = await connection.save();
            console.log("Saved document ID:", savedDocument._id); // Log the MongoDB ObjectId
        
            const savedConnection = savedDocument.toDomain();
            console.log("Saved connection from repository:", savedConnection);
            console.log("Saved connection requestId:", savedConnection.requestId); // Log the requestId
        
            const event = {
                eventType: "ConnectionRequestCreated",
                data: {
                    requestId: savedConnection.requestId, // Use requestId here
                    senderId: savedConnection.senderId,
                    receiverId: savedConnection.receiverId,
                    status: savedConnection.status,
                    timestamp: new Date().toISOString()
                }
            };
        
            await this.messageBroker.publish("connection_request_queue", JSON.stringify(event));
        
            return savedConnection;
        }

        
        async allconnections(userId) {
            const SAFE_DATA = ["firstName", "lastName", "age", "photoUrl", "about", "emailId", "skills"];
            console.log("Fetching connections for user:", userId);


    
            const connections = await ConnectionRequestModel.find({
                $or: [
                    { senderId: userId, status: "accepted" },
                    { receiverId: userId, status: "accepted" }
                ]
            })
           
    
            return connections;
        }

        async getAllConnection(userId){
            console.log("fromdb",userId)
            const connection = await ConnectionRequestModel.find({
                $or:[
                    {senderId:userId},
                    {receiverId:userId}
                ]
            })
            //.select("senderId receiverId")
            return connection 
        }


        async updateConnection(requestId, status) {
            if (!mongoose.Types.ObjectId.isValid(requestId)) {
                throw new Error("Invalid requestId format");
            }
        
            const updatedConnection = await ConnectionRequestModel.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(requestId) },
                { $set: { status: status } },
                { new: true } // Return the updated document
            );
        
            return updatedConnection ? updatedConnection.toDomain() : null;
        }
        


}



module.exports = ConnectionRepository