// node script that inserts demo users into Mongo
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthdb';

(async ()=>{
  await mongoose.connect(MONGO_URI);
  const userSchema = new mongoose.Schema({email:String,password:String,role:String,profile:Object,patients:[String]});
  const User = mongoose.model('User', userSchema);
  await User.deleteMany({});
  const pass = await bcrypt.hash('demo123',10);
  const patient = await User.create({email:'patient@demo.com', password:pass, role:'patient', profile:{firstName:'Patient',lastName:'Demo'}});
  const doctor = await User.create({email:'doctor@demo.com', password:pass, role:'doctor', profile:{firstName:'Doctor',lastName:'Demo'}, patients:[patient._id]});
  const admin = await User.create({email:'admin@demo.com', password:pass, role:'admin', profile:{firstName:'Admin',lastName:'Demo'}});
  console.log('seeded users', patient._id, doctor._id, admin._id);
  process.exit(0);
})();
