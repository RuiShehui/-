/*
 * @Author: your name
 * @Date: 2021-12-09 20:06:50
 * @LastEditTime: 2021-12-13 10:12:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\utils\astrict.js
 */
import store from "@/store"
import router from "@/router"


var timer = null

clearInterval(timer)

export function isOperateFun() {
  var lastTime = new Date().getTime()
  var currentTime = new Date().getTime()
  var timeOut = 5000

  function handleReset() {
    lastTime = new Date().getTime()
    console.log('点击了')
    clearInterval(timer)
    if (timer) {
      timer = null
    }
    if (!timer) {
      clearInterval(timer)
      handleInterval()
    }
  }

  document.onclick = () => {
    handleReset()
  }
  document.ondblclick = () => {
    handleReset()
  }
  document.onmousedown = () => {
    handleReset()
  }
  document.onmouseup = () => {
    handleReset()
  }
  document.onmousemove = () => {
    handleReset()
  }
  document.onmouseout = () => {
    handleReset()
  }
  document.onmouseenter = () => {
    handleReset()
  }
  document.onmouseleave = () => {
    handleReset()
  }

  function handleInterval() {
    timer = setInterval(() => {
      currentTime = new Date().getTime()

      if (currentTime - lastTime > timeOut) {
        clearInterval(timer)
        const path = window.location.href.split('#')[1]

        if (path !== '/login') {
          localStorage.removeItem('TOKEN')
          router.push('/login')
        }
      }
    }, 1000)
  }
  handleInterval()
}