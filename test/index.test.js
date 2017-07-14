const compile = require('../index')
const fs = require('fs')
const path = require('path')
const expect = require('chai').expect

describe("assign-loader测试用例", function(){
  it("用例一", function(){
    const expected = `let nn,dd,cc,ce,a,b,c
nn=dd=cc=4
a=b=c=5
console.log(1)
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
let n,m,e,f,g
m=e=f=g=10
`
    const input = fs.readFileSync(path.resolve(__dirname, "./source.js"), "utf-8")
    let output = compile(input)
    console.log("output:", output)
    expect(output == expected).to.be.true
  })
})
