var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var http = require('http');
var mysql = require('mysql');
var connection = require('express-myconnection');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var mongoose = require("mongoose");
var passport = require("passport");
require("dotenv").config({ path: `${__dirname}/config/env/.env.${process.env.ENV_MODE}` });

//Configure mongoose"s promise to global promise
mongoose.promise = global.Promise;
//Configure Mongoose
mongoose.connect(`mongodb://${process.env.MONGODB_DATABASE_HOST}:${process.env.MONGODB_DATABASE_PORT}/${process.env.MONGODB_DATABASE_NAME}`, {
  useNewUrlParser: true
}).catch(function (err) {
  console.log("DATABASE CONNECTION ERROR : ", err);
})
mongoose.connection.on("connected", function () {
  console.log(`\nMONGODB CONNECTED SUCCESSFULLY ON ${process.env.MONGODB_DATABASE_HOST}:${process.env.MONGODB_DATABASE_PORT}\n`);
});
mongoose.set("debug", true);

var app = express();
app.use(logger("dev"));

//cors configuration
var corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token"]
};
app.use(cors(corsOption));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000
}));
app.use(cookieParser());
app.use(session({
    secret: 'Dr~jdprTsdf44',
    resave: true,
    saveUninitialized: true
}));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'devlopment' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// //flash error and success mssages
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     // res.locals.notnull = constants.NOT_NULL_ARRAY;
//     res.locals.error_messages = req.flash('errorMessage');
//     res.locals.success_messages = req.flash('successMessages');
//     // console.log(req.session.user)
//     res.locals.user_role_id = req.session.user;
//     next();
// });


// My-sql connection

app.use(connection(mysql, {
    host: process.env.MYSQL_DATABASE_HOST,
    user: process.env.MYSQL_DATABASE_USER,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME, //database name
    multipleStatements: true,
    whichdb: "LOCAL"
}));


require("./models/Users");
var usersRouter = require("./routes/api/users");
var categoryRouter = require("./routes/api/category");
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use(passport.initialize());
app.use(passport.session());
var server = http.createServer(app);

server.listen(`${process.env.PORT}`, function () {
    console.log('HTTP server listening on port ' + process.env.PORT);
});

console.error = function(msg) {
    // send email
    // ...
  //console.log("common function",msg);
    // additionaly log
    process.stderr.write(msg);
  };

module.exports = app;