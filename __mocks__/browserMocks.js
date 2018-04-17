document.getElementById = () => ({
  focus() { },
  select() { }
});

window.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0)
}

window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {}
})

window.clevertap = { event: [], profile: [], account: [], onUserLogin: [], notifications: [] }