<!--
 * @Autor: 朱涛
 * @Date: 2021-11-08 09:39:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-16 15:37:16
 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\steps\steps.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="common-steps mb24 tc">
    <!-- <el-steps :active="activeIndex" finish-status="success" align-center class="inline-block"> -->
    <el-steps :active="activeIndex" finish-status="success" align-center>
      <el-step
        v-for="(item, index) in stepsList"
        :key="index"
        :title="item.title"
        :description="item.description"
        :status="item.status"
      ></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    stepsList: {
      type: Array,
      default: () => [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION'),
          description: ''
        },
        {
          title:this.$t('COMMON.STEPS_RESULT_INFORMATION'),
          description: '',
          status: 'success'
        }
      ]
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    finishStatus: {
      type: String,
      default: 'success'
    }
  }
};
</script>

<style lang="scss" scoped>
.common-steps {
  // .inline-block {
  //   width: 70%;
  // }
  /deep/ .el-step__title {
    font-size: 12px;
    line-height: 22px;
    letter-spacing: 0;
    margin-top: 8px;
    &.is-process {
      color: #f06b00;
    }
  }
  /deep/ .el-step__icon {
    width: 30px;
    height: 30px;
  }
  /deep/ .el-step__head.is-process {
    .el-step__line {
      &::before {
        position: absolute;
        content: '';
        background-color: #f06b00;
        width: 50%;
        height: 2px;
        left: 0;
        top: 0;
      }
    }
    .el-step__icon {
      color: #fff;
      background-image: linear-gradient(
        -36deg,
        #f55e2d 0%,
        #f1ab40 100%,
        #f1ab40 100%
      );
      box-shadow: 0px 4px 10px 0px rgba(245, 107, 0, 0.32);
    }
  }
  /deep/ .el-step__head.is-success {
    .el-step__icon {
      color: #fff;
      background-image: linear-gradient(
        -36deg,
        #f55e2d 0%,
        #f1ab40 100%,
        #f1ab40 100%
      );
      box-shadow: 0px 4px 10px 0px rgba(245, 107, 0, 0.32);
    }
  }
  /deep/ .el-step__icon-inner {
    font-size: 16px;
    line-height: 22px;
  }
}
</style>