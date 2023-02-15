<template>
  <el-dialog
    append-to-body
    class="pop-up"
    top="0vh"
    :visible.sync="dialogVisible"
    :show-close="showClose"
    :center="center"
    v-bind="$attrs"
    v-on="$listeners"
    @close="close"
  >
    <slot />

    <div slot="footer" v-if="options" class="flexc">
      <VButton size="w120" @click="hideDialog" class="mr16">{{ cancelField }}</VButton>
      <VButton   :style="{ overflow: 'hidden' }"
          size="wMin160" type="primary" @click="handleConfirm">{{ confirmField }}</VButton>
    </div>
    <div slot="footer" v-if="!options" class="flexc">
      <VButton size="w210" type="primary" @click="handleConfirm">{{confirmField}}</VButton>
    </div>
  </el-dialog>
</template>

<script>
// import OperateBtn from './OperateBtn'
import i18n from '@/i18n';
export default {
  name: 'PopUp',
  components: {
    // OperateBtn
  },
  props: {
    options: {
      type: Boolean,
      default: true
    },
    confirmField: {
      type: String,
      default: `查询`
    },
    cancelField: {
      type: String,
      default: i18n.t('COMMON.CANCEL')
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
      // this.closeHandle();
    },
    hideDialog() {
      this.closeHandle();
      this.$emit('hideDialog');
      // this.$parent.isTimeOut();
    },
    closeHandle() {
      this.dialogVisible = false;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    close() {
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-up {

  .cancel-btn {
    width: 32px;
    height: 24px;
    border: 1px solid #f06b00;
    color: #f06b00;
     
    font-weight: 400;
    font-size: 16px;
  }
  .confirmField-btn {
    width: 32px;
    height: 24px;
    background-image: linear-gradient(
      -45deg,
      #f06b00 0%,
      #feaf03 100%,
      #feaf03 100%
    );
    border-radius: 4px;
  }
  .confirm-btn {
    margin-top: 20px;
    width: 160px !important;
    height: 36px !important;
    background-image: linear-gradient(
      -45deg,
      #f06b00 0%,
      #feaf03 100%,
      #feaf03 100%
    );
    border-radius: 4px;
  }

  ::v-deep .el-button {
    // padding: 0.5em 1.5em !important;
    font-size: 18px;
    min-width: 70px;
    padding: 0 12px;
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
    margin-top: 24px;
    padding-top: 0;
    padding-bottom: 24px;
  }
}
</style>