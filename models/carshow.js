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
        type: Number,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    urlImage: {
        type: String,
        required: true,
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
