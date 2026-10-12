import mongoose from 'mongoose';
export const User = mongoose.model('User', new mongoose.Schema({
 name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true},
 passwordHash:{type:String,required:true}, role:{type:String,enum:['student','coordinator','admin'],default:'student'}
},{timestamps:true}));
export const Event = mongoose.model('Event', new mongoose.Schema({
 title:{type:String,required:true}, description:{type:String,required:true}, club:{type:String,required:true},
 venue:{type:String,required:true}, date:{type:Date,required:true}, capacity:{type:Number,min:1,required:true},
 createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},{timestamps:true}));
export const Registration = mongoose.model('Registration', new mongoose.Schema({
 event:{type:mongoose.Schema.Types.ObjectId,ref:'Event',required:true},
 student:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, attended:{type:Boolean,default:false}
},{timestamps:true}).index({event:1,student:1},{unique:true}));
