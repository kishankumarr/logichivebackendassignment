const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const session_secret = "newton";

const app = express();
app.use(express.json()); 
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(
  session({
    secret: session_secret,
    cookie: { maxAge: 1*60*60*1000 }
  })
); 
const db = mongoose.createConnection("mongodb://localhost:27017/services",{
  useNewUrlParser:true,
  useUnifiedTopology:true,
});

const serviceSchema=new mongoose.Schema({
  id:Number,
  image:String,
  title:String,
  description:String,
  userId:mongoose.Schema.Types.ObjectId
});

const serviceModel=db.model("services",serviceSchema);

app.get("/services", async(req,res)=>{
  const allservices=await serviceModel.find({
    userId:req.session.userId
  });
  res.send(allservices);
});

app.post("/services", async(req,res)=>{
 try{ const service=req.body;
  console.log(req.body)
  service.userId=req.session.userId;
  const newservice=new serviceModel(service);
  await newservice.save();
  res.send(newservice);
 }catch(e){
   res.sendStatus(404);
 }
});
app.listen(8888);