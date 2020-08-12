var express = require('express');
var router = express.Router();
var auth = require('../auth');
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
var moment = require('moment');
var { body, validationResult } = require('express-validator');
var aws = require('aws-sdk');
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	"region": "us-west-2"
});
console.log("process.env.AWS_BUCKET_NAME",process.env.AWS_BUCKET_NAME)
var s3 = new aws.S3({
	params: {
		Bucket: process.env.AWS_BUCKET_NAME
	}
})

var upload = multer({
	fileFilter: function (req, file, callback) {
		console.log("file",file)
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
			console.log("filefilefile",file);
			cb(null, file.mimetype);
		},
		metadata: function (req, file, cb) {
			console.log("meta data============>",file);
			cb(null, { fieldName: file.fieldname + '-' + Date.now() + path.extname(file.originalname) });
		},
		key: function (req, file, cb) {
			console.log("fil=========>",file);
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

router.post('/list', auth.required, function (req, res) {
	var post = req.body;
	const { payload: { id } } = req;
	req.getConnection(function (err, connection) {
		if (err) {
			res.json({ errors: err })
		} else {
			var where_sql = "";
			if(post.category_id && post.category_id > 0 ){
				where_sql += ` AND id = ${post.category_id}`
			}
			var sql = "SELECT * FROM category WHERE user_id  = ? "+ where_sql+" ORDER BY id DESC";
			connection.query(sql, [id], function (err, rows) {
				if (err) {
					res.json({
						status: 0,
						message: "There is error in processing data!"
					});
				} else {
					res.json({
						status: 1,
						message: "Success",
						data: rows
					})
				}
			});
		}
	});
});

router.post('/add-update', auth.required, async function (req, res) {
	var post = req.body;
	const { payload: { id } } = req;
	console.log("post=============>", req.body, id);
	req.getConnection(function (err, connection) {
		if (err) {
			res.json({ errors: err })
		} else {
			var check_sql = "SELECT * FROM category WHERE name = ? AND id != ?";
			connection.query(check_sql, [post.name, post.category_id], function (err, check_rows) {
				if (err) {
					res.json({
						status: 0,
						errors: err
					});
				} else {
					if (check_rows.length > 0) {
						res.json({
							status: 0,
							errors: "Category Already Exisits"
						});
					} else {
						if (post.category_id > 0) {
							//update
							var sql = "UPDATE category SET name = ?,user_id=? WHERE id = ?";
							connection.query(sql, [post.name, id, post.category_id], function (err, upres) {
								if (err) {
									res.json({ status: 0, errors: err })
								} else {
									res.json({ status: 1, message: "Updated Successfully" })
								}
							})
						} else {
							// insert
							var sql = "INSERT INTO category (name,user_id) VALUES (?,?)";
							connection.query(sql, [post.name, id], function (err, upres) {
								if (err) {
									res.json({ status: 0, errors: err })
								} else {
									res.json({ status: 1, message: "Added Successfully" })
								}
							})
						}
					}
				}
			});
		}
	});
});

router.post('/list-content', auth.required, async function (req, res) {
	var post = req.body;
	const { payload: { id } } = req;
	req.getConnection(function (err, connection) {
		if (err) {
			res.json({
				status: 0,
				errors: err
			});
		} else {
			var where_sql = "";
			if (post.category_id && post.category_id > 0) {
				where_sql += ` AND c.category_id = ${post.category_id}`
			}
			if (post.content_id && post.content_id > 0) {
				where_sql += ` AND c.id= ${post.content_id}`
			}
			var sql = "SELECT c.*,cat.name FROM category_content c LEFT JOIN category cat ON cat.id = c.category_id WHERE c.status = 1" + where_sql + " ORDER BY id DESC";
			connection.query(sql, function (err, rows) {
				if (err) {
					res.json({
						status: 0,
						errors: err
					});
				} else {
					res.json({
						status: 1,
						message: "Success",
						data: rows
					});
				}
			});
		}
	});
});

router.post('/add-update-content', auth.required, async function (req, res) {
	const { payload: { id } } = req;
	req.getConnection(function (err, connection) {
		if (err) {
			res.json({
				status: 0,
				errors: err
			})
		} else {
			var set_sql = "";
			upload_profile_photo(req, res, async (err) => {
				console.log("req.file",req.file);
				console.log("errrrrrr",err);
				var post = req.body;
				if (err) {
					//profile photo not upload
					// console.log("profile foto upload err :", err.message);
					let msg = 'Invalid file';
					if (err && err.message == 'only_images') msg = 'Invalid file type, only images (png, jpeg) are allowed';
					else if (err && err.message == 'File too large') msg = 'File too large, maximum 2 mb file size allowed'
					return res.json({ status: 0, errors: [{ "msg": msg, "param": "profile_photo", "location": "body" }] })
				} else if (req.file) {
					post.document= req.file.location;
					set_sql += ` ,document= "${req.file.location}" `
				}
				console.log("post================>",post);
				if (post.content_id > 0) {
					var sql = "UPDATE category_content SET content = ?, category_id = ?" + set_sql + " WHERE id = ?";
					connection.query(sql, [post.content, post.category_id, post.content_id], function (err, upres) {
						console.log("this.sql================>",this.sql);
						if (err) {
							res.json({
								status: 0,
								errors: err
							})
						} else {
							res.json({
								status: 1,
								message : "Updated Successfully"
							})
						}
					});
				} else {
					var sql = "INSERT INTO category_content (content,category_id,document) VALUES (?,?,?)";
					connection.query(sql, [post.content, post.category_id, post.document], function (err, upres) {
						if (err) {
							res.json({
								status: 0,
								errors: err
							})
						} else {
							res.json({
								status: 1,
								message : "Added Successfully"
							})
						}
					});
				}
			});
		}
	});
});

module.exports = router;