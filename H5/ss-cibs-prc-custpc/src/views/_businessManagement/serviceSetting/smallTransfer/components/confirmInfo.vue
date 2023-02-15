<template>
  <div class="u-confirm-info">
    <div class="u-content">
      <detail-item :title="$t('AUTHORIZE.AUTH_STATUS')" :content="contentStatus"></detail-item>
      <detail-item v-if="confirmInfo.status" :title="$t('AUTHORIZE.AUTH_DAYLIMIT')" :content="content"></detail-item>
    </div>
    <div class="flexc mt36">
      <v-button @click="$emit('back', confirmInfo)" class="mr16">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
      <v-button type="primary" @click="confirm">{{$t('COMMON.CONFIRM')}}</v-button>
    </div>
  </div>
</template>
<script>
import {
  checkAuthStt,
  setUpSmallTransferSubmit
} from '@/api/setServiceQuota.js';
import mathTools from '@/utils/mathTools.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
export default {
  props: {
    confirmInfo: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      content: '',
      contentStatus: ''
    };
  },
  mounted() {
    if (this.confirmInfo.dayLimit === '0.00') {
      this.contentStatus = this.$t('USER_MANAGEMENT.DEACTIVATE');
    } else if (this.confirmInfo.status === true) {
      this.contentStatus = this.$t('USER_MANAGEMENT.ENABLE');
    } else {
      this.contentStatus = this.$t('USER_MANAGEMENT.DEACTIVATE');
    }
    this.confirmInfo.dayLimit = mathTools.moneyCheck(this.confirmInfo.dayLimit);
    this.content = 'HKD ' + this.confirmInfo.dayLimit;
  },
  methods: {
    //确认
    confirm() {
      let self = this;
      let setStatus = '';
      if (this.confirmInfo.status) {
        setStatus = 1;
      } else {
        setStatus = 0;
      }
      if (this.confirmInfo.dayLimit === '0.00') {
        setStatus = 0;
      }
      let limitMoney = '';
      if (this.confirmInfo.dayLimit) {
        limitMoney = mathTools.delDecollator(this.confirmInfo.dayLimit);
      }
      let smallTransferObj = {
        limitAmount: limitMoney,
        setStatus
      };

      checkAuthStt(smallTransferObj).then(resp => {
        if (resp.stt === '1') {
          self.confirmSmall(smallTransferObj);
        } else {
          this.$confirm({
            isIcon: true,
            type: 'warn',
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_REPEAT'),
            btnText: {
              cancleText: this.$t('COMMON.CANCEL'),
              confirmText: this.$t('COMMON.DETERMINE'),
            },
            isCancle: false
          });
        }
      });
    },

    //确认提交——小额转账
    confirmSmall(smallTransferObj) {
      const tradeInfo = JSON.stringify(smallTransferObj);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      const entType = localStorage.getItem('entType');
      setUpSmallTransferSubmit(smallTransferObj).then(resp => {
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.confirmSmall(smallTransferObj);
          });
        } else if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
          }).then(() => {
            this.confirmSmall(smallTransferObj);
          });
        } else {
          if (resp.body.authResultInfo.flowNo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage =
              this.$t('REMITTANCECONFIRM.PROGRESS');
              this.$emit('confirm', resp.body.authResultInfo);
            } else {
              this.$emit('confirm', resp.body.authResultInfo);
            }
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.u-confirm-info {
  .u-content {
    width: 940px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 88px;
  }
}
</style>