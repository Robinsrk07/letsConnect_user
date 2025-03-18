const {ValidationError} = require("../errors/customError")


class validateProfileEditData {
    constructor(){
        //this.data = data,
        this. allowedUpdates=["name","dob","about","photoUrl","pincode","town","userId","gender"]
    }

    validateReq(data) {
        console.log("Data to validate:", data);
        console.log("Allowed updates:", this.allowedUpdates);
    
        const invalidFields = Object.keys(data).filter((key) => !this.allowedUpdates.includes(key));
        if (invalidFields.length > 0) {
            console.log("Invalid fields:", invalidFields);
            throw new ValidationError(`Invalid fields: ${invalidFields.join(", ")}`);
        }
    }

    validateSkillLimit(data) {
        console.log(data.skills)

        if (data.skills && data.skills.length > 10) {
            throw new ValidationError("Skill limit exceeded. Maximum allowed is 10.");
        }
    }

    validate(data) {
        this.validateReq(data);
        this.validateSkillLimit(data);
        return true
    }
}


module.exports = validateProfileEditData;
