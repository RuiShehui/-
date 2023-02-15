<!--
 * @Author: your name
 * @Date: 2021-12-15 19:10:37
 * @LastEditTime: 2022-10-24 16:50:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\openFixed\components\interestRate\components\result.vue
-->
<template>
  <div class="resultWapperBox">
   <operate-result :status="message.status" :title="message.title" :desc="message.desc" :comfirm="message.comfirm"></operate-result>
    <el-row class="flexc mt56">
      <v-button size="w210" @click="next">{{$t('COMMON.COMPLETE')}}</v-button>
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
      let formData={}
      this.$emit('next',formData);
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