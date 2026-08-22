import { ValidationError } from "../lib/errors.js";

export const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue ? issue.message : "Validation failed";
      throw new ValidationError(message);
    }
    req.body = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
