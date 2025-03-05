class UserCaseController{
    constructor(allConnections,getFeedCase,requestRecieved){
    this.allConnections=allConnections;
    this.getFeedCase=getFeedCase;
    this.requestRecieved=requestRecieved
    }

    async handleAllconnections(req,res,next){
        try{
           const {userId}=req.user
           const connections =await this.allConnections.execute(userId)
           res.send({success:true,message:"connection fetched succefully",data:connections})

        }catch(err){
          next(err)
        }

    }

    async handleFeed(req,res,next){
        try{
            const{userId}=req.user
            let page = parseInt(req.query.page)||1 ;
            let  limit = parseInt(req.query.limit) || 10
            limit =limit >50 ? 50 :limit;
            page = page > 30 ?30 :page;
            const users = await this.getFeedCase.execute(userId,page,limit)
            console.log(users)
            res.json({users})
        }catch(err){
        next(err)
        }
    }

    async handleRequestRecived(req,res,next){
        try{
         const{userId} =req.user
         const ReceivedRequests = await this.requestRecieved.execute(userId)
         res.send({message:" data fetched succefully",data:ReceivedRequests})
        }catch(err){
           next(err)
        }
    }
}

module.exports = UserCaseController