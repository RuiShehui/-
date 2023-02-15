<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-08-19 14:14:28
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\paymentSettlement\remittance\index.vue
 * 电汇
-->

<template>
  <div class="g-remittance-container">
    <!-- 特殊天气 -->
    <div class="phoonStyle" v-show="activeIndex !== 2 && TyphoonFlag">
      <img src="@/images/logo/lingdang.png" />
      <span>{{$t('PAYMENT.PAYMENT_METHOD_PHOONFLAG')}}</span>
    </div>
    <steps
      class="formW_550"
      :stepsList="stepsList"
      :activeIndex="activeIndex"
      :isResultTo="isResultTo"
      @onChangeisResultTo="onChangeisResultTo"
    />
    <transfer-info v-if="activeIndex === 0" @next="toConfirmStep" :confirmInfo="transferInfo" />
    <confirm-info
      ref="confirmInfo"
      v-loading="requestLoading"
      v-show="activeIndex === 1"
      :confirmData="transferInfo"
      @back="toLastStep"
      @next="toResultStep"
    />
    <result-info
      v-if="activeIndex === 2"
      :resultInfo="transferInfo"
      @back="backToFirstStep"
      @downloadPDF="downloadPDF"
    />

    <!-- <div class="wPro">
      <p class="p1">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p
        v-for="(item, index) in $t('PAYMENT.GLOBAL_TIPS')"
        :key="index"
        v-html="item"
      ></p>
    </div>-->
  </div>
</template>

<script>
import TransferInfo from './components/transfer-info';
import confirmInfo from './components/confirmInfo';
import resultInfo from './components/resultInfo';

import { trans, confirm } from '@bank-transfer/mixins';
import { softToken, choosesWay } from '@/components/messageBox';
import {
  submitTelegraphicTx,
  removeTransactionDraft,
  newTradeToken
} from '@/api/paymentRemittance';

export default {
  name: 'remittance',
  components: {
    TransferInfo,
    confirmInfo,
    resultInfo
  },
  mixins: [trans, confirm],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  created() {
    this.getTyphoonFlagFun();
  },
  methods: {
    async toConfirmStep(val) {
      const tokResult = await newTradeToken();
      if (tokResult) {
        console.log(tokResult);
        sessionStorage.setItem('tranToken', tokResult.body);
      }
      this.transferInfo = val;
      this.activeIndex = 1;
    },
    toResultStep() {
      if (this.TyphoonFlag) {
        this.$confirm({
          title: '',
          isIcon: true,
          type: 'warn',
          message: this.$t('PAYMENT.PAYMENT_METHOD_PHOONFLAGTO'),
          btnText: {
            cancleText: this.$t('COMMON.CANCEL'),
            confirmText: this.$t('PAYMENT.PAYMENT_METHOD_PHOONFLAGTOBTN')
          },
          isCancle: true
        })
          .then(() => {
            this.toResultStepTwo();
          })
          .catch(() => {});
      } else {
        this.toResultStepTwo();
      }
    },
    // 确认信息页 确认按钮
    async toResultStepTwo(confirm = 'false') {
      this.formLoading = true;
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      const tradeInfo = JSON.stringify(this.transferInfo);
      submitTelegraphicTx({ ...this.transferInfo, confirm }).then(
        ({ body = {}, head = {} }) => {
          if (
            head.returnCode == 'OTP000107' &&
            cuSoleAuthorizerInd == '1' &&
            this.transferInfo.creditorType == '3'
          ) {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '1'
              // status: status
            }).then(() => {
              this.toResultStepTwo('true');
            });
          } else if (
            head.returnCode == 'OTP000107' &&
            this.transferInfo.creditorType == '3' &&
            entType == '1'
          ) {
            // const tradeInfo = JSON.stringify(this.transferInfo);
            softToken({
              softTokenCode: '',
              otpType: '030103',
              tradeInfo: tradeInfo
              // randomNum:''
            }).then(() => {
              this.toResultStepTwo('true');
              // this.comfirm();
            });
          } else if (head.returnCode == 'COC009970') {
            this.$confirm({
              isIcon: false,
              type: 'warn',
              message: this.$t('PAYMENT.TRANSFER_REPEAT_INT'),
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText: this.$t('COMMON.CONFIRM')
              },
              countDown: true,
              isCancle: true
            })
              .then(() => {
                this.toResultStepTwo('true');
              })
              .catch(() => {
                this.formLoading = false;
              });
          } else {
            if (body) {
              const { authResultInfo } = body;
              if (authResultInfo) {
                this.activeIndex = 2;
                this.transferInfo = {
                  ...this.transferInfo,
                  ...body
                };
                this.sendEmail(this.transferInfo);
              }
            }
          }
          this.formLoading = false;
        }
      );
      if (this.transferInfo.hasOwnProperty('tdId')) {
        await removeTransactionDraft({
          tdId: this.transferInfo.tdId
        });
      }
    },
    toLastStep() {
      this.activeIndex = 0;
    },
    onChangeisResultTo(val) {
      this.isResultTo = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.formW_550 {
  margin: 0 auto 24px;
}
.phoonStyle {
  padding: 9px 16px;
  background-color: #fffbe6;
  width: 100%;
  margin: 0 auto 24px;
  font-size: 14px;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  img {
    // width: 14px;
    height: 14px;
    padding-right: 8px;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: middle;
  }
  span {
    line-height: 22px;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: middle;
  }
}
</style>
