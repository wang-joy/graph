import Vue from 'vue'
let isDragging = false
export default function (element, opts) {
  if (Vue.prototype.$isServer) return
  const moveFn = function (evt) {
    if (opts.drag) {
      opts.drag(evt)
    }
  }
  const upFn = function (event) {
    document.removeEventListener('mousemove', moveFn)
    document.removeEventListener('mouseup', upFn)
    document.onselectstart = null
    document.ondragstart = null

    isDragging = false

    if (opts.end) {
      opts.end(event)
    }
  }
  element.addEventListener('mousedown', function (event) {
    if (isDragging) return
    document.onselectstart = function () { return false }
    document.ondragstart = function () { return false }

    document.addEventListener('mousemove', moveFn)
    document.addEventListener('mouseup', upFn)
    isDragging = true

    if (opts.start) {
      opts.start(event)
    }
  })
}
