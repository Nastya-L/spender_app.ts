import { type ErrorFormatter, type ValidationError } from 'express-validator';

const errorFormatter: ErrorFormatter = (error: ValidationError) => {
  if (error.type === 'field') {
    return { msg: error.msg, field: error.path };
  }
  return { msg: error.msg };
};

export default errorFormatter;
