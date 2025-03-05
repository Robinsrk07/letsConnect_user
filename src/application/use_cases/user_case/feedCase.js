const{NotFoundError}= require("../../errors/customError")

class GetFeedCase{
    constructor(userRepository,connectionRepository){
        this.userRepository = userRepository;
        this.ConnectionRepository = connectionRepository
    }
    async execute(userId,page=1,limit=10){
        limit = limit > 50 ? 50 : limit;
        page = page > 30 ? 30 : page;
        const skip = (page - 1) * limit;
    
     const user = await this.userRepository.find(userId)
     if(!user){
        throw new NotFoundError("user not Found")
     }
     const connections = await this.ConnectionRepository.getAllConnection(user.userId)
     if(!connections){
        throw new NotFoundError("connection not Found")
     }
     const hideUser = new Set([user.userId]);
     connections.forEach((req)=>{
        hideUser.add(req.senderId.toString())
        hideUser.add(req.receiverId.toString())
     })
     const users = await this.userRepository.findExcludeUser(Array.from(hideUser), skip, limit)
     return users;
    }
}

module.exports = GetFeedCase