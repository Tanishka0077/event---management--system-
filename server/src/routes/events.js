import {Router} from 'express';
import {Event,Registration} from '../models.js';
import {requireAuth,roles} from '../auth.js';
const r=Router();
r.get('/',async(req,res)=>{
 try{
  const q=(req.query.q||'').trim();
  const filter=q?{$or:[{title:{$regex:q,$options:'i'}},{club:{$regex:q,$options:'i'}},{description:{$regex:q,$options:'i'}}]}:{};
  const all=await Event.find(filter).sort({date:1});
  const out=await Promise.all(all.map(async e=>{const count=await Registration.countDocuments({event:e._id});return {...e.toObject(),registeredCount:count,availableSeats:Math.max(0,e.capacity-count)}}));
  res.json(out);
 }catch{res.status(500).json({message:'Could not load events.'});}
});
r.post('/',requireAuth,roles('coordinator','admin'),async(req,res)=>{
 try{
  const {title,description,club,venue,date,capacity}=req.body;
  if(!title||!description||!club||!venue||!date||Number(capacity)<1) return res.status(400).json({message:'Complete all fields with a valid capacity.'});
  res.status(201).json(await Event.create({title,description,club,venue,date,capacity:Number(capacity),createdBy:req.user._id}));
 }catch{res.status(400).json({message:'Could not create event.'});}
});
r.post('/:id/register',requireAuth,async(req,res)=>{
 try{
  const event=await Event.findById(req.params.id);
  if(!event)return res.status(404).json({message:'Event not found.'});
  if(new Date(event.date)<new Date())return res.status(400).json({message:'This event has already passed.'});
  if(await Registration.findOne({event:event._id,student:req.user._id}))return res.status(409).json({message:'Already registered for this event.'});
  if(await Registration.countDocuments({event:event._id})>=event.capacity)return res.status(400).json({message:'Event is full.'});
  res.status(201).json({message:'Registration successful.',registration:await Registration.create({event:event._id,student:req.user._id})});
 }catch(e){res.status(e.code===11000?409:500).json({message:e.code===11000?'Already registered.':'Registration failed.'});}
});
r.get('/mine',requireAuth,async(req,res)=>{
 try{res.json(await Registration.find({student:req.user._id}).populate('event').sort({createdAt:-1}));}
 catch{res.status(500).json({message:'Could not load registrations.'});}
});
r.get('/:id/registrations',requireAuth,roles('coordinator','admin'),async(req,res)=>{
 try{
  const e=await Event.findById(req.params.id);if(!e)return res.status(404).json({message:'Event not found.'});
  if(req.user.role!=='admin'&&String(e.createdBy)!==String(req.user._id))return res.status(403).json({message:'Only creator/admin may view registrations.'});
  res.json(await Registration.find({event:e._id}).populate('student','name email'));
 }catch{res.status(500).json({message:'Could not load participants.'});}
});
export default r;
