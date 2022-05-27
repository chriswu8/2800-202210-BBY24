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

/** Middleware function that checks the privilege of the current session. If the 
 * privilege value is 'regular' or 'admin', proceed to URL endpoint, otherwise,
 * redirect to login/register page.
 */
async function authCheck(req, res, next) {
  if (await req.session.privilege === 'regular' || req.session.privilege === 'admin') {
    console.log('ok');
    next();
  } else {
    console.log('lacking appropriate privileges');
    res.redirect('/');
  }
};

/** Middleware function that checks the privilege of the current session. If the 
 * privilege value is 'admin', proceed to URL endpoint, otherwise, redirect to 
 * home for logged-in regular users, or login/register page for not logged-in
 * users.
 */
function authCheckAdmin(req, res, next) {
  if (req.session.privilege === 'admin') {
    console.log('ok');
    next();
  } else if (req.session.privilege === 'regular') {
    console.log('Lacking admin privileges');

    res.redirect('home');

  } else {
    console.log('lacking appropriate privileges');
    res.redirect('/');
  }
};

/** Middleware function that checks the privilege of the current session. If the 
 * privilege value is 'admin', proceed to URL endpoint, otherwise, redirect to 
 * home for logged-in regular users, or login/register page for not logged-in
 * users. This version redirects the regular users to '../home', instead of 
 * 'home'.
 */
function authCheckAdmin2(req, res, next) {
  if (req.session.privilege === 'admin') {
    console.log('ok');
    next();
  } else if (req.session.privilege === 'regular') {
    console.log('Lacking admin privileges');

    res.redirect('../home');

  } else {
    console.log('lacking appropriate privileges');
    res.redirect('/');
  }
};


module.exports = {
  checkNotAuthenticated,
  checkAuthenticated,
  authCheck,
  authCheckAdmin,
  authCheckAdmin2
};

