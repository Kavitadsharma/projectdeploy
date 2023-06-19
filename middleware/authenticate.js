// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const fs = require("fs");
// const {userModel} = require("../models/usermodel");


// async function authenticate(req, res, next) {


//   try {
//     let token = req.headers.authorization

//     if (token) {
//       const blackListData = JSON.parse(
//         fs.readFileSync("blacklist.token.json", "utf-8")
//       );
//       if (blackListData.includes(token)) {
//         res.send("login again user logout");
//       } else {
//         jwt.verify(token, process.env.secret, function (err, decoded) {
//           if (decoded) {
//             req.body.customerName = decoded.name;
//              req.body.userID = decoded.userID;
//             req.body.client = decoded.userID;
//             ///req.body.role=decoded.role;

//             next();
//           } else {
//             console.log(err);
//             res.status(401);
//             res.send("token you provided is invalid or it is expired");
//           }
//         });
//       }
//     }



//     // token = req.headers.authorization.split(" ")[1];

//     const validettoken = jwt.verify(token, process.env.secret);
//      //console.log(validettoken)
//     if (!validettoken) {
//       return res.status(401).send(({ "msg": "not Athorized..." }))
//     }
//     const { userId } = validettoken;


//     const user = await userModel.findOne({ _id: userId });
//     //console.log(user)
//     const role = user?.role;
//     req.role = role;
//     next();

//   } catch (error) {
//     return res.status(500).send(({ "msg": "something went wrong", error: error.message }))
//   }

// }

// module.exports = { authenticate };



const jwt = require("jsonwebtoken");
const { userModel } = require("../models/usermodel");
const fs = require("fs");
require("dotenv").config();


function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (token) {
    const blackListData = JSON.parse(
      fs.readFileSync("blacklist.token.json", "utf-8")
    );
    if (blackListData.includes(token)) {
      res.send("login again user logout");
    } else {
      jwt.verify(token, process.env.secret, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }

        const { userID } = decoded;
        console.log(decoded)
        try {
          const user = await userModel.findById(userID);

          if (!user) {
            return res.status(401).json({ message: "User not found" });
          }

          req.body.customerName = decoded.name;
          //req.body.userID = decoded.userID;
          req.body.client = decoded.userID;

          req.user = user;
          console.log(req.user)
          next();
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Internal server error" });
        }
      });
    }
  }

}



module.exports = { authenticate };

