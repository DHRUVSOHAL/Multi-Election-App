const express=require('express')

const app=express();
const db=require('./db.js')


app.get('/',(req,res)=>{
    res.send("hello welcome to voting app");
})

const ElectionRoutes=require('./Routes/ElectionRoutes.js')

const Vote=require('./Routes/VotersRoutes.js')
app.use(express.json());
app.use('/election',ElectionRoutes);
app.use('/vote',Vote);

app.listen(1000,()=>{
    console.log(`server is running at port 1000...`)
})
