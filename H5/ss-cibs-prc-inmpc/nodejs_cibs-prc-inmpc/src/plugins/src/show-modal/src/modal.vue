<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-09 10:50:31
 * @LastEditTime: 2022-06-10 17:14:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\plugins\src\show-modal\src\modal.vue
-->
<template>
  <transition name="msg-box">
    <div
      ref="modalInstance"
      class="msg-box"
      @click="onMaskClose"
      v-show="visable"
    >
      <transition name="msg-box-inner">
        <div class="msg-box-inner" v-show="visable" @click.stop :style="{
          animationTime
        }">
          <header class="msg-box-header">
            <h2 class="msg-box-title">
              <span
                class="o-title"
                :style="{
                  visibility: !!title.length ? 'visible' : 'hidden'
                }"
              >
                {{ !!title.length ? title: '-----' }}
              </span>
              <span class="close-tag" @click="onCancel">
                &times;
              </span>
            </h2>
            <div class="tip-icon">
              <img :src="icon" alt="tip" title="tipIcon" />
            </div>
          </header>
          <main class="msg-box-main">
            <p class="msg-box-content" v-html="content" />
            <slot />
          </main>
          <footer class="msg-box-ops">
            <button class="msg-box-btn confirm-btn" @click="onConfirm">
              {{ confirmButtonText }}
            </button>
            <button
              v-show="showCancelButton"
              class="msg-box-btn cancel-btn"
              @click="onCancel"
            >
              {{ cancelButtonText }}
            </button>
          </footer>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ZzMsgBox',
  data() {
    return {
      /** 模态框标题 */
      title: '',
      /** 模态框内容 */
      content: 'MsgBox Content',
      /** 点击确认触发的回调函数 */
      confirm: () => {
        // console.log('confirm');
      },
      /** 点击取消触发的回调函数 */
      cancel: () => {
        // console.log('cancel');
      },
      /** @private animation-visable */
      visable: false,
      /** 确认按钮文字 */
      confirmButtonText: 'Confirm',
      /** 取消按钮文字 */
      cancelButtonText: 'Cancel',
      /** is show cancel-button */
      showCancelButton: true,
      /** close-by-mask */
      closeByMask: true,
      /** 动画时间 */
      animationTime: 300,
    };
  },
  computed: {
    icon() {
      return require('../../../assets/imgs/warning.png');
    }
  },
  watch: {
    /** 自动销毁组件 */
    visable(newVal, oldVal) {
      if (oldVal && !newVal) {
        setTimeout(() => {
          // console.log('should destory');
          // this.$parent.$el.removeChild(this.$refs['modalInstance']);
        }, this.animationTime);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setVisable(true);
    });
  },
  methods: {
    /**
     * 点击确认按钮时触发的事件
     */
    onConfirm() {
      new Promise((resolve) => {
        setTimeout(() => {
          this.setVisable(false);
          resolve('');
        }, 0);
      }).then(() => {
        if (this.confirm) {
          this.confirm();
        }
      });
    },
    /**
     * 点击取消按钮时触发的事件
     */
    onCancel() {
      new Promise((resolve) => {
        setTimeout(() => {
          this.setVisable(false);
          resolve('');
        }, 0);
      }).then(() => {
        if (this.cancel) {
          this.cancel();
        }
      });
    },
    /**
     * 设置visable
     */
    setVisable(visable) {
      this.visable = visable;
    },
    /**
     * 点击模态框触发的事件
     */
    onMaskClose() {
      if (this.closeByMask) {
        this.onCancel();
      }
    }
  }
}
</script>
