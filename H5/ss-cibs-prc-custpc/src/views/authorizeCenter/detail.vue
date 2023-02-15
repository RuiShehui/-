<!--
 * @Author: your name
 * @Date: 2021-12-10 10:49:57
 * @LastEditTime: 2022-09-09 17:27:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\detail.vue
-->
<template>
  <div class="g-detail-wrapper" v-loading="requestLoading">
    <cardDetail
      v-if="tableDataArr.length>0"
      :scene="scene"
      :jump030103="jump030103"
      :authState="authState"
      :tableDataArr="tableDataArr"
      :stateAll="stateAll"
      :stt="stt"
      :res="res"
      :currentPage="currentPage"
    ></cardDetail>
    <!-- v-if="showDetail" -->
    <cardDetail v-else :scene="scene" :authState="authState" :tableData="tableData" :stt="stt" :res="res" :currentPage="currentPage"></cardDetail>
  </div>
</template>

<script>
import cardDetail from './components/cardDetail';
import { queryDetail } from '@/api/authorizeCenter.js';
import { mapState } from 'vuex';
import _ from 'lodash';
export default {
  components: {
    cardDetail
  },
  data() {
    return {
      jump030103: 'N',
      formData: { authActionType: '1', authActionMessage: '' },
      tableData: {},
      flowNo: '',
      processType: 'order', //order有序  disorder无序
      scene: '2', //交易类型 0为我提交的待授权场景，1为我提交的已结束场景，2为待我授权场景，3为已授权场景
      businessName: '', //交易类型
      authStateName: '', //授权状态
      authTime: '', //授权时间
      autherName: '', //授权人
      dealRen: '', //授权意见
      form: {
        radio: 1, // 0 同意 1 拒绝
        opinion: '' //授权意见
      },
      showDetail: false,
      authState: '',
      batchStatus: false, //批量标识
      tableDataArr: [], //
      stateAll: false, //
      stt:'',
      res:{},
      currentPage:{}
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  created() {
    console.log('this.$route.query',this.$route.query)
    if (this.$route.query.flowNo) {
      this.flowNo = this.$route.query.flowNo;
      this.authState = this.$route.query.authState;
      this.scene = this.$route.query.scene;
      this.jump030103 = this.$route.query.jump030103;
      this.stt = this.$route.query.stt
      this.res = this.$route.query.res
      this.currentPage = this.$route.query.currentPage

    }
    if (this.$route.query.row && this.$route.query.row.flowNo) {
      this.flowNo = this.$route.query.row.flowNo;
      this.authState = this.$route.query.authState;
      this.scene = this.$route.query.scene;
      this.stt = this.$route.query.stt
      this.res = this.$route.query.res
      this.currentPage = this.$route.query.currentPage
    }
    if (this.$route.query.batchStatus) {
      this.tableDataArr = this.$route.query.checkList;
      this.showDetail = true;
      this.stateAll = true;
    } else {
      this.stateAll = false;
    }
    console.log('this.stt',this.stt)

    if(this.stt){
      //网银交易记录页面跳转，不调用授权详情接口
      this.tableData = this.res
    } else{
      this.queryDetail();
    }
    console.log('this.tableDataArr', this.tableDataArr);
  },
  methods: {
    async queryDetail() {
      let params = {
        tcTransactionAbstract: {
          flowNo: this.flowNo
        }
      };
      const result = await queryDetail(params);
      console.log(result,'resutlsdsdsdsdsdsds')
      if (result && result.tcTransactionAbstract) {
        this.tableData = _.cloneDeep(result.tcTransactionAbstract);
        if (this.$route.query.row) {
          this.tableData.businessCode = this.$route.query.row.businessCode;
          this.tableData.authStateName = this.$route.query.row.authStateName;
          this.tableData.authTime = this.$route.query.row.authTime;
          this.tableData.autherName = this.$route.query.row.autherName;
          this.tableData.dealRen = this.$route.query.row.dealRen;
          this.authState = this.tableData.authState;
        }
        console.log('result.tcTransactionAbstract', this.tableData);
        this.tableData.transactionDescribe = JSON.parse(
          this.tableData.transactionDescribe
        );
        //缴费服务
        if(this.$route.query.businessCode == '060101' || this.$route.query.businessCode == '060102'||this.$route.query.businessCode == '060103'){
            this.$route.query.item.tradeState = this.tableData.tradeState
            this.tableData = this.$route.query.item
        }
        this.showDetail = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner {
  height: 62px;
}
::v-deep .el-dialog__body {
  padding: 24px 0;
}
::v-deep .el-dialog__header {
  padding: 0;
}
.u-mr12 {
  margin-bottom: 12px;
}
</style>