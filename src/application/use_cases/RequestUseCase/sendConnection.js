
const{ConnectionError,NotFoundError}= require("../../errors/customError")

class SendConnection{
    constructor(userRepository,connectionRepository,emailService,messageBroker){
             this.ConnectionRepository=connectionRepository;
             this.userRepository=userRepository;
             this.emailService = emailService
             this.exchange="sendConnection",
             this.messageBroker=messageBroker
            
    }
   
    async execute(userId,toUserId,status){
        console.log("handl",userId,status,toUserId)

        const[sender,existingConnection]= await Promise.all([
            this.userRepository.find(toUserId),
            this.ConnectionRepository.find(userId,toUserId)
        ])

        if(!sender){
         throw new NotFoundError("user  not found")
        }

        if(existingConnection){
            throw new ConnectionError("existing connection")
        }
       
        const connection = await this.ConnectionRepository.save(userId,toUserId,status)
            console.log("connction data",connection)

            setImmediate(async()=>{
                if(status== "interested"){
                    await this.sendInterestNotification(sender.emailId)
                 }

                 await this.messageBroker.publish(this.exchange, {
                    eventType:"sendConnection",
                    data: {
                        connection
                        }
                }).catch(err=>console.error("Failed to publish message:", err) )
            })
          
        
        return connection

       }
        
        
      
      async sendInterestNotification(emailId) {
        console.log(emailId)
        const subject = "New Connection Request";
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2>New Connection Request</h2>
                <p>is interested in connecting with you!</p>
                <p>Check your dashboard for more details.</p>
            </div>
        `;
        await this.emailService.sendEmail(emailId, subject, html);
    }


}

module.exports = SendConnection