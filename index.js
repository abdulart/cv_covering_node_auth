const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const app = express();
const auth = require('./auth/index');
const middlewares = require('./auth/middleware');

/**
 * Http logger
 */
app.use(volleyball);

/**
 * Cors for evading that annoying Chrome error
 * set to * to allow all connections
 */
app.use(cors({
    origin: '*'
}));

app.use(express.json());

/**
 * Middleware for checking token on Front end
 */
app.use(middlewares.checkTokenSetUser);

app.use('/auth', auth);

/**
 * Not found handler
 * @param req
 * @param res
 * @param next
 */
function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

/**
 * Error handler
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`We're on `, port);
});