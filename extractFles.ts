import translate from 'google-translate-api'
import fs from 'fs'
class extractFles {
  langs: string[] = ["en"]
  fsName: string
  reg: RegExp
  constructor(langs: string[], fsName: string, reg: RegExp) {
    this.langs = langs
    this.fsName = fsName
    this.reg = reg
  }
  readFile() {
    if (!this.langs || !this.fsName || !this.reg) { console.log(`请传入正确的参数`); return }
    try {
      /**提取文件关键字 */
      let data = fs.readFileSync(this.fsName, 'utf8').match(this.reg).map(item => item.slice(4, -2))
      let str = data.join(",")
      langs.forEach(lang => {
        this.getTranslate(lang, str).then(res => {
          this.writeFs(lang, this.getJSON(res.text.split(","), data))
        })
      })
    } catch (err) {
      console.error(err)
    }
  }
  getJSON(data: string[], arr: string[]) {
    let obj = {}
    data.forEach((item, i) => {
      obj[arr[i]] = item
    })
    return obj
  }
  writeFs(lang: string, content: object) {
    fs.writeFile(`./lang/${lang}.js`, `let ${lang} = ${JSON.stringify(content)};`, err => {
      if (err) {
        console.error(err)
        return
      }
      //文件写入成功。
    })
  }
  async getTranslate(lang: string, text: string) {
    return await translate(text, {
      to: lang
    })
  }
}
/***语言种类 */
let langs = ["en", "th", "hi", "vi"]
/**匹配关键字正则 */
let reg = /__\('(\S*)'\)/g
/**文件位置名称 */
let fsName = "./index.vue"

let funFile = new extractFles(langs, fsName, reg)
funFile.readFile()




