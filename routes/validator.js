const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    body('title').notEmpty(),
    body('body').notEmpty(),
    body('author').notEmpty(),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}
