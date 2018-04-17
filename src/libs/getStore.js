let storeRef = ''
/*
 * @function bindStore binds the ref of store to storeRef variable
 * @export
 * @param {any} store
 */
export function bindStore(store) {
  storeRef = store
}

/*
 * @function getStore
 * @param {function} cb callback function returns store
 */
export default function getStore(cb) {
  cb(storeRef)
}
