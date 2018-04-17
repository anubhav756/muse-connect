const ambassadorKeys = ['email']; // key use in window object

export function createAmbassadorUserObj(payload) {
  const userObj = {}
  for (let index = 0; index < ambassadorKeys.length; index++) {
    userObj[ambassadorKeys[index]] = payload[ambassadorKeys[index]];
  }
  return userObj;
}
export function addAmbassadorVarToWindow(obj) {
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      window[k] = obj[k];
    }
  }
}

export function removeAmbassadorVarFromWindow() {
  for (let i = 0; i < ambassadorKeys.length; i++) {
    delete window[ambassadorKeys[i]]
  }
}