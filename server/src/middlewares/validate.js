import { validationResult } from 'express-validator';

// Middleware to check for validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    next();
  };

  export default validate;