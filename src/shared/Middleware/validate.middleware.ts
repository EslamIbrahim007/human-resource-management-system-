//Importing validationResult:
import { validationResult } from 'express-validator';

const validatorMiddelware =(req, res, next) => {
// Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "Fail",
        errors: errors.array().map(error => ({ field: error.param, msg: error.msg }))
      });
    }
    next();
};
  
export default validatorMiddelware