<!--
 * @Author: your name
 * @Date: 2021-12-16 14:07:46
 * @LastEditTime: 2022-09-19 09:53:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\changeDueTip\components\result.vue
-->
<template>
  <div class="resultWapperBox">
    <operate-result :status="message.status" :title="message.title" :desc="message.desc" :comfirm="message.comfirm"></operate-result>
    <el-row class="flexc mt56">
      <v-button size="w210" @click="$router.push( '/investmentFinancing/changeDueTip')">{{$t('COMMON.COMPLETE')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult/index';
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    OperateResult
  },
  data() {
    return {};
  },
  methods: {
    next() {
      this.$emit('next');
    }
  }
};
</script>
<style lang="scss" scoped>
.resultWapperBox {
  display: flex;
  flex-direction: column;
  // .btn {
  //     margin-top: 20px;
  // }
}
</style>