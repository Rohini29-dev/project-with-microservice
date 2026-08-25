const { body, validationResult } = require("express-validator");

const respondwithValidationError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

const createAddressValidation = [
  body("shippingAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full Name is required"),

  body("shippingAddress.phone")
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be 10 digits"),

  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 3 })
    .withMessage("Street must be at least 3 characters"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.pincode")
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage("Pincode must be 6 digits"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  respondwithValidationError,
];

const updateAddressValidation = [
  body("shippingAddress.fullName")
    .optional()
    .trim()
    .notEmpty(),

  body("shippingAddress.phone")
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/),

  body("shippingAddress.street")
    .optional()
    .trim()
    .notEmpty(),

  body("shippingAddress.city")
    .optional()
    .trim()
    .notEmpty(),

  body("shippingAddress.state")
    .optional()
    .trim()
    .notEmpty(),

  body("shippingAddress.pincode")
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/),

  body("shippingAddress.country")
    .optional()
    .trim()
    .notEmpty(),

  respondwithValidationError,
];

module.exports = {
  createAddressValidation,
  updateAddressValidation,
};