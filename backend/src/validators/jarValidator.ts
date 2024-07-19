import { body } from 'express-validator';

const jarValidator = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Jar name is required')
    .isString()
    .custom((value: string) => {
      const lettersConsist: boolean = /[a-zA-Z]/i.test(value);
      if (!lettersConsist) {
        throw new Error('The jar name must contain only Latin letters');
      }
      return true;
    }),
  body('color')
    .exists({ checkFalsy: true })
    .withMessage('Jar color is required')
    .isString()
];

export default jarValidator;
