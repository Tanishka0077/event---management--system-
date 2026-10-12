import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models.js';
import {requireAuth} from '../auth.js';
const r=Router();
const makeToken=u=>jwt.sign({id:u._id},process.env.JWT_SECRET||'dev_only_change_me',{expiresIn:'2d'});
r.post('/register',async(req,res)=>{
 try{
  const {name,email,password}=req.body;
  if(!name?.trim()||!email?.trim()||!password) return res.status(400).json({message:'Name, email and password are required.'});
  if(password.length<8) return res.status(400).json({message:'Password must contain at least 8 characters.'});
  if(await User.findOne({email:email.toLowerCase().trim()})) return res.status(409).json({message:'Email is already registered.'});
  const u=await User.create({name:name.trim(),email:email.toLowerCase().trim(),passwordHash:await bcrypt.hash(password,12)});
  res.status(201).json({token:makeToken(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}});
 }catch{res.status(500).json({message:'Could not create account.'});}
});
r.post('/login',async(req,res)=>{
 try{
  const u=await User.findOne({email:(req.body.email||'').toLowerCase().trim()});
  if(!u||!await bcrypt.compare(req.body.password||'',u.passwordHash)) return res.status(401).json({message:'Incorrect email or password.'});
  res.json({token:makeToken(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}});
 }catch{res.status(500).json({message:'Login failed.'});}
});
r.get('/me',requireAuth,(req,res)=>res.json({user:req.user}));
export default r;
