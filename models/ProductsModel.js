import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
