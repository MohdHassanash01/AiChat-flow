import mongoose from "mongoose";

export function ConnectionDB(url){

    mongoose.connect(url).
    then(() => {
        console.log("MongoDB Connected Succesfully....");
        
    }).catch((err) => {
        console.log("mongoDb connection error : ", err);
        
    })

}