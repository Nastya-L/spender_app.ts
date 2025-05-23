import { body } from 'express-validator';

const userPasswordValidator = [
  body('newPassword')
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

export default userPasswordValidator;
