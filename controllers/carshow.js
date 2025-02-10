const express = require('express');
const router = express.Router();
const Cars = require('../models/carshow.js');

// const allcar = async (req, res) => {
//     try {
//         const cars = await User.aggregate([
//             { $unwind: "$owner" },
//             { $replaceRoot: { newRoot: "$owner" } },

//         ])
//         console.log(cars)

//         res.render('carshow/allcar.ejs', {
//             title: " All Cars",
//             cars
//         });
//     } catch (err) {
//         console.log(err);
//         res.redirect('/');
//     }
// }

const index = async (req, res) => {
    try {
        const car = await Cars.find().populate('owner')
        res.render('carshow/index.ejs', {
            title: 'Cars',
            cars: car,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
const newCars = async (req, res) => {
    res.render('carshow/new.ejs', { title: "Add Car" })
}

const creat = async (req, res) => {
    try {
        req.body.owner = req.params.userId
        await Cars.create(req.body)
        res.redirect('/carshow/index')
    } catch (error) {
        console.log(error)

    }
}
const show = async (req, res) => {
    try {
        const car = await Cars.findById(req.params.carshowId).populate('owner')
        res.render('carshow/show.ejs', {
            title: car.model,
            car,

        })
    } catch (error) {
        console.log(error)

    }

}

const deleteCar = async (req, res) => {
    try {
        const car = await Cars.findById(req.params.carshowId)

        if (car.owner.equals(req.params.userId)) {
            await car.deleteOne()
            res.redirect('/carshow/index')
        } else {
            res.send("You don't have permission to do that.")
        }

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}


const editCar = async (req, res) => {
    try {
        const car = await Cars.findById(req.params.carshowId).populate('owner')
        if (car.owner.equals(req.params.userId)) {
            res.render('carshow/edit.ejs', {
                title: `Edit ${car.model}`,
                car
            })
        } else {
            res.send("You don't have permission to do that.") // if owner and signed in user are different - send message
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const updateCar = async (req, res) => {
    try {
        const car = await Cars.findByIdAndUpdate(
            req.params.carshowId,
            req.body,
            { new: true }
        )
        res.redirect(`/carshow/${car._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}






module.exports = {
    index,
    // allcar,
    newCars,
    creat,
    show,
    deleteCar,
    editCar,
    updateCar,

}