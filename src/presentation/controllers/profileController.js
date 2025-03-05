



class profileController{
    constructor(forgotPassword,getUser,profileEditCase,profileViewCase){
                
      this.forgotPassword =forgotPassword;
      this.getUser = getUser;
      this.profileEditCase=profileEditCase;
      this.profileViewCase = profileViewCase

      this.handleForgotPassword = this.handleForgotPassword.bind(this);  
      this.handleGetUser = this.handleGetUser.bind(this);
      this.handleProfileEdit = this.handleProfileEdit.bind(this);
      this.handleProfileView = this.handleProfileView.bind(this);

    }


    async handleForgotPassword(req,res,next){
        try{
         const {userId,password} = req.body
         console.log(req.body)
         await this.forgotPassword.execute(userId,password)
         res.send("password changed succefully")
        }catch(err){
             next(err)
        }
    }
//to be test
    async handleGetUser(req,res,next){
      try{
       const {userId} = req.user
       const user =  await this.getUser.execute(userId)
       res.send(user)
      }catch(err){
        next(err)
      }
    }

    async  handleProfileEdit(req,res,next){
        try{
            const {userId} = req.user
            console.log(req.body)
          const updatedUser =  await this.profileEditCase.execute(userId,req.body)
           res.send(updatedUser)
        }catch(err){
         next(err)
        }
    }

    async handleProfileView(req,res,next){
        try{
           const{userId}=req.user
           const user = await this.profileViewCase.execute(userId)
           res.send(user)
        }catch(err){
          next(err)
        }
    }    
}

module.exports= profileController