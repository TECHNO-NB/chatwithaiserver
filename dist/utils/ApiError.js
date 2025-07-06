class ApiError extends Error {
    constructor(success = false, statusCode = 400, message = "Something went wrong", stack, errors = []) {
        super(message);
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiError;
