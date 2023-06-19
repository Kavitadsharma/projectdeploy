
function athorization(roles) {
    return (req, res, next) => {
      const { role } = req.user;
       //console.log(req.user)
      if (!roles.includes(role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      next();
    };
  }

  module.exports={
    athorization
}