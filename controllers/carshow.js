const express = require('express');
const router = express.Router();
const Cars = require('../models/carshow.js');
const cloudinary = require("../config/cloudinary") // require Cloudinary in the controller file

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

const myCar = async (req, res) => {
    try {
        const cars = await Cars.find({ owner: req.session.user._id }).populate('owner');
        res.render('carshow/my.ejs', {
            title: "My Cars",
            cars: cars
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

const creat = async (req, res) => {
    console.log('req: ', req.file)

    try {
        req.body.image = {
            url: req.file.path, // Cloudinary URL
            cloudinary_id: req.file.filename, // Cloudinary public ID
        }
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
        if (!car) return res.status(404).json({ message: "Car not found" });

      
        const cloudinary = require("../config/cloudinary");


        await cloudinary.uploader.destroy(car.image.cloudinary_id);

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
            res.send("You don't have permission to do that.")
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}


const updateCar = async (req, res) => {
    try {
        const car = await Cars.findById(req.params.carshowId)

        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(listing.imgUrl.cloudinary_id);

        // Add the new image to the form data
        req.body.imgUrl = {
            url: req.file.path, // Cloudinary URL
            cloudinary_id: req.file.filename, // Cloudinary public ID
        }

        await Cars.findByIdAndUpdate(
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
    myCar,
    newCars,
    creat,
    show,
    deleteCar,
    editCar,
    updateCar,

}