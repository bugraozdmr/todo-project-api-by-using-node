const express = require("express");
const {
    createTodo ,
    getAllTodos ,
    getSingleTodo,
    getAllTodosForSomeone,
    editTodo,
    deleteTodo}
     = require("../controllers/todo");
const {getAccessToRoute, getTodoOwnerAccess , getOwnerAccess} = require("../middleWares/authorization/auth");
const {checkTodoExist , checkUserExist} = require("../middleWares/database/databaseErrorHelper");
const {TodoQuerryMv} = require("../middleWares/query/todoQueryMv");
const Todo = require("../models/Todo");





const router = express.Router();




//* yine dummy
router.post("/create",[getAccessToRoute,() => console.log("")],createTodo);

router.get("/getAllTodos",getAllTodos);

//? {{URL}}/api/todo/6550932a528d79c9123a6894/user?page=2&limit=2&search=b -- örnek kullanım
//* bu sadece kendi hesabında tüm todoları alır
//! getAllTodos'da response değişecek unutma dönen res.querryResult kullanılacak
router.get("/:id/user",[getAccessToRoute,
    checkUserExist,
    getOwnerAccess,
    TodoQuerryMv(Todo,{
        population :{
            path : "user",
            select : "name email"
        }
    }),() => console.log("")],getAllTodosForSomeone);

//* bu sadece kendi hesabında belli bir todoyu alır
router.get("/:id",[getAccessToRoute,checkTodoExist,getTodoOwnerAccess,() => console.log("")],getSingleTodo);

router.put("/:id/edit",[getAccessToRoute,checkTodoExist,getTodoOwnerAccess],editTodo);
// //! art arda response döndürme oluyor bir mv çalışınca res dönüyor ve sonrasında diğer ana fonk çalışıyor ve patlıyor -- ondan dummy func SOR BUNU
router.delete("/:id/delete",[getAccessToRoute,checkTodoExist,getTodoOwnerAccess,() => console.log("")],deleteTodo);




module.exports = router;