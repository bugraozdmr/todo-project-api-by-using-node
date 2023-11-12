const Todo = require("../models/Todo");
const CustomError = require("../helpers/error/customError");
const asyncErrorWrapper = require("express-async-handler");



const createTodo = asyncErrorWrapper(async(req,res,next) => {
    // json olarak alıp geçiremedim -- yada ...information yaparak tüm alanlar alınabilirdi questiondada yollardı
    // const olursa piority tekrar değişemez
    let { content, title , piority } = req.body;

    if(piority === undefined) piority = "daily thing"; 

    const todo = await Todo.create({
        content: content,
        title: title,
        piority : piority,
        user : req.user.id
    });

    
    res
    .status(200)
    .json({
        success : true,
        data : todo
    });
});


const getAllTodos = asyncErrorWrapper(async(req,res,next) => {

    const todo = await Todo.find();
    

    return res.status(200).json({
        success : true,
        data : todo
    })
    
});


const getSingleTodo = asyncErrorWrapper(async(req,res,next) => {
    const todo_id = req.params.id || req.params.id;

    
    const todo = await Todo.findById(todo_id);
    // .populate(
    //     {
    //         path : "question",
    //         select : "title content"
    //     }
    // )
    // .populate(
    //     {
    //         path : "user",
    //         select : "name profile_image email"
    //     }
    // )

    return res.status(200).json({
        success : true,
        data : todo
    })
    
});

const getAllTodosForSomeone = asyncErrorWrapper(async(req,res,next) => {
    //burda tanımlanan filtreleme user: userid ile çekme todoQueryMv'e gitti

    return res.status(200).json(res.querryResult);
    
});

const editTodo = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    // bunu girmek zorunda değil girmezse eski değer yollansın
    let piority_old = (await Todo.findById(id))["piority"];

    let {title,content,piority} = req.body;
    
    if(piority == undefined) piority = piority_old;
    let todo = await Todo.findById(id);

    todo.title = title;
    todo.content = content;
    todo.piority = piority;

    todo = await todo.save();

    return res.status(200).json({
        success : true,
        data : todo
    });
});

//* todo direkt silinebilir sorun yok ama user silinirse user'ın todolarıda silinmeli
const deleteTodo = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.params;

    await Todo.findByIdAndDelete(id);

    return res.status(200).json({
        success : true,
        message : "Todo has deleted"
    });
});



module.exports = {
    createTodo,
    getAllTodos,
    getAllTodosForSomeone,
    getSingleTodo,
    editTodo,
    deleteTodo,
}