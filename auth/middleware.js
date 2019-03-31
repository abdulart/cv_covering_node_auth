const jwt = require('jsonwebtoken');
const db = require('../config/connection');
const config_token = require('../config/token');
const users = db.get('users');

/**
 * This middleware used for front end to check is user (still) authenticated
 * @param req
 * @param res
 * @param next
 */
function checkTokenSetUser(req, res, next) {
    const authHeader = req.get('authorization');
    if(authHeader) {
        const token  = authHeader.split(' ')[1];
        if(token) {
            jwt.verify(token, config_token, (error, user) => {
                if(error) {
                    console.log(error);
                }

                users.findOne({
                    email: user.email
                }).then(usr => {
                    // if user is undefined, username is not in the db
                    if(usr) {
                        req.user = {
                            email: usr.email,
                            token: usr.token,
                        };
                        next();
                    } else {
                        req.user = user;
                        next();
                    }
                });
            });
        } else {
            next();
        }
    } else {
        next();
    }
}

/**
 * Check if logged in
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        const error = new Error('unathorized');
        res.status(401);
        next(error);
    }
}

module.exports = {
    checkTokenSetUser,
    isLoggedIn,
};