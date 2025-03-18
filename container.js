
const UserCreatedCase = require("./src/application/use_cases/createUser/UserCreatedCase")
const ForgotPassword = require("./src/application/use_cases/profileUseCase/forgotPassword")
const GetUser=require("./src/application/use_cases/profileUseCase/getUser")
const ProfileEditCase= require("./src/application/use_cases/profileUseCase/profileEditUserCase")
const ProfileViewCase= require("./src/application/use_cases/profileUseCase/profileViewCase")
const ReviewConnection=require("./src/application/use_cases/RequestUseCase/reviewConnectionCase")
const SendConnection=require("./src/application/use_cases/RequestUseCase/sendConnection")
const AllConnections= require("./src/application/use_cases/user_case/allConnections")
const GetFeedCase=require("./src/application/use_cases/user_case/feedCase")
const RequestRecieved= require("./src/application/use_cases/user_case/requestRecieved")
const ConnectionRepository =require("./src/infrastructure/dataBase/repositories/connectionRepositry")
const UserRepository=require("./src/infrastructure/dataBase/repositories/UserRepositoires")
const EmailService = require("./src/infrastructure/EmailService/EmailService")
const AuthClient= require("./src/infrastructure/grpc/Authclient")
const AuthService=require("./src/application/services/authService")
const MessageBroker =require("./src/infrastructure/RabitMq/server")
const AuthMiddleware=require("./src/presentation/middleware/verifyToken")
const ProfileRoutes= require("./src/presentation/routes/profileRoutes")
const ProfileController =require("./src/presentation/controllers/profileController")
const RequestController=require("./src/presentation/controllers/RequsetController")
const UserController= require("./src/presentation/controllers/userCaseController")
const UserRoutes= require("./src/presentation/routes/userRoutes")
const RequestRoutes=require("./src/presentation/routes/requestRoutes")
const GenericConsumer = require('./src/infrastructure/RabitMq/consumer');
const UserPaymentUpdate = require("./src/application/use_cases/createUser/userUpdate_Payment")
const NewPhotoUpload  = require("./src/application/use_cases/profileUseCase/newPhotoUpload")
const DeletePhotoCase = require("./src/application/use_cases/profileUseCase/deletePhoto")

const authClient  = new AuthClient()
const userRepository = new UserRepository()
const emailService = new EmailService()
const messageBroker = new MessageBroker()
const newPhotoUpload =new NewPhotoUpload
const connectionRepository= new ConnectionRepository(messageBroker)
const userPaymentUpdate = new UserPaymentUpdate(userRepository)
const deletePhotoCase = new DeletePhotoCase(userRepository)

const userCreatedCase = new UserCreatedCase(userRepository)
const newUserFormSignup = new GenericConsumer("user_created","user_queue",userCreatedCase)
const IspremiumUpdate = new GenericConsumer("IsPremiumUpdate","IspremiumUpdate",userPaymentUpdate)
//const RabitMqConsumer = new startConsumer(userCreatedCase)

const forgotPassword = new ForgotPassword(userRepository,messageBroker)
const getUser = new GetUser(userRepository)
const profileEditCase = new ProfileEditCase(userRepository,messageBroker)
const profileViewCase = new ProfileViewCase(userRepository)
const reviewConnection =new ReviewConnection(userRepository,connectionRepository,emailService,messageBroker)
const sendConnection =new SendConnection(userRepository,connectionRepository,emailService,messageBroker)
const allConnections =new AllConnections(userRepository,connectionRepository)
const getFeedCase =new GetFeedCase(userRepository,connectionRepository)


const requestRecieved =new RequestRecieved(userRepository,connectionRepository)



const authService =new AuthService(authClient)

const authMiddleware=new AuthMiddleware(authService)



const profileController = new ProfileController(forgotPassword,getUser,profileEditCase,profileViewCase,newPhotoUpload,deletePhotoCase)
const requestController =new RequestController(reviewConnection,sendConnection)
const userController =new UserController(allConnections,getFeedCase,requestRecieved)


const profileRoutes =new ProfileRoutes(profileController)
const requestRoutes =new RequestRoutes(requestController)
const userRoutes =new UserRoutes(userController)







module.exports ={
    userRoutes,
    requestRoutes,
    profileRoutes,userController,requestController,
    profileController,authMiddleware,authService,
    requestRecieved,getFeedCase,allConnections,
    sendConnection,reviewConnection,profileViewCase,profileEditCase
    ,getUser,forgotPassword,userCreatedCase,messageBroker,emailService,
    connectionRepository,userRepository,authClient,newUserFormSignup,IspremiumUpdate
}