const CustomError = require("../../helpers/error/customError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/TokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

const getAccessToRoute = (req,res,next) => {
    //* gönderilen değer yani auth.. - bearer.. bu ikisi request oluyorlar
    const {JWT_SECRET_KEY} = process.env;


    // false donerse tersi true dur ve girer
    // 401 unauthorizer - 403 forbidden admin page'e erişmek
    if(!isTokenIncluded(req)){
        
        return next(new CustomError("You are not allowed to access this router",401));
    }
    const access_token = getAccessTokenFromHeader(req);
    
    // decode edecek karsilastiracak ve expire suresine bakacak
    jwt.verify(access_token,JWT_SECRET_KEY,(err,decoded) => {
        
        if(err){
            return next(new CustomError("You are not allowed to access this router",401));
        }

        req.user = {
            id : decoded.id,
            name:  decoded.name
        }

        next();
    });

    next();
}

//? başkasının todosunu göremiyor tek izni kendi todoları

const getTodoOwnerAccess = asyncErrorWrapper(async(req,res,next) => {
    //! önce routeAccess çalışacak ondan -- req.user.id oluşmuş olacak
    const userID = req.user.id;
    const todoID = req.params.id;
    
    const todo = await Todo.findById(todoID);
    
    const confirmId = todo.user;

    if(confirmId != userID) {
        return next(new CustomError("you can not see somebody's todos",403));
    }

    next();
});

//? hesaba giriş yapmışmısın o yani fazla bir olayı yok

const getOwnerAccess = asyncErrorWrapper(async(req,res,next) => {
    //! önce routeAccess çalışacak ondan -- req.user.id oluşmuş olacak
    console.log(req.user.name)
    const userID = req.user.id;
    const id = req.params.id;
    
    const user = await User.findById(id);
    
    if(user.id != userID) {
        return next(new CustomError("only owner can see todos",403));
    }

    next();
});

module.exports = {
    getAccessToRoute,
    getTodoOwnerAccess,
    getOwnerAccess
};