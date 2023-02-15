import Vue from "vue";
import Message from "./message.vue";

/**
 * message的类型枚举
 */
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
  /** @type {CreateMyMessage} 当前message的实例 */
  myMessage;
  /** @type {ExtendedVue} Vue.extend下的组件实例构造器 */
  MyMessageConstructor;
  /** @type {Vue} 当前的组件实例 */
  VueComponent;

  /**
   * 1.创建组件实例构造器
   * 2.执行render方法创建组件实例
   */
  constructor(options) {
    this.MyMessageConstructor = Vue.extend(Message);

    this.render(options);
  }
  /**
   * 单例创建
   * @example
   * CreateMyMessage.create({
   *   * *** *
   * })
   **/
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
   * @public 关闭当前的实例
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

/**
 * 每一次创建ShowMessage的实例, 需要将上一次创建的Message实例删除
 */
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
   * // 单例模式新建VueComponent实例 (目前不采用这样的实现方案, 需要的话请开发者自行扩展)
   */

  const instance = new CreateMyMessage({
    ...options,
    isShowMask: options.hasOwnProperty('isShowMask') ? options.isShowMask : true,
    duration: options.hasOwnProperty('duration') ? options.duration : 3 * 1000,
  });

  removePreINode();

  const instanceElement = instance.VueComponent.$el;
  document.body.appendChild(instanceElement);

  window.myMessageInstance = instance;

  return instance;
};

/**
 * 方法扩展
 * createMessage.success
 * createMessage.error
 * createMessage.warn
 * createMessage.info
 */
for (let type of types) {
  createMessage[type] = (message) => createMessage({ type, message });
}

export default createMessage;
