const signup = {}

function getPayload() {
}

signup.getPayload = getPayload

export function doSignup(payload, done = () => { }) {
  done()
  done({ status: 409 })
  return signup.getPayload(payload)
}

export default signup
