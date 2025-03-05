const{ValidationError}=require("../errors/customError")


class RequestController{
    constructor(reviewConnection,sendConnection){
              this.reviewConnection= reviewConnection;
              this.sendConnection=sendConnection
    }

    async handleReviewConnection(req,res,next){
        try{
          const{userId}=req.user
          const{status,requestId} = req.params

          console.log("fromhandleReviewConnection ",userId,status,requestId)
          const allowedStatus = ["accepted","rejected"]
              if(!allowedStatus.includes(status)){
                  throw new ValidationError(" Status must be 'accepted' or 'rejected' ") 
                       }
          console.log("handleReviewConnection",userId,status,requestId)
          const data = await this.reviewConnection.execute(userId,requestId,status)
          res.send({success:true,
            message:"user request"+status,
            data
                 })

        }catch(err){
         next(err)
        }

    }


    async handleSendConnection(req,res,next){
        try{
          const {userId}=req.user
          const{toUserID,status}= req.params
          console.log("handleSendConnection",userId,status,toUserID)

          const data = await this.sendConnection.execute(userId,toUserID,status)
          res.send({message:"Connection request send succesfully",data})
        }catch(err){
          next(err)
        }
    }
}


module.exports = RequestController