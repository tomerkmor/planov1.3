import express from 'express'
const app = express()
import mongoose from 'mongoose'
import cors from 'cors'
import nodeSchedule from "node-schedule"
import nodemailer from 'nodemailer';

import User from "./modules/UserSchema.js";

import posts from './routes/posts.js';
import tasks from './routes/tasks.js';


const CONNECTION_URL="mongodb+srv://tomermor:Te709709@nodeexpressprojects.wxq8pye.mongodb.net/PLANO?retryWrites=true&w=majority"
const PORT = process.env.PORT||5000

mongoose.connect(CONNECTION_URL)
    .then(()=>{
        
        app.use(express.static('./public'))
        app.use(express.json());
        app.use(cors())
        app.listen(PORT, () => 
            console.log('Connect to DATABASE! on port:'+PORT)
        )

        app.use('/', posts);
        app.use('/', tasks);

        nodeSchedule.scheduleJob('0 0 * * *', async()=>{
            let transporter = nodemailer.createTransport({
                service:"gmail",
                secure: false,
                port: 25,
                auth:{
                    user:'sexylooter@gmail.com',
                    pass:'iafwewpjwdbiyzll'
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            let mailOption ={
                from:'planocooperation@gmail.com',
                to:'',
                subject:'Expired List',
                text:''
            }

            try{
                let sendMail = false;
                let message = "";
                const users = await User.find();
                console.log(users);
                users.map(item=>{
                    sendMail = false;
                    message = item.username+"\n";
                    let expire = item.expD;
                    item.itemList.map(item1=>{
                        console.log("item: ",item1.name);
                        console.log("space: ",Math.floor((item1.expDate - new Date())/(1000*3600*24)));
                        if(Math.floor((item1.expDate - new Date())/(1000*3600*24)) < expire){
                            message += item1.name+"\n";
                            message += item1.expDate+"\n\n";
                            sendMail = true;
                        }
                    })
                    console.log("-----------------");
                    mailOption.to = item.email;
                    mailOption.text = message;
                    if(sendMail){
                        console.log(message);
                        transporter.sendMail(mailOption,(error,info)=>{
                            if(error){
                                console.log(error.message);
                            }else{
                                console.log("Email sent:\n"+info.response);
                            }
                        })
                    }
                })
            }
        catch{
            console.log("error in expire date");
        }
    }); 
})
.catch((e)=>{ console.log(e.message) })

//route