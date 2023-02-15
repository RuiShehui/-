<!--
 * @Author: your name
 * @Date: 2021-12-09 09:38:03
 * @LastEditTime: 2021-12-13 15:04:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src=""\views\seriveQuery\serviceCenter.vue
-->
<template>
  <div class="g-service-center-wrapper" v-loading="requestLoading">
    <div class="m-head-wrapper">
      <div class="u-head">
        <div style="padding-left: 16px;">{{$t('INTERESTRATEQUERY.BANK_BRANCH_INFORMATION')}}</div>
        <div class="u-headBottom"></div>
      </div>
      <el-table :data="tableData" stripe class="fontstatus">
        <el-table-column
          prop="branchName"
          :label="$t('INTERESTRATEQUERY.BRANCH_NAME')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="branchAddress"
          :label="$t('INTERESTRATEQUERY.ADDRESS')"
          align="center"
          :style="'word-wrap:break-word'"
        ></el-table-column>
        <el-table-column
          prop="bankBranchTelephone"
          :label="$t('INTERESTRATEQUERY.MOBILE')"
          align="center"
        ></el-table-column>
      </el-table>
    </div>

    <div class="m-tips">
      <div class="u-phone">
        <img src="../../images/seriveQuery/kefurexian.png" alt />
        <span>{{$t('INTERESTRATEQUERY.CUSTOMER_SERVICES_HOTLINE')}}</span>
        <span class="u-orange">(852) 3768 6888</span>
      </div>
      <div class="m-sevice-time">
        <img src="../../images/seriveQuery/fuwushijian.png" alt />
        <span>{{$t('INTERESTRATEQUERY.SERVICE_TIME')}}</span>
        <span class="u-orange">{{$t('INTERESTRATEQUERY.SERVICE_TIME2')}}</span>
      </div>
      <div class="m-bottom">{{$t('INTERESTRATEQUERY.OBJECTIVE')}}</div>
    </div>
  </div>
</template>

<script>
import { getBranchInfo } from '@/api/serveQuery.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tableData: [
        {
          branchName: '',
          branchAddress: '',
          bankBranchTelephone: ''
        }
      ]
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  methods: {
    async Datalist() {
      let params = {};
      const res = await getBranchInfo(params);
      this.tableData = res.branchInfoList;
      getBranchInfo(params).then(resp => {
        console.log('resp', resp);
      });
    }
  },
  created() {
    this.Datalist();
  }
};
</script>

<style lang="scss" scoped>
.g-service-center-wrapper {
  position: relative;
  min-height: 100%;
  .m-tips {
    margin-top: 36px;

    bottom: 0;
    left: 0;
    padding: 24px 64px;
    width: 100%;
    height: 186px;
    box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fffcf5;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    img {
      height: 19.26px;
      width: 19.26px;
    }
    div {
      display: flex;
      align-items: center;
    }
    span {
      margin-left: 8px;
    }
    .m-bottom {
      margin-top: 20px;
      letter-spacing: 1px;
    }
  }
}
.m-head-wrapper {
  // padding: 0 62px;
}
.u-head {
  position: relative;
  margin-bottom: 20px;
  font-size: 18px;
  color: #f06b00;
  letter-spacing: 0;
  line-height: 26px;
  font-weight: 500;
  padding: 2px 0 9px;
  box-shadow: inset 0px -1px 0px 0px rgba(240, 240, 240, 1);
}

.u-headBottom:before {
  content: '';
  width: 140px;
  height: 3px;
  background: #f06b00;
  position: absolute;
  bottom: 0;
  left: 0;
}
.u-orange {
  color: #f06b00;
}
/deep/.el-table .el-table__cell.is-center {
  text-align: left;
}
/deep/.el-table .cell {
  padding-left: 56px !important;
  padding-right: 12px !important;
  word-break: break-word;
}

//英文換行
.fontstatus {
  word-wrap: break-word;
}
</style>