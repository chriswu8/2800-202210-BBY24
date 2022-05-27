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

    async function authCheck (req, res, next) {                 //new, ok working
      if(await req.session.privilege === 'regular') {
        console.log('ok');
        next();
      } else {
        console.log('lacking appropriate privileges'); 
        res.redirect('/');
      }
      };

      function authCheckAdmin (req, res, next) {                 //new 
        if(req.session.privilege === 'admin') {
          console.log('ok');
          next();
        } else if (req.session.privilege === 'regular') {
          console.log('lacking appropriate privileges'); 
          res.redirect('home');

        } else {
          console.log('lacking appropriate privileges');
          res.redirect('/');
        }
        };

module.exports = {
  checkNotAuthenticated,
  checkAuthenticated,
  authCheck, // new
  authCheckAdmin //new
};
  