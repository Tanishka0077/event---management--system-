import jwt from 'jsonwebtoken';
import { User } from './models.js';
export async function requireAuth(req,res,next){
 try{
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');
  if(!token) return res.status(401).json({message:'Please log in first.'});
  const payload=jwt.verify(token,process.env.JWT_SECRET||'dev_only_change_me');
  req.user=await User.findById(payload.id).select('-passwordHash');
  if(!req.user) return res.status(401).json({message:'User not found.'});
  next();
 }catch{return res.status(401).json({message:'Session invalid. Please log in again.'});}
}
export function roles(...allowed){return (req,res,next)=>allowed.includes(req.user?.role)?next():res.status(403).json({message:'Permission denied.'});}
