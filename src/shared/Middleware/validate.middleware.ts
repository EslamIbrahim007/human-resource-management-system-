//Importing validationResult:
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validatorMiddelware = (req: Request, res: Response, next: NextFunction): void => {
// Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "Fail",
        errors: errors.array().map(error => ({ field: (error as any).path ?? (error as any).param, msg: error.msg }))
      });
      return;
    }
    next();
};
  
export default validatorMiddelware;