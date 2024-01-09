const express = require('express');
const router = express.Router();
const Booking = require("../model/booking");
const Room = require("../model/room");
const stripe = require('stripe')(
    'sk_test_51OJAnCSFlsOEfvLRiG9jORBj30G1WAx420We6VyGO9iiNNYVYnYQFORschUCm9aYbo5xI0SENykt4rr0oGXwW53C00B0yyIkLC');
const { v4: uuidv4 } = require('uuid');


router.post("/bookroom", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.paymentIntents.create({
            amount: totalamount * 100,
            customer: customer.id,
            currency: 'inr',
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        });

        if (payment) {
            try {
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate,
                    todate,
                    totalamount,
                    totaldays,
                    transactionid: payment.id // Use the actual transaction ID
                });

                const booking = await newbooking.save();
                const roomtemp = await Room.findOne({ _id: room._id });
                roomtemp.currentbookings.push({
                    bookingid: booking._id,
                    fromdate,
                    todate,
                    userid,
                    status: booking.status
                });
                await roomtemp.save();
                res.status(200).send("Room Booked Successfully");
            } catch (error) {
                console.error(error);
                res.status(500).json({ error });
            }
        } else {
            res.status(402).json({ error});
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error});
    }

    
    
});
    

router.post("/getbookingsbyuserid", async (req, res) => {
    console.log("Request received for getbookingsbyuserid");
    const userid = req.body.userid;

    try {
        const bookings = await Booking.find({ userid: userid });
        console.log("Bookings:", bookings);
        res.send(bookings);
    } catch (error) {
        console.log("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
},[]);



router.post("/cancelbooking",async(req,res)=>
    {

        const{bookingid,roomid}=req.body

        try {
            const bookingitem=await Booking.findOne({_id: bookingid})
            bookingitem.status="Cancelled"
            await bookingitem.save()

            const room=await Room.findOne({_id : roomid})

            const bookings=room.currentbookings


            const temp=bookings.filter(booking => booking.bookingid.toString()!==bookingid)

            room.currentbookings=temp

            await room.save()
            res.send("Your Booking Cancelled Succesfully")
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
            
        }
    })

    router.get("/getallbookings",async(req,res)=>
    {
        try {
            const bookings= await Booking.find()
            res.send(bookings)
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })


module.exports = router;
