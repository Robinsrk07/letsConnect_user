
const{ConnectionError,NotFoundError}= require("../../errors/customError")


class ReviewConnection{
    constructor(userRepository,connectionRepository,emailService,messageBroker){
        this.ConnectionRepository=connectionRepository;
        this.userRepository=userRepository;
        this.emailService = emailService ;
        this.messageBroker= messageBroker
        this.exchange="ConnectionUpdate"

    }

    async execute(userId,requestId,status){

        console.log(userId,requestId,status)

        const [loggedUser,connection]= await Promise.all([
            this.userRepository.find(userId),
            this.ConnectionRepository.findone(userId,requestId,"interested")
        ])

        if(!loggedUser){
         throw new NotFoundError("user  not found")
        }
    
        if(!connection){
            throw new ConnectionError("connection not found")
        }

        const updatedConnection = await this.ConnectionRepository.updateConnection(requestId, status);
         
        setImmediate(async()=>{
            try{
                const sender=  await this.userRepository.find(connection.senderId)
                if(!sender){
                    console.warn("Sender not found, skipping notification.");
                }
                await Promise.all([
                    this.messageBroker.publish(this.exchange, {
                        eventType:"connectionUpdate",
                        data: {
                            updatedConnection
                              }
                    }).catch(err=>console.error("failed to send updatedconnection queue:",err),
                    this.sendReviewNotification(sender,loggedUser).catch(err=>console.log(err))
                    )
                ])
            }catch(err){
                console.error("Error in background task:", err);
            }
        })

        return updatedConnection

    }



    async sendReviewNotification(sender,loggedUser) {
        const subject = "Review Connection";
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2>Connection Request Update</h2>
                <p> has  your connection request</p>
                <p>Check your dashboard for more details.</p>
            </div>
        `;
        await this.emailService.sendEmail(sender.emailId, subject, html);
    }

}
module.exports = ReviewConnection;



