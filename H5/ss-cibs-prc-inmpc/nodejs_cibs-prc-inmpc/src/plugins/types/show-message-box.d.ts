/*
 * @Author: ZhangZhen
 * @Date: 2021-11-12 09:24:55
 * @LastEditTime: 2022-01-29 16:30:37
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\plugins\types\show-message-box.d.ts
 */
import Vue, { VNode } from 'vue';

/**
 * @interface IShowBox
 * @description zz's self-design show-box 
 */
export interface ShowBoxOptions {
  /** 对话框的标题 */ // title of show-box
  title?: string;
  /** 对话框的内容, 可接收字符串或render函数 */ // content of show-box, supported by string, VNode and VNode collection
  content?: string | VNode | VNode[];
  /** 点击确认按钮的回调函数 */ // success operate by click confirm-button
  confirm?: () => void;
  /** 点击取消按钮的回调函数 */ // failure operate by click cancel-button
  cancel?: () => void;
  /** 是否显示取消按钮 */ // is-show-cancel-button
  showCancelButton?: boolean;
  /** 确认按钮文字 */ // confirmButtonText
  confirmButtonText?: string;
  /** 取消按钮文字 */ // cancelButtonText
  cancelButtonText?: string;
  /** 是否能够自己删除, 并设置删除的时间, 默认为false */
  removeDelay?: number;
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * zz's design: show-message-box
     */
    $showBox: (options: ShowBoxOptions) => void;
  }
}
