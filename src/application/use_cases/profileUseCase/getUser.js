const{NotFoundError}= require("../../errors/customError")

class getUser{
    constructor(userRepository){
          this.userRepository = userRepository
    }

    async execute(userId){
         const user = await this.userRepository.find(userId)
         if(!user){
            throw new NotFoundError("invalid user")
         }
         return user
    }
}

module.exports = getUser