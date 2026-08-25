const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

function validateResult(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  next();
}

const validationaddItemTOCart = [
  body("productId")
    .notEmpty().withMessage("productId is required")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid productId format"),

  body("qty")
  .isInt()
  .withMessage("Quantity must be an integer"),

  validateResult,
];


// const validateUpdateCartItem = [
//   param("productId")
//     .notEmpty().withMessage("productId is required")
//     .custom(value => mongoose.Types.ObjectId.isValid(value))
//     .withMessage("Invalid productId format"),

//   body("qty")
//     .notEmpty().withMessage("qty is required")
//     .isInt({ gt: 0 })
//     .withMessage("Quantity must be greater than 0"),

//   validateResult,
// ];

const validateUpdateCartItem = [
  param("productId")
    .notEmpty()
    .withMessage("productId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid productId format"),

  body("qty")
    .notEmpty()
    .withMessage("qty is required")
    .isInt()
    .withMessage("Quantity must be an integer"),

  validateResult,
];




module.exports = {
  validationaddItemTOCart,
  validateUpdateCartItem
};