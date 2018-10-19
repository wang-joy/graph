import SVG from 'svg.js'
function _transformPoint (x, y, m) {
  return {x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f}
}
function _ptToScreen (xIn, yIn, matrix) {
  var out = {
    x: xIn,
    y: yIn
  }
  if (matrix) {
    var pt = _transformPoint(out.x, out.y, matrix)
    out.x = pt.x
    out.y = pt.y
  }
  return out
}
class TextActions {
  constructor (el) {
    this.el = el
  }
  getEl () {
    return this.el
  }
  setTextInput () {
    if (!this.textInput) {
      var textInput = document.createElement('input')
      this.textInput = textInput
      this.textInput.style.position = 'absolute'
      this.textInput.style.left = '-9999px'
      var body = document.getElementsByTagName('body')
      body.appendChild(textInput)
    }
  }

  setCursor (index) {
    var textInput = this.textInput
    // var chardata = this.el.text().split('')
    var empty = (textInput.value === '')
    textInput.focus()
    if (!arguments.length) {
      if (empty) {
        index = 0
      } else {
        if (textInput.selectionStart !== textInput.selectionEnd) return
        index = textInput.selectionEnd
      }
    }
    // var charbb = chardata[index]
    if (!empty) {
      textInput.setSelectionRange(index, index)
    }
    var cursor = SVG.get('text_cursor')
    if (!cursor) {
      var draw = this.el.doc()
      cursor = draw.line().attr({
        id: 'text_cursor',
        stroke: '#333',
        'stroke-width': 1
      })
    }
    if (this.blinker) {
      this.blinker = setInterval(function () {
        var show = cursor.visible()
        if (show) {
          cursor.hide()
        } else {
          cursor.show()
        }
      })
    }
  }
  init (inputElem) {
    var curtext = this.el
    var textInput = this.textInput
    var str = curtext.text()
    var len = str.length
    // var xform = curtext.transform()
    this.chardata = Array(len)
    textInput.focus()
    var textNode = this.el.node
    var textbb = this.el.bbox()
    for (var i = 0; i < len; i++) {
      var start = textNode.getStartPositionOfChar(i)
      var end = textNode.getEndPositionOfChar(i)
      this.chardata.push({
        x: start.x,
        y: textbb.y,
        width: end.x - start.x,
        height: textbb.height
      })
    }
    this.chardata.push({
      x: end.x,
      width: 0
    })
  }
  setSelection (start, end, skipInput) {
    var el = this.el
    if (start === end) {
      this.setCursor(end)
      return
    }
    if (!skipInput) {
      this.textInput.setSelectionRange(start, end)
    }
    var selectBlock = this.selectBlock = SVG.get('text_selectblock')
    if (!selectBlock) {
      var draw = this.el.doc()
      this.selectBlock = draw.path().attr({id: 'text_selectblock', fill: 'green', opacity: 0.5, style: 'pointer-events:none'})
    }
    var startbb = this.chardata[start]
    var endbb = this.chardata[end]
    var textbb = el.bbox()
    this.cursor.hide()
    var matrix = new SVG.Matrix('el')
    var tl = _ptToScreen(startbb.x, textbb.y, matrix)
    var tr = _ptToScreen(startbb.x + (endbb.x - startbb.x), textbb.y, matrix)
    var bl = _ptToScreen(startbb.x, textbb.y + textbb.height, matrix)
    var br = _ptToScreen(startbb.x + (endbb.x - startbb.x), textbb.y + textbb.height, matrix)
    var dstr = `M${tl.x},${tl.y} L${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}z`
    selectBlock.plot(dstr)
  }
}
export default TextActions
