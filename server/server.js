require('dotenv').config()
const express=require("express")
const path=require('path')
const cors=require("cors")
const app=express()
const dbconn=require("./config/db")
const route=require('./routes/invoiceRoute')
const port=process.env.PORT||7777;

app.use(express.json())
app.use(cors())
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


app.use('/api',route)
app.get('/',(req,res)=>{
    res.json("Welcome to Server");
})

app.listen(port,()=>{
    console.log(`Server running in http://localhost:${port}`);
})