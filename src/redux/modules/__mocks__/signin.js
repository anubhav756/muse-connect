export function doSignIn(payload, done) {
  done();
  done({
    email: 'Email does not exist',
    password: 'Wrong password'
  })
}

export default null;
