const express = require ('express')
const { default: mongoose } = require('mongoose')
const router =express.Router()

const User = mongoose.model("User")
const bycrpt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys/')


router.get('/',(req,res)=>{
    res.send("hellow")
})

router.post('/singup',(req,res)=> {
    
    const {name,email, password} = req.body
    if (!email || !password || !name){
      return res.status(422).json({error:"please add all field"})
    }
    
        // res.status(422)({message:"successfully posted"})
        // console.log(req.body)
        User.findOne({email:email})
        .then((savedUser)=>{

            if(savedUser){
                return res.status(422).json({error:"user alrady exits with tahat ewmail"}) 
            }
                bycrpt.hash(password,12)
                .then(hashedpassword=>{
                    const user =new User({
                        email,
                        password:hashedpassword,
                        name
    
                    })
    
                    user.save()
                    .then(user=>{
                        res.json({message:"saved sussussfully"})
    
                    })
                    .catch(err=>{
                        console.log(err)
    
                    })

                })
              
            })

        .catch((err=>{
            console.log(err)
        }))

    
    

})

router.post('/signin',(req,res)=>{
    const {email, password} =req.body
    if(!email || !password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if (!savedUser){
            res.status(422).json({error:"Ivalid email or password"})
        }
        bycrpt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                res.json({message:"succussfully sign in"})
            }
            else{
                return res.status(422).json({error:"Ivalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })


})

module.exports = router