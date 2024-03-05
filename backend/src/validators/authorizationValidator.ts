import { body } from 'express-validator';

const authorizationValidator = [
  body('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Provide valid email'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password length must be from min 6 characters')
];

export default authorizationValidator;
