import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
