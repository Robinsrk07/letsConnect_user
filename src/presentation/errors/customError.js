class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name="validationError",
        this.statusCode =400

    }
}
class  AuthenticationError extends Error {
    constructor(message){
        super(message);
        this.name ="AuthenticationError",
        this.statusCode =401
    }
}

class NotFoundError extends Error{
    constructor(message){
        super(message)
        this.name="NotFoundError",
        this.statusCode=401

    }
}

class DataBaseError extends Error{
    constructor(message){
        super(message)
        this.name="DataBaseError",
        this.statusCode=401

    }
}
class ConnectionRequestError extends Error{
    constructor(message){
        super(message)
        this.name="ConnectionRequestError",
        this.statusCode=401

    }
}


module.exports={
    ValidationError,
    AuthenticationError,
    NotFoundError,DataBaseError,ConnectionRequestError
}         