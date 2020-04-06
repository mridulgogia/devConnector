const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const jwt = require('jsonwebtoken');
const secretKey = require('../../config/keys').secretKey;

const User = require('../../models/User');

const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get('/test', (req, res) => res.json({
    msg: "Users works"
}));

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
if(!isValid) return res.status(400).json(errors);

const {name, email, password } = req.body;
    User.findOne({
        email: email
    })
    .then( user => {
        if(user) {return res.status(400).json({
            msg  : "Email already exist"
        })
    } else {
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d:'mm'
        });

        const newUser = new User({
            name: name,
            email: email,
            avatar: avatar,
            password: password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then( user => res.json(user))
                    .catch(err => console.log(err));
            })
        });
    }
    });
});

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) return res.status(400).json(errors);

   
    const { email, password} = req.body;

    User.findOne({
        email
    })
    .then( user => {
        if(!user) {
            errors.email = 'User not found';
            return res.status(404).json({errors});
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar
                    };

                    jwt.sign(
                        payload, 
                        secretKey,
                        {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    );
                } else {
                    errors.password = 'Password incorrect'
                     res.status(400).json({ errors });
                }
            })
    });
}); 

router.get('/current', 
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
    })


module.exports = router;