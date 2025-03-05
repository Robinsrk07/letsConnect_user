const validateProfileEditMiddleware = (req, res, next) => {
    if (!validateProfileEditData(req)) {
        return next(new ValidationError("validation failed"));
    }
    next();
};
