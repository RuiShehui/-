<!-- 登记第三者账户 -本地跨行账户-本地特快(外币转账) 新增/修改  -->
<template>
  <div v-loading="requestLoading" class="g-localAddupdate-container">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <!-- 填写信息 -->
    <div v-show="activeIndex == 0">
      <el-form
        ref="submitForm"
        :model="formData"
        :rules="formRules"
        label-width="calc(50% - 160px)"
        label-suffix=":"
      >
        <divider :title="$t('PAYMENT.PAYEE_INFO')" class="mb20" />
        <el-form-item :label="$t('PAYMENT.RECEIVE_BANK')" prop="payeeBankCode">
          <el-select
            class="form-item-component"
            v-model="formData.payeeBankCode"
            :filterable="true"
          >
            <el-option
              v-for="(item, index) of filterTransBank"
              :label="item.bankName"
              :value="item.value"
              :key="`${index + 1} ${item.value}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" :label="$t('PAYMENT.PAYEE_NAME')" prop="payeeName">
          <el-input
            class="form-item-component"
            v-model="formData.payeeName"
            maxlength="34"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.PAYEE_NAME')
              })
            "
          />
        </el-form-item>
        <el-form-item class="form-item" :label="$t('PAYMENT.RECEIVE_ACCOUNT')" prop="payeeAccount">
          <el-input
            class="form-item-component"
            v-model.trim="formData.payeeAccount"
            maxlength="34"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVE_ACCOUNT')
              })
            "
          />
        </el-form-item>
        <auth-select
          v-if="this.entType != 1"
          ref="authSelect"
          labelWidth="160px"
          @checkClick="getAuthInfo"
          :authInfo="authInfo"
          :isMoney="false"
          tradeType="030107"
        />
        <el-row class="flexc mt36">
          <v-button size="w160" @click="handlerBack" class="mr16">
            {{
            $t('COMMON.BACK')
            }}
          </v-button>
          <v-button size="w160" @click="handlerNext" type="primary">
            {{
            $t('COMMON.NEXT_STEP')
            }}
          </v-button>
        </el-row>
      </el-form>
    </div>
    <!-- 确认信息 -->
    <div class="pt12" v-show="activeIndex == 1">
      <div class="m-detail-content mb20">
        <detail-item :title="$t('PAYMENT.RECEIVE_BANK')" :content="formData.payeeBank" />
        <detail-item :title="$t('PAYMENT.PAYEE_NAME')" :content="formData.payeeName" />
        <detail-item
          :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
          :content="(formData.payeeAccount)"
        />
      </div>
      <el-row class="flexc">
        <v-button size="w160" @click="handlerUp" class="mr16">
          {{
          $t('COMMON.PREVIOUS_STEP')
          }}
        </v-button>
        <v-button type="primary" size="w160" @click="onConfirm">
          {{
          $t('COMMON.CONFIRM')
          }}
        </v-button>
      </el-row>
    </div>
    <!-- 结果 -->
    <div v-show="activeIndex == 2">
      <operate-result
        :status="resultStatus"
        :title="resultTitle"
        :desc="resultMessage"
        :comfirm="authResultState == '90' ? $t('PAYMENT.AUTH_RESULT_STATE') : authResultState == '03' ? $t('HEAD.AUTHORISATION_PROGRESS') : '' "
      >
        <template slot>
          <v-button size="w210" @click="handlerBack" class="mt56">
            {{
            $t('COMMON.BACK')
            }}
          </v-button>
        </template>
      </operate-result>
    </div>
  </div>
</template>

<script>
import operateResult from '@/components/common/operateResult';

import {
  addInterBankTransferChats,
  updateInterBankTransferChats
} from '@/api/paymentRemittance';

import bankInfos from '@/mixins/bankInfos';
import { getStepsList, formatAcctNo } from '@bank-transfer/utils/function';
import { INTRA_ACCT_TYPES } from '@bank-transfer/utils/constant';
import { confirm } from '@bank-transfer/mixins';
import regsCollection from '@/utils/regs';
import { isSameObject } from '@/utils/tools';
import { mapState } from 'vuex';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import _ from 'lodash';
const { checkAcctNo, checkAcctName, swiftAcct } = regsCollection;

export default {
  name: 'LocalBankOperate',
  components: {
    operateResult
  },
  mixins: [bankInfos, confirm],
  inject: ['scrollToTop', 'sendEmail'],
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
        payeeBank: '', // 收款银行名称
        payeeBankCode: '', // 收款银行编号
        payeeName: '', // 收款户名
        payeeAccount: '', // 收款账户

        remindNameList: [], // 提醒人列表
        authInfo: {}
      },
      flowNo: '',
      resultStatus: '',
      authResultState: '',
      resultTitle: '',
      resultMessage: '',
      desction: '',
      entType: Number(localStorage.getItem('entType') || '0')
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    formRules() {
      const self = this;
      return {
        payeeBankCode: {
          required: true,
          message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: self.$t('PAYMENT.RECEIVE_BANK')
          }),
          trigger: true
        },
        payeeName: {
          required: true,
          validator: (r, val, cb) => {
            if (!val || !val.length) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.PAYEE_NAME')
                  })
                )
              );
              return;
            }
            cb();
          }
        },
        payeeAccount: {
          required: true,
          validator: (r, val, cb) => {
            if (!val || !val.length) {
              cb(
                new Error(
                  self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: self.$t('PAYMENT.RECEIVE_ACCOUNT')
                  })
                )
              );
              return;
            }
            if (!/^\d{1,34}$/.test(val)) {
              cb(new Error(self.$t('COMMON.CHECK_FAIL')));
              return;
            }
            cb();
          }
        }
      };
    },
    stepsList() {
      return getStepsList({
        changeType: this.changeType,
        resultStatus: this.formData.resultStatus
      });
    },
    submitFn() {
      if (this.changeType == 'add') {
        return addInterBankTransferChats;
      }
      if (this.changeType == 'update') {
        return updateInterBankTransferChats;
      }
      return () => {};
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
      console.log('克隆', curData, originData);

      delete curData.selectBankType;
      delete originData.selectBankType;
      delete curData.payeeIdentifyMethod;
      delete originData.payeeIdentifyMethod;

      delete curData.authInfo;
      delete curData.remindNameList;
      delete curData.areaNo;
      delete curData.phoneNo;
      delete curData.resultStatus;
      console.log('.内容删除后', curData, originData);

      return !isSameObject(curData, originData);
    }
  },
  watch: {
    'formData.payeeBankCode'(newVal) {
      const target = this.filterTransBank.find(item => item.value === newVal);
      if (target) {
        this.$set(this.formData, 'payeeBank', target.bankName || '');
      } else {
        this.$set(this.formData, 'payeeBank', '');
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    formatAcctNo,
    init() {
      if (this.changeType === 'update') {
        const formData = { ...this.formData };
        console.log(this.changeData);
        for (let k in formData) {
          const value = this.changeData.hasOwnProperty(k)
            ? this.changeData[k]
            : formData[k];
          this.$set(this.formData, k, value);
        }
        this.$nextTick(() => {
          // 设置登记编号
          this.$set(
            this.formData,
            'registerCode',
            this.changeData.registerCode
          );
          // 设置收款银行
          this.$set(
            this.formData,
            'payeeBankCode',
            this.changeData.payeeBankCode
          );
        });
      } else {
        this.formData = {
          payeeBank: '',
          payeeBankCode: '',
          payeeName: '',
          payeeAccount: '',

          remindNameList: []
        };
      }
    },
    // 返回列表页
    handlerBack() {
      this.$emit('returnBack');
    },
    // 下一步
    handlerNext() {
      if (!this.isEditInfo) {
        this.$message({
          type: 'fail',
          message: `${this.$t('PAYMENT.NOT_EDIT_TIP')}`,
          duration: 1500
        });
        return;
      }
      this.scrollToTop();
      this.$refs['submitForm'].validate(valid => {
        if (!valid) {
          return;
        }
        this.activeIndex = 1;
      });
    },
    // 上一步
    handlerUp() {
      this.activeIndex = 0;
    },
    // 确定
    async onConfirm() {
      this.submits();
    },
    async submits() {
      this.submitFn({
        ...this.formData,
        transferWay: INTRA_ACCT_TYPES.CHATS
      }).then(({ body = {}, head = {} }) => {
        console.log('得到的数据', head);
        console.log('得到的数据', body);
        const entType = localStorage.getItem('entType');
        const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
          sessionStorage.getItem('userInfo')
        );
        const tradeInfo = JSON.stringify({...this.formData, otpType: this.changeType == 'add' ? '030102021' : '030102022'});
        if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
            // status: status
          }).then(() => {
            this.submits();
          });
        } else if (head.returnCode == 'OTP000107' && entType == '1') {
          softToken({
            softTokenCode: '',
            otpType: this.changeType == 'add' ? '030102021' : '030102022',
            tradeInfo: tradeInfo,
            flag: this.changeType === 'add' ? '1' : '2'
            // randomNum:''
          }).then(() => {
            // this.comfirm();
            this.submits();
          });
        }
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
            } else {
              this.resultTitle = this.$t('INTERESTRATEQUERY.PARTIALLY_FAILED');
              this.resultMessage =
                this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
            }
          }
          this.activeIndex = 2;
          this.scrollToTop();
          if (this.$refs['authSelect']) {
            this.$refs['authSelect'].reset();
          }
        }
      });
    },
    getResultStatus(result) {
      console.log(result, '2414124124124');
      if (result) {
        const { authResultInfo } = result.body;
        if (Object.getOwnPropertyNames(authResultInfo).length) {
          return true;
        }
      }
      return false;
    },
    // 获取授权信息
    getAuthInfo(val) {
      this.$set(this.formData, 'authInfo', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-localAddupdate-container {
  .el-form-item {
    width: 650px;
    margin: 0 auto;
    margin-bottom: 25px;
    .form-item-component {
      width: 320px;

      ::v-deep .el-input {
        width: 100%;
      }
    }
  }
  .formW_550 {
    margin: 0 auto 24px;
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
