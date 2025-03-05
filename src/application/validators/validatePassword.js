const validator = require("validator")
const {NotFoundError,ValidationError,AuthenticationError} = require("../errors/customError")
const bcrypt = require("bcrypt")



  class PasswordValidator{
    constructor(data){ 
          this.data = data,
          this.allowedUpdates = ["password","userId"]
    }


    validateReqBody(){
        const isValidUpdate = Object.keys(this.data).every((key)=>this.allowedUpdates.includes(keyy));

        if(!isValidUpdate){
            throw new  ValidationError("invalid request body")
        }
    }

    validatePasswordStrength() {
        if (!this.data.password || !validator.isStrongPassword(this.data.password)) {
            throw new ValidationError(
                "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character."
            );
        }
    }

    validate() {
        this.validateRequestBody();
        this.validatePasswordStrength();
    }

  }

  module.exports = PasswordValidator;
