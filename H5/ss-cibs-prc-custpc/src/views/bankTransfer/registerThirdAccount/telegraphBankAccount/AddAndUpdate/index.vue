<!-- 登记第三者账户 - 电汇账户 新增/修改 -->
<template>
  <div class="g-telegraphAddupdate-container">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <!-- 填写信息 -->
    <div v-loading="requestLoading" v-show="activeIndex == 0">
      <el-form
        ref="submitForm"
        :model="formData"
        :rules="formRules"
        label-width="calc(50% - 160px)"
        label-suffix=": "
      >
        <divider :title="$t('PAYMENT.PAYEE_INFO')" class="mb20" />
        <el-form-item :label="$t('PAYMENT.ACCT_NAME')" prop="payeeName">
          <el-input
            v-model="formData.payeeName"
            maxlength="35"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.ACCT_NAME')
              })
            "
          />
        </el-form-item>
        <el-form-item :label="$t('PAYMENT.RECEIVER_ADDRESS')" prop="payeeAddress">
          <el-input
            v-model="formData.payeeAddress"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVER_ADDRESS')
              })
            "
            :maxlength="140 - formData.payeeName.length"
          />
        </el-form-item>
        <el-form-item :label="$t('PAYMENT.RECEIVER_COUNTRY')" prop="payeeCountryCode">
          <el-select class="form-select" v-model="formData.payeeCountryCode" :filterable="true">
            <el-option
              v-for="(item, index) in countryInfoList"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PAYMENT.ACCT_NO_OR_IBAN')" prop="accountNo">
          <money-input
            v-model.trim="formData.accountNo"
            :isAllNum="true"
            maxlength="34"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.ACCT_NO_OR_IBAN')
              })
            "
          />
        </el-form-item>
        <divider :title="$t('PAYMENT.RECEIVE_BANK_INFO')" class="mb20" />
        <el-form-item :label="$t('PAYMENT.RECEIVE_METHOD')" prop="isSwiftCode">
          <el-radio-group v-model="formData.isSwiftCode" @change="resetBankInfos">
            <el-radio :label="true" class="pt16">SWIFT Code</el-radio>
            <el-radio :label="false" class="pt16">
              {{
              $t('PAYMENT.PAYEE_COUNTRY_CODE')
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 通过swiftCode反显 -->
        <template v-if="formData.isSwiftCode">
          <el-form-item label="SWIFT Code" prop="swiftCode">
            <el-input
              v-model.trim="formData.swiftCode"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'SWIFT Code' })
              "
              @blur="getBankInfoBySwiftCode"
              class="ml5"
            />
          </el-form-item>
          <div
            class="swift-info-wrapper"
            v-show="
              formData.countryCode.length > 0 &&
                formData.bankAddress.length > 0 &&
                formData.bankName.length > 0
            "
          >
            <el-form-item :label="$t('PAYMENT.PAYEE_COUNTRY_CODE')" prop="countryCode">
              <el-input
                :value="getCountryName(formData.countryCode)"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.PAYEE_COUNTRY_CODE')
                  })
                "
                :disabled="true"
              />
            </el-form-item>
            <el-form-item :label="$t('PAYMENT.BANK_ADDRESS')" prop="bankAddress">
              <el-input
                :value="formData.bankAddress"
                :maxlength="140 - formData.bankName.length"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.BANK_ADDRESS')
                  })
                "
                :disabled="true"
              />
            </el-form-item>
            <el-form-item :label="$t('PAYMENT.BANK_NAME')" prop="bankName">
              <el-input
                :value="formData.bankName"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.BANK_NAME')
                  })
                "
                :disabled="true"
                maxlength="35"
              />
            </el-form-item>
          </div>
        </template>
        <!-- 用户手写收款银行信息 -->
        <template v-else>
          <el-form-item :label="$t('PAYMENT.PAYEE_COUNTRY_CODE')" prop="countryCode">
            <!-- swift-code mode && switft-code.length > 0 -->
            <el-select class="form-select" v-model="formData.countryCode" :filterable="true">
              <el-option
                v-for="(item, index) in countryInfoList"
                :label="item.label"
                :value="item.value"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.BANK_ADDRESS')" prop="bankAddress">
            <el-input
              v-model.trim="formData.bankAddress"
              maxlength="140"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.BANK_ADDRESS')
                })
              "
            />
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.BANK_NAME')" prop="bankName">
            <el-input
              v-model.trim="formData.bankName"
              maxlength="35"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.BANK_NAME')
                })
              "
            />
          </el-form-item>
        </template>
        <!-- 授权提醒 -->
        <auth-select
          v-if="Number(entType) !== 1"
          ref="authSelect"
          labelWidth="180px"
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
          <v-button size="w160" @click="handleNextStep" type="primary">
            {{
            $t('COMMON.NEXT_STEP')
            }}
          </v-button>
        </el-row>
      </el-form>
    </div>
    <!-- 确认信息 -->
    <confirm-info
      v-show="activeIndex === 1"
      v-loading="requestLoading"
      :data="formData"
      :authInfo="authInfo"
      :getCountryName="getCountryName"
      @handleBackStep="handleBackStep"
      @handleConfirm="handleConfirm"
    />
    <!-- 结果 -->
    <div v-show="activeIndex === 2">
      <operateResult
        v-if="resultStatus && resultStatus.length > 0"
        :status="resultStatus"
        :title="
          resultStatus === 'success'
            ? $t('COMMON.SUBMIT_SUCCESS')
            : $t('COMMON.SUBMIT_FAIL')
        "
        :desc="`${$t('PAYMENT.WEBBANK_FLOW_NO')}: ${flowNo}`"
        :comfirm="authResultState == '90' ? $t('PAYMENT.AUTH_RESULT_STATE') : authResultState == '03' ? $t('HEAD.AUTHORISATION_PROGRESS') : '' "
      >
        <template slot>
          <v-button size="w210" @click="handleBack" class="mt56">
            {{
            $t('COMMON.BACK')
            }}
          </v-button>
        </template>
      </operateResult>
    </div>
  </div>
</template>

<script>
import ConfirmInfo from './ConfirmInfo.vue';

import { getStepsList, formatAcctNo } from '@bank-transfer/utils/function';
import operateResult from '@/components/common/operateResult';
import { countryInfos } from '@/mixins';
import {
  getSwiftDetails,
  addGlobalRemittanceReg,
  updateGlobalRemittanceReg
} from '@/api/paymentRemittance';
import { mapState } from 'vuex';
import { otpDialog, softToken,choosesWay } from '@/components/messageBox';
import { isSameObject } from '@/utils/tools';
import _ from 'lodash';

export default {
  name: 'GlobalAcctChange',
  components: {
    ConfirmInfo,
    operateResult
  },
  mixins: [countryInfos],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
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
        payeeName: '', // 收款人-名称
        payeeAddress: '', // 收款人-地址
        payeeCountryCode: '', // 收款人-国家/地区
        accountNo: '', // 收款人-账户号码/IBAN

        isSwiftCode: true, // 是否通过swiftCode反显提交

        swiftCode: '', // 收款银行-SWIFT Code
        bankCountry: '', // 收款银行-国家/地区
        bankAddress: '', // 收款银行-地址
        bankName: '', // 收款银行-名称
        countryCode:'',
        remindNameList: [], // 授权提醒人列表
        authInfo: {}
      },
      resultStatus: '', // 'success' | 'fail'
      flowNo: '',
      authResultState: ''
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
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm;
    },
    formRules() {
      const self = this;
      const { isSwiftCode } = self.formData;

      return {
        payeeName: {
          required: true,
          trigger: 'blur',
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.ACCT_NAME')
          })
        },
        payeeAddress: {
          required: true,
          trigger: 'blur',
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.RECEIVER_ADDRESS')
          })
        },
        payeeCountryCode: {
          required: true,
          trigger: 'change',
          message: self.$t('COMMON.PLEASE_SELECT_SOMETHING', {
            select: self.$t('PAYMENT.RECEIVER_COUNTRY')
          })
        },
        accountNo: {
          required: true,
          trigger: 'blur',
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.ACCT_NO_OR_IBAN')
          })
        },
        // ...(isSwiftCode ? {} : {}),
        countryCode: {
          required: true,
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.PAYEE_COUNTRY_CODE')
          })
        },
        bankAddress: {
          required: true,
          trigger: 'blur',
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.BANK_ADDRESS')
          })
        },
        bankName: {
          required: true,
          trigger: 'blur',
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.BANK_NAME')
          })
        }
      };
    },
    submitFn() {
      if (this.changeType === 'update') {
        return updateGlobalRemittanceReg;
      }
      return addGlobalRemittanceReg;
    },
    authSelect() {
      const { authSelect } = this.$refs;
      return authSelect;
    },
    authInfo() {
      return this.formData.authInfo;
    },
    /** 是否对当前数据进行了修改操作 (没有修改不能提交) */
    isEditInfo() {
      const curData = _.cloneDeep(this.formData),
        originData = _.cloneDeep(this.changeData);
      if (curData.areaNo && curData.phoneNo) {
        curData.mobilePhone = `${curData.areaNo}-${curData.phoneNo}`;
      }

      delete curData.selectBankType;
      delete curData.isSwiftCode;
      delete originData.selectBankType;
      delete curData.payeeIdentifyMethod;
      delete originData.payeeIdentifyMethod;

      delete curData.authInfo;
      delete curData.remindNameList;
      delete curData.areaNo;
      delete curData.phoneNo;
      delete curData.resultStatus;

      return !isSameObject(curData, originData);
    }
  },
  watch: {
    'formData.isSwiftCode'() {
      this.submitForm.clearValidate();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    formatAcctNo,
    init() {
      if (this.changeType === 'update') {
        const changeData = { ...this.changeData },
          formData = { ...this.formData };
        for (let k in formData) {
          const value = changeData.hasOwnProperty(k)
            ? changeData[k]
            : formData[k];
          this.$set(this.formData, k, value);
        }
        this.$set(this.formData, 'registerCode', this.changeData.registerCode);
        this.setSwiftCodeStatus();
      }
      setTimeout(() => {
        if (this.authSelect) {
          this.authSelect.reset();
        }
        this.scrollToTop();
      }, 0);
    },
    setSwiftCodeStatus() {
      if (this.formData.swiftCode.length > 0) {
        this.$set(this.formData, 'isSwiftCode', true);
      } else {
        this.$set(this.formData, 'isSwiftCode', false);
      }
    },
    // 返回列表页
    handleBack() {
      this.$emit('returnBack');
    },
    // 下一步
    handleNextStep() {
      if (!this.isEditInfo) {
        this.$message({
          type: 'fail',
          message: `${this.$t('PAYMENT.NOT_EDIT_TIP')}`,
          duration: 1500
        });
        return;
      }
      this.submitForm.validate(valid => {
        if (valid) {
          console.log(this.formData);
          this.activeIndex = 1;
        }
      });

      this.scrollToTop();
    },
    /** 清空收款银行信息 */
    resetBankInfos() {
      this.$set(this.formData, 'swiftCode', '');
      this.$set(this.formData, 'countryCode', '');
      this.$set(this.formData, 'bankAddress', '');
      this.$set(this.formData, 'bankName', '');
    },
    async getBankInfoBySwiftCode() {
      const { swiftCode } = this.formData;
      if (!swiftCode || !swiftCode.length) {
        this.resetBankInfos();
        return;
      }
      const result = await getSwiftDetails({ swiftCode });
      if (result && Object.getOwnPropertyNames(result).length) {
        const { countryCode, bankAddress, bankName } = result;
        this.$set(this.formData, 'countryCode', countryCode);
        this.$set(this.formData, 'bankAddress', bankAddress);
        this.$set(this.formData, 'bankName', bankName);
      } else {
        // this.$message({
        //   type: 'fail',
        //   message: 'Error',
        //   duration: 1500
        // });
        this.resetBankInfos();
      }
    },
    // 上一步
    handleBackStep() {
      this.activeIndex = 0;
    },
    // 确定
    handleConfirm() {
      this.submits();
    },
    submits() {
      const { adminEmpower,cuSoleAuthorizerInd } = JSON.parse(sessionStorage.getItem('userInfo'));
      this.submitFn(this.formData).then(({ body = {}, head = {} }) => {
        console.log('得到的数据', head);
        console.log('得到的数据', body);
        const entType = localStorage.getItem('entType')
         const tradeInfo = JSON.stringify(this.formData);
        if(head.returnCode == 'OTP000107' && cuSoleAuthorizerInd=='1'){
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag:'1'
            // status: status
          }).then(() => {
            this.submits();
          });
        } else if (head.returnCode == 'OTP000107' && entType=='1') {
          softToken({
            softTokenCode: '',
            otpType: this.changeType === 'add' ? '0301031' : '0301032',
            tradeInfo: tradeInfo,
            flag: this.changeType === 'add' ? '1' : '2'
            // randomNum:''
          }).then(() => {
            this.submits()
            // this.comfirm();
          });
        }
        if (body) {
          const { authResultInfo } = body,
            { flowNo, authResultState } = authResultInfo;
          this.authResultState = authResultInfo.authResultState;

          if (authResultState === '90') {
            this.resultStatus = 'success';
            this.flowNo = flowNo;
          } else if (authResultState === '03') {
            this.sendEmail(this.formData);
            this.resultStatus = 'success';
            this.flowNo = flowNo;
          } else {
            this.resultStatus = 'fail';
          }
          this.activeIndex = 2;
          this.scrollToTop();
        }
      });
    },
    /**
     * 获取当前国家名
     */
    getCountryName(code) {
      const target = this.countryInfoList.find(item => item.value === code);
      if (target) {
        return target.label;
      }
      return '';
    },
    // 获取授权信息
    getAuthInfo(val) {
      this.$set(this.formData, 'authInfo', val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/style/mixin.scss';

.g-telegraphAddupdate-container {
  position: relative;
  .el-form-item {
    width: 650px;
    margin-left: auto;
    margin-right: auto;
    // margin-bottom: 16px;
    margin-bottom: 24px;
  }
  ::v-deep .el-input {
    width: 320px;
  }
  ::v-deep .el-select {
    &.form-select {
      position: relative;
      .el-select-dropdown.el-popper {
        position: absolute;
        left: 0;
        z-index: 100;
        width: 320px;
        @include text-overflow;
      }
    }
  }
  .formW_550 {
    margin: 0 auto 24px;
  }
  .el-radio-group {
    padding-left: 12px;
  }
}
</style>
