const express = require("express");

require("dotenv").config();

const port = process.env.port||8000;
const { connection } = require("./config/db");
const { userRoute } = require("./routes/userroutes");
const { authenticate } = require("./middleware/authenticate");


const { authRoute } = require("./routes/auth");
const Razorpay=require("razorpay");
const crypto=require("crypto")

const photographerRouter=require("./routes/photogrpher.route");
const bookingRouter=require("./routes/bookingroute")
const {adminRouter}=require("./routes/adminroute")
const cors=require("cors")
const app = express();
app.use(express.json())
app.use(cors())


app.use(express.json());


app.use(userRoute);
app.use("/admin",adminRouter)

app.get("/", (req, res) => {
  res.send("welcome to apiace");
});

//app.use("/auth", authRoute);
app.use("/studio", photographerRouter);

//app.use("/auth", authRoute);

app.use("/bookings", bookingRouter);




/*************************************Razorpay********************************************************* */

// razorpay routes please dont touch these routes

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});



// app.get('/', (req, res) => {
//   //res.sendFile(path.join(__dirname, '../Frontend'))
// })

app.post('/createOrder', (req, res)=>{
  const {amount, currency, receipt, notes} = req.body;
  razorpayInstance.orders.create({amount, currency, receipt, notes},
      (err, order)=>{
          if(!err) {
              console.log(order.id)
              res.json(order)
          } else {
              res.send(err);
          }
      }
  )
});

app.post('/verifyOrder', (req, res)=>{
  const {order_id, payment_id} = req.body;
  const razorpay_signature = req.headers['x-razorpay-signature'];
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  let hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest('hex');
  if(razorpay_signature === generated_signature) {
      res.json({success:true, message:"Payment has been verified"})
  } else {
      res.json({success:false, message:"Payment verification failed"})
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, async () => {
  try {
    await connection;
    console.log("db connected");
  } catch (error) {
    console.log(error);
    console.log("db not connected something went wrong");
  }
  console.log("listning at port", port);
});