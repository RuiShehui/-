/*
 * @Author: ZhangZhen
 * @Date: 2021-11-12 14:51:20
 * @LastEditTime: 2021-11-29 20:19:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\src\plugins\types\show-message.d.ts
 */
import Vue, { VNode } from 'vue';
import { MessageType } from 'element-ui/types/message';

export interface ShowMessageOptions {
  /** 显示时间 (单位: 秒) */
  showTime?: number;
  /** 提示内容 */
  message?: string;
  /** 提示类型 */
  type?: MessageType;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 是否显示遮罩 */
  maskable?: boolean;
  /** 是否能够点击遮罩关闭 */
  closable?: boolean;
}

export interface ShowMessage {
  /** 成功消息提示 */
  success: (message: string) => void;
  /** 失败消息提示 */
  error: (message: string) => void;
  /** 告警消息提示 */
  warning: (message: string) => void;
  /** 普通信息提示 */
  info: (message: string) => void;
  /** 自定义信息提示 */
  (options: ShowMessageOptions): void;
}

declare module 'vue/types/vue' {
  /**
   * zz's design: show-message
   */
  interface Vue {
    $showMsg: ShowMessage;
  }
}