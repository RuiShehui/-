<template>
  <div class="resultWapperBox">
    <!-- 修改成功 -->
    <operate-result :status="message.status" :title="$t('USER_COMMON.UDATE_SUCCESS')"></operate-result>
    <el-row class="flexc mt56">
      <!-- 完成 -->
      <v-button size="w210" @click="$router.push( '/home')">{{$t('USER_COMMON.FINIFISH')}}</v-button>
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
    return {
  
    };
  },
  created(){
    console.log(this.message,'msg')
  },
  methods: {
    
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