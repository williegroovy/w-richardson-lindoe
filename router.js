const passport = require('passport');
const passportService = require('./services/passport');
const Authentication = require('./controllers/authentication');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = app => {

	app.get('/', requireAuth, (req, res) => {
		res.send({message: 'You are authenticated'});
	});

	app.post('/login', requireSignin, Authentication.login);
	app.post('/logout', Authentication.register);
};