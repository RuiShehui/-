/*
 * @Author: zhangcheng
 * @Date: 2022-08-04 09:41:33
 * @LastEditTime: 2022-08-10 14:23:50
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\downLoadTools.js
 */

/**
 * downUrl
 * @param {string} url link
 */
function downUrl(url) {
  if (url) {
    // window.open(location.protocol + '//' + location.host + url)
    const link = document.createElement('a');
    link.download = location.protocol + '//' + location.host + url
    link.setAttribute('href', location.protocol + '//' + location.host + url)
    link.style.display = 'none';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }
  return
}
export {
  downUrl
}