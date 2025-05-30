import mongoose, { Schema, models } from 'mongoose';

const editorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed passwords
});

export const Editor = models.Editor || mongoose.model('Editor', editorSchema);
