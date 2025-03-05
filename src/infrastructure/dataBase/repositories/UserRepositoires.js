const UserModel = require('../model/UserModel');
const IUserRepository = require('../../../application/interface/IUserRepository');
const{DataBaseError}=require("../../errors/customError")
const User = require("../../../doamin/entities/user")
const mongoose = require('mongoose');

class UserRepository extends IUserRepository {
    constructor(messageBroker) {
        super();
        this.messageBroker = messageBroker; // Inject message broker
    }
    async find(userId) {
       try{
          const user = await UserModel.findOne({userId:userId})
          console.log("from db",user)
          return user
        } 
        catch(err){
            return null
                  }
    }


    async findByIds(userIds) {
        console.log("Input userIds:", userIds);
    
       
        const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));
        console.log("Converted objectIds:", objectIds);
    
        
        const friends = await UserModel.find({ userId : { $in: objectIds } })
            .select("firstName lastName age photoUrl about emailId skills userId");
    
        console.log("Fetched friends:", friends);
        return friends;
    }


    async save(user) {
        try {
            const newUser = new UserModel(user);  
            const savedUser = await newUser.save();
            const event ={
                eventType:"UserCreated",
                data:{savedUser}
            }
         

            return savedUser; 
        } catch (err) {
            throw new DataBaseError("Error saving user: " + err.message);
        }
    }


    async updatePassword(userId, newPassword) {
        try {
            // Update only the password for the user with the given userId
            const updatedUser = await UserModel.findOneAndUpdate(
                { userId: userId }, // Find the user by userId
                { $set: { password: newPassword } }, // Update only the password
                { new: true } // Return the updated document
            );

            if (!updatedUser) {
                throw new DataBaseError("User not found");
            }

            return updatedUser;
        } catch (err) {
            throw new DataBaseError("Error updating password: " + err.message);
        }
    }


    async updateUser(user,userId){
        try {
            // Update the existing user
            const updatedUser = await UserModel.findOneAndUpdate(
                { userId:userId }, // Find the user by userId
                { $set: user }, // Update all fields provided in the user object
                { new: true } // Return the updated document
            );
            if (!updatedUser) {
                throw new DataBaseError("User not found");
            }
            return updatedUser;
        } catch (err) {
            throw new DataBaseError("Error saving user: " + err.message);
        }
    }





    async findExcludeUser(execludes,skip,limit){
        console.log("from db sd",execludes)
        const objectIds = execludes.map(id => new mongoose.Types.ObjectId(id));
        return await UserModel.find({userId:{$nin:objectIds}}).
        select("-password").
        skip(skip).
        limit(limit);
    }
    
}

module.exports = UserRepository;

 //select(["firstName" ,"lastName","age","photoUrl","about","emailId","skills,userId"]).