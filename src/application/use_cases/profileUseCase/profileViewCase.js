const{NotFoundError}= require("../../errors/customError")


class ProfileViewCase{
    constructor(userRepository){
        this.userRepository = userRepository
    }
     async execute(userId){

          const user = await this.userRepository.find(userId)
          if(!user){
            throw new NotFoundError("user not found ")
          }
          return user
          }
     }


module.exports = ProfileViewCase