//rename.js
const fs = require('fs') //引入node内置的文件系统

function rename(path,rgp) {
  fs.readdir(path, (err, oldName) => {  //读取file文件夹下的文件的名字，oldName是一个数组
    if (err) {
      console.log(err)
    }
    for (let i = 0; i < oldName.length; i++) {
      newName =  oldName[i].replace(rgp,"")
      let oldPath = `${path}${oldName[i]}`  //原本的路径
      let newPath = `${path}${newName}`  //新路径
      fs.rename(oldPath, newPath, (err) => {  //重命名
        if (err) {
          console.log(err)
        }
        console.log('done!')
      })
    }
   
    // for (var i = 0; i < oldName.length; i++) {
     
    // }
  })
}

rename('img/',/[-][m][i][n]/)