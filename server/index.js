const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser =require("body-parser");
const jsonParser = require("json-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10
var jwt = require("jsonwebtoken");
const secret = 'Fullstack-login-fm';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  user: "foodmachin_2019",
  host: "192.168.2.224",
  password: "twe31219#",
  database: "fm",
});

app.get("/comcopy", (req, res) => { 
    db.query("SELECT * FROM comcopy", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user_copy WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.username = result;
            console.log(req.session.username);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});
app.post('/authen',(req,res,next)=>{
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token,secret)
    res.json({status: 'ok',decoded})
  }catch(err){
    res.json({status:'error',message: err.message})
  }
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO user_copy (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});
/*
app.post('/register', bodyParser.json(), (req, res ,next)=>{
bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
  db.query(
    'INSERT INTO user_copy (username, password , fname , lname) VALUES (?,?,?,?)',
    [req.body.username, hash,req.body.fname, req.body.lname],
    (err, result , fields)=>{
      if(err){
        res.json({status:'error',message:err})
        return
      }
      res.json({status:'ok'})
     
    }
  );
});
})

app.post("/login",bodyParser.json() ,function(req, res,next){ 
  db.query('SELECT * FROM user_copy WHERE username = ?',
  [req.body.username], 
  function(err,user_copy,fields){
    if (err) {
      res.json({status: 'error',message: err});return} 
    if(user_copy.length==0) {
      res.json({status: 'error',message: 'no user found'});return}
    bcrypt.compare(req.body.password,user_copy[0].password,(err,isLogin)=>{
      if(isLogin){
        var token = jwt.sign({username:user_copy[0].username},secret,{expiresIn:'1h'});
        res.json({status:'ok',message: 'login success',token})
      }else{
        res.json({status:'error',message: 'login failed'})
      }
    });
  });
});*/

/*app.post("/create", (req, res) => {
  const pcname = req.body.cpname  ;
  const Case = req.body.cpcase ;
  const CPU = req.body.cpcpu;
  const Mainboard = req.body.cpmainboard;
  const RAM = req.body.cpram;
  const HDD = req.body.cphdd;
  const SSD = req.body.cpssd;
  const Monitor = req.body.cpmonitor;
  const VGA = req.body.cpvga;
  const UPS = req.body.cpups;
  const Printer = req.body.cpprinter;
  const Mouse = req.body.cpmouse;
  const Keyboard = req.body.cpkeyboard;
  const OS = req.body.cpos ;
  const License = req.body.cposlc ;
  const Location = req.body.cplocation;
  const User = req.body.cpuser ;
  const Etc = req.body.cpetc ;

  db.query(
    "INSERT INTO comcopy (pcname, Case, CPU, Mainboard, RAM, HDD, SSD, Monitor, VGA, UPS, Printer,Mouse, Keyboard, OS, License,User,Etc) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [pcname, Case, CPU, Mainboard, RAM, HDD, SSD, Monitor,  VGA, UPS, Printer, Mouse, Keyboard, OS, License, Location, User, Etc],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
        console.log("values");
      }
    }
  );
});

app.put("/update", (req, res) => {
  const id = req.body.cpid;
  
  db.query(
    "UPDATE employees WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
/*
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});*/

app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});
