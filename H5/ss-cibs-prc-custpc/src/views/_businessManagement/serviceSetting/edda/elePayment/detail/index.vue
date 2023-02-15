<template>
  <div class="detail">
    <!-- <divider title="详情" class="mt24 mb20" /> -->
    <!-- <p>所有电子直接付款授权的设置/更改/删除只在于商户或储值支付工具服务供应商确认后方才生效。</p> -->
    <div class="detail_title">{{$t('NOTICE.DETAILS')}}</div>
    <div class="line1">
      <div class="line2"></div>
    </div>
    <div class="confirmContent mt24">
      <detail-item :title="$t('USER_MANAGERMENT.PAY_TYPE')" :content="detailObj.supportType | supporyType" />
      <detail-item :title="$t('AUTHORIZE.AUTH_SERVICENUMBER')" :content="detailObj.paymentCode" />
      <detail-item :title="$t('AUTHORIZE.CREDITNAME')" :content="detailObj.remitteeName" />
      <detail-item :title="$t('ACCOUNT_MAINTENACE.ACCOUNT_NUMBER')" :content="detailObj.accountNo" />
      <detail-item
        :title="$t('AUTHORIZE.AUTH_FREQUENCY')"
        :content="detailObj.paymentFreq | paymentFreqType"
      />
      <detail-item :title="$t('ACCOUNT_MANAGEMENT.START_DATE')" :content="detailObj.startDate" />
      <detail-item
        :title="$t('ACCOUNT_MANAGEMENT.END_DATE')"
        :content="detailObj.endDate ? detailObj.endDate : '——'"
      />
      <detail-item :title="$t('AUTHORIZE.AUTH_LIMIT')" :content="detailObj.transLimit" />
    </div>
    <el-row v-if="!approveFlag" style="margin-bottom: 56px" class="flexc mt20">
      <v-button class="mr16" @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
      <v-button class="mr16" @click="refuseClcik">{{$t('AUTHORIZE.MY_REFUSE')}}</v-button>
      <v-button type="primary" @click="modifyClick">{{$t('AUTHORIZE.MY_AGRESS')}}</v-button>
    </el-row>
    <el-row v-if="approveFlag" style="margin-bottom: 56px" class="flexc mt20">
      <v-button class="mr16" @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
      <v-button class="mr16" @click="deleteClick">{{$t('AUTHORIZE.DELETE')}}</v-button>
      <v-button type="primary" @click="updateClick">{{$t('AUTHORIZE.UPDATE')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { examineApproveTrancOperationSubmit } from '@/api/setUpEDDA.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import filter from '@/filters/accountManagement';
import business from '@/filters/business.js';
import tool from '@/dataTools/tools/moneyTools.js';

export default {
  data() {
    return {
      approveFlag: true, //true:已审批, false:未审批
      detailObj: {}
    };
  },
  filters: {
    paymentFreqType: filter.paymentFreqType,
    supporyType:business.supporyType,
  },
  mounted() {
    console.log('打印，。。。', this.$route.query.row);
    this.detailObj = this.$route.query.row;
    this.detailObj.transLimit=tool.currencyFormat( this.detailObj.transLimit,'',2);
    this.approveFlag = this.$route.query.row.approveFlag;
  },
  methods: {
    //返回
    returnClick() {
      this.$router.push({
        path: '/_businessManagement/serviceSetting/edda',
        query: { activeName: this.detailObj.activeName }
      });
    },
    //拒绝
    refuseClcik() {
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.REJECT_REQUEST'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        this.detailObj.action = '01';
        examineApproveTrancOperationSubmit(this.detailObj).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(this.detailObj);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '5'
              // status: status
            }).then(() => {
              this.refuseClcik(resp);
            });
          } else if (returnCode == 'OTP000107' && adminEmpower == '0') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.refuseClcik(resp);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },
    //同意
    modifyClick() {
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.AGREE_REQUEST'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        this.detailObj.action = '00';
        examineApproveTrancOperationSubmit(this.detailObj).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(this.detailObj);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '4'
              // status: status
            }).then(() => {
              this.modifyClick(resp);
            });
          } else if (returnCode == 'OTP000107' && adminEmpower == '0') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.modifyClick(resp);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },

    //修改
    updateClick() {
      this.$router.push({
        path: '/_businessManagement/serviceSetting/edda/elePayment/modify',
        query: { row: this.detailObj }
      });
    },
    //删除
    deleteClick() {
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.DELETE_REQUEST'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        this.detailObj.action = '02';
        examineApproveTrancOperationSubmit(this.detailObj).then(resp => {
          const { returnCode } = resp.head;
          const tradeInfo = JSON.stringify(this.detailObj);
          let menuId = localStorage.getItem('sliderMenusAct');
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const entType = localStorage.getItem('entType');
          if (returnCode == 'OTP000107' && adminEmpower == '0') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '3'
              // status: status
            }).then(() => {
              this.deleteClick(resp);
            });
          } else if (returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: menuId,
              tradeInfo: tradeInfo
            }).then(() => {
              this.deleteClick(resp);
            });
          } else {
            this.operationJump(resp);
          }
        });
      });
    },
    //同意、拒绝、删除操作后判断跳转结果页
    operationJump(resp) {
      console.log('resp',resp)
      if (resp.body.authResultInfo) {
        if (resp.body.authResultInfo.authResultState === '03') {
          resp.body.authResultInfo.authorMessage = this.$t(
            'REMITTANCECONFIRM.PROGRESS'
          );
          this.$router.push({
            path:
              '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
            query: resp.body.authResultInfo
          });
        } else {
          this.$router.push({
            path:
              '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
            query: resp.body.authResultInfo
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>