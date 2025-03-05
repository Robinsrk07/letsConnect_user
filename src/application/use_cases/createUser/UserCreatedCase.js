const User = require("../../../doamin/entities/user")
const{NotFoundError}=require("../../errors/customError")


class UserCreatedCase{
    constructor(userRepository){
        this.userRepository = userRepository
    }
        async execute(Userdata){

            try{
                if(!Userdata){
                    throw new NotFoundError("invalid userdata userservice  UserCreatedCase")
                }
                const userData= Userdata.data
                const user = new User({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    emailId: userData.emailId,
                    photoUrl: userData.photoUrl,
                    skills: userData.skills,
                    age: userData.age,
                    about: userData.about,
                    password:userData.password,
                    gender: userData.gender,
                    isPremium: userData.isPremium,
                    memberShipType: userData.memberShipType,
                    userId:userData.userId 

                });
                const savedUser = await this.userRepository.save(user)
                return savedUser; 
            }catch(err){
                throw err
            }

} }

module.exports = UserCreatedCase;
