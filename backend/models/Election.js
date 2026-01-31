const mongoose=require('mongoose')
const ElectionSchema=new mongoose.Schema({
    title:{type:String,require:true,unique:true},
    description:{type:String,require:true},
    startDate:{type:Date,require:true},
    endDate:{type:Date,require:true}
})
module.exports=mongoose.model('Election',ElectionSchema)
