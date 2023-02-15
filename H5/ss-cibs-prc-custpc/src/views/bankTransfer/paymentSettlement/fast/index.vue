<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-09-26 11:49:38
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\paymentSettlement\fast\index.vue
-->
<!-- 转数快-->
<template>
  <div class="g-fastContainer" v-loading="formLoading">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <transfer-info
      v-show="activeIndex === 0"
      payType="fast"
      @next="toNextStep"
      :confirmInfo="transferInfo"
      :isResultTo="isResultTo"
      @onChangeisResultTo="onChangeisResultTo"
    />
    <confirm-info
      v-show="activeIndex === 1"
      ref="confirmInfo"
      payType="fast"
      :confirmData="transferInfo"
      @back="toLastStep"
      @next="onConfirmSubmit"
    />
    <result-info
      payType="fast"
      v-if="activeIndex === 2"
      @clickBack="backToFirstStep"
      :resultInfo="transferInfo"
      @downloadPDF="downloadPDF"
    />
    <div class="wPro">
      <p class="p1">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p v-for="(item, index) in $t('PAYMENT.FAST_TIPS')" :key="index">{{ item }}</p>
    </div>
    <!-- 2022-02-10 -->
    <el-dialog
      class="m-message-know"
      :visible.sync="isShowPotrol"
      :destroy-on-close="true"
      :center="false"
      :lock-scroll="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title
      top="0vh"
      width="980px"
      height="100%"
    >
      <Portrol>
        <section v-html="$t('PAYMENT.FAST_POLICIES')"></section>
        <p class="m-delay-tip" v-show="!isShowBtnGroup">{{$t('PAYMENT.FAST_POLICIES_TIPS',{showpotrolTime:showpotrolTime}) }}</p>
        <footer
          class="btn-group"
          v-show="isShowBtnGroup"
          :style="{
            textAlign: 'center',
            width: '100%',
            padding: '10px 0',
            marginTop: '10px'
          }"
        >
          <el-button :style="{ width: '120px' }" @click="onReject">{{ $t('COMMON.DISAGREE') }}</el-button>
          <el-button
            :style="{ width: '120px' }"
            type="primary"
            @click="handleAgree"
          >{{ $t('COMMON.AGREE') }}</el-button>
        </footer>
      </Portrol>
    </el-dialog>
    <!-- 2022-02-10 -->
  </div>
</template>

<script>
import TransferInfo from '../components/inter-bank-transfer-info';
import ConfirmInfo from '../components/inter-bank-confirm-info';
import ResultInfo from '../components/inter-bank-result-info';

import Portrol from '../components/portrol';

import {
  checkFPSTermStatus,
  updateFPSTermStatus,
  submitFPSTx,
  chatsSubmitFPSBankTx,
  removeTransactionDraft,
  newTradeToken
} from '@/api/paymentRemittance';
import { BANK_TYPES } from '@bank-transfer/paymentSettlement/utils/enums';
import { softToken, choosesWay } from '@/components/messageBox';
import { trans } from '@bank-transfer/mixins';
import { sendEmail } from '@/api/sendMsg';
export default {
  name: 'TransFastPage',
  components: {
    TransferInfo,
    ConfirmInfo,
    ResultInfo,
    Portrol
  },
  mixins: [trans],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  data() {
    return {
      isShowPotrol: false,
      isShowBtnGroup: false,
      showpotrolTime: 10,
      formLoading: false
    };
  },
  mounted() {
    this.handlePotrolShow();
  },
  methods: {
    /**
     * 判断是否需要提示用户协议
     */
    async handlePotrolShow() {
      const { state } = await checkFPSTermStatus();
      if (state !== 'Y') {
        setTimeout(() => {
          this.isShowPotrol = true;
          const itvl = setInterval(() => {
            --this.showpotrolTime;
            if (this.showpotrolTime <= 0) {
              this.isShowBtnGroup = true;
              clearInterval(itvl);
            }
          }, 1000);
        }, 1000);
      }
    },
    // 填入信息的下一步按钮
    async toNextStep(data) {
      const tokResult = await newTradeToken();
      if (tokResult) {
        console.log(tokResult);
        sessionStorage.setItem('tranToken', tokResult.body);
      }
      this.transferInfo = data;
      this.activeIndex++;
    },
    // 确认信息页 上一步
    toLastStep() {
      this.activeIndex--;
    },
    // 确认信息页 确认按钮
    async onConfirmSubmit(payType, confirm = '') {
      console.log(payType);
      this.formLoading = true;
      const fn =
        payType === BANK_TYPES.FAST ? submitFPSTx : chatsSubmitFPSBankTx;
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      const tradeInfo = JSON.stringify(this.transferInfo);
      fn({ ...this.transferInfo, confirm }).then(({ body = {}, head = {} }) => {
        if (
          head.returnCode == 'OTP000107' &&
          cuSoleAuthorizerInd == '1' &&
          this.transferInfo.creditorType == '3'
        ) {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
          }).then(() => {
            this.onConfirmSubmit(payType);
          });
        } else if (
          head.returnCode == 'OTP000107' &&
          this.transferInfo.creditorType == '3' &&
          entType === '1'
        ) {
          softToken({
            softTokenCode: '',
            otpType: '03010201',
            tradeInfo: tradeInfo
          }).then(() => {
            this.onConfirmSubmit(payType);
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
            countDown: false,
            isCancle: true
          })
            .then(() => {
              this.onConfirmSubmit(payType, 'true');
            })
            .catch(() => {
              this.formLoading = false;
            });
        } else {
          if (body) {
            const { authResultInfo = {} } = body;
            if (
              authResultInfo.authResultState &&
              authResultInfo.authResultState !== '91'
            ) {
              // 成功
              this.transferInfo = {
                ...body,
                ...this.transferInfo
              };
              this.sendEmail(this.transferInfo);
            } else {
              // 失败
              this.transferInfo = {
                ...body,
                ...this.transferInfo
              };

              console.error(this.transferInfo);
            }
            this.activeIndex++;
          }
        }
        this.formLoading = false;
      });
      if (this.transferInfo.hasOwnProperty('tdId')) {
        await removeTransactionDraft({
          tdId: this.transferInfo.tdId
        });
      }

    },
    onReject() {
      this.isShowPotrol = false;
      this.$router.push('/home/homePage');
    },
    async handleAgree() {
      // TODO subs ...
      // const result = await updateFPSTermStatus();
      const { state } = await updateFPSTermStatus();
      if (state === 'SUCC') {
        this.$message({
          type: 'success',
          message: this.$t('COMMON.UPDATE_SUCCESS'),
          delay: 2000
        });
      } else {
        this.$message({
          type: 'fail',
          message: this.$t('COMMON.UPDATE_FAIL'),
          delay: 2000
        });
      }
      this.isShowPotrol = false;
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
</style>
