/**
 * Mobile application users
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    profile_photo: { type: String, trim: true, default: null },
    dob: { type: String, trim: true }, //DD.MM.YYYY
    hash: String, //password hash
    salt: String, //password salt
    google_id: { type: String, trim: true },
    status: Number, // 1=active/verified 2=not verified
    googleProvider: {
        type: { id: String, token: String },
        select: false
    }
}, { timestamps: true });

UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.statics.generateSalt = function () {
    return crypto.randomBytes(16).toString('hex');
};

UsersSchema.statics.generateHash = function (salt, password) {
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function (password, hash = this.hash, salt = this.salt) {
    const chkhash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return hash === chkhash;
};

UsersSchema.statics.validatePassword = function (password, hash = this.hash, salt = this.salt) {
    const chkhash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return hash === chkhash;
};

UsersSchema.methods.generateJWT = function (email = this.email, id = this._id) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: email,
        id: id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_SECRET_KEY);
}

UsersSchema.statics.generateJWT = function (email = this.email, id = this._id) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: email,
        id: id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_SECRET_KEY);
}

UsersSchema.methods.toAuthJSON = function () {
    return {
        email: this.email,
        token: this.generateJWT(),
    };
};

UsersSchema.methods.isValidUsernamePassword = function (email, password, done) {
    this.model("Users").findOne({ email })
        .then((user) => {
            if (!user) {
                return done("Invalid email address", null);
            }

            if (!this.validatePassword(password, user.hash, user.salt)) {
                return done("Invalid password", null);
            }

            if (user.status == 1) {
                return done(null, user);
            }

            if (user.status == 2) {
                return done("Please verify your email address", null);
            }

            if (user.status == 3) {
                return done("User is blocked by admin", null);
            }
        }).catch(done);
}


UsersSchema.statics.upsertGoogleUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    console.log("in upsert google user");
    return this.findOne({
        'googleProvider.id': profile.googleId
    }, function (err, user) {
        // no user was found
        console.log("user found by google id response : ", user);
        if (!user) {
            console.log("no user found by google id");
            //check if email already registered or not
            that.findOne({
                'email': profile.email
            }, function (err, emailuser) {
                console.log("user found by email response : ", emailuser);
                //no user found by email, lets create a new one
                if (!emailuser) {
                    console.log("no user found by email, insert new user");
                    var newUser = new that({
                        first_name: profile.givenName,
                        last_name: profile.familyName,
                        email: profile.email,
                        googleProvider: {
                            id: profile.googleId,
                            token: accessToken
                        },
                        register_from: 1,
                        status: 1,
                        // profile_photo: profile._json.picture
                    });

                    newUser.save(function (error, savedUser) {
                        if (error) { console.log(error); }
                        return cb(error, savedUser);
                    });
                } else { //if user found with email, lets merge the user
                    console.log("user found by email, update existing user");
                    that.findByIdAndUpdate(emailuser._id, {
                        // first_name: profile.name.givenName,
                        // last_name: profile.name.familyName,
                        // email: profile.emails[0].value,
                        googleProvider: {
                            id: profile.googleId,
                            token: accessToken
                        },
                        // profile_photo: profile._json.picture
                    }, function (error, savedUser) {
                        if (error) { console.log(error); }
                        return cb(error, savedUser);
                    })
                }
            })
        } else {
            console.log("user found by google id");
            return cb(err, user);
        }
    });
};

mongoose.model('Users', UsersSchema,'users');