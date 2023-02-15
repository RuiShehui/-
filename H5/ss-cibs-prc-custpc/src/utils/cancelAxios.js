/*
 * @Author: your name
 * @Date: 2022-09-01 14:27:59
 * @LastEditTime: 2022-09-01 15:10:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\utils\cancelAxios.js
 */
import axios from "axios";

export default class cancelToken {
  // 聲明一個 Map 储存请求标识 和取消函数
  static pending = new Map()
  static whiteRequest = []


  /**
   * 得到该格式的url 
   * @param {AxiosRequestConfig} config
   * @returns
   * 
   */
  static getUrl(config){
    return [config.method,config.url].join('&')
  }

  /**
   * 
   * 添加请求
   * @params {AxiosRequestConfig} config
   * 
   */
    static addPending(config){
      const url = this.getUrl(config)
      config.cancelToken = new axios.CancelToken(cancel =>{
        if(!this.pending.has(url)){ 
          this.pending.set(url,cancel) //如果Pending 中不存在当前请求，则添加进去
        }  
      })
    }

    /**
     * 
     * 移除请求
     * @params
     */
    static removePending(config){
      const url = this.getUrl(config)
      const method = url.split('&')[1]
      if(this.pending.has(url) && !this.whiteRequest.includes(method)){
        const cancel = this.pending.get(url)
        cancel(url)
        this.pending.delete(url)
      }
    }

    /**
     * 
     * @params 清空 pending 中的请求
     */
    static clearPending(){
      for(const [url,cancel] of this.pending){
        cancel(url)
      }
      this.pending.clear()
    }

}


