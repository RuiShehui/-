<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :width="width"
      class="popup"
      top="0vh"
      center
      :show-close="false"
      v-bind="$attrs"
      v-on="$listeners"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="imgTitle" v-if="isShowImg">
        <img src="@/images/common/warning.png" alt />
      </div>
      <slot></slot>
      <span slot="footer" class="flexc">
        <v-button size="w120" @click="cancle" class="mr16">{{$t('COMMON.CANCEL')}}</v-button>
        <v-button size="w120" type="primary" @click="confirm">{{$t('COMMON.CONFIRM')}}</v-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '400px'
    },
    isShowImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: this.visible || false
    };
  },
  computed: {
    //   dialogVisible: {
    //       get() {
    //           return this.visible
    //       },
    //       set(val) {
    //           this.$emit('updateVisible',val)
    //       }
    //   }
  },
  methods: {
    cancle() {
      this.$emit('cancle', this.dialogVisible);
      this.dialogVisible = false;
    },
    confirm() {
      this.$emit('confirm', this.dialogVisible);
      this.dialogVisible = false;
    },
    handlerClose() {
      this.$emit('handlerClose');
      this.dialogVisible = false;
    },
    close() {
      this.$emit('close', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.popup {
  box-sizing: border-box;
  min-height: 300px;
  display: flex;
   justify-content: center;
    align-items: center;
  .imgTitle {
    width: 44px;
    height: 44px;
    margin-bottom: 24px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 12px;
    color: #1b1b1b;
    font-size: 16px;
  }

  ::v-deep .el-dialog__footer {
    // margin-top: 30px;
    padding-top: 0;
    // padding-bottom: 25px;
  }
  .confirmTitle {
    margin: 10px 0;
    color: #333;
  }

  .desc {
    color: #999;
    font-size: 12px;
  }
}
</style>