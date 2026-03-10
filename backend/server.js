const express = require('express');
const cors = require('cors');

const app = express();
const db=require('./db.js')

app.use(cors());          // allow frontend requests
app.use(express.json());  // parse JSON



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
