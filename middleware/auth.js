function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.render("home");
    }
    
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
      next();
    } else {
        req.session.error = "You have to Login first";
        res.render("register");
    }
  }
  
  module.exports = {
    checkNotAuthenticated,
    checkAuthenticated,
  };
  