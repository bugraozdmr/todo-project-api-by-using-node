const CustomError = require("../../helpers/error/customError");
const asyncErrorWrapper = require("express-async-handler");
const Todo = require("../../models/Todo");
const User = require("../../models/User");

//? todo var mı yok mu kontrol

const checkTodoExist = asyncErrorWrapper(async(req,res,next) =>{
    const {id} = req.params;
    const todo = await Todo.findById(id);

    if(!todo){
        return next(new CustomError("There is no such todo has that id",400));
    }

    next();
});


const checkUserExist = asyncErrorWrapper(async(req,res,next) =>{
    const user_id = req.params.id;
    const user = await User.findById(user_id);

    if(!user){
        return next(new CustomError("There is no such user has that id",400));
    }

    next();
});


module.exports = {
    checkTodoExist,
    checkUserExist
};