w<!-- 登记第三者账户 - 本地跨行-转数快-新增/修改  -->
<template>
  <div class="g-fastAddupdate-container" v-loading="requestLoading">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex"></steps>
    <!-- 填写信息 -->
    <div v-show="activeIndex === 0" v-loading="formLoading">
      <el-form
        ref="submitForm"
        :model="formData"
        :rules="formRules"
        label-width="calc(50% - 160px)"
        label-suffix=":"
      >
        <divider :title="$t('PAYMENT.PAYEE_INFO')" class="mb20" />
        <!-- 收款人识别方式 -->
        <el-form-item
          :required="true"
          :label="$t('PAYMENT.PAYEE_IDENTIFY_WAY')"
          prop="payeeIdentifyMethod"
        >
          <el-select
            :disabled="isUpdate"
            v-model="formData.payeeIdentifyMethod"
            @change="onMethodChange"
          >
            <el-option
              v-for="(item, index) in identifyWayList"
              :label="item.value | FPStransTypeFilers"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <!-- 1-收款账户 -->
        <template v-if="formData.payeeIdentifyMethod === 'BBAN' || showAcct">
          <el-form-item :label="$t('PAYMENT.RECEIVE_ACCOUNT')" prop="payeeAccount">
            <el-input
              v-model="formData.payeeAccount"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.RECEIVE_ACCOUNT')
                })
              "
              maxlength="34"
            />
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.PAYEE_NAME')" prop="payeeName">
            <el-input
              v-model="formData.payeeName"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.PAYEE_NAME')
                })
              "
              :maxlength="120"
            />
          </el-form-item>
          <el-form-item :label="$t('PAYMENT.RECEIVE_BANK')" prop="payeeBankCode">
            <el-select v-model="formData.payeeBankCode" :filterable="true">
              <el-option
                v-for="(item, index) in filterTransBank"
                :label="item.bankName"
                :value="item.value"
                :key="`${index} ${item.value}`"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 2.流动电话号码 -->
        <template v-if="formData.payeeIdentifyMethod === 'MOBN'">
          <el-form-item
            :label="$t('PAYMENT.MOBILE_PHONE_NUMBER')"
            prop="areaNo"
            class="changeInputStyle"
          >
            <el-input
              class="phone-input"
              v-model.trim="formData.areaNo"
              :placeholder="$t('PAYMENT.AREA_NO')"
              maxlength="5"
            />
            <span>&nbsp;-&nbsp;</span>
            <el-input
              class="phone-input phone"
              v-model.trim="formData.phoneNo"
              :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.MOBILE_PHONE_NUMBER')
                })"
              maxlength="11"
              @blur="queryFpsInfo('0')"
            />
          </el-form-item>
        </template>
        <!-- 3.电邮地址 -->
        <template v-if="formData.payeeIdentifyMethod === IDENTIFY_WAY_MAP.emailAddress">
          <el-form-item :label="$t('PAYMENT.EMAIL_ADDRESS')" prop="emailAddress">
            <el-input
              v-model.trim="formData.emailAddress"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.EMAIL_ADDRESS')
                })
              "
              @blur="queryFpsInfo('0')"
            />
          </el-form-item>
        </template>
        <!-- 4.FPS ID -->
        <template v-if="formData.payeeIdentifyMethod === IDENTIFY_WAY_MAP.fpsId">
          <el-form-item label="FPS ID" prop="fpsId">
            <el-input
              v-model.trim="formData.fpsId"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'FPS ID' })
              "
              @blur="queryFpsInfo('0')"
            />
          </el-form-item>
          <template v-if="formData.payeeBank && formData.payeeBankCode &&formData.payeeName ">
            <el-form-item :label="$t('PAYMENT.PAYEE_BANK')">
              <el-input
                disabled
                :placeholder="$t('PAYMENT.PAYEE_BANK')"
                :value="filterFpsBank(formData)"
              />
            </el-form-item>
            <!-- 收款账户名称 -->
            <el-form-item :label="$t('PAYMENT.PAYEE_NAME')">
              <el-input
                disabled
                :placeholder="$t('PAYMENT.PAYEE_NAME')"
                :value="formData.payeeName"
              />
            </el-form-item>
          </template>
        </template>

        <!-- 对于电话以及邮箱的优化 -->
        <template
          v-if="formData.payeeIdentifyMethod === IDENTIFY_WAY_MAP.emailAddress || formData.payeeIdentifyMethod === 'MOBN'"
        >
          <!-- 单选框切换 -->
          <el-form-item :required="true" :label="$t('PAYMENT.RECEIVE_BANK')" prop="selectBankType">
            <el-radio-group v-model="formData.selectBankType" class="flex-cloum">
              <!-- fake data -->
              <el-radio
                v-for="(value, prop) of SELECT_BANK_TYPES"
                :key="prop"
                :label="prop"
              >{{ value | selectBackTypeFilter }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 下拉选项 -->
          <el-form-item
            v-if="formData.selectBankType === 'OPT'"
            :label="$t('PAYMENT.DESIGNATED_RECEIVE_BANK')"
            prop="payeeBankCode"
          >
            <el-select v-model="formData.payeeBankCode" :filterable="true">
              <el-option
                v-for="(item, index) in filterTransBank"
                :label="item.bankName"
                :value="item.value"
                :key="`${index} ${item.value}`"
              />
            </el-select>
          </el-form-item>
          <!-- 收款账户名称 -->
          <el-form-item v-if="formData.payeeName" :label="$t('PAYMENT.PAYEE_NAME')">
            <el-input disabled :placeholder="$t('PAYMENT.PAYEE_NAME')" :value="formData.payeeName" />
          </el-form-item>
        </template>
        <!-- 授权提醒 -->
        <auth-select
          v-if="this.entType !== 1"
          ref="authorizationSelect"
          @checkClick="getAuthInfo"
          :authInfo="authInfo"
          :isMoney="false"
          tradeType="030107"
        />
        <el-row class="flexc mt36">
          <v-button size="w160" @click="handleBack" class="mr16">{{ $t('COMMON.BACK') }}</v-button>
          <v-button size="w160" @click="handleNextStep" type="primary">{{ $t('COMMON.NEXT_STEP') }}</v-button>
        </el-row>
      </el-form>
    </div>
    <!-- 确认信息 -->
    <confirm-page
      v-show="activeIndex === 1"
      :propList="confirmPropList"
      :authInfo="authInfo"
      @handleLastStep="handleLastStep"
      @handleConfirm="handleConfirm"
    />
    <!-- 结果 -->
    <div class="mt16" v-show="activeIndex === 2">
      <operate-result
        :status="resultStatus"
        :title="resultTitle"
        :desc="resultMessage"
        :comfirm="authResultState == '90' ? $t('PAYMENT.AUTH_RESULT_STATE') : authResultState == '03' ? $t('HEAD.AUTHORISATION_PROGRESS') : '' "
      >
        <template>
          <v-button size="w210" @click="handleBack" class="mt56">{{ $t('COMMON.BACK') }}</v-button>
        </template>
      </operate-result>
    </div>
  </div>
</template>

<script>
import OperateResult from '@/components/common/operateResult';
import ConfirmPage from './fast-confirm.vue';
import business from '@/filters/business.js';
import _ from 'lodash';
import {
  identifyWayList,
  IDENTIFY_WAY_MAP,
  INTRA_ACCT_TYPES,
  SELECT_BANK_TYPES
} from '@bank-transfer/utils/constant';
import {
  scrollToTop,
  checkFlowNum,
  checkEmailAddress,
  checkFpsId,
  getStepsList,
  getFastSubmitData
} from '@bank-transfer/utils/function';
import { selectBackTypeFilter } from '@bank-transfer/utils/filters';

import bankInfos from '@/mixins/bankInfos';
import {
  addInterBankTransferReg,
  updateInterBankTransferReg,
  findFpsAcctInfo
} from '@/api/paymentRemittance';
import regs from '@/utils/regs';
import { isSameObject } from '@/utils/tools';

import { mapState } from 'vuex';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
const { checkAcctNo, checkAcctName } = regs;

export default {
  components: {
    OperateResult,
    ConfirmPage
  },
  mixins: [bankInfos],
  inject: ['entType', 'formatAcctNo', 'sendEmail'],
  props: {
    changeType: {
      type: String,
      default: 'add'
    },
    changeData: Object
  },
  data() {
    return {
      payType: 'fast', //此参数只为了解决混入
      activeIndex: 0,
      identifyWayList: identifyWayList.filter(
        item => item.value !== IDENTIFY_WAY_MAP.creditCard
      ),
      IDENTIFY_WAY_MAP,
      SELECT_BANK_TYPES,
      formData: {
        payeeIdentifyMethod: IDENTIFY_WAY_MAP.payeeAccount, // 收款人识别方式
        payeeAccount: '', // 收款账户
        payeeName: '', // 收款户名
        payeeBankCode: '', // 收款银行机构-编号
        payeeBank: '', // 收款银行机构-名称
        emailAddress: '', // 收款人邮箱地址
        fpsId: '', // 收款人fpsId
        authInfo: {},
        /** 流动电话号码 */
        // countryNo: '', // 收款人地区编号
        areaNo: '', // 收款人区域编号
        phoneNo: '', // 收款人电话号码
        /** 流动电话号码 */
        selectBankType: SELECT_BANK_TYPES.PRE, // 指定收款银行机构
        ebankCstmNo: '', // 指定银行信息
        remindNameList: [],
        resultStatus: 'success' // '' | 'success' | 'fail'
      },
      showAcct: false,
      submitStatus: '', // 'success' | 'fail'
      flowNum: '',
      formLoading: false,
      authResultMessage: '',
      resultStatus: 'success',
      resultTitle: '',
      resultMessage: '',
      authResultState: '',
      flowNo: '',
      ableSubmit: false,
      isShowAcctInfos: false
    };
  },
  filters: {
    selectBackTypeFilter,
    FPStransTypeFilers:business.FPStransTypeFilers,
  },
  computed: {
    ...mapState('app', ['requestLoading']),
    isUpdate() {
      return this.changeType !== 'add';
    },
    submitFn() {
      if (this.isUpdate) {
        return updateInterBankTransferReg;
      }
      return addInterBankTransferReg;
    },
    // 提交的表单refrence
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm;
    },
    // 收款人识别账户方式列表
    selectBankTypeList() {
      const self = this;
      return [
        {
          label: self.$t('PAYMENT.PRESET_PAYEE_BANK'),
          value: '0'
        },
        {
          label: self.$t('PAYMENT.CHUANGXING_BANK'),
          value: '1'
        },
        {
          label: self.$t('PAYMENT.RECEIVE_BANK'),
          value: '2'
        }
      ];
    },
    // TODO 表单校验规则
    formRules() {
      const self = this,
        { payeeIdentifyMethod, selectBankType } = self.formData;
      /** 收款账户 */
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.payeeAccount) {
        return {
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
              if (!/^\d{1,120}$/.test(val)) {
                cb(new Error(self.$t('COMMON.CHECK_FAIL')));
                return;
              }
              cb();
            }
          },
          payeeName: {
            required: true,
            message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: self.$t('PAYMENT.PAYEE_NAME')
            }),
            trigger: 'blur'
          },
          payeeBankCode: {
            required: true,
            message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: self.$t('PAYMENT.RECEIVE_BANK')
            })
          }
        };
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.mobilePhone) {
        return {
          areaNo: {
            required: true,
            trigger: 'blur',
            validator: (r, val, cb) => {
              const { areaNo, phoneNo } = self.formData;
              if (!areaNo.length || !phoneNo.length) {
                cb(
                  new Error(
                    self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                      input: self.$t('PAYMENT.MOBILE_PHONE_NUMBER')
                    })
                  )
                );
                return;
              }
              /** rules checking */
              cb();
            }
          },
          payeeBankCode: {
            required: selectBankType === SELECT_BANK_TYPES.OPT,
            message: self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: self.$t('PAYMENT.RECEIVE_BANK')
            })
          }
        };
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.emailAddress) {
        return {
          emailAddress: {
            required: true,
            validator: checkEmailAddress(self.formData)
          },
          payeeBankCode: {
            required: selectBankType === SELECT_BANK_TYPES.OPT,
            validator: (r, val, cb) => {
              if (self.formData.selectBankType === SELECT_BANK_TYPES.OPT) {
                if (!val) {
                  cb(
                    new Error(
                      self.$t('COMMON.PLEASE_INPUT_SOMETHING', {
                        input: self.$t('PAYMENT.RECEIVE_BANK')
                      })
                    )
                  );
                  return;
                }
              }
              cb();
            }
          }
        };
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.fpsId) {
        return {
          fpsId: {
            required: true,
            validator: (r, val, cb) => checkFpsId(r, val, cb)
          }
        };
      }
      return {};
    },
    /** 步骤条列表 */
    stepsList() {
      return getStepsList({
        changeType: this.changeType,
        resultStatus: ''
      });
    },
    /** 提交的內容 */
    submitData() {
      return getFastSubmitData(this.formData);
    },
    /** confirm-prop-list */
    confirmPropList() {
      const self = this;
      const { payeeIdentifyMethod, selectBankType } = self.formData;
      const {
        // AlevelList = [],
        BlevelList = [],
        ClevelList = []
      } = this.authInfo;

      switch (payeeIdentifyMethod) {
        case IDENTIFY_WAY_MAP.payeeAccount:
          return [
            {
              prop: 'payeeIdentifyMethod',
              title: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY'),
              content: self.identifyWayList.find(
                item => item.value === payeeIdentifyMethod
              )
                ? self.identifyWayList.find(
                    item => item.value === payeeIdentifyMethod
                  ).label
                : ''
            },
            {
              prop: 'payeeName',
              title: self.$t('PAYMENT.PAYEE_NAME'),
              content: self.submitData['payeeName']
            },
            {
              prop: 'payeeAccount',
              title: self.$t('PAYMENT.RECEIVE_ACCOUNT'),
              content: self.submitData['payeeAccount']
            },
            {
              prop: 'payeeBankCode',
              title: self.$t('PAYMENT.PAYEE_BANK'),
              content: self.filterBankInfo(self.submitData['payeeBankCode'])
            }
          ];
        case IDENTIFY_WAY_MAP.emailAddress:
          return [
            {
              prop: 'payeeIdentifyMethod',
              title: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY'),
              content: self.identifyWayList.find(
                item => item.value === payeeIdentifyMethod
              )
                ? self.identifyWayList.find(
                    item => item.value === payeeIdentifyMethod
                  ).label
                : ''
            },
            {
              prop: 'emailAddress',
              title: self.$t('PAYMENT.EMAIL_ADDRESS'),
              content: self.submitData['emailAddress']
            },
            {
              prop: 'payeeName',
              title: self.$t('PAYMENT.PAYEE_NAME'),
              content: self.submitData['payeeName']
            },
            {
              prop: 'selectBankType',
              title: self.$t('PAYMENT.PAYEE_BANK'),
              content: selectBackTypeFilter(self.submitData['selectBankType'])
            },
            ...(self.submitData['selectBankType'] === SELECT_BANK_TYPES.OPT
              ? [
                  {
                    prop: 'payeeBankCode',
                    title: self.$t('PAYMENT.DESIGNATED_RECEIVE_BANK'),
                    content: self.filterBankInfo(
                      self.submitData['payeeBankCode']
                    )
                  }
                ]
              : [])
          ];
        case IDENTIFY_WAY_MAP.mobilePhone:
          return [
            {
              prop: 'payeeIdentifyMethod',
              title: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY'),
              content: self.identifyWayList.find(
                item => item.value === payeeIdentifyMethod
              )
                ? self.identifyWayList.find(
                    item => item.value === payeeIdentifyMethod
                  ).label
                : ''
            },
            {
              prop: 'mobilePhone',
              title: self.$t('PAYMENT.EMAIL_ADDRESS'),
              content: self.submitData['mobilePhone']
            },
            {
              prop: 'payeeName',
              title: self.$t('PAYMENT.PAYEE_NAME'),
              content: self.submitData['payeeName']
            },
            {
              prop: 'selectBankType',
              title: self.$t('PAYMENT.PAYEE_BANK'),
              content: selectBackTypeFilter(self.submitData['selectBankType'])
            },
            ...(self.submitData['selectBankType'] === SELECT_BANK_TYPES.OPT
              ? [
                  {
                    prop: 'payeeBankCode',
                    title: self.$t('PAYMENT.DESIGNATED_RECEIVE_BANK'),
                    content: self.filterBankInfo(
                      self.submitData['payeeBankCode']
                    )
                  }
                ]
              : [])
          ];
        case IDENTIFY_WAY_MAP.fpsId:
          return [
            {
              prop: 'payeeIdentifyMethod',
              title: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY'),
              content: self.identifyWayList.find(
                item => item.value === payeeIdentifyMethod
              )
                ? self.identifyWayList.find(
                    item => item.value === payeeIdentifyMethod
                  ).label
                : ''
            },
            {
              prop: 'fpsId',
              title: 'FPS ID',
              content: self.submitData['fpsId']
            },
            {
              prop: 'payeeName',
              title: self.$t('PAYMENT.PAYEE_NAME'),
              content: self.submitData['payeeName']
            }
          ];
        default:
          return [
            {
              prop: 'payeeIdentifyMethod',
              title: self.$t('PAYMENT.PAYEE_IDENTIFY_WAY'),
              content: self.identifyWayList.find(
                item => item.value === payeeIdentifyMethod
              )
                ? self.identifyWayList.find(
                    item => item.value === payeeIdentifyMethod
                  ).label
                : ''
            }
          ];
      }
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
    'formData.payeeBankCode'(newVal) {
      this.setPayeeBank(newVal);
      if (this.formData.payeeIdentifyMethod !== 'BBAN') {
        if (newVal === '1') {
          this.$set(this.formData, 'payeeBankCode', '041');
          this.$set(
            this.formData,
            'payeeBank',
            this.$t('PAYMENT.CHUANGXING_BANK')
          );
        }
      }
    },
    'formData.selectBankType'(newVal) {
      if (
        this.formData.payeeIdentifyMethod === 'EMAL' ||
        this.formData.payeeIdentifyMethod === 'MOBN'
      ) {
        if (newVal === 'PRE') {
          this.$set(this.formData, 'payeeBankCode', '');
          this.$set(this.formData, 'payeeBank', '');
        } else if (newVal === 'DEF') {
          this.$set(this.formData, 'payeeBankCode', '041');
          this.$set(
            this.formData,
            'payeeBank',
            this.$t('PAYMENT.CHUANGXING_BANK')
          );
        }
      }

      setTimeout(() => {
        this.$refs['submitForm'].clearValidate();
      }, 0);
    },
    activeIndex() {
      this.scrollToTop();
    }
  },
  created() {
    this.init();
  },
  methods: {
    scrollToTop,
    // 初始化
    init() {
      if (this.isUpdate) {
        const formData = { ...this.formData };
        for (let k in this.formData) {
          const value =
            this.changeData && this.changeData.hasOwnProperty(k)
              ? this.changeData[k]
              : formData[k];
          this.$set(this.formData, k, value);
        }
        this.initPhoneNo(this.changeData);
        this.initBankInfo(this.changeData);
        this.queryFpsInfo('0');
        this.$set(this.formData, 'registerCode', this.changeData.registerCode);
        setTimeout(() => {
          this.$set(
            this.formData,
            'payeeBankCode',
            this.changeData.payeeBankCode
          );

          if (
            [
              IDENTIFY_WAY_MAP.mobilePhone,
              IDENTIFY_WAY_MAP.emailAddress
            ].includes(this.formData.selectBankType)
          ) {
            this.isShowAcctInfos = true;
          }
        }, 0);
      }
    },
    initPhoneNo({ mobilePhone = '' }) {
      const [areaNo = '', phoneNo = ''] = (mobilePhone || '').split('-');
      this.$set(this.formData, 'areaNo', areaNo);
      this.$set(this.formData, 'phoneNo', phoneNo);
    },
    initBankInfo({ payeeBankCode }) {
      if (!payeeBankCode) {
        this.$set(this.formData, 'selectBankType', SELECT_BANK_TYPES.PRE);
        return;
      }
      if (payeeBankCode === '041') {
        this.$set(this.formData, 'selectBankType', SELECT_BANK_TYPES.DEF);
      } else {
        this.$set(this.formData, 'selectBankType', SELECT_BANK_TYPES.OPT);
      }
    },
    setPayeeBank(value) {
      const tarItem = this.filterTransBank.find(item => item.value === value);
      if (tarItem) {
        this.$set(this.formData, 'payeeBank', tarItem.bankName || '');
      } else {
        this.$set(this.formData, 'payeeBank', '');
      }
    },
    onMethodChange() {
      if (['EMAIL', 'MOBN'].includes(this.payeeIdentifyMethod)) {
        // 电邮地址/流动电话号码
        this.formData.selectBankType = SELECT_BANK_TYPES.PRE;
      }
      this.formData.selectBankType = SELECT_BANK_TYPES.PRE;
      this.$nextTick(() => {
        this.formData.payeeAccount = '';
        this.formData.payeeName = '';
        this.formData.payeeBankCode = '';
        this.formData.payeeBank = '';
        this.formData.emailAddress = '';
        this.formData.fpsId = '';
        this.formData.areaNo = '';
        this.formData.phoneNo = '';
        this.submitForm.clearValidate();
        this.showAcct = false;
        this.ableSubmit =
          this.formData.payeeIdentifyMethod === IDENTIFY_WAY_MAP.payeeAccount;
        this.$forceUpdate();
      });
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
      this.submitForm.validate(async valid => {
        if (valid) {
          await this.queryFpsInfo('1');
          if (!this.ableSubmit) {
            return;
          }
          this.activeIndex = 1;
        }
      });
    },
    // 上一步
    handleLastStep() {
      this.activeIndex = 0;
    },
    // 确定
    async handleConfirm() {
      this.formLoading = true;
      this.confirmSubmit();
    },
    async confirmSubmit() {
      const { submitData, submitFn } = this;
      this.submitFn({ ...submitData, transferWay: INTRA_ACCT_TYPES.FAST }).then(
        ({ body = {}, head = {} }) => {
          const entType = localStorage.getItem('entType');
          const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          const tradeInfo = JSON.stringify({
            ...submitData,
            otpType: this.changeType == 'add' ? '030102011' : '030102012'
          });
          if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '1'
              // status: status
            }).then(() => {
              this.confirmSubmit();
            });
          } else if (entType == '1' && head.returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: this.changeType == 'add' ? '030102011' : '030102012',
              tradeInfo: tradeInfo
            }).then(() => {
              this.confirmSubmit();
            });
          }
          if (body) {
            const { authResultInfo } = body;
            this.authResultState = authResultInfo.authResultState;
            if (['03', '90'].includes(authResultInfo.authResultState)) {
              this.resultStatus = 'success';
              this.sendEmail(this.submitData);
            } else {
              this.resultStatus = 'fail';
            }
            if (this.entType === 1) {
              if (this.resultStatus == 'success') {
                this.resultTitle = this.$t('PAYMENT.SUCCESS_TRADE');
                this.resultMessage =
                  this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
              } else {
                this.resultTitle = this.$t(
                  'INTERESTRATEQUERY.PARTIALLY_FAILED'
                );
                this.resultMessage =
                  this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
              }
              this.activeIndex = 2;
            } else {
              if (this.resultStatus == 'success') {
                this.resultTitle = this.$t('PAYMENT.SUCCESS_TRADE');
                this.resultMessage =
                  this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
                // this.resultConfirm = '请至授权zhogn'xin'
              } else {
                this.resultTitle = this.$t(
                  'INTERESTRATEQUERY.PARTIALLY_FAILED'
                );
                this.resultMessage =
                  this.$t('PAYMENT.WEBBANK_REF_NO') + authResultInfo.flowNo;
              }
              this.activeIndex = 2;
            }
          }
        }
      );

      if (this.$refs['authorizationSelect']) {
        this.$refs['authorizationSelect'].reset();
      }
      this.formLoading = false;
    },
    getResultStatus(result) {
      if (result) {
        const { authResultInfo } = result;
        if (Object.getOwnPropertyNames(authResultInfo).length) {
          return true;
        }
      }
      return false;
    },
    // 返回列表
    handleBack() {
      this.$emit('returnBack');
    },
    // 获取授权信息
    getAuthInfo(val) {
      this.$set(this.formData, 'authInfo', val);
    },
    // fps查询服务
    async queryFpsInfo(val) {
      const params = {
        proxyId: getValueByPayeeIdentifyMethod(this.formData),
        proxyIdTp: this.formData.payeeIdentifyMethod
      };
      if ([IDENTIFY_WAY_MAP.payeeAccount].includes(params.proxyIdTp)) {
        this.ableSubmit = true;
        return;
      }
      const result = await findFpsAcctInfo(params);
      if (result) {
        if (val === '1') {
          return;
        } else {
          if (this.formData.payeeIdentifyMethod === 'SVID') {
            this.filterTransBank.map(item => {
              if (item.clearingCode === result.mmbId) {
                this.formData.payeeBank = item.chtName;
                this.formData.payeeBankCode = item.clearingCode;
              }
            });
          }
          this.formData.selectBankType = 'PRE';
          this.formData.payeeName = result.dispNm;
        }

        this.ableSubmit = true;
      } else {
        this.ableSubmit = false;
      }
      function getValueByPayeeIdentifyMethod(origin) {
        const { payeeIdentifyMethod } = origin;
        switch (payeeIdentifyMethod) {
          case IDENTIFY_WAY_MAP.payeeAccount:
            return origin.payeeAccount;
          case IDENTIFY_WAY_MAP.mobilePhone:
            return `${origin.areaNo}-${origin.phoneNo}`;
          case IDENTIFY_WAY_MAP.emailAddress:
            return origin.emailAddress;
          case IDENTIFY_WAY_MAP.fpsId:
            return origin.fpsId;
          default:
            return '';
        }
      }
    },
    // 过滤FPS银行
    filterFpsBank({ payeeBankCode, payeeIdentifyMethod, selectBankType }) {
      console.log(payeeIdentifyMethod, selectBankType, payeeBankCode);
      if (['MOBN', 'EMAL'].includes(payeeIdentifyMethod)) {
        if (selectBankType === 'PRE') {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        }
        if (selectBankType === 'DEF') {
          return this.$t('PAYMENT.CHUANGXING_BANK');
        }
      }
      const curBank = this.bankInfoList.find(
        item => item.value === payeeBankCode
      );
      if (curBank && curBank.bankName) {
        return curBank.bankName;
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.g-fastAddupdate-container {
  .el-form-item {
    width: 650px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
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
  .changeInputStyle {
    /deep/ .el-input {
      width: 105px;
      &:nth-of-type(2) {
        width: 202px;
      }
    }
  }
  .phone-input {
    width: 120px;
  }
  .flex-cloum {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .el-radio {
      padding-top: 13px;
      margin-bottom: 9px;
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
