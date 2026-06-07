class AppError extends Error{
    constructor(public message:string, public statusCode:number,public code:string){
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}


class BadRequestError extends AppError{
    constructor(message:string){
        super(message,400,"BAD_REQUEST");
    }
}

class NotFoundError extends AppError {
    constructor(message:string,code="NOT_FOUND"){
        super(message,404,code);
    }
}
class UnauthorizedError extends AppError{
    constructor(message:string,code="UNAUTHORIZED"){
        super(message,401,code);
    }
}
class ForbiddenError extends AppError{
    constructor(message:string,code="FORBIDDEN"){
        super(message,403,code);
    }
}

class ConflictError extends AppError{
    constructor(message:string,code="CONFLICT"){
        super(message,409,code);
    }
}

class TooManyRequestsError extends AppError{
    constructor(message:string,code="TOO_MANY_REQUESTS"){
        super(message,429,code);
    }
}

class InternalServerError extends AppError{
    constructor(message:string,code="INTERNAL_SERVER_ERROR"){
        super(message,500,code);
    }
}


export {
    AppError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    TooManyRequestsError,
    InternalServerError
}
