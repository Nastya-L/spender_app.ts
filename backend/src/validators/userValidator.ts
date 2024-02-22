import { body } from 'express-validator';

const userValidator = [
  body('lastName')
    .exists({ checkFalsy: true })
    .withMessage('User last name is required')
    .isString()
    .withMessage('User last name should be string')
    .custom((value: string) => {
      const lettersConsist: boolean = /[a-zA-Z]/i.test(value);
      if (!lettersConsist) {
        throw new Error('The last name must contain only Latin letters');
      }
      return true;
    }),
  body('firstName')
    .exists({ checkFalsy: true })
    .withMessage('User first name is required')
    .isString()
    .withMessage('User first name should be string')
    .custom((value: string) => {
      const lettersConsist: boolean = /[a-zA-Z]/i.test(value);
      if (!lettersConsist) {
        throw new Error('The first name must contain only Latin letters');
      }
      return true;
    }),
  body('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Provide valid email'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required Password length must be from 6 to 10 characters')
    .isLength({ min: 6 })
    .withMessage('Password length must be from min 6 characters')
    .custom((value: string) => {
      const lettersConsist: boolean = /[a-zA-Z]/.test(value);
      const digitsConsist: boolean = /[0-9]/.test(value);
      if (!(lettersConsist && digitsConsist)) {
        throw new Error('The password must contain numbers and letters');
      }
      return true;
    })
];

export default userValidator;
