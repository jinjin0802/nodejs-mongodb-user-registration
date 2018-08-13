var express   = require('express');
var router    = express.Router();
var mongoose  = require('mongoose');
var User      = mongoose.model('Users');
var crypto    = require('crypto'), hmac, signature;


const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize }   = require('express-validator/filter');
var path = require('path');




   /* GET home page. */
  router.get('/', function(req, res, next) {
      if(req.session && req.session.userId){
          User.findOne({ _id: req.session.userId }).exec(function(err, userLogged){
              if(!err){
                  res.render('profile', { fullname: userLogged.fullname });
              }
          });
      } else {
          res.render('login', { title: 'Registration'});
      }
   });



  // router.get('/', function(req, res, next) {
  //     res.sendFile('login.html', { root: path.join(__dirname, '../views') });
  // })
/////////////////////////////////////////////////////
  // router.get('/upload', function(req, res, next) {
  //     res.sendFile('main.html', { root: path.join(__dirname, '../public/html') });
  // })
/////////////////////////////////////////////////////




  router.post('/login', function(req, res, next){
    console.log(req.body.fullnameLG + req.body.passwordLG);
    if (req.body.fullnameLG && req.body.passwordLG) {
        User.authenticate(req.body.fullnameLG, req.body.passwordLG, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            return res.redirect('/');
          }
        });
      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }

  });

   
  /* POST user registration page. */
  router.post('/register',[ 
   
    check('fullname','Name cannot be left blank')
    .isLength({ min: 1 }),
   
    check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .trim()
    .normalizeEmail()
    .custom(value => {
        return findUserByEmail(value).then(User => {
          //if user email already exists throw an error
      })
    }),

    check('password')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long')
    .matches(/\d/).withMessage('Password must contain one number')
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.cpassword) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
      } else {
          return value;
      }
      
  }),

  // check('gender','Please select gender')
  //   .isLength({ min: 1 }),

  //   check('dob','Date of birth cannot be left blank')
  //   .isLength({ min: 1 }),
    
  //   check('country','Country cannot be left blank')
  //   .isLength({ min: 1 }),
    
    // check('terms','Please accept our terms and conditions').equals('yes'),

   ], function(req, res, next) {

      const errors = validationResult(req);

    if (!errors.isEmpty()) {     
        
       res.json({status : "error", message : errors.array()});

    } else {

        var document = {
            fullname:   req.body.fullname, 
            email:       req.body.email, 
            password:    req.body.password, 
            //dob:         req.body.dob, 
            // country:     req.body.country, 
            // gender:      req.body.gender, 
            // calorie:     req.body.calorie, 
            //salt:        req.body.salt 
          };
        
        var user = new User(document); 
        user.save(function(error){
          console.log(user);
          if(error){ 
            throw error;
          }
          return res.redirect('/');
          // res.json({message : "Data saved successfully.", status : "success"});
       });    
    }
});

function findUserByEmail(email){

  if(email){
      return new Promise((resolve, reject) => {
        User.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
          })
      })
    }
 }


module.exports = router;