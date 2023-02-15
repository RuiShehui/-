/**
 * 文件类型转换
 */
import CryptoJS from 'crypto-js'

export default {
  // base64转file
  dataURLtoFile (base64) {
    let arr = base64.content.split(',');
  
    let mime = ((arr[0]).match(/:(.*?);/))[1]
  
    let bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  
    // console.log('mime', mime)
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
  
    return new File([u8arr], base64.filename, { type: mime })
  },
  // base64转blob转file
  dataURLtoBlob (base64) {
    var bytString = "";
    if(base64.split(",")[0].indexOf("base64")>=0){
      bytString = atob(base64.split(",")[1]);
    } else {
      bytString = unescape(base64.split(",")[1]);
    }
    let mineString = base64.split(",")[0].split(":")[1].split(";")[0];
    let ia = new Uint8Array(bytString.length);
    for(let i=0;i<bytString.length;i++){
      ia[i] = bytString.charCodeAt(i);
    }
    let blob = new Blob([ia],{
      type: mineString
    })
    return blob
  },
  // file转base64
  fileToDataURL (file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onload = evt => {
        let base64 = evt.target.result
        resolve(base64)
      }
      reader.onerror = error => {
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  },
  
  
  // 获取blob的MD5
  getBlobMd5 (blob) {
    // reader.readAsBinaryString(blob)
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsBinaryString(blob)
      reader.onloadend = () => {
        let hash = CryptoJS.MD5(reader.result).toString()
        // console.log('getBlobMd5 -> hash', hash)
        resolve(hash)
      }
      reader.onerror = error => {
        // console.log('getBlobMd5 -> error', error)
        reject(error)
      }
    })
  },
  // 获取文件的MD5
  getFileMd5 (file) {
    return new Promise((resolve, reject) => {
      bmf.md5(file, (error, md5) => {
        if (error) {
          reject(error)
        }
        resolve(md5)
      }, (process) => {
        // 计算进度
      })
    })
  }
 
}

