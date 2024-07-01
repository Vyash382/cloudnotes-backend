var jwt = require("jsonwebtoken");
const fetchuser = (req, res, next) => {
  //get user from jwt token
  const token = req.header("auth-token");
  if (!token) {
   return  res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  try {
    // console.log('hi');
    // console.log(token);
    const data = jwt.verify(token, "YashSumpremacy");

    // console.log(data);
    
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401);
    console.log(error)
  }
};
module.exports = fetchuser;
