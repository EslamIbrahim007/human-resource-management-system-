import moment from 'moment';
import { check } from 'express-validator';
import validatorMiddleware from '../../Middleware/validatorMiddleware.js'; // Ensure you have this middleware

// Custom date format validator
const isValidDate = (value) => {
  const dateFormat = 'DD/MM/YYYY';
  return moment(value, dateFormat, true).isValid();
};

export const leaveValidation = [
  check('reason')
    .notEmpty().withMessage('Reason is required'),

  check('startDate')
    .notEmpty().withMessage('Start date is required')
    .custom((value, { req }) => {
      console.log(`Validating startDate: ${value}`); // Debugging
      if (!isValidDate(value)) {
        throw new Error('Start date must be a valid date with this form DD/MM/YYYY.');
      }
      const start = moment(value, 'DD/MM/YYYY', true);
      const end = moment(req.body.endDate, 'DD/MM/YYYY', true);

      if (!end.isValid()) {
        throw new Error('End date must be provided in the form DD/MM/YYYY.');
      }
      if (start.isAfter(end)) {
        throw new Error('Start date must be before or equal to end date.');
      }
      return true;
    }),

  check('endDate')
    .notEmpty().withMessage('End date is required')
    .custom((value) => {
      console.log(`Validating endDate: ${value}`); // Debugging
      if (!isValidDate(value)) {
        throw new Error('End date must be a valid date with this form DD/MM/YY.');
      }
      return true;
    }),

  validatorMiddleware
];
