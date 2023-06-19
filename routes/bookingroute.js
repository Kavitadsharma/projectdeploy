const express = require('express');
const bookingRouter = express.Router();
const Booking = require('../models/booking.model');
// const userModel=require("../models/usermodel");

const {athorization}=require("../middleware/authorozation")
const {authenticate}=require("../middleware/authenticate")
// Get all bookings
// bookingRouter.get('/',athorization(["client"]), async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// Create a new booking
bookingRouter.post('/',authenticate,athorization(["client"]), async (req, res) => {
  try {
    const {photographerId, customerContact, startTime, endTime } = req.body;
    // const client = req.body.client;
    //console.log(req.body)
    //decode logic
    const booking = new Booking({
      customerContact,
      client:req.body.client,
      photographer:photographerId,
      startTime: new Date(startTime),
      endTime:new Date(endTime)

    });
 console.log(booking)
    
    // Save the booking to the database
    await booking.save();

    res.status(201).send({ message: 'Booking created successfully' ,booking});
  } catch (error) {
    console.error('Failed to create booking', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});




// Delete a booking by ID
bookingRouter.delete('/:id',authenticate,athorization(["client"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update a booking by ID
bookingRouter.patch('/:id',authenticate,athorization(["client","photographer"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve bookings with the same client
bookingRouter.get('/client',authenticate, authenticate, async (req, res) => {
  try {
    const client = req.body.client;

    // Find bookings with the provided client ID
    const bookings = await Booking.find({ client });

    res.json(bookings);
  } catch (error) {
    console.error('Failed to retrieve bookings', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
});



//http://localhost:4002/studio/photographerbookings
//Retrieve all booking requests for a specific photographer
// bookingRouter.get('/requests/:status', async (req, res) => {
//   try {
//     // Get the logged-in photographer's ID
//     const photographerId = req.user.id;
//     // Find all booking requests for the logged-in photographer from the database
//     const bookings = await Booking.find({ photographer: photographerId, status: req.params.status }).populate('client', 'name email');
//     res.json({ ok: true, bookings });
//   } catch (err) {
//     res.status(500).send({ error: err.message, mssg: 'Server Error', ok: false });
//   }
// });



module.exports = bookingRouter;

///http://localhost:4002/bookings == crete new booking

// http://localhost:4002/bookings/:id = delete booking

//http://localhost:4002/bookings/:id = update booking

//http://localhost:4002/bookings/client == all booking of perticular client
