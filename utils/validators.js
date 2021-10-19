const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct email!')
        .custom( async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('This email is already taken!');
                }
            } catch (e) {
                console.log('Error: ', e);
            }
        }).normalizeEmail(),
    body('password', 'password must be at least 6 characters')
        .isLength({min:6, max:56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match!');
            }
            return true;
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('The name must be at least 3 characters.')
        .trim()
];

exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Minimum name length 3 characters.')
        .trim(),
    body('price')
        .isNumeric()
        .withMessage('Enter the correct price'),
    body('img', 'Enter the correct URL picture.')
        .isURL()
];