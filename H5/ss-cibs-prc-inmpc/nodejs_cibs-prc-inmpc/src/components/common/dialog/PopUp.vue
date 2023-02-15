<template>
  <el-dialog
    class="pop-up"
    :visible.sync="dialogVisible"
    :show-close="showClose"
    :center="center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-show="message.length">
      {{ message }}
    </template>
    <slot />

    <div slot="footer">
      <el-button @click="hideDialog" class="cancel-btn">{{
        $t(`COMMON.CANCEL`)
      }}</el-button>
      <operate-btn @click="handleConfirm">{{ confirmField }}</operate-btn>
    </div>
  </el-dialog>
</template>

<script>
import OperateBtn from './OperateBtn';

export default {
  name: 'PopUp',
  components: {
    OperateBtn
  },
  props: {
    confirmField: {
      type: String,
      default: `确定`
    },
    message: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 在PopUp组件内部控制显隐
      dialogVisible: this.visible || false
    };
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
      this.hideDialog();
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    showDialog() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.pop-up {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  overflow-y: auto;
  // position: absolute;
  // top: 40%;
  // left: 50%;
  .cancel-btn {
    border: 1px solid #ccc;
    color: #999;
    margin-right: 5.1%;
    width: 160px;
  }

  ::v-deep .el-button {
    padding: 0.5em 1.5em !important;
    font-size: 18px;
    width: auto;
    height: 40px;
    border-radius: 3px;
  }

  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-dialog__footer {
    margin-top: 33px;
    padding-top: 0;
    padding-bottom: 32px;
  }
}
</style>
