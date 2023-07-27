import mongoose from 'mongoose'

const userCollection = 'Users'

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'premium', 'user'],
    default: 'user'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  },
  documents: [
    {
      _id: false,
      name: { type: String },
      reference: { type: String }
    }
  ],
  last_connection: Date,
  status: Array
})

export const userModel = mongoose.model(userCollection, userSchema)
