<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-25 17:20:24
 * @LastEditTime: 2022-09-16 17:38:03
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\my-alert\alert.vue
-->
<template>
  <el-dialog
    :title="text.title"
    center
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="dialogClass"
    top="0vh"
  >
    <p class="mtb24">{{ text.message }}</p>
    <div slot="footer" class="flexc">
      <v-button size="w160" type="primary" @click="onConfirm">{{ text.btnText.confirmText }}</v-button>
    </div>
  </el-dialog>
</template>
<script>
import messageBoxMixin from '../libs/messageBox.mixin';

export default {
  name: 'MyAlert',
  mixins: [messageBoxMixin],
  data() {
    return {
      text: {
        title: '',
        message: '',
        btnText: {
         confirmText: ' '
        }
      }
    };
  },
};
</script>
<style lang="scss" scoped>
::v-deep .dialogClass {
  text-align: center;
  padding: 24px;
  border-radius: 4px;
  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    padding: 0 !important;
  }
  p {
    width: 336px;
    color: #1b1b1b;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
}
</style>