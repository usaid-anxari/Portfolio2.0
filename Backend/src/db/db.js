import mongoose from "mongoose";


// console.log(process.env.MONGO_URI);
// console.log(process.env.DB_NAME);
const connectedDb = async ()=>{
//    try {
//     const connect = await mongoose.connect(`${process.env.MONGO_URI}`)
//      console.log(`Connected To DataBase ${connect.ConnectionStates}`);
//    } catch (error) {
//     console.log(`Connection Error ${error}`);
//    }
try {
    const connect = await mongoose.connect(`${process.env.MONGO_URI}/portfolio`)
    console.log(`\nData base Connected !! DB HOST: ${connect.connection.host}`);
} catch (error) {
    console.log('Data base Connction FAILED ERROR: ',error);
    process.exit(1);
}
}

export default connectedDb