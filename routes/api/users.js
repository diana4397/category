var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../auth');
var Users = mongoose.model('Users');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var moment = require('moment');
var { body, validationResult } = require('express-validator');
var passport = require("passport");
require("../passport")();
var aws = require('aws-sdk');
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	"region": "us-east-1"
});

var s3 = new aws.S3({
	params: {
		Bucket: process.env.AWS_BUCKET_NAME
	}
})

var upload = multer({
	fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
			return callback(new Error('only_images'))
		}
		callback(null, true)
	},
	limits: {
		fileSize: 2e+6 //2mb
	},
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_S3_PROFILE_PHOTO_PATH,
		acl: 'public-read',
		contentType: function (req, file, cb) {
			cb(null, file.mimetype);
		},
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname + '-' + Date.now() + path.extname(file.originalname) });
		},
		key: function (req, file, cb) {
			cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
		}
	})
})

var upload_profile_photo = upload.single('images');

const validate = validations => {
	return async (req, res, next) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) return next();

		res.json({ status: 0, errors: errors.array() });
	};
};

/**
	User normal registration :
	(All required)
	@first_name 	- String
	@last_name 		- String
	@email 			- String
	@password 		- String (Password requires one uppercase, one lowercase, one number, one symbol and minimum charcters)
	@phone			- String
*/
router.post('/register', validate([
	body('first_name').isAlpha(),
	body('last_name').isAlpha(),
	body('email').isEmail(),
	body('password', 'Requires 1 uppercase, 1 lowercase, 1 symbol, 1 number, min 8 and max 30 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,30}$/), //1upper 1lower 1symbol 1number min8char max30char
	body('phone').isMobilePhone(),
]), function (req, res) {

	//check email already exists or not
	Users.findOne({"$or": [{ email: req.body.email},{phone :req.body.phone}]}).then((user) => {
		if (user && user._id) {
			var message = (user.email === req.body.email) ? "Email Already Exists" : "Phone Already Exists";
			return res.json({
				status: 0,
				errors: [{ "msg": message, "param": "email", "location": "body" }],
				user_status: user.status
			})
		}

		const post_data = req.body;
		let email = (post_data.email).toLowerCase();
		//token text
		// var txt = { // this will use for generation hash for email verification token
		// 	timestamp: moment().add({
		// 		hours: process.env.USER_REGISTER_VERIFY_TOKEN_VALIDITY_IN_HOURS
		// 	}).utc(),
		// 	email: email
		// };
		const finalUser = new Users({
			first_name: post_data.first_name,
			last_name: post_data.last_name,
			email: email,
			phone: post_data.phone,
			status: 1, // due to mail option not proivided I have kept status = 1 otherwise it will be updated once users verify email id.
			// token: { // token will be for email verification token
			// 	new_user_register_verification: token 
			// }
		});

		finalUser.setPassword(post_data.password);

		finalUser.save()
			.then((registered_user) => {
                console.log("registered_user",registered_user);
				return res.json({
					status: 1,
					msg: "Registration successful.",
					user_id: registered_user._id,
					data: {
						first_name: post_data.first_name,
						last_name: post_data.last_name,
						email: email,
						phone: post_data.phone,
						dob: post_data.dob,
						profile_photo: null,
						quiz_completed: false
					}
				})
			}).catch(err => {
				console.log("err in register :", err);
				return res.json({
					status: 0,
					msg: "Registration failed"
				})
			});
	}).catch(err => {
		console.log("err in register :", err)
		return res.json({
			status: 0,
			msg: "Registration failed"
		})
	});
});

/**
	User normal login
	(All require)
	@email 		- String
	@password	- String
*/

router.post('/login',
	validate([
		body('email').isEmail(),
		body('password', 'Incorrect password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,20}$/)
	]),
	async (req, res) => {
		let email = (req.body.email).toLowerCase();
		Users.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return res.json({ status: 0, errors: [{ "msg": "Email not registered", "param": "email", "location": "body" }], })
				}

				if (!Users.validatePassword(req.body.password, user.hash, user.salt)) {
					return res.json({ status: 0, errors: [{ "msg": "Incorrect password", "param": "password", "location": "body" }], })
				}

				if (user.status == 1) {
                    return res.json({
                        status: 1,
                        data: {
                            _id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: email,
                            phone: user.phone,
                            profile_photo: user.profile_photo,
                        },
                        token: Users.generateJWT(email, user._id)
                    })
				}

				if (user.status == 2) {
					return res.json({
						status: 0,
						errors: [{ "msg": "Please verify your email address", "param": "email", "location": "body" }],
						data: {
							_id: user._id,
							first_name: user.first_name,
							last_name: user.last_name,
							email: email,
							phone: user.phone,
							dob: user.dob,
							profile_photo: user.profile_photo,
							quiz_completed: user.quiz_completed
						},
						user_status: 2
					})
				}
			})
			.catch((err) => {
				console.log("err : ", err);
				return res.json({ status: 0, msg: "Something went wrong" })
			})
	});

    /**
	User social login
	(All require)
*/
    router.post("/google",function (req, res, next) {
		var post = req.body;
		Users.upsertGoogleUser(post.accessToken, post.refreshToken, post.profileObj, function (err, user) {
			let token = Users.generateJWT(user.email, user._id);
			let data = JSON.parse(JSON.stringify(user))
			delete data['hash'];
			delete data['salt'];
			delete data["googleProvider"];
			delete data["twitterProvider"];
			delete data["status"];
			delete data["_v"];
			delete data["createdAt"];
			delete data["updatedAt"];
			return res.json({ status: 1, data, token });
		});
    });

    /**
*	User profile update
*	(All not mandatory & minimum one field require)
*	@first_name 		- optional - String
*	@last_name 			- optional - String
*	@phone 				- optional - String
*	@dob				- optional - String [DD.MM.YYYY] e.g. 31.01.1992
*	@profile_photo		- optional - file
*/
router.post('/update', auth.required, async function (req, res) {
	const { payload: { id } } = req;
	let updateObj = {};
	let profile_photo_path;
	const updateFields = ["first_name", "last_name", "phone", "dob"]

	upload_profile_photo(req, res, async (err) => {
		console.log("req file :", err, req.file);
		if (err) {
			//profile photo not upload
			// console.log("profile foto upload err :", err.message);
			let msg = 'Invalid file';
			if (err && err.message == 'only_images') msg = 'Invalid file type, only images (png, jpeg) are allowed';
			else if (err && err.message == 'File too large') msg = 'File too large, maximum 2 mb file size allowed'
			return res.json({ status: 0, errors: [{ "msg": msg, "param": "profile_photo", "location": "body" }] })
		} else if (req.file) {
			profile_photo_path = req.file.location;
			updateObj["profile_photo"] = req.file.location;
		}

		const post_data = req.body;

		await body('first_name').isAlpha().optional().run(req);
		await body('last_name').isAlpha().optional().run(req);
		await body('phone').isMobilePhone().optional().run(req);

		const result = validationResult(req);
		//if validation errors found
		if (!result.isEmpty()) return res.json({ errors: result.array() });

		for (var p in post_data)
			if (updateFields.includes(p) && post_data[p].trim()) //check update fields name from list
				updateObj[p] = post_data[p];

		//if no update fields passed
		if (Object.keys(updateObj).length == 0)
			return res.json({ status: 0, msg: "Missing update parameters" })

		//update data to database
		Users.findOne({phone :req.body.phone, _id : {$ne : mongoose.Types.ObjectId(id)}}).then((user) => {
			if (user && user._id) {
				return res.json({
					status: 0,
					errors: [{ "msg": "Phone already exists", "param": "email", "location": "body" }],
					user_status: user.status
				})
			}
			Users.findByIdAndUpdate(id, updateObj, { new: true }).then((user) => {
				console.log("updated user : ", user);
				return res.json({
					status: 1,
					msg: "Profile updated successfully",
					user: {
						first_name: user.first_name,
						last_name: user.last_name,
						email: user.email,
						phone: user.phone,
						profile_photo: (user.profile_photo && user.profile_photo != 'null') ? user.profile_photo : "",
					}
				});
			}).catch((err) => {
				console.log("in catch ...", err);
				return res.json({ status: 0, msg: "Profile update failed" });
			})

		});
	})
});

router.post('/get-profile',auth.required,function(req,res){
	Users.findOne({_id : mongoose.Types.ObjectId(req.body.id)}).then(user=>{
		res.json({status : 1, message : "Success",data : user});
	});
});



module.exports = router;