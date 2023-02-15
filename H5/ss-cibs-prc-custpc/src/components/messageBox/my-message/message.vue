<!--
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:31
 * @LastEditTime: 2022-10-11 19:36:07
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \webbank-pc\src\components\messageBox\my-message\message.vue
-->
<template>
  <el-dialog
    :title="text.title"
    center
    top="0vh"
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="text.clickModal"
    custom-class="dialogClass"
  >
    <div class="message-box" @mouseenter="claerTimer" @mouseleave="startTimer">
      <span class="img-box">
        <img :src="require(`@/images/common/${showIcon}.png`)" alt />
      </span>
      <span class="text-wrap">{{ text.message }}</span>
    </div>
  </el-dialog>
</template>

<script>
import messageBoxMixin from '../libs/messageBox.mixin';

export default {
  name: 'MyMessage',
  mixins: [messageBoxMixin],
  data() {
    return {
      /** @override 配置项 */
      text: {
        title: '',
        message: '',
        type: 'warn',
        delay: 1500,
        clickModal: false
      },
      /** @type {} 关闭用到的定时器 (NodeJs.Timer) */
      timer: null
    };
  },
  methods: {
    /**
     * 清除内部定时器
     */
    claerTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    /**
     * 设置内部定时器
     */
    startTimer() {
      this.timer = setTimeout(() => {
        this.isShow = false;
      }, this.text.delay);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .dialogClass {
  cursor: pointer;
  text-align: center;
  padding: 8px 20px;
  border-radius: 3px;
  max-width: 220px;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    padding: 0 !important;
    box-sizing: border-box;
  }
  .message-box {
    // width: 100%;
    word-break: break-word;
    .img-box {
      color: #1b1b1b;
      font-size: 24px;
      width: 24px;
      height: 24px;
      line-height: 14px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .text-wrap {
      margin-left: 3px;
      font-size: 14px;
      line-height: 14px;
    }
  }
}
</style>