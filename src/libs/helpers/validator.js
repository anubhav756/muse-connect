import validator from 'email-validator'

export function isValidEmail(email) {
  return validator.validate(email)
}

export function isValidTel(value) {
  const pattern = new RegExp(/^[\d(+)-]+$/)
  return pattern.test(value)
}

export default {
  isValidEmail,
  isValidTel
}
