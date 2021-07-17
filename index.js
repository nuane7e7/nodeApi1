const fs = require('fs')
const translate = require('google-translate-api');
const path =require('path')


function readFile(langs, fsName, reg) {
  if (!langs || !fsName || !reg) {
    console.log(`请传入正确的参数`);
    return
  }
  try {
    /**提取文件关键字 */
    let data = fs.readFileSync(fsName, 'utf8').match(reg).map(item => item.slice(4, -2))
    let str = data.join(",")
    console.log("开始啦")
    let time = new Date().getTime()
    langs.forEach((lang,index) => {
      getTranslate(lang, str).then(res => {
        if(index ===langs.length-1) {
            let newTime =new Date().getTime()
          console.log(`结束了执行了${(newTime-time)/1000}秒`)
        }
        writeFs(lang, getJSON(res.text.split(","), data))
      })
    })
  } catch (err) {
    console.error(err)
  }
}

/**获取json格式 */
function getJSON(data, arr) {
  let obj = {}
  data.forEach((item, i) => {
    obj[arr[i]] = item
  })
  return obj
}
/**文件写入*/
function writeFs(lang, content) {
  fs.writeFile(`./lang/${lang}.js`, `let ${lang} = ${JSON.stringify(content)}`, {
    flag: 'a+'
  }, err => {
    if (err) {
      console.error(err)
      return
    }
    //文件写入成功。
  })
}
/**翻译请求*/
async function getTranslate(lang, text) {
  return await translate(text, {
    to: lang
  })
}

function readFiles(pathName,langs,filesReg,reg) {
  fs.readdir(pathName, function(err, files){
    var dirs = [];
    (function iterator(i){
      if(i == files.length) {
        console.log(dirs);
        return ;
      }
      fs.stat(path.join(pathName, files[i]), function(err, data){     
        if(data.isFile()){  
          console.log(files[i])       
            if(filesReg.test(files[i])){
              readFile(langs, `${pathName}/${files[i]}`, reg)
            }
        }
        iterator(i+1);
       });   
    })(0);
  })
}

/***语言种类 */
let langs = ["en", "th", "hi", "vi"]
/**匹配关键字正则 */
let reg = /__\('(\S*)'\)/g
/**匹配文件 */
let filesReg = /\.vue/
// readFile(langs, fsName, reg)
/**文件目录 */
let pathName = './files'
readFiles(pathName,langs,filesReg,reg)