const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;


const TodoSchema = new Schema({
    title : {
        type : String,
        required : [true , "please provide a title"],
        minlength : [10 , "title must be longer than 10 characters"],
        unique : true
    },
    content : {
        type : String,
        required : [true , "Please provide a content"],
        minlength : [10 , "content must be longer than 20 characters"],
    },
    piority : {
        type : String,
        default : "daily thing"
    },
    slug : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    },  //kim ekledi - ref olacak User'dan çekme yapmak için
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    }
});

TodoSchema.pre("save",function(next) {
    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
})

// linki değiştirir slugify
TodoSchema.methods.makeSlug = function(){
    return slugify(this.title,{
        replacement : "-",
        remove : /[*+~.()'"!:@]/g,
        lower : true
    });
};



module.exports = mongoose.model("Todo",TodoSchema);