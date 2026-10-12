import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import auth from './routes/auth.js';
import events from './routes/events.js';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req,res)=>res.json({status:'ok'}));
app.use('/api/auth', auth);
app.use('/api/events', events);
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req,res,next)=>{
 if(req.path.startsWith('/api/')) return next();
 res.sendFile(path.join(clientDist, 'index.html'), err=>{ if(err) next(); });
});
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect')
 .then(()=>app.listen(port,()=>console.log(`API listening on ${port}`)))
 .catch(e=>{console.error('MongoDB connection error:',e.message);process.exit(1)});
