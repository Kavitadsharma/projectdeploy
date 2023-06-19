/*************************************Razorpay********************************************************* */

// razorpay routes please dont touch these routes

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET

});


//app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/success.html'))
})

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



// razorpay frontend
/*****************Razorpay*****************************/

    
fetch(`${baseURL}createOrder`, {
    method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
      payment(data)
  })
  .catch(error => {
    console.log(error);
  });
  

  function payment(data){
      let x = JSON.parse(localStorage.getItem("total"))
      console.log(x)
      const options = {
      "key": "rzp_test_FkLG5L2aUSSixd",
      "amount": x*100,
      "currency": "INR",
      "name": "Bake N Flake",
      "order_id": data.orderId,
      "handler": function (response){
          console.log(response)
          alert("This step of Payment Succeeded");
          window.location.href = "./success.html";

      },
      "prefill": {
          //Here we are prefilling random contact
          "contact":"9075537652",
          //name and email id, so while checkout
          "name": "Darshan Bhandwalkar",
          "email": "bhandwalkardarshan@gmail.com" 
      },
      "theme": {
          "color": "#2300a3"
      }
    };
  
      var razorpayObject = new Razorpay(options);
      console.log(razorpayObject);
  
      razorpayObject.on('payment.failed', function (response){
          console.log(response);
          alert("This step of Payment Failed");
      });
  
      document.getElementById('pay-button').onclick = function(e){
     
      e.preventDefault();
      
      razorpayObject.open();
      }
     
  }
      
  