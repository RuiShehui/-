<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-08-19 14:14:31
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\paymentSettlement\localtransfer\index.vue
-->
<template>
  <div class="g-localtransfer-container">
    <!-- 特殊天气 -->
    <div class="phoonStyle" v-show="activeIndex !== 2 && TyphoonFlag">
      <img src="@/images/logo/lingdang.png" />
      <span>{{$t('PAYMENT.PAYMENT_METHOD_PHOONFLAG')}}</span>
    </div>
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <!-- 1, 3 v-if ; 2 v-show -->
    <bank-info
      v-show="activeIndex === 0"
      payType="localtransfer"
      @next="toConfirmPage"
      :confirmInfo="transferInfo"
      :isResultTo="isResultTo"
      @onChangeisResultTo="onChangeisResultTo"
    />
    <confirm-info
      v-show="activeIndex === 1"
      ref="confirmInfo"
      v-loading="requestLoading"
      payType="localtransfer"
      :confirmData="transferInfo"
      @back="toBackStep"
      @next="toResultStep"
    />
    <result-info
      v-if="activeIndex === 2"
      @clickBack="backToFirstStep"
      @downloadPDF="downloadPDF"
      :resultInfo="transferInfo"
    />
    <div class="wPro">
      <p class="p1 mb16">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p v-for="(item, index) in $t('PAYMENT.LOCAL_TIPS')" :key="index">{{ item }}</p>
    </div>
  </div>
</template>
<script>
import BankInfo from '../components/inter-bank-transfer-info';
import ConfirmInfo from '../components/inter-bank-confirm-info';
import ResultInfo from '../components/inter-bank-result-info';
import { trans, confirm } from '@bank-transfer/mixins';
import { softToken, choosesWay } from '@/components/messageBox';
import {
  submitChatsTx,
  removeTransactionDraft,
  newTradeToken
} from '@/api/paymentRemittance';
import { sendEmail } from '@/api/sendMsg';
export default {
  name: 'LocalTransferPage',
  components: {
    BankInfo,
    ConfirmInfo,
    ResultInfo
  },
  mixins: [trans, confirm],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  created() {
    this.getTyphoonFlagFun();
  },
  methods: {
    // 进入确认页面
    async toConfirmPage(data) {
      const tokResult = await newTradeToken();
      if (tokResult) {
        console.log(tokResult);
        sessionStorage.setItem('tranToken', tokResult.body);
      }
      this.transferInfo = data;
      this.activeIndex++;
    },
    // 返回上一步页面
    toBackStep() {
      if (this.activeIndex === 2) {
        this.activeIndex = 0;
        // this.transferInfo = {};
        return;
      }
      this.activeIndex--;
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
    // 发送请求到结果页面
    async toResultStepTwo(confirm = 'false') {
      this.formLoading = true;
      const entType = localStorage.getItem('entType');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const tradeInfo = JSON.stringify(this.transferInfo);
      submitChatsTx({ ...this.transferInfo, confirm }).then(
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
            entType === '1'
          ) {
            // const tradeInfo = JSON.stringify(this.transferInfo);
            softToken({
              softTokenCode: '',
              otpType: '03010202',
              tradeInfo: tradeInfo
              // randomNum:''
            }).then(() => {
              // this.comfirm();
              this.toResultStepTwo('true');
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
              this.transferInfo = {
                ...body,
                ...this.transferInfo
              };
              this.sendEmail(this.transferInfo);
              if (this.transferInfo.hasOwnProperty('tdId')) {
                removeTransactionDraft({
                  tdId: this.transferInfo.tdId
                }).then({});
              }
              this.activeIndex++;
              this.formLoading = false;
            }
          }
        }
      );
      this.formLoading = false;
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
