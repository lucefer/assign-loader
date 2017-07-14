const compile = require('continue-assign-parser')

const WhitespaceReg = /[\u0020\u00A0\u0009\u000B\u000C]/
const WhiteOrLine = /[\s\b]/

let source
let len
let pos = 0
let ch
let cursor = 0
module.exports = function(src) {
  source = src
  len = src.length
  let result = []
  try{
    while(cursor !== -1) {
      cursor = getCodeFrag()
      if(cursor !== -1) {
        let frag = getFrag()
        if(frag && frag.code.trim() !== '') {
          result.push(frag)
        }
      }
    }
    return generator(result)
  }
  catch(ex){
    console.error("assign-loader编译错误:",ex)
  }
  return src
}
function generator(result) {
  let code = ''
  let pos = 0
  for(let i = 0, count = result.length; i<count; i++) {
    code += source.substring(pos, result[i].start)
    let new_source = compile(result[i].code)
    if(new_source && new_source.trim() !== '') {
      if(code && (isLineTerminal(code[code.length - 1])||WhitespaceReg.test(code[code.length-1]))) {
        console.log("new_source:",new_source)
        code += new_source
      } else if(!code) {
        code += new_source
      } else {
        code += ("\n" + new_source)
      }
    } else {
      code += source.substring(result[i].start, result[i].end)
    }
    pos = result[i].end
  }
  code += source.substring(pos, len)
  return code
}

function getCodeFrag() {
  let inString = false
  while(pos < source.length) {
      ch = source[pos]
      if(ch === 'v' && source[pos + 1] === 'a'&& source[pos + 2] === 'r' && WhiteOrLine.test(source[pos + 3])) {
        if(!inString) {
          return pos
        }
        pos++
      }else if(ch === 'l' && source[pos + 1] === 'e'&& source[pos+2] === 't' && WhiteOrLine.test(source[pos + 3])) {
        if(!inString) {
          return pos
        }
        pos++
      } else if(ch == '"') {
        inString = true
        pos++
        while(source[pos++] !== '"') {
          inString = false
          break
        }
      }else if(ch === '\'') {
        inString = true
        pos++
        while(source[pos++]!=='\'') {
          inString = false
          break
        }
        continue
      } else if(ch.charCodeAt(0) == 96) {//'`'
        inString = true
        pos++
        while(ch.charCoeAt(source[pos++]) != 96) {
          inString = false
          break
        }
        continue
      } else {
        pos++
        continue
      }
  }
  return -1
}
function isLineTerminal(cp) {
  let code = cp.charCodeAt(0)
  if(code == 0x0A || code == 0x0D || code == 0x2028 || code == 0x2029) {
    return true
  }
  return false
}
function getFrag() {
  let ch = source[pos]
  let frag = {
    start: pos,
    end: pos,
    code: ''
  }
  let result = ''
  while(pos < len) {
    ch = source[pos]
    if(ch === ',') {
      result += ch
    } else if(isLineTerminal(ch)) {
      if(result && (result.trim() === 'let' || result.trim() === 'var')){
        result += ch
      }
      else if(result[result.length-1] != ',' && !WhitespaceReg.test(result[result.length-2])) {
          frag.end = pos
          frag.code = result
          return frag
      }
    }
    else if(ch === ';') {
      frag.end = pos + 1
      frag.code = result
      return frag
    } else if(WhitespaceReg.test(ch)) {
      if(!WhitespaceReg.test(result[result.length-1]))
      result += ch
    } else {
      result += ch
    }
    pos++
  }
  frag.code = result
  frag.end = pos
  return frag
}
