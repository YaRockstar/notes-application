import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  fullName: { type: String },
  createdOn: { type: Date, default: Date.now() },
});

export default mongoose.model('User', userSchema);
