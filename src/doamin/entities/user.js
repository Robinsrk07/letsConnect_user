

const bcrypt = require('bcrypt');

class User {
    constructor({ firstName, lastName, emailId, password, photoUrl, skills, age, about, gender,userId,isPremium,memberShipType}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.password = password;
        this.photoUrl = photoUrl;
        this.skills = skills;
        this.age = age;
        this.about = about;
        this.gender = gender;
        this.userId = userId;
        this.isPremium=isPremium;
        this.memberShipType=memberShipType
    } 

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(userEnteredPassword) {
        return await bcrypt.compare(userEnteredPassword, this.password);
    }


    static fromDatabase(userData) {
        return new User(userData);
    }
}
  
module.exports = User;