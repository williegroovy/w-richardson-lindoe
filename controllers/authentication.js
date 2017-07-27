const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) =>
  new Promise((resolve, reject) => {
    console.log('get this shit resolved');
    const timestamp = new Date().getTime();
    resolve(jwt.encode({sub: user.id, igt: timestamp}, config.secret));
  }
);

exports.login = function(req, res, next) {
  console.log('req', req);
  tokenForUser(req.user.id)
    .then( token => {
      res.send({ user: req.user, token });
    }
  ).catch(error => ({ error }));
};

exports.register = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  console.log('username', username);
  console.log('pass', password);
  if(!username || !password) {
    return res.status(422).send({error: 'Username and password required'});
  }

  User.findOne({username}, (err, existingUser) => {
    //if(err) console.log('err err err');
    if(err) return next(err);
    //console.log("existing user", existingUser);
    //if(existingUser) console.log('12345 everybody');
    if(existingUser) return res.status(422).send({error: 'Username already in use'});
    console.log('leave find one');
  });

  const user = User({username, password});

  user.save(err => {
    console.log(err);
    if(err) return next(err);
    res.json({token: tokenForUser(user)});
  })
};