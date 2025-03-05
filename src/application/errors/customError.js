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

class ConnectionError extends Error{
    constructor(message){
        super(message)
        this.name="ConnectionError",
        this.statusCode=401

    }
}
module.exports={
    ValidationError,
    AuthenticationError,
    NotFoundError,
    ConnectionError
}         