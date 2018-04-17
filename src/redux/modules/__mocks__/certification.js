export function addCertification(payload, done) {
  done();
  done({
    agree: 'Please agree to our terms',
    certificationNumber: 'Wrong certification number',
    certifyingBody: 'Wrong certifying body'
  })
}

export default null;
