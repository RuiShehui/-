<template>
  <transition name="fade">
    <div
      v-show="isShowMessage"
      :class="[
        'message-wrapper',
        // `message-${size}`
      ]"
      :style="wrapperStyle"
      @click="onClickBackground"
    >
      <div
        class="message-inner"
        @mouseenter="clearTimer"
        @mouseleave="startTimer"
      >
        <img
          class="message-tip-img"
          :src="require(`../img/${type}.png`)"
          alt=""
        />
        <span class="message-content">
          {{ message }}
        </span>
        <span
          v-show="isShowClose"
          :class="['close-message-tag', `${type}-tag`]"
          @click="clickIcon"
        >
          &times;
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * 自定义Message
 * @author Jack
 **/
export default {
  name: "MyMessage",
  data() {
    return {
      /** @type {string} 消息的内容 */
      message: "Message",
      /** @type {'success' | 'error' | 'warn' | 'info'} 消息的类型 */
      type: "",
      /** @type {number} 消息显示的时间 */
      duration: 2000,
      /** @type {Timer} 控制关闭的定时器 */
      controlTimer: null,
      /** @type {boolean} 是否显示当前的message */
      isShowMessage: false,
      /** @type {boolean} 是否显示关闭按钮 */
      isShowClose: false,
      /** @type {boolean} 是否显示消息的遮罩层 */
      isShowMask: false,
    };
  },
  computed: {
    /** 根据"isShowMask"判断wrapper的样式 */
    wrapperStyle() {
      if (this.isShowMask) {
        return {
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        };
      }
      return {
        position: "relative",
        top: "0",
        left: "0",
      };
    },
  },
  mounted() {
    this.isShowMessage = true;
    this.startTimer();
  },
  methods: {
    /** 点击按钮后的回调函数 */
    clickIcon() {
      this.hideMessage();
      this.$emit("clickClose");
    },
    /** 设置显示当前的message实例 */
    showMessage() {
      this.isShowMessage = true;
    },
    /** 自动移除自己的元素 */
    startTimer() {
      this.controlTimer = setTimeout(() => {
        if (this.isShowMessage) {
          this.hideMessage();
        }
      }, this.duration);
    },
    clearTimer() {
      clearTimeout(this.controlTimer);
    },
    /** 设置隐藏当前的message实例 */
    hideMessage() {
      this.isShowMessage = false;
      setTimeout(() => {
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
      }, 1000);
    },
    /** 点击蒙层的回调方法 */
    onClickBackground() {
      if (this.isShowMask) {
        this.hideMessage();
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/index.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
