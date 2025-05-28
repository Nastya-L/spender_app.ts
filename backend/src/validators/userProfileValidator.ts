import { body } from 'express-validator';

const userProfileValidator = [
  body('lastName')
    .optional({ values: 'null' })
    .isString()
    .withMessage('User last name should be string')
    .custom((value: string) => {
      if (value && value.trim() === '') {
        throw new Error('User last name cannot be empty');
      }
      if (value) {
        const lettersConsist: boolean = /^[a-zA-Z]+$/i.test(value);
        if (!lettersConsist) {
          throw new Error('The last name must contain only Latin letters');
        }
      }
      return true;
    }),
  body('firstName')
    .optional({ values: 'null' })
    .isString()
    .withMessage('User first name should be string')
    .custom((value: string) => {
      if (value && value.trim() === '') {
        throw new Error('User first name cannot be empty');
      }
      if (value) {
        const lettersConsist: boolean = /^[a-zA-Z]+$/i.test(value);
        if (!lettersConsist) {
          throw new Error('The first name must contain only Latin letters');
        }
      }
      return true;
    }),
  body('email')
    .optional({ values: 'null' })
    .isEmail()
    .withMessage('Provide valid email')
    .normalizeEmail()
];

export default userProfileValidator;
