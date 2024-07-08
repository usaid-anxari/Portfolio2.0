import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema({
       senderName:{
         type:String,
         minLength:[2,'min Length must be 2 Cherachter!']
       },
       subject:{
         type:String,
         minLength:[2,'min Length must be 2 Cherachter!']
       },
       message:{
         type:String,
         minLength:[2,'min Length must be 2 Cherachter!']
       },
},{timestamps:true})

export const Message = mongoose.model('Message',messageSchema)