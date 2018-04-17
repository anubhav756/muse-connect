const terms = {}

function getPayload() {
}

terms.getPayload = getPayload

export function doCompleteRegister(payload, done = () => { }) {
  done()
  done('err')
  return terms.getPayload(payload)
}

export default terms
