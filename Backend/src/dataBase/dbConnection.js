import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"Portfolio"
    }).then(()=>{
        console.log(`Connected to database successfully`);
    }).catch((err)=>{
        console.log(`Data Base Error ${err}`);
    })
}

export default dbConnection;