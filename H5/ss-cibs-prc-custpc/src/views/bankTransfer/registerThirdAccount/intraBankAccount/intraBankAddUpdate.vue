<!-- 登记第三者账户 - 行内账户 新增/修改  -->
<template>
  <div class="g-intraAddUpdate-container" v-loading="requestLoading">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <!-- 填写信息 -->
    <div v-show="activeIndex === 0">
      <el-form
        ref="submitForm"
        :model="formData"
        label-width="calc(50% - 160px)"
        :rules="formDataRules"
        label-suffix=":"
      >
        <divider :title="$t('PAYMENT.PAYEE_INFO')" class="mb20" />
        <el-form-item class="formW_650" :label="$t('PAYMENT.RECEIVE_ACCOUNT')" prop="payeeAccount">
          <money-input
            v-model.trim="formData.payeeAccount"
            :isAllNum="true"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVE_ACCOUNT')
              })
            "
            maxlength="16"
          />
        </el-form-item>
        <el-form-item v-show="false" prop="payeeName" :label="$t('PAYMENT.PAYEE_NAME')"></el-form-item>
        <!-- 授权提醒 -->
        <auth-select
          v-if="entType !== 1"
          labelWidth="calc(50% - 160px)"
          @checkClick="getAuthInfo"
          :authInfo="authInfo"
          :isMoney="false"
          tradeType="030107"
        />
        <el-row class="flexc mt36">
          <v-button size="w160" @click="handleBack" class="mr16">
            {{
            $t('COMMON.BACK')
            }}
          </v-button>
          <v-button size="w160" @click="handleToNextStep" type="primary">
            {{
            $t('COMMON.NEXT_STEP')
            }}
          </v-button>
        </el-row>
      </el-form>
    </div>
    <!-- 确认信息 -->
    <div class="pt12" v-show="activeIndex === 1">
      <div class="m-detail-content mb20">
        <detail-item
          :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
          :content="
            `${formatAcctNo(formData.payeeAccount)} ${formData.payeeCcy ||
              'HKD'} ${accountType(formData.payeeType)}`
          "
        />
        <detail-item :title="$t('PAYMENT.PAYEE_NAME')" :content="formData.payeeName" />
        <template v-if="authInfo && authInfo.AlevelList">
          <detail-item
            v-if="authInfo.AlevelList.length > 0"
            :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
            :content="authInfo.AlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.BlevelList.length > 0"
            :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
            :content="authInfo.BlevelList | getAuthName"
          />
          <detail-item
            v-if="authInfo.ClevelList.length > 0"
            :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
            :content="authInfo.ClevelList | getAuthName"
          />
        </template>
      </div>
      <el-row class="flexc">
        <v-button size="w160" @click="handleToLastStep" class="mr16">
          {{
          $t('COMMON.PREVIOUS_STEP')
          }}
        </v-button>
        <v-button type="primary" size="w160" @click="onConfirm">{{ $t('COMMON.CONFIRM') }}</v-button>
      </el-row>
    </div>
    <!-- 结果 -->
    <div v-if="activeIndex === 2">
      <div class="m-resultInfo">
        <operate-result
          :status="resultStatus"
          :title="resultTitle"
          :desc="resultMessage"
          :comfirm="authResultState == '90' ? $t('PAYMENT.AUTH_RESULT_STATE') : authResultState == '03' ? $t('HEAD.AUTHORISATION_PROGRESS') : '' "
        >
          <template slot>
            <v-button size="w210" @click="handleBack" class="mt56">{{ $t('COMMON.BACK') }}</v-button>
          </template>
        </operate-result>
      </div>
    </div>
    <div class="wPro">
      <p class="p1 mb16">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <!-- <p>1.温馨提示温馨提示</p>
      <p>2.温馨提示温馨提示；</p>
      <p>3.温馨提示温馨提示；</p>
      <p>4.温馨提示温馨提示。</p>-->
      <p v-for="item of $t('PAYMENT.REGISTERED_INLINE_TIPS')" :key="item" v-html="item" />
    </div>
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools';
import { isSameObject } from '@/utils/tools';
import OperateResult from '@/components/common/operateResult';
import { getStepsList } from '@bank-transfer/utils/function';
import _ from 'lodash';

import {
  findAccountName,
  addInnerBankReg,
  updateInnerBankReg
} from '@/api/paymentRemittance';
import { mapState } from 'vuex';
import filters from '@/filters/accountManagement';
import i18n from '@/i18n';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';

export default {
  components: {
    OperateResult
  },
  inject: ['scrollToTop', 'entType', 'formatAcctNo', 'sendEmail'],
  props: {
    changeType: {
      type: String,
      default: 'add'
    },
    changeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeIndex: 0,
      formData: {
        ebankCstmNo: '', // 网银客户号
        payeeAccount: '', // 收款账户
        payeeBank: i18n.t('PAYMENT.CHUANGXING_BANK'), // 付款银行
        payeeCcy: '', // 2022-04-06新增 收款人交易币种
        payeeType: '', // 2022-04-06新增 收款人账户类型
        payeeName: '', // 收款户名
        authInfo: {}
      },
      resultStatus: '', // 'success' | 'fail'
      flowNo: '',
      authResultState: '',
      authResultMessage: ''
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    stepsList() {
      const self = this;
      return getStepsList({
        changeType: self.changeType,
        resultStatus: self.resultStatus
      });
    },
    authInfo() {
      return this.formData.authInfo;
    },
    formDataRules() {
      const self = this;
      // var checkPayee = (rule, value, cb) => {
      //   // console.log(value,'value')
      //   if (value == this.changeData.payeeAccount) {
      //     cb(new Error('收款账户不能相同'));
      //   }
      // };
      return {
        payeeAccount: [
          {
            required: true,
            message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: self.$t('PAYMENT.RECEIVE_ACCOUNT')
            }),
            trigger: 'blur'
          }
        ]
      };
    },
    /** 是否对当前数据进行了修改操作 (没有修改不能提交) */
    isEditInfo() {
      const curData = _.cloneDeep(this.formData),
        originData = _.cloneDeep(this.changeData);

      delete curData.authInfo;

      return !isSameObject(curData, originData);
    }
  },
  watch: {
    activeIndex() {
      this.scrollToTop();
    }
  },
  mounted() {
    this.initFormData();
  },
  methods: {
    ...filters,
    initFormData() {
      if (Object.keys(this.changeData).length) {
        const formData = { ...this.formData };
        for (let k in formData) {
          const value = this.changeData.hasOwnProperty(k)
            ? this.changeData[k]
            : formData[k];
          this.$set(this.formData, k, value);
        }
        /** 编辑需要 registerCode */
        this.$set(this.formData, 'registerCode', this.changeData.registerCode);
      } else {
        this.formData = {
          ebankCstmNo: '', // 网银客户号
          payeeAccount: '', // 收款账户
          payeeBank: i18n.t('PAYMENT.CHUANGXING_BANK'), // 付款银行
          payeeName: '', // 收款户名
          authInfo: {}
        };
      }
    },
    // 返回
    handleBack() {
      this.$emit('returnBack');
    },
    /** 获取脱敏数据 */
    async checkIsAcctValid() {
      const params = {
        custNo: null,
        tranCode: '41346',
        acctNoList: [this.formData.payeeAccount]
      };
      const result = await findAccountName(params);
      if (result) {
        const { chineseName, englishName, payeeCcy, payeeType } = result;
        const value = chineseName || englishName;
        this.$set(this.formData, 'payeeName', value);
        this.$set(this.formData, 'payeeCcy', payeeCcy);
        this.$set(this.formData, 'payeeType', payeeType);
        return true;
      } else {
        this.$set(this.formData, 'payeeName', '');
        // this.$set(this.formData, 'payeeAccount', '');
      }
      return false;
    },
    // 下一步
    handleToNextStep() {
      if (!this.isEditInfo) {
        this.$message({
          type: 'fail',
          message: `${this.$t('PAYMENT.NOT_EDIT_TIP')}`,
          duration: 1500
        });
        return;
      }
      this.$refs['submitForm'].validate(async valid => {
        if (valid) {
          const isValid = await this.checkIsAcctValid();
          if (isValid) {
            this.activeIndex = 1;
          }
        } else {
          this.$message({
            type: 'fail',
            message: this.$t('COMMON.CHECK_FAIL'),
            duration: 3000
          });
        }
      });
    },
    // 确定
    async onConfirm() {
      this.submit();
    },
    async submit() {
      let custNo = sessionStorage.getItem('custNo');
      const entType = localStorage.getItem('entType');
      const fn =
        this.changeType === 'add' ? addInnerBankReg : updateInnerBankReg;
      const operate =
        this.changeType === 'add'
          ? this.$t('COMMON.ADD')
          : this.$t('COMMON.UPDATE');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      fn(this.formData).then(({ body = {}, head = {} }) => {
        const tradeInfo = JSON.stringify({...this.formData,  operationType: this.changeType == 'add'?'1':'2'});
        if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
            // status: status
          }).then(() => {
            this.submit();
          });
        } else if (head.returnCode == 'OTP000107' && entType == '1') {
          // const tradeInfo = JSON.stringify(this.formData)
          softToken({
            softTokenCode: '',
            // otpType: this.transferType == 'fast' ? '030102013' : '030102023',
            otpType:this.changeType == 'add'?'0301011':'0301012',
            tradeInfo: tradeInfo,
            // flag:'3'
            // randomNum:''
          }).then(() => {
            // this.comfirm();
            this.submit();
          });
        }
        // if (this.entType === 1 && head.returnCode == 'OTP000107') {
        //   otpDialog({
        //     otpType: this.transferType == 'fast' ? '030102013' : '030102023',
        //     custNo: custNo,
        //     otpMode: 'otp'
        //   }).then(() => {});
        // }
        if (body) {
          const { authResultInfo } = body;
          this.authResultState = authResultInfo.authResultState;
          if (authResultInfo.authResultState !== '91') {
            this.resultStatus = 'success';
            this.sendEmail(this.formData);
          } else {
            this.resultStatus = 'fail';
          }
          if (this.entType === 1) {
            if (this.resultStatus == 'success') {
              this.resultTitle = this.$t('PAYMENT.SUCCESS_TRADE');
              this.resultMessage =
                this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
            } else {
              this.resultTitle = this.$t('INTERESTRATEQUERY.PARTIALLY_FAILED');
              this.resultMessage =
                this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
            }
          } else {
            if (this.resultStatus == 'success') {
              this.resultTitle = this.$t('PAYMENT.SUCCESS_TRADE');
              this.resultMessage =
                this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
              // this.resultConfirm = '请至授权zhogn'xin'
            } else {
              this.resultTitle = this.$t('INTERESTRATEQUERY.PARTIALLY_FAILED');
              this.resultMessage =
                this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
            }
          }
          this.activeIndex = 2;
        }
      });
    },
    //  上一步
    handleToLastStep() {
      this.activeIndex = 0;
    },
    selectPayAcct(val) {
      this.formData.payAcctName = val.accountName;
      this.formData.payAcctMoney = val.balance;
    },
    formatMoney(val) {
      if (val) {
        return mathTools.addDecollator(val);
      }
    },
    // 获取授权信息
    getAuthInfo(val) {
      this.$set(this.formData, 'authInfo', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-intraAddUpdate-container {
  .formW_550 {
    margin: 0 auto 24px;
  }
  .el-form-item {
    &.is-error {
      margin-bottom: 40px;
    }
    .el-form-item__label {
      padding-top: 7px;
      padding-bottom: 7px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      font-size: 14px;
    }
    .el-form-item__content {
      line-height: 36px;
    }
    /deep/.el-form-item__error {
      left: 12px;
      line-height: 20px;
    }
    /deep/ .el-input {
      width: 320px;
    }
  }

  .m-detail-content {
    width: 940px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    flex-wrap: wrap;
    .detailItem {
      margin-bottom: 16px;
      &:nth-child(2n) {
        margin-left: 52px;
      }
    }
  }
}
</style>
