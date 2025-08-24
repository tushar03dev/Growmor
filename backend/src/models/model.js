import mongoose from 'mongoose';
const { Schema } = mongoose;

const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }]
});

const DiscountSchema = new Schema({
    percent: { type: Number, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    plants: [{ type: Schema.Types.ObjectId, ref: 'Plant' }]
});

const ReviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    rating: { type: Number, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now },
});

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentId: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }]
});

const OrderItemSchema = new Schema({
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const AddressSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal: { type: String, required: true },
    country: { type: String, required: true }
});

const ViewLogSchema = new Schema({
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    ip: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now }
    // Removed 'productId'
});

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const PlantSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
        imageUrl: { type: String },
        key: String,
        contentType: String,
        imageName: String,
        size: Number,
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    discountPercentage: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    cartItems: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }],
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    viewLogs: [{ type: Schema.Types.ObjectId, ref: 'ViewLog' }]
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    items: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }]
});

const CartItemSchema = new Schema({
    cartId: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant' },
    quantity: { type: Number, default: 1 }
});

export const Admin = mongoose.model('Admin', AdminSchema);
export const User = mongoose.model('User', UserSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Discount = mongoose.model('Discount', DiscountSchema);
export const Review = mongoose.model('Review', ReviewSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
export const Address = mongoose.model('Address', AddressSchema);
export const ViewLog = mongoose.model('ViewLog', ViewLogSchema);
export const Blog = mongoose.model('Blog', BlogSchema);
export const Plant = mongoose.model('Plant', PlantSchema);
export const Cart = mongoose.model('Cart', CartSchema);
export const CartItem = mongoose.model('CartItem', CartItemSchema);