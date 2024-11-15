const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'myfirstloginpage';

let users = [];

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
})

function auth(req,res,next){
    // const username = req.body.username;
    const token = req.headers.token;

    if(!token){
        return res.status(401).json({
            message : "token not generated"
        });
    }
    try{
        let decodedtoken = jwt.verify(token, JWT_SECRET);
        if(decodedtoken){
            req.username = decodedtoken.username;
            console.log(req.username);
            next();
        }else{
            res.json({
                message : "user not logged in"
            });
        }
    }catch(error){
        res.status(400).json({
            message : "invalid loggin details"
        })
    }
}

app.use(express.json());

app.post("/signup", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    let user = users.find(u => u.username === username);

    if(user){
        res.json({
            message : "user already exists"
        });
    }else{
       
        users.push({
            username : username,
            password : password
        });
       
        res.json({
            message: "user successfully signed-up"
        });
       
        console.log(users);
    }
    
})


app.post("/signin", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    let user = users.find(u => u.username === username && u.password === password);

    if(user){

        let token = jwt.sign({
            username : username
        },JWT_SECRET);
        user.token = token;
        
        res.header("jwt",token);
        
        res.json({
            message : "token succcessfully generated. user successfully logged in.",
            token : token
        });
        
        console.log(users);

    }else{
        res.status(401).json({
            message : "invalid login details"
        });
    }
    

})


app.get("/me", auth, (req,res)=>{
    let username = req.username;
    
    try{
        let user = users.find(u => u.username === username);
        if(user){
            res.json({
                message: "user exists",
                username: user.username,
                token: user.token
            });
            console.log(user);
        }else{
            res.status(401).json({
                message : "user does not exists"
            })
        }
    }catch(error){
        res.status(401).json({
            message : "invalid token"
        })
    }
})

app.listen(3004);