const { body, validationResult } = require('express-validator');

const respondwithValidationError  = (req,res,next)=>{
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({
            error:error.array()
        })
    }

    next()
} 


const registerUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^\S+$/)
    .withMessage('Username should not contain spaces'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('fullName.firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),

  body('fullName.lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),

    body('role')
    .isString()
    .withMessage('role must be string'),

    respondwithValidationError
];



const loginUserValidation = [
  // Email OR Username validation
  body()
    .custom((value, { req }) => {
      if (!req.body.email && !req.body.username) {
        throw new Error('Email or Username is required');
      }
      return true;
    }),

  // If email is provided → validate it
  body('email')
    .optional()
    .isEmail()
    .withMessage('Enter a valid email'),

  // If username is provided → validate it
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^\S+$/)
    .withMessage('Username should not contain spaces'),

  // Password validation
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

    respondwithValidationError

    
];
  
const createAddressValidation = [
  body("street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),

  body("zip")
    .notEmpty()
    .withMessage("Zip is required")
    .isPostalCode("IN") // 🇮🇳 India zip validation
    .withMessage("Invalid zip code"),

  body("country")
    .notEmpty()
    .withMessage("Country is required"),

  body("isDefult")
    .optional()
    .isBoolean()
    .withMessage("isDefult must be true or false"),

  respondwithValidationError,
];

module.exports = {
  registerUserValidation,
  loginUserValidation,
  createAddressValidation
};