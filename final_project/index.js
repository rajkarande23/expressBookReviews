const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Get the token from the Authorization header
    const token = req.headers["authorization"];
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    // The token is usually sent as "Bearer <token>", so split and get the actual token
    const actualToken = token.split(" ")[1];
  
    jwt.verify(actualToken, "access", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Failed to authenticate token" });
      }
      // If token is valid, save decoded user info to request object for use in routes
      req.user = decoded;
      next();
    });
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
