<!--
 * @Author: your name
 * @Date: 2022-04-19 20:12:59
 * @LastEditTime: 2022-08-12 17:27:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\enterpriseQuota\components\confirmInfo.vue
-->
<template>
  <div class="confirmInfo">
    <el-table
      :data="confirmInfo.updateArr"
      default-expand-all
      row-key="transTypeSmall"
      :tree-props="{ children: 'children' }"
      stripe
    >
      <el-table-column prop="tradeTypeName" :label="$t('AUTHORIZE.TYPE')" min-width="20%">
        <template slot-scope="scope">
          <span class="u-circle" v-if="scope.row.rowSpan"></span>
          <span>{{scope.row.tradeTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="limitDaily" :label="$t('AUTHORIZE.AUTH_LIMITHKD')" min-width="22%"></el-table-column>
      <el-table-column prop="updateLimitDaily" :label="$t('AUTHORIZE.AUTH_LIMITTOTAL')" min-width="22%"></el-table-column>
      <el-table-column prop="updateTime" :label="$t('ACCOUNT_MANAGEMENT.LAST_UPDATE_TIME')" min-width="16%"></el-table-column>
    </el-table>
    <el-row class="flexc mt36">
      <v-button @click="$emit('back', confirmInfo)" class="mr16">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
      <v-button :disabled="quoatFlag" type="primary" @click="confirm(submit)">{{$t('COMMON.CONFIRM')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { updateQuotaInfo, checkAuthQuata } from '@/api/setServiceQuota.js';
import mathTools from '@/utils/mathTools.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
export default {
  props: {
    confirmInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      message: {},
      submit: [],
      quoatFlag: false
    };
  },
  created() {
    this.submit = this.confirmInfo.tableData;
  },
  methods: {
    confirm(confirmInfo) {
      // this.$emit('confirmClick', this.confirmInfo);
      this.quoatFlag = true;
      checkAuthQuata().then(resp => {
        console.log('resp', resp);
        //stt  1:不存在授权审批 0：存在授权审批
        if (resp.stt === '0') {
          this.quoatFlag = false;
          this.$confirm({
            title: this.$t('ACCOUNT_MANAGEMENT.TIPS_TITLE'),
            isIcon: false,
            type: 'warn',
            message: this.$t('USER_MANAGERMENT.ZHONGFU'),
            btnText: {
              cancleText: this.$t('COMMON.CANCEL'),
              confirmText: this.$t('COMMON.DETERMINE')
            },
            // dangerouslyUserHTMLString:true,
            isCancle: false
          });
        } else {
          confirmInfo = confirmInfo.filter(item => item.updateLimitDaily);
          confirmInfo.forEach(item => {
            item.limitType = item.tradeType;
            item.limitSmallType = item.tradeTypeSmall;
            item.limitDaily = mathTools.delDecollator(item.limitDaily);
            item.limitSingleStart = mathTools.delDecollator(
              item.limitSingleStart
            );
            item.updateLimitDaily = mathTools.delDecollator(
              item.updateLimitDaily
            );
            //20220728新增updateFlag值。所维修改送0，修改送1
            item.updateFlag = 0;
          });
          // 这个数组，用来匹配，然后更换updateflag值
          for (let i = 0; i < confirmInfo.length; i++) {
            for (let k = 0; k < this.confirmInfo.updateArr.length; k++) {
              if (
                confirmInfo[i].tradeTypeSmall ===
                this.confirmInfo.updateArr[k].tradeTypeSmall
              ) {
                console.log(confirmInfo[i]);
                confirmInfo[i].updateFlag = 1;
              }
            }
          }
          this.updateQuotaInfoFun(confirmInfo);
        }
      });
    },
    updateQuotaInfoFun(confirmInfo) {
      const tradeInfo = JSON.stringify(confirmInfo);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower, cuSoleAuthorizerInd,entType } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      // const entType = localStorage.getItem('entType');
      console.log(entType,'entType')
      updateQuotaInfo({ list: confirmInfo }).then(resp => {
        this.quoatFlag = false;
        console.log('updateQuotaInfo', resp);
        const { returnCode } = resp.head;
        if ( returnCode == 'OTP000107'&& entType=='1') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.confirm(confirmInfo);
          });
        } else if (returnCode == 'OTP000107' && adminEmpower == '0') {
           choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
            // status: status
          }).then(() => {
            this.confirm(confirmInfo);
          });
        } else {
          if (resp && resp.body.authResultInfo) {
            this.message = {
              flag: resp.body.authResultInfo.authResultState === '03',
              status: 'success',
              title: this.$t('COMMON.SUBMIT_SUCCESS'),
              desc: `${this.$t('COMMON.FLOW_NO')}: ${resp.body.authResultInfo.flowNo}`,
              succ: true
            };
            this.$emit('confirmClick', this.message);
          } else {
            this.message = {
              status: 'fail',
              title: this.$t('COMMON.SUBMIT_FAIL'),
              desc: `${this.$t('RIGHTS_TEMPLATE.FAIL_RESON')}: ${resp.head.returnMessage}`,
              succ: false
            };
            this.$emit('confirmClick', this.message);
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.u-circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #f06b00;
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}

.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  margin-left: 18px;
}

.el-table tr {
  background-color: #ffffff;
}

/deep/ .el-table td.el-table__cell div {
  position: relative;
  margin-left: 16px;
}
</style>