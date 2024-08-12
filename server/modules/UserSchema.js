import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    itemList:{
        type:[{
            barcode:String,
            name:String,
            expDate:Date
        }],
        default:[]
    },
    expD:{
        type:String,
        required:true,
        default:0
    }
})

const User = mongoose.model('User',UserSchema);
export default User;