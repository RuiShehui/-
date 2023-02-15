import Vue from "vue";
import Message from "./message.vue";

const types = ["success", "error", "warn", "info"];

/**
 * 判断是否为指定参数的类型
 * @param {any} target 需要判断的数据
 * @param {'Number'|'String'|'Boolean'|'Function'|'Array'|'Object'|'Symbol'|'Attr'} typeName 目标判断的类型
 */
function isType(target, typeName) {
  return Object.prototype.toString.call(target) === `[object ${typeName}]`;
}

class CreateMyMessage {
  /** @type {CreateMyMessage} */
  myMessage;
  /** @type {ExtendedVue} */
  MyMessageConstructor;
  /** @type {Vue} */
  VueComponent;

  constructor(options) {
    this.MyMessageConstructor = Vue.extend(Message);

    this.render(options);
  }
  /** 单例创建 */
  static create(options) {
    if (!this.myMessage) {
      this.myMessage = new CreateMyMessage(options);
    }
    return this.myMessage;
  }

  render(options) {
    /**
     * 根据options的类型进行渲染
     * 1. 如果是字符串, 直接渲染{ message: options, type: info }
     * 2. 按照配置来渲染message
     */
    if (isType(options, "String")) {
      this.VueComponent = new this.MyMessageConstructor({
        el: "#app",
        data() {
          return {
            message: options,
            type: "info",
          };
        },
      }).$mount();
    }
    if (isType(options, "Object")) {
      const {
        message = "Message",
        type = "info",
        duration = 3000,
        isShowClose = false,
        isShowMask = false,
      } = options;

      this.VueComponent = new this.MyMessageConstructor({
        data() {
          return {
            message,
            type,
            duration,
            isShowClose,
            isShowMask,
          };
        },
      }).$mount();
    }
  }
  /**
   * 关闭当前的实例
   */
  close() {
    const crtEl = document.getElementsByClassName(".message-wrapper")[0];
    if (crtEl) {
      if (crtEl.remove) {
        crtEl.remove();
      } else {
        crtEl.parentNode.removeChild(crtEl);
      }
    }

    this.VueComponent = null;
    this.myMessage = null;
  }
}

function removePreINode() {
  const crtEl = document.getElementsByClassName("message-wrapper")[0];
  if (crtEl) {
    if (crtEl.remove) {
      crtEl.remove();
    } else {
      crtEl.parentNode.removeChild(crtEl);
    }
  }
}

const createMessage = (options) => {
  /**
   * 1. 删除之前创建的message
   * 2. 新建VueComponent实例
   * // 单例模式新建VueComponent实例
   */

  const instance = new CreateMyMessage({
    ...options,
  });

  removePreINode();

  const instanceElement = instance.VueComponent.$el;
  document.body.appendChild(instanceElement);

  window.myMessageInstance = instance;

  return instance;
};

for (let type of types) {
  createMessage[type] = (message) => createMessage({ type, message });
}

export default createMessage;
