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



const createAddressValidation = [
  body("shippingAddress.street")
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),

  body("shippingAddress.pincode")
    .notEmpty()
    .withMessage("pincode is required")
    .isPostalCode("IN") // 🇮🇳 India zip validation
    .withMessage("Invalid zip code"),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required"),

 

  respondwithValidationError,
];

const updateAddressValidation = [
body('shippingAddress.street')
.isString()
.withMessage('street must be a string')
.notEmpty()
.withMessage('street cannot to empty'),

body('shippingAddress.city')
.isString()
.withMessage('city must be a string')
.notEmpty()
.withMessage('city cannot to empty'),


body('shippingAddress.state')
.isString()
.withMessage('state must be a string')
.notEmpty()
.withMessage('state cannot to empty'),

body('shippingAddress.pincode')
.isString()
.withMessage('pincode must be a string')
.notEmpty()
.withMessage('pincode cannot to empty')
.bail()
.matches(/^\d{4,}$/)
.withMessage('pincode must be at least 4 digits'),

body('shippingAddress.country')
.isString()
.withMessage('country must be a string')
.notEmpty()
.withMessage('country cannot to empty'),


respondwithValidationError


]


module.exports = {
    createAddressValidation,
    updateAddressValidation
}
