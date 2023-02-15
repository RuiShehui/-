<!--
 * @Author: your name
 * @Date: 2022-06-03 18:02:33
 * @LastEditTime: 2022-09-15 10:37:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\twicLogin\tiwceLogin.vue
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
    id="twiceDialog"
  >
    <p class="mtb24">{{ text.time }}</p>
    <p class="mtb24">{{ text.dueTime }}</p>
    <p class="mtb24">{{ text.ip }}</p>
    <p class="mtb24">{{ text.tips }}</p>
    <div slot="footer" class="flexc">
      <v-button
        v-if="text.isCancle"
        size="w160"
        @click="onCancel"
        class="mr16"
      >{{ text.btnText.cancleText }}</v-button>
      <v-button size="w160" type="primary" @click="onConfirm">{{ text.btnText.confirmText }}</v-button>
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
        time: '1',
        dueTime: '2',
        ip: '3',
        tips: '4',
        btnText: {
          cancleText: '',
          confirmText: ''
        },
        isCancle: false,
        overLoad: false
      }
    };
  },
  created() {
    let body = document.body;
    let dialog = document.getElementById('twiceDialog');
    let modal = document.querySelector('.v-modal');
    console.log(dialog, 'dialogalog');
    console.log(modal, 'dialogalog');
    if (dialog && modal) {
      body.removeChild(dialog);
      body.removeChild(modal);
      // dialog.style.display="none";
      // modal.style.display="none"
    }
  },
  mounted() {
    console.log('打印text', this.text);
  }
};
</script>
<style lang="scss" scoped>
::v-deeo .el-dialog {
}
::v-deep .my-dialog {
  text-align: center;
  padding: 24px;
  border-radius: 4px;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 490px;
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
