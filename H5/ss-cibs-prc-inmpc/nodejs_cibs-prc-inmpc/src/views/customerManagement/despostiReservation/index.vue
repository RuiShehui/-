<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-11-07 16:22:01
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\despostiReservation\index.vue
-->
<template>
  <div class="contain">
    <customer-query v-if="stepIdx === 0" @showIndex="changeStepIdx" />
    <el-tabs v-if="stepIdx === 1" v-model="activeTab" class="g-mb-120">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.DESPOSIT_RESERVATION_CREATOR')" name="creator">
        <el-form
          ref="submitForm"
          class="g-submit-form"
          :model="submitData"
          :rules="submitDataRules"
          label-width="calc(50% - 170px)"
        >
          <el-form-item
            class="g-submit-item"
            :label="`${$t('CUSTOMER_MANAGEMENT.ENT_NAME')}:`"
            prop="entName"
          >
            <el-input class="g-w-340" v-model="submitData.entName" :disabled="true" />
          </el-form-item>
          <el-form-item
            class="g-submit-item"
            :label="`${$t('CUSTOMER_MANAGEMENT.AMOUNT')}:`"
            prop="amount"
          >
            <el-form-item :style="{ display: 'inline-block' }" prop="contactType">
              <el-select
                v-model="submitData.contactType"
                class="g-w-100"
                @change="onChangeContactType"
              >
                <el-option
                  v-for="item in contactTypeList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <money-input
              class="g-small-input"
              v-model="submitData.amount"
              :is-full-number="submitData.contactType === 'JPY'"
              :is-save-dot="submitData.contactType !== 'JPY'"
              :placeholder="$t('COMMON.PLEASE_INPUT')"
              @changeBlur="changeBlur"
            />
          </el-form-item>
          <el-radio-group
            class="g-radio-group"
            v-model="submitData.fixedFlag"
            @change="handleChangeRadio"
          >
            <el-form-item class="g-submit-item" prop="fixedDateType">
              <template slot="label">
                <el-radio label="Y">{{ $t('CUSTOMER_MANAGEMENT.FIXED_DATE') }}:</el-radio>
              </template>
              <el-select v-show="dateIsAble" v-model="submitData.fixedDateType" class="g-w-340">
                <el-option
                  v-for="item in selectDateList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                />
              </el-select>
              <el-select v-show="!dateIsAble" :disabled="!dateIsAble" value=" " class="g-w-340">
                <el-option
                  v-for="item in selectDateList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="dateIsAble"
              :label="`${$t('CUSTOMER_MANAGEMENT.RATE')}:`"
              prop="rate"
            >
              <money-input
                v-show="dateIsAble"
                class="g-w-340"
                v-model="submitData.rate"
                :is-save-dot="true"
                :placeholder="$t('COMMON.PLEASE_INPUT', { label: $t('CUSTOMER_MANAGEMENT.RATE') })"
              />
              <el-input
                v-show="!dateIsAble"
                class="g-w-340"
                :disabled="true"
                :placeholder="$t('COMMON.PLEASE_INPUT', { label: $t('CUSTOMER_MANAGEMENT.RATE') })"
              />
              <span>%</span>
            </el-form-item>
            <!-- <el-form-item class="g-submit-item" prop="timespan">
              <template slot="label">
                <el-radio label="N">{{ $t('CUSTOMER_MANAGEMENT.TIMESPAN') }}:</el-radio>
              </template>
          
              <el-date-picker
                class="g-form-picker"
                v-show="!dateIsAble"
                value-format="yyyy-MM-dd"
                v-model="submitData.timespan[0]"
                type="date"
                :picker-options="dateOptions"
                :range-separator="$t('COMMON.DATESPAN_TO')"
                :start-placeholde="$t('COMMON.START_TIME')"
                :end-placeholde="$t('COMMON.END_TIME')"
              />
              <el-date-picker
                class="g-form-picker"
                v-show="dateIsAble"
                :disabled="dateIsAble"
                type="date"
                :picker-options="dateOptions"
                :range-separator="$t('COMMON.DATESPAN_TO')"
                :start-placeholde="$t('COMMON.START_TIME')"
                :end-placeholde="$t('COMMON.END_TIME')"
                @change="(val) => (!val && (submitData.timespan = ['', '']))"
              />
            </el-form-item>
            <el-form-item
              v-show="!dateIsAble"
              prop="rate"
              :label="`${$t('CUSTOMER_MANAGEMENT.RATE')}:`"
            >
              <money-input
                class="g-w-340"
                v-show="!dateIsAble"
                v-model="submitData.rate"
                :is-save-dot="true"
                :placeholder="$t('COMMON.PLEASE_INPUT', { label: $t('CUSTOMER_MANAGEMENT.RATE') })"
                :disabled="dateIsAble"
              />
              <el-input
                class="g-w-340"
                v-show="dateIsAble"
                value
                :placeholder="$t('COMMON.PLEASE_INPUT', { label: $t('CUSTOMER_MANAGEMENT.RATE') })"
                :disabled="dateIsAble"
              />
              <span>%</span>
            </el-form-item> -->
          </el-radio-group>
          <!-- <el-form-item ></el-form-item> -->
          <el-form-item
            class="g-submit-item"
            :label="`${$t('CUSTOMER_MANAGEMENT.RECEIVING_RESERVATION_NUMBER_EMAIL')}:`"
            prop="email"
          >
            <div class="g-email-item-wrapper" v-for="(itm, idx) of submitData.email" :key="idx">
              <el-input
                class="g-w-340"
                :placeholder="$t('COMMON.PLEASE_INPUT')"
                v-model="submitData.email[idx]"
                maxlength="300"
              />
              <el-button
                class="g-ml-20"
                type="primary"
                :disabled="submitData.email.length >= 5"
                @click.native="submitData.email.push('')"
              >{{ $t('COMMON.ADD') }}</el-button>
              <el-button
                v-show="idx > 0"
                :disabled="submitData.email.length <= 1"
                type="error"
                @click.native="submitData.email.splice(idx, 1)"
              >{{ $t('COMMON.DELETE') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="g-bottom">
          <el-button class="f-cancel" @click="handleBack">{{$t('COMMON.BACK')}}</el-button>
          <el-button
            class="f-cancel"
            @click.native="handleReset"
          >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
          <el-button type="primary" @click="handleConfirm">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.DESPOSIT_RESERVATION_QUERY')" name="list">
        <display-list />
      </el-tab-pane>
    </el-tabs>
    <!-- (idx) => stepIdx = idx -->
    <confirm-page
      v-if="stepIdx === 2"
      :submitData="filterSubmitData"
      @handleBackTo="handleBack()"
    />
    <article v-if="stepIdx > 0" class="article">
      <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
      <br />
      <p>{{$t('CUSTOMER_MANAGEMENT.RESERVATION_CODE_TIP_1')}}</p>
      <p>{{$t('CUSTOMER_MANAGEMENT.RESERVATION_CODE_TIP_2')}}</p>
      <p>{{$t('CUSTOMER_MANAGEMENT.RESERVATION_CODE_TIP_3')}}</p>
    </article>
  </div>
</template>

<script>
import DisplayList from './display-list.vue';
import ConfirmPage from './confirm.vue';

import { transToHighCamel, isType } from '@/utils/tools';
import { validateEmail } from '@/utils/regExpTools';
import { queryMerchantDetail } from '@/api/customer-management/customer';
// import { saveNumber } from '@/api/customer-management/desposit-reservation';
import constant from '@/utils/constant';
import mapValidator from '@/utils/stategies';
import dateTools from '@/utils/dateTools';
import { createNamespacedHelpers } from 'vuex';
import {
  setSubmitData
  // getSubmitData
} from './utils/tools';
// import mathTools from '@/utils/mathTools.js';
const { CONTACT_TYPE_LIST, SELECT_DATE_LIST } = constant;
const {
  formatDate
  // dateStrToNum
} = dateTools;
const { mapMutations } = createNamespacedHelpers('tabs');

export default {
  name: 'DespositReservation',
  components: {
    DisplayList,
    ConfirmPage
  },
  data() {
    return {
      submitData: {
        ebankCstmNo: '',
        entName: '', // 客户名称
        contactType: 'HKD', // 存额类型
        amount: '', // 存款额
        fixedFlag: 'Y', // 固定存期类型: "Y" | "N"
        fixedDateType: '', // 固定存款期
        rate: '', // 利率
        email: [''], // 邮箱
        timespan: ['', ''] // 自定义存期
      },
      detailItem: {},
      contactTypeList: CONTACT_TYPE_LIST,
      activeTab: 'creator',
      stepIdx: 0
    };
  },
  computed: {
    dateIsAble() {
      const { fixedFlag } = this.submitData;
      if (fixedFlag === 'Y') {
        return true;
      }
      return false;
    },
    submitDataRules() {
      const { STR_NOT_EMPTY } = mapValidator(this);
      const { fixedFlag } = this.submitData;
      const rules = {
        entName: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('entName')}`)
        ),
        rate: STR_NOT_EMPTY(
          this.$t(`CUSTOMER_MANAGEMENT.${transToHighCamel('rate')}`),
          'change'
        ),
        email: {
          validator: (r, val, cb) => {
            if (!isType(val, 'Array')) {
              cb(new Error(this.$t('COMMON.EMAIL_CONTENT_INVALID')));
            } else {
              // 非必填
              if (val.length === 1 && val[0] === '') {
                cb();
                return;
              }
              // const recordList = [];
              const isEmpty = val.some(v => !v || !v.length),
                isValid = val.some(v => !validateEmail(v)),
                isRepeat = ((list = []) => {
                  const records = [];
                  for (let item of list) {
                    if (!records.includes(item)) {
                      records.push(item);
                    } else {
                      return true;
                    }
                  }
                  return false;
                })(val);
              if (isEmpty) {
                cb(new Error(this.$t('COMMON.EMAIL_NOT_ALLOW_EMPTY')));
                return;
              }
              if (isRepeat) {
                cb(new Error(this.$t('COMMON.EMAIL_NOT_ALLOW_REPEAT')));
                return;
              }
              if (isValid) {
                cb(new Error(this.$t('COMMON.EMAIL_FORMAT_INVALID')));
                return;
              }
            }
            cb();
          }
        },
        amount: [
          {
            required: true,
            validator: (r, val, cb) => {
              const {contactType}=this.submitData
              const tips=this.$t('COMMON.DEPOSIT_AMOUNT_CANNOT_MIN')
              if(contactType === 'HKD' || contactType === 'CNY') {
                val<5000?cb(tips):''
              }else if( contactType === 'JPY'){
                val<100000?cb(tips):''
              }else{
                val<1000?cb(tips):''
              }
              // const valNum = Number(val || 0);
              // if (valNum < 1) {
              //   cb(
              //     new Error(this.$t('CUSTOMER_MANAGEMENT.MONEY_GREATER_THAN'))
              //   );
              // }
              cb();
            }
          },
          STR_NOT_EMPTY(this.$t('CUSTOMER_MANAGEMENT.AMOUNT'))
        ]
      };

      if (fixedFlag === 'Y') {
        rules.fixedDateType = STR_NOT_EMPTY(
          // this.$t(`CLIENT_MANAGE.${transToHighCamel('fixedDateType')}`)
          this.$t(`CUSTOMER_MANAGEMENT.FIXED_DATE`),
          'change'
        );
      } else {
        rules.timespan = {
          required: true,
          /** 只判断结束时间 */
          validator: (r, val, cb) => {
            console.log('val', val);
            if (!val || !val.length || !val[0]) {
              cb(
                new Error(
                  `${this.$t('CUSTOMER_MANAGEMENT.SELECT')}"${this.$t(
                    'CUSTOMER_MANAGEMENT.CUSTOM_SHELF_LIFE'
                  )}"`
                )
              );
              return;
            }
            cb();
          }
          /** 判断时间范围 */
          // validator: (r, val, cb) => {
          //   if (!val) {
          //     cb(new Error(`${this.$t('COMMON.PLEASE_SELECT')}"${this.$t('COMMON.END_TIME')}"`));
          //     return;
          //   } else {
          //     const [time1, time2] = val;
          //     if (!time1 || !time2) {
          //       cb(new Error(`${this.$t('COMMON.PLEASE_SELECT')}"${this.$t('COMMON.END_TIME')}"`));
          //       return;
          //     }
          //   }
          //   cb();
          // }
        };
      }

      return rules;
    },
    submitForm() {
      const { submitForm } = this.$refs;
      return submitForm || null;
    },
    filterSubmitData() {
      // this.submitData.rate = mathTools.roundStr(this.submitData.rate);
      const {
        entName,
        contactType,
        amount,
        fixedFlag,
        fixedDateType,
        rate,
        email,
        cardList,
        timespan,
        ...subProps
      } = this.submitData;
      if (this.dateIsAble) {
        return {
          ...subProps,
          entName,
          contactType,
          amount,
          fixedFlag,
          fixedDateType,
          rate,
          email: email.join(','),
          cardList
        };
      } else {
        const [time1, time2] = timespan; // formatDate
        return {
          ...subProps,
          entName,
          contactType,
          amount,
          fixedFlag,
          startDate: isType(time1, 'String') ? time1 : formatDate(time1),
          // endDate: isType(time2, 'String') ? time2 : formatDate(time2),
          rate,
          email: email.join(','),
          cardList
        };
      }
    },
    selectDateList() {
      if (!['HKD', 'CNY'].includes(this.submitData.contactType)) {
        return SELECT_DATE_LIST.filter(item => item.value !== '24M');
      }
      return SELECT_DATE_LIST;
    },
    dateOptions() {
      console.log('this.submitData.contactType', this.submitData.contactType);
      if (['HKD', 'CNY'].includes(this.submitData.contactType)) {
        return {
          disabledDate(date) {
            const dayTimesteamp = 1000 * 60 * 60 * 24;
            const selectDate = new Date(date),
              currentDate = new Date();

            /**
             * 2 year >= date >= 7
             */
            if (
              selectDate.getTime() >
                currentDate.getTime() + 6 * dayTimesteamp &&
              selectDate.getTime() <=
                currentDate.getTime() + 730 * dayTimesteamp
            ) {
              return false;
            }

            return true;
          }
        };
      }
      return {
        disabledDate(date) {
          const dayTimesteamp = 1000 * 60 * 60 * 24;
          const selectDate = new Date(date),
            currentDate = new Date();

          /**
           * 1 year >= date >= 7
           */
          if (
            selectDate.getTime() > currentDate.getTime() + 6 * dayTimesteamp &&
            selectDate.getTime() <= currentDate.getTime() + 365 * dayTimesteamp
          ) {
            return false;
          }

          return true;
        }
      };
    }
  },
  watch: {
    'submitData.contactType'(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    ...mapMutations(['DELETE_TABS']),
    async initContentData() {
      // const submitData = getSubmitData();
      const ebankCstmNo = this.submitData.ebankCstmNo;
      if (ebankCstmNo.length) {
        // console.log(ebankCstmNo);
        // detailItem
        try {
          const result = await queryMerchantDetail({ ebankCstmNo }),
            { body } = result;
          // const _submitData = deepClone(this.submitData);
          console.log('body', body.cardList);
          for (let k in body) {
            this.$set(this.detailItem, k, body[k]);
          }
          this.$set(this.submitData, 'email', ['']);
          const entName =
            body.entChsName && body.entChsName.length
              ? body.entChsName
              : body.entEglsName;
          this.$set(this.submitData, 'entName', entName);
          // 把body所有的内容存到submitData中
          console.log('this.submitData', this.submitData);
          this.submitData.cardList = body.cardList;
        } catch (err) {
          throw new Error(err);
        }
      }
      // if (Object.getOwnPropertyNames(submitData).length) {
      //   const { startDate = '', endDate = '' } = submitData;
      //   if (Object.keys(submitData).length) {
      //     for (let k in this.submitData) {
      //       this.submitData[k] = submitData[k];
      //     }
      //     this.$set(this.submitData, 'timespan', [startDate, endDate]);
      //   }
      // }
    },
    tips(msg) {
      this.submitData.amount = '';
       return this.$showMsg({
            message: this.$t(msg),
            type: 'error'
          });
    },
    changeBlur(e) {
      const {contactType}=this.submitData
      if(contactType === 'HKD'||contactType === 'CNY'){
        Number(e)<5000? this.tips('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_HKD'):''
      }else if(contactType === 'JPY'){
        Number(e)<100000? this.tips('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_JPY'):''
      }else{
        Number(e)<1000? this.tips('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_OTHER'):''
      }
      
      // if (
      //   contactType === 'HKD' ||
      //   contactType === 'CNY'
      // ) {
      //   if (parseFloat(e) < parseFloat(5000)) {
      //     this.submitData.amount = '';
      //     return this.$showMsg({
      //       message: this.$t('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_HKD'),
      //       type: 'error'
      //     });
      //   }
      // } else if (contactType === 'JPY') {
      //   if (parseFloat(e) < parseFloat(100000)) {
      //     this.submitData.amount = '';
      //     return this.$showMsg({
      //       message: this.$t('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_JPY'),
      //       type: 'error'
      //     });
      //   }
      // } else {
      //   if (parseFloat(e) < parseFloat(1000)) {
      //     this.submitData.amount = '';
      //     return this.$showMsg({
      //       message: this.$t('COMMON.DEPOSIT_AMOUNT_CANNOT_LESS_OTHER'),
      //       type: 'error'
      //     });
      //   }
      // }
    },
    handleChangeRadio() {
      // this.handleReset();
      this.$set(this.submitData, 'rate', '');
      this.$nextTick(() => {
        this.submitForm.clearValidate();
      });
    },
    handleReset() {
      const { entName } = this.submitData;
      this.submitForm.resetFields();
      this.$set(this.submitData, 'entName', entName);
    },
    handleConfirm() {
      console.log('this.submitForm', this.submitData);
      this.submitForm.validate(valid => {
        if (valid) {
          // sub request...
          // setSubmitData({
          //   ...this.detailItem,
          //   ...this.filterSubmitData
          // });
          // this.$router.push({
          //   path: '/customerManagement/despostiReservation/confirm'
          // });
          this.stepIdx = 2;
          setTimeout(() => {
            this.DELETE_TABS('/customerManagement/despostiReservation');
          }, 100);
        } else
          this.$showMsg({
            message: this.$t('COMMON.CHECK_FAIL'),
            type: 'error'
          });
      });
    },
    // 返回
    handleBack() {
      setSubmitData({});
      // if(this.stepIdx===1){
      //   this.$set(this.submitData, 'amount', '');
      //   this.$set(this.submitData, 'fixedFlag', 'Y');
      //   this.$set(this.submitData, 'rate', '');
      //   this.$set(this.submitData, 'fixedDateType', '');
      //   this.$set(this.submitData, 'timespan',['','']);
      // }
      this.$set(this.submitData, 'amount', '');
      this.$set(this.submitData, 'fixedFlag', 'Y');
      this.$set(this.submitData, 'rate', '');
      this.$set(this.submitData, 'fixedDateType', '');
      this.$set(this.submitData, 'timespan',['','']);
      this.stepIdx = 0;
      
      // if(this.stepIdx==1){
      //   this.$set(this.submitData,'')
      // }
    },
    changeStepIdx({ ebankCstmNo }) {
      this.submitData.ebankCstmNo = ebankCstmNo;
      this.stepIdx = 1;
      this.initContentData();
    },
    onChangeContactType() {
      this.submitData.amount = '';
      this.submitData.fixedDateType = '';
      //选择币种，清空日期
      this.submitData.timespan = [];

      this.$nextTick(() => {
        this.submitForm.clearValidate();
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import './styles/index.scss';
</style>
