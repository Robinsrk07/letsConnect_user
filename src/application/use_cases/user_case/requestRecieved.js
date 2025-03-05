const{ConnectionError,NotFoundError}= require("../../errors/customError")


class RequestRecieved{
    constructor(userRepository,connectionRepository){
        this.userRepository = userRepository;
        this.ConnectionRepository = connectionRepository
    }

    async execute(userId){
         const user = await this.userRepository.find(userId)  
         if(!user){
            throw new NotFoundError("user not found")
         }
         const ReceivedRequests = await this.ConnectionRepository.requestRecived(user.userId)

                  
        return ReceivedRequests.length >0 ?ReceivedRequests:[]
    }


}
module.exports = RequestRecieved