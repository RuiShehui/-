<!--
 * @Author: your name
 * @Date: 2022-06-08 19:17:16
 * @LastEditTime: 2022-09-16 16:24:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\messageBox\changePassword\changePassword.vue
-->
<template>
  <el-dialog
    :title="text.title"
    top="0"
    center
    :visible.sync="isShow"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="my-dialog"
  >
    <p class="mtb24">{{ text.message }}</p>
    <div  class="mtb24 flexc">
      <v-button  size="w160" @click="onCancel" class="mr16">
        {{ text.btnText.cancleText }}
      </v-button>
      <v-button size="w160" type="primary" @click="onConfirm">
        {{ text.btnText.confirmText }}
      </v-button>
    </div>
    <div class=" flexc">
      <el-form ref="text">
        <el-form-item > 
          <el-checkbox-group @change="changeTips" v-model="text.tipsMe">
            <el-checkbox :label="text.remindme"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
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
        type: 'warn',
        message: ',',
        btnText: {
          cancleText: '',
          confirmText: ''
        },
        isCancle: false,
        overLoad: false,
        tipsMe:false,
        remindme:""
      }
    };
  },
  mounted() {
    // console.log('打印text', this.text);
   
  },
  methods:{
    changeTips(){
      console.log(this.text.tipsMe,'me')
    }
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
  max-width: 390px;
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
    width: 315px;
    color: #1b1b1b;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
}
</style>
