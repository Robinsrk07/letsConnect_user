const{NotFoundError,ValidationError}= require("../../errors/customError")
 const  ValidateProfileEditData = require("../../validators/validateProfileEditData")
 const validateProfileEditData = new ValidateProfileEditData()
class profileEditCase{
    constructor(userRepository,messageBroker){
        this.userRepository=userRepository
        this.messageBroker=messageBroker;
        this.queue="user_updated"
        console.log(this.messageBroker)
    }

     async execute(userId,req){
        
        const user = await this.userRepository.find(userId)
       
        if(!user){
            throw new  NotFoundError("invalid user")

        }
         if(!validateProfileEditData.validate(req)){
            throw new ValidationError("malware on req body")
         }
        const savedUser = await this.userRepository.updateUser(req,userId)

            process.nextTick(async()=>{
                await this.messageBroker.publish(this.queue, {
                    eventType: "userUpdate",
                    data: {
                        savedUser
                    },source:"user_service"
                }) 
            })
           
         return savedUser

     }                
} 

module.exports = profileEditCase 