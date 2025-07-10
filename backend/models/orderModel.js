import mongoose from 'mongoose';

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    // Order items with details
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],

    // Shipping address details
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      states: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Payment method and result details
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    // Prices and totals
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // User reference
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Payment and delivery status
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' timestamps
  }
);

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

export default Order;
