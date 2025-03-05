const User = require("../../../doamin/entities/user");
const { NotFoundError, ValidationError } = require("../../errors/customError");

class ForgotPassword {
    constructor(userRepository, messageBroker) {
        this.userRepository = userRepository;
        this.messageBroker = messageBroker;
        this.queue = "password_updated";
    }

    async execute(userId, password) {
        try {
            // Fetch user data from the repository
            const userData = await this.userRepository.find(userId);
            console.log("User Data:", userData);

            if (!userData || userData.length === 0) {
                throw new NotFoundError("User not found");
            }

            // Create a User object
            const user = new User({
                firstName: userData[0].firstName,
                lastName: userData[0].lastName,
                emailId: userData[0].emailId,
                password: userData[0].password,
                photoUrl: userData[0].photoUrl,
                skills: userData[0].skills,
                age: userData[0].age,
                about: userData[0].about,
                gender: userData[0].gender,
                userId: userData[0].userId
            });
            console.log("User:", user);

            // Check if the new password is the same as the old one
            const isSamePassword = await user.comparePassword(password);
            if (isSamePassword) {
                throw new ValidationError("Cannot use the existing password");
            }

            // Update and hash the new password
            user.password = password;
            await user.hashPassword();

            // Save the updated user
            const savedUser = await this.userRepository.updatePassword(user.userId,user.password);
             console.log("new User",savedUser)
            // Publish the password update event
            await this.messageBroker.publish(this.queue, {
                eventType: "PasswordUpdated",
                data: {
                    userId: savedUser.userId,
                    password: savedUser.password
                }
            });

            return savedUser;
        } catch (error) {
            // Log the error for debugging
            console.error("Error in forgotPassword.execute:", error);

            // Re-throw the error to be handled by the caller
            throw error;
        }
    }
}

module.exports = ForgotPassword;