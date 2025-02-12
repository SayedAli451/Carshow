const mongoose = require('mongoose')
const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    mileage: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: { type: String, required: true }, // Cloudinary URL
        cloudinary_id: { type: String, required: true }, // Public ID for deletion
      },
    status: {
        type: String,
        enum: ['Sold', 'Available'],
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

},)

const Cars = mongoose.model('Cars', carSchema)
module.exports = Cars
