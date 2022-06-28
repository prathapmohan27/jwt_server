const express=require('express');
const router= express.Router()
const User=require('../models/user')
const jwt=require('jsonwebtoken');

const mongoose=require('mongoose');
const user = require('../models/user');

const db="mongodb+srv://m001-student:m001-mongodb-basics@sandbox.7eke6.mongodb.net/eventDB?retryWrites=true&w=majority";
mongoose.connect(db,err=>{
    if(err){
        console.log('Error',err);
    }else{
    console.log('connected to database!')
    }
})

// function verifyToken(res,req,next){
//     if(!res.headers.authorization){
//         return res.status(401).send('unathorized request');
//     }
//     let token=req.headers.authorization.split(' ')[1]
//     if(token === 'null'){
//         return res.status(401).send('unathorized request');
//     }
//     let payload =jwt.verify(token,'secretkey');
//     if(!payload){
//         return res.status(401).send('unathorized request');
//     }
//     req.userId=payload.subject
//     next()
// }

router.get('/',(req,res)=>{
    res.send('form api route')
})


router.post('/register',(req,res)=>{
    let userData=req.body
    let user=new User(userData)
    user.save((error,registeredUser)=>{
        if(error){
            console.log(error);
        }else{
            let payload={subject:registeredUser._id}
            let token=jwt.sign(payload,'secretkey')
            res.status(200).send({token});
        }
    })
})


router.post('/login',(req,res)=>{
    let userData=req.body
    User.findOne({email:userData.email},(error,user)=>{
        if(error){
            console.log(error);
        }else{
            if(!user){
                res.status(401).status('invalid email');
            }else{
                if(user.password !== userData.password){
                    res.status(401).status('invalid password');
                }else{
                    let payload={subject:user._id}
                    let token=jwt.sign(payload,'secretkey',{expiresIn:'12s'})
                    res.status(200).send({token})
                }
            }
        }
    })
})



module.exports=router;