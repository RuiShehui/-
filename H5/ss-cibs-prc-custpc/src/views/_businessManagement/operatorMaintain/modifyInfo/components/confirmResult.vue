<!--
 * @Author: your name
 * @Date: 2021-12-15 08:56:13
 * @LastEditTime: 2022-08-10 15:01:58
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\operatorMaintain\modifyInfo\components\confirmResult.vue
-->
<template>
  <div class="confirmResult">
    <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <el-row class="flexc mt56">
      <v-button @click="$emit('back')" size="w210">{{$t('COMMON.BACK')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import OperateResult from '../../../components/operateResult';
export default {
  components: {
    OperateResult
  },
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
</style>