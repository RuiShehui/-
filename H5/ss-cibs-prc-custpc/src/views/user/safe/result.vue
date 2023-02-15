<!--
 * @Author: your name
 * @Date: 2021-12-15 14:29:37
 * @LastEditTime: 2022-09-26 14:45:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\openFixed\components\openFix\components\result.vue
-->
<template>
  <div class="resultWapperBox">
    <operate-result
      :title="resultTitle"
      :desc="resultSubTitle"
      :comfirm="comfirmTitle"
      :status="resultIco"
    ></operate-result>
    <el-row class="flexc mt56">
      <v-button size="w210" @click="next">
        {{$('USER_COMMON.FINIFISH')}}
      </v-button>
    </el-row>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult/index';
export default {
  props: {
    // message: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  components: {
    OperateResult
  },
  data() {
    return {
      status: '',
      message: {},
      resultIco: '', //success: 成功，fail：失败
      resultTitle: '', //返回结果标题
      resultSubTitle: '',
      comfirmTitle: ''
    };
  },
  mounted() {
    this.status =  JSON.parse(this.$route.query.params);
    console.log(this.status,'status')
     if (this.status == 'SUCCESS') {
        this.resultIco = 'success';
        this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
        this.resultSubTitle = '';
      }else{
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle = '';
      }
    // this.getMessage()
  },
  methods: {
    next() {
      // this.$emit('next');
      this.$router.replace('/home')
    },
    getMessage() {
     
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