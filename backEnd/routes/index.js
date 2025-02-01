const router = require('express').Router();
const authRoute = require('./auth');
const userRoute = require('./user');
const configRoute = require('./config');
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/config', configRoute);//added this line
module.exports = router;