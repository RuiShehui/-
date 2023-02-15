/*
 * @Author: ZhangZhen
 * @Date: 2021-11-12 14:38:08
 * @LastEditTime: 2022-01-11 10:18:58
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\plugins\src\show-message.js
 */
// import Vue from 'vue';
import { Message } from 'element-ui';
import { setElStyles } from '@/utils/tools';
// import _ from 'loadsh';

const doc = document.documentElement || document.body;

const msgTypes = ['success', 'error', 'warning', 'info'];

/**
 * showMsg
 * @description 生成自定义消息框
 * @param {import('../types/show-message').ShowMessageOptions} options
 * @example this.$showMsg({ message: 'MESSAGE' })
 */
const myMessage = (options) => {
  // const app = document.getElementById('app');

  const oMsg = document.querySelector('.el-message');
  if (oMsg) {
    return;
  }

  let msgMask = null;

  if (document.querySelector('.g-msg-wrapper')) {
    msgMask = document.querySelector('.g-msg-wrapper');
  } else {
    msgMask = document.createElement('div');
    msgMask.className = 'g-msg-wrapper';
    setElStyles(msgMask, {
      display: 'none',
      // border: '0',
      // borderRadius: '0',
      position: 'fixed',
      // cursor: 'pointer',
      // width: '100%',
      // height: '100%',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: '9999',
      background: 'rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      boxShadow: '1px 2px 2px #666',
      textAlign: 'center',
    });
    doc.appendChild(msgMask);
  }

  if (typeof options === 'string') {
    Message({
      message: options
    });
  } else {
    const {
      showTime = 3,
      message = 'Message',
      type,
      showClose = false,
      maskable = false,
      closable = false,
    } = options;

    Message({
      duration: showTime * 1000,
      message,
      type,
      showClose,
      // offset: '250',
    });

    // show-msg-mask
    maskable && isAddMask(closable);
    // hide-msg-mask
    setTimeout(() => {
      msgMask.style.display = 'none';
    }, showTime * 1000);
  }

  msgTypes.forEach(type => {
    Object.defineProperty(myMessage, type, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: (message = '') => {
        Message({
          message,
          type
        });
      }
    });
  });

  resetMessage();
}

msgTypes.forEach(type => {
  myMessage[type] = (message = 'Message') => {
    const oMsg = document.querySelector('.el-message');
    if (oMsg) {
      return;
    }
    myMessage({
      type,
      message
    });
  }
});

export default myMessage;

/** reset-message-show-style */
function resetMessage() {
  const oMessage = document.querySelector('.el-message'),
    oMessageContent = oMessage.querySelector('.el-message__content');

  if (oMessage) {
    Array.from(oMessage.classList, (className) => {
      // remove className which includes "--"
      if (className.includes('--')) {
        oMessage.classList.remove(className);
      }
      // set message total-style
      setElStyles(oMessage, {
        background: '#fff',
        padding: '15px 3px',
        border: '1px solid #ccc',
        boxShadow: '1px 3px 5px #f6f6f6',
        zIndex: '9999',
      });
      // set message-content style
      setElStyles(oMessageContent, {
        backgroundColor: '#fff',
        color: '#333'
      });
    });
  }
}

/** is-add-message-mask */
function isAddMask(closable) {
  const oMask = document.querySelector('.g-msg-wrapper'),
    oMsg = document.querySelector('.el-message');

  oMask.appendChild(oMsg);

  oMask.style.display = 'block';

  // click-mask-to-close
  if (closable) {
    oMask.addEventListener('click', () => {
      oMask.style.display = 'none';
    }, false);
  }
}
