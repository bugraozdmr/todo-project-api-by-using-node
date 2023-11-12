
const asyncErrorWrapper = require("express-async-handler");

const { searchHelper ,
    populateHelper,
    questionSortHelper,
    paginationHelper} = require("./queryMvHelpers");





const TodoQuerryMv = function(model,options){
    return asyncErrorWrapper(async function(req,res,next){
        //? initial querry
        //* bu query getAllTodosForSomeone için kullanılacağı için tek bir userin todolarını çekmeli
        const user_id = req.user.id;

        let querry = model.find({user: user_id});

        //* search
        querry = searchHelper("title",querry,req);
        
        //* populate
        if (options && options.population) {
            querry = populateHelper(querry,options.population);
        }
        
        //* sort
        querry = questionSortHelper(querry,req);

        //* pagination

        const total = await model.countDocuments();

        const paginationResult = await paginationHelper(total , querry ,req);

        querry = paginationResult.querry;
        const pagination = paginationResult.pagination;
        
        // promise yapısını çözecek ve en son değerimiz gelecek
        const querryResult = await querry;

        res.querryResult = {
            success : true,
            count : querryResult.length,
            pagination : pagination,
            data : querryResult
        }

        next();
    });
}

module.exports = {
    TodoQuerryMv
}