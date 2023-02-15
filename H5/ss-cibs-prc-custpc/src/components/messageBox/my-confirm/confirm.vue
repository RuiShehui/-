<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-09-28 19:57:00
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\my-confirm\confirm.vue
-->
<template>
  <el-dialog
    :title="text.title"
    top="0vh"
    center
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="my-dialog"
  >
    <div class="img-box" v-if="text.isIcon">
      <img :src="require(`@/images/common/${showIcon}.png`)" :alt="showIcon" />
    </div>
    <p class="mtb24" style="word-break: break-word;">{{ text.message }}</p>
    <div slot="footer" class="flexc">
      <v-button
        v-if="text.isCancle"
        size="w160"
        @click="onCancel"
        class="mr16"
      >{{ text.btnText.cancleText }}</v-button>
      <v-button
        :disabled="disabled"
        size="w160"
        type="primary"
        @click="onConfirm"
      >{{ text.btnText.confirmText }}{{disabled?`(${time}S)`:''}}</v-button>
    </div>
  </el-dialog>
</template>
<script>
import messageBoxMixin from '../libs/messageBox.mixin';

export default {
  name: 'MyConfirm',
  mixins: [messageBoxMixin],
  data() {
    return {
      isShow: false,
      text: {
        title: '',
        isIcon: true,
        type: 'warn',
        message: '',
        btnText: {
          cancleText: '',
          confirmText: ''
        },
        isCancle: false,
        overLoad: false,
        countDown: false
      },
      disabled: false,
      time: 3,
      timer: null
    };
  },
  watch: {
    'text.countDown': {
      handler(newVal) {
        if (this.text.countDown) {
          this.disabled = true;
          this.timer = setInterval(() => {
            this.time--;
          }, 1000);
        }
      }
    },
    time: {
      handler(newVal) {
        if (newVal === 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.disabled = false;
        }
      }
    }
  },
  mounted() {
    console.log('打印text', this.text);
  }
};
</script>
<style lang="scss" scoped>
::v-deep .my-dialog {
  text-align: center;
  padding: 24px;
  border-radius: 4px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    padding: 0 !important;
  }
  .img-box {
    width: 44px;
    height: 44px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    // width: 315px;
    color: #1b1b1b;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
}
</style>
