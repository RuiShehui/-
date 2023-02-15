<template>
  <div class="g-form">
    <el-form
      :model="userInfo"
      label-position="right"
      label-width="150px"
      ref="userInfo"
      :rules="userRules"
      label-suffix=":"
    >
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')" prop="userType">
        <el-radio-group v-model="userInfo.userType" @change="changeUserType">
          <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.ADMAIN')}}</el-radio>
          <el-radio label="2">{{$t('CUSTOMER_MANAGEMENT.AUTH_USER')}}</el-radio>
          <el-radio label="3">{{$t('CUSTOMER_MANAGEMENT.INPUT_USER')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="showLoginName"
        :label="$t('CUSTOMER_MANAGEMENT.USER_CODE')"
        prop="loginName"
      >
        <el-input
          maxlength="24"
          disabled
          v-model="userInfo.userCode"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item v-else></el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')" prop="userChsName">
        <el-input
          v-model.trim="userInfo.userChsName"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')" prop="userEglsName">
        <el-input
          v-model="userInfo.userEglsName"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')" prop="cardType">
        <el-select
          class="f-w-340"
          v-model="userInfo.cardType"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option
            v-for="(item,index) in cardTypeList"
            :label="item.fiedlDescrible"
            :key="index"
            :value="item.fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"
        :rules="userInfo.cardType!=='HKID'?userRules.cardNo:hkdId"
        prop="cardNo"
      >
        <el-input
          v-model="userInfo.cardNo"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')" prop="cardArea">
        <el-select
          class="f-w-340"
          v-model="userInfo.cardArea"
          filterable
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option
            v-for="(item,index) in cardAreaList"
            :label="item.fiedlDescrible"
            :key="index"
            :value="item.fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.BIRTHDAY')" prop="birthday">
        <el-date-picker
          class="f-w-340"
          v-model="userInfo.birthday"
          type="date"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')" prop="status">
        <el-radio label="1" v-model="userInfo.status">{{$t('CUSTOMER_MANAGEMENT.ENABLE')}}</el-radio>
        <el-radio label="0" v-model="userInfo.status">{{$t('CUSTOMER_MANAGEMENT.DISABLE')}}</el-radio>
      </el-form-item>
      <el-form-item
        v-if="userInfo.status==='0'"
        :label="$t('CUSTOMER_MANAGEMENT.USER_STOP_REASON')"
        prop="revokeReason"
      >
        <el-input
          v-model.trim="userInfo.revokeReason"
          class="f-w-340"
          maxlength="140"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item
        v-if="userInfo.userType!=='2'"
        :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
        prop="empowerGroup"
        :rules="[]"
      >
        <el-select
          v-model="userInfo.empowerGroup"
          :disabled="userInfo.userType==='3'"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.NONE')" value="0"></el-option>
        </el-select>
        <div
          v-if="userInfo.userType==='1'"
          class="son"
        >{{$t('CUSTOMER_MANAGEMENT.ADMAIN_AND_AUTH')}}</div>
      </el-form-item>
      <el-form-item
        v-if="userInfo.userType==='2'"
        :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
        prop="empowerGroup"
      >
        <el-select
          v-model="userInfo.empowerGroup"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')" prop="tfaStatus">
        <el-select
          class="f-w-340"
          v-model="userInfo.tfaStatus"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option :label="$t('CUSTOMER_MANAGEMENT.YES')" value="1"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.NO')" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')" class="g-formitems">
        <el-form-item prop="userPhoneCountry">
          <money-input
            v-model="userInfo.userPhoneCountry"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhoneArea">
          <money-input
            v-model="userInfo.userPhoneArea"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhonePhone">
          <money-input
            v-model="userInfo.userPhonePhone"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2'" class="g-formitems">
        <el-form-item prop="userPhoneCountry2">
          <money-input
            v-model="userInfo.userPhoneCountry2"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhoneArea2">
          <money-input
            v-model="userInfo.userPhoneArea2"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhonePhone2">
          <money-input
            v-model="userInfo.userPhonePhone2"
            :is-all-num="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')" prop="email">
        <el-input
          v-model="userInfo.email"
          maxlength="34"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')"
        required
        class="g-formitems"
        style="box-sizing:border-box;height:40px"
      >
        <el-form-item prop="mobilePhoneCountry">
          <money-input
            v-model="userInfo.mobilePhoneCountry"
            :is-all-num="true"
            class="f-w-160"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="mobilePhonePhone">
          <money-input
            v-model="userInfo.mobilePhonePhone"
            :is-all-num="true"
            class="f-w-160"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            maxlength="11"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')" prop="mailAddress">
        <el-input
          v-model="userInfo.mailAddress"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item v-if="entType === '2'" label="單一批核者特權" prop="cuSoleAuthorizerInd">
        <el-radio-group v-model="userInfo.cuSoleAuthorizerInd" @change="changeApproval">
          <el-radio label="1">開</el-radio>
          <el-radio label="0">關</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div v-if="userInfo.cuSoleAuthorizerInd === '1'">
      <div>
        <span class="privilegedAccount">特權賬戶</span>
      </div>
      <div style="display: flex">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
      <div style="display: flex">
        <el-table :data="userAccountLimits" border stripe style="width: 85%; margin-left: 110px">
          <el-table-column align="center" label="特權賬戶" prop="accName" min-width="45%">
            <template slot-scope="scope">
              <el-select
                style="width: 80%"
                v-model="scope.row.accountNo"
                :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
              >
                <el-option
                  v-for="(item,index) in accountList"
                  :label="item.label"
                  :key="index"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="單一批核限額" min-width="45%">
            <template slot-scope="scope">
              <span>HKD</span>
              <el-input
                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
                style="width: 80%"
                :maxlength="17"
                v-model="scope.row.limitDaily"
                @blur="changeBlur(scope.row)"
                @focus="changeFocus(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="10%">
            <template slot-scope="scope">
              <span @click="delApproval(scope.row, scope.$index)">刪除</span>
            </template>
          </el-table-column>
        </el-table>
        <span
          v-if="userAccountLimits.length === 0"
          style="height: 25px; padding: 10px 32px; border: solid 1px #f06b00;color: #f06b00;"
          @click="addApproval"
        >添加</span>
        <div
          v-if="userAccountLimits.length > 0"
          style="margin-left: 24px; margin-right: 10%; margin-top: 25px;border-radius: 5px;"
        >
          <div v-for="(item, index) in userAccountLimits" :key="index">
            <div style="margin-top: 45px">
              <span style="color: transparent">添加</span>
              <span
                style="padding: 10px 32px; border: solid 1px #f06b00;color: #f06b00;"
                v-show="index === (userAccountLimits.length - 1)"
                @click="addApproval"
              >添加</span>
            </div>
          </div>
        </div>
        <!-- <span
          v-if="userAccountLimits.length === 0"
          style="margin-left: 24px; margin-right: 10%"
          @click="addApproval"
        >添加</span>-->
      </div>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button
        class="f-reset"
        @click="handleReset('userInfo')"
      >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
    </div>
  </div>
</template>

<script>
// import { setValidateForm } from '@/utils/tools';

import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import { getPaymentCommAccountList } from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant';
import tool from '@/utils/moneyTools.js';
export default {
  name: 'UserMaintainOperate',
  props: {
    showLoginName: {
      type: Boolean,
      default: false
    }, // 是否修改
    userCode: {
      type: String,
      default: ''
    }, // 查询条件

    //客户号
    ebankCstmNo: {
      type: String,
      default: ''
    },
    //判断客户号类型——sa/mam
    entType: {
      type: String,
      default: ''
    },
    userInfoProp: {
      type: Object,
      default() {
        return {};
      }
    } //传入数据
  },
  watch: {},
  data() {
    return {
      userAccountLimits: [],
      accountList: [],
      option: 'option',
      userInfo: {
        userPhoneCountry: '',
        userPhoneArea: '',
        userPhonePhone: '',
        userPhoneCountry2: '',
        userPhoneArea2: '',
        userPhonePhone2: '',
        mobilePhoneCountry: '',
        mobilePhonePhone: '',
        cuSoleAuthorizerInd: '0'
      },
      cardTypeList: [],
      cardAreaList: [],
      userRules: {
        userType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.USER_TYPE_RULES'),
            trigger: 'blur'
          }
        ],
        cuSoleAuthorizerInd: [
          {
            required: true,
            // message: this.$t('CUSTOMER_MANAGEMENT.USER_TYPE_RULES'),
            trigger: 'blur'
          }
        ],
        // loginName: [
        //   {
        //     required: true,
        //     message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
        //       msg: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')
        //     }),
        //     trigger: 'blur'
        //   },
        //   {
        //     pattern: /^(\d|\w){3,24}$/,
        //     message: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME_RULES'),
        //     trigger: 'blur'
        //   }
        // ],
        cardType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_TYPE')
            }),
            trigger: 'change'
          }
        ],
        cardNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_NO')
            }),
            trigger: 'blur'
          }
        ],
        cardArea: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.CARD_AREA')
            }),
            trigger: 'change'
          }
        ],
        userEglsName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')
            }),
            trigger: 'blur'
          }
        ],
        empowerGroup: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')
            }),
            trigger: 'change'
          }
        ],
        revokeReason: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.USER_STOP_REASON')
            }),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.USER_STATUS')
            }),
            trigger: 'blur'
          }
        ],
        tfaStatus: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.TFA_STATUS')
            }),
            trigger: 'change'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')
            }),
            trigger: 'blur'
          },
          {
            min: 6,
            max: 34,
            message: this.$t('CUSTOMER_MANAGEMENT.EMAIL_ADRESS_LENGTH'),
            trigger: 'blur'
          },
          {
            pattern: /^(\w|\d|\_|\-|\.)+\@(\w|\d|\_|\-|\.)+$/,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_TRUE_EMAIL'),
            trigger: 'blur'
          }
        ],
        mobilePhoneCountry: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')
            }),
            trigger: 'blur'
          }
        ],
        mobilePhonePhone: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.PHONE_NO')
            }),
            trigger: 'blur'
          }
        ],
        mailAddress: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')
            }),
            trigger: 'blur'
          }
        ]
      }, // 验证规则
      hkdId: [
        {
          required: true,
          pattern: /^(\w|\d){8,9}$/,
          message: '請輸入正確格式的香港身份證',
          trigger: 'blur'
        }
      ]
    };
  },
  mounted() {
    if (this.entType === '2' && !this.userInfo.cuSoleAuthorizerInd) {
      this.userInfo.cuSoleAuthorizerInd = '2';
    }
    if (this.entType === '1') {
      this.userInfo.cuSoleAuthorizerInd = '2';
    }
    this.accountList = [];
    getPaymentCommAccountList({
      ebankCustNo: this.ebankCstmNo
    }).then(resp => {
      console.log('resp', resp);
      if (resp.body) {
        if (resp.body.accList.length > 0) {
          resp.body.accList.forEach(item => {
            let accTypeName = '';
            let currencyName = '';
            if (item.accType) {
              accTypeName = CONSTANTS.accountTypes[item.accType];
            }
            if (item.currency) {
              currencyName = item.currency;
            }
            item.label = item.accNo + ' ' + currencyName + ' ' + accTypeName;
            item.value = item.accNo;
            this.accountList.push(item);
          });
        } else {
          this.accountList = [];
        }
      }
    });
  },
  methods: {
    init() {
      console.log(this.userInfoProp, 'userInfoProp');
      console.log('userInfoPropssssss', this.userInfoProp.operator);

      this.getListCardType();
      this.getListCardArea();
      if (this.userInfoProp.operator) {
        this.userInfo = { ...this.userInfoProp.operator };
      } else {
        this.userInfo = { ...this.userInfo, ...this.userInfoProp };
        if (this.userInfo.userAccountLimits) {
          this.userAccountLimits = [...this.userInfo.userAccountLimits];
          // this.userAccountLimits.forEach(item => {
          //   item.limitDaily = tool.currencyFormat(item.limitDaily, '', 2);
          // });
        }

        if (this.userInfo.mobilePhone) {
          const mobilePhoneArray = this.userInfo.mobilePhone.split('-');
          this.$set(this.userInfo, 'mobilePhoneCountry', mobilePhoneArray[0]);
          this.$set(this.userInfo, 'mobilePhonePhone', mobilePhoneArray[1]);
        }
        if (this.userInfo.userPhone) {
          const userPhoneArray = this.userInfo.userPhone.split('-');
          if (userPhoneArray.length === 2) {
            this.$set(this.userInfo, 'userPhoneCountry', userPhoneArray[0]);
            this.$set(this.userInfo, 'userPhonePhone', userPhoneArray[1]);
          } else if (userPhoneArray.length === 1) {
            this.$set(this.userInfo, 'userPhonePhone', userPhoneArray[0]);
          } else {
            this.$set(this.userInfo, 'userPhoneCountry', userPhoneArray[0]);
            this.$set(this.userInfo, 'userPhoneArea', userPhoneArray[1]);
            this.$set(this.userInfo, 'userPhonePhone', userPhoneArray[2]);
          }
        }
        if (this.userInfo.contactsPhone) {
          const contactsPhoneArray = this.userInfo.contactsPhone.split('-');
          if (contactsPhoneArray.length === 2) {
            this.$set(
              this.userInfo,
              'userPhoneCountry2',
              contactsPhoneArray[0]
            );
            this.$set(this.userInfo, 'userPhonePhone2', contactsPhoneArray[1]);
          } else if (contactsPhoneArray.length === 1) {
            this.$set(this.userInfo, 'userPhonePhone2', contactsPhoneArray[0]);
          } else {
            this.$set(
              this.userInfo,
              'userPhoneCountry2',
              contactsPhoneArray[0]
            );
            this.$set(this.userInfo, 'userPhoneArea2', contactsPhoneArray[1]);
            this.$set(this.userInfo, 'userPhonePhone2', contactsPhoneArray[2]);
          }
        }
      }
    },
    handleReset(formName) {
      // const submitForm = this.$refs[formName];
      this.$refs[formName].resetFields();
      // this.$nextTick(() => {
      //   submitForm.$el && setValidateForm(submitForm.$el, true);
      // });
    },
    changeUserType(val) {
      if (val === '3') {
        this.userInfo.tfaStatus = '0';
        this.userInfo.empowerGroup = '0';
      } else {
        this.userInfo.tfaStatus = '1';
        this.userInfo.empowerGroup = '';
      }
    },
    findValue(key, dataList) {
      const data = dataList.find(item => item.fieldValue === key);
      // console.log(key, dataList, data);
      return data ? data.fiedlDescrible : '';
    },
    //聚焦
    changeFocus(row) {
      if (row.limitDaily) {
        row.limitDaily = tool.delDecollator(row.limitDaily);
      }
    },
    //失焦事件
    changeBlur(row) {
      console.log('e', row);
      row.limitDaily = tool.currencyFormat(row.limitDaily, '', 2);
    },
    submit() {
      if (this.userInfo.cuSoleAuthorizerInd === '1') {
        if (this.userAccountLimits.length === 0) {
          return this.$showMsg({
            type: 'error',
            message: '單一批核者特權未開，特權賬號不能為空'
          });
        } else {
          let flag = false;
          this.userAccountLimits.forEach(item => {
            if (item.accountNo === '' || item.limitDaily === '') {
              flag = true;
            }
          });
          if (flag) {
            return this.$showMsg({
              type: 'error',
              message: '特權賬號有內容未填寫，請先填寫特權賬號內容'
            });
          }
        }
      } else {
        this.userAccountLimits = [];
      }
      if (
        !(
          this.userInfo.userPhoneCountry === '' &&
          this.userInfo.userPhoneArea === '' &&
          this.userInfo.userPhonePhone === ''
        ) &&
        !(
          this.userInfo.userPhoneCountry !== '' &&
          this.userInfo.userPhonePhone !== ''
        )
      ) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
          type: 'error'
        });
        return;
      }
      if (
        !(
          this.userInfo.userPhoneCountry2 === '' &&
          this.userInfo.userPhoneArea2 === '' &&
          this.userInfo.userPhonePhone2 === ''
        ) &&
        !(
          this.userInfo.userPhoneCountry2 !== '' &&
          this.userInfo.userPhonePhone2 !== ''
        )
      ) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
          type: 'error'
        });
        return;
      }
      const submitForm = this.$refs['userInfo'];
      console.log(this.showLoginName, 'showLoginName');
      submitForm.validate(valid => {
        if (valid) {
          if (
            this.userInfo.userPhoneCountry !== '' &&
            this.userInfo.userPhoneArea !== '' &&
            this.userInfo.userPhonePhone !== ''
          ) {
            this.userInfo.userPhone = `${this.userInfo.userPhoneCountry}-${this.userInfo.userPhoneArea}-${this.userInfo.userPhonePhone}`;
          } else if (
            this.userInfo.userPhoneCountry !== '' &&
            this.userInfo.userPhonePhone !== ''
          ) {
            this.userInfo.userPhone = `${this.userInfo.userPhoneCountry}-${this.userInfo.userPhonePhone}`;
          } else {
            this.userInfo.userPhone = '';
          }
          if (
            this.userInfo.userPhoneCountry2 !== '' &&
            this.userInfo.userPhoneArea2 !== '' &&
            this.userInfo.userPhonePhone2 !== ''
          ) {
            this.userInfo.contactsPhone = `${this.userInfo.userPhoneCountry2}-${this.userInfo.userPhoneArea2}-${this.userInfo.userPhonePhone2}`;
          } else if (
            this.userInfo.userPhoneCountry2 !== '' &&
            this.userInfo.userPhonePhone2 !== ''
          ) {
            this.userInfo.contactsPhone = `${this.userInfo.userPhoneCountry2}-${this.userInfo.userPhonePhone2}`;
          } else {
            this.userInfo.contactsPhone = '';
          }
          this.userInfo.mobilePhone = `${this.userInfo.mobilePhoneCountry}-${this.userInfo.mobilePhonePhone}`;
          if (this.userInfo.empowerGroup === '') {
            this.userInfo.empowerGroup = '0';
          }
          this.userInfo.cardTypeLabel = this.findValue(
            this.userInfo.cardType,
            this.cardTypeList
          );
          this.userInfo.cardAreaLabel = this.findValue(
            this.userInfo.cardArea,
            this.cardAreaList
          );
          this.userInfo.userAccountLimits = [...this.userAccountLimits];
          this.userInfo.userAccountLimits.forEach(item => {
            item.limitDaily = tool.delDecollator(item.limitDaily);
          });
          this.userInfo.accountList = this.accountList;

          if (!this.showLoginName) {
            this.userInfo.ebankCstmNo = this.ebankCstmNo;
          }
          if (this.entType === '1') {
            this.userInfo.showLoginName = this.showLoginName;
            this.$emit('handleConfirm', this.userInfo);
          } else {
            if (!this.userInfo.hasOwnProperty('menuPermissions')) {
              this.userInfo.menuPermissions = [];
            }
            this.userInfo.showLoginName = this.showLoginName;
            this.$emit('handleShowDetail', this.userInfo);
          }
        }
      });
    },
    back() {
      this.$emit('backIndex');
    },
    async getListCardType() {
      if (sessionStorage.getItem('cardTypeList')) {
        this.cardTypeList = JSON.parse(sessionStorage.getItem('cardTypeList'));
      } else {
        const result = await getListCardType({
          bigGroupCode: 'language',
          fieldName: 'cardTypeInd'
        });
        if (result.body) {
          this.cardTypeList = result.body.cardTypeList;
          sessionStorage.setItem(
            'cardTypeList',
            JSON.stringify(this.cardTypeList)
          );
        }
      }
    },
    async getListCardArea() {
      if (sessionStorage.getItem('cardAreaList')) {
        this.cardAreaList = JSON.parse(sessionStorage.getItem('cardAreaList'));
      } else {
        const result = await getListCardArea({
          bigGroupCode: 'language',
          fieldName: 'cardArea'
        });
        if (result.body) {
          this.cardAreaList = result.body.cardAreaList;
          sessionStorage.setItem(
            'cardAreaList',
            JSON.stringify(this.cardAreaList)
          );
        }
      }
    },
    //单一批核者特权
    changeApproval(e) {
      if (e === 0) {
        this.userAccountLimits = [];
      } else {
        this.userAccountLimits = [
          {
            accountNo: '',
            limitDaily: ''
          }
        ];
      }
    },
    //添加一个批核账号
    addApproval() {
      if (this.userAccountLimits.length === 0) {
        let obj = {
          accountNo: '',
          limitDaily: ''
        };
        this.userAccountLimits.push(obj);
      } else {
        if (
          this.userAccountLimits[this.userAccountLimits.length - 1].accountNo &&
          this.userAccountLimits[this.userAccountLimits.length - 1].limitDaily
        ) {
          let obj = {
            accountNo: '',
            limitDaily: ''
          };
          this.userAccountLimits.push(obj);
        } else {
          return this.$showMsg({
            type: 'error',
            message: '特權賬號有內容未填寫，請先填寫特權賬號內容'
          });
        }
      }
    },
    //删除一个批核账号
    delApproval(row, index) {
      this.userAccountLimits.splice(index, 1);
    }
  },
  async created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.f-w-340 {
  width: 340px;
}
.f-w-100 {
  width: 100px;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    margin-left: 10px;
  }
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
  .f-reset {
    color: rgba(0, 0, 0, 0.45);
    border-color: rgba(0, 0, 0, 0.45);
  }
}
.g-form {
  ::v-deep .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
  }
}
.g-formitems {
  ::v-deep .el-form-item__content {
    display: flex;
    .el-form-item {
      width: auto;
      display: inline-block;
    }
  }
}
.num-span {
  width: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-form-item__label {
  padding-right: 8px;
}
.f-w-160 {
  width: 160px;
}
.son {
  position: absolute;
  top: 30px;
  left: 16px;
  color: #e34141;
}
.privilegedAccount {
  font-size: 18px;
  font-weight: 500;
  margin-left: 25px;
}
.line1 {
  width: 120px;
  border: solid 3px transparent;
  border-bottom-color: #000000;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 10px;
}
.line2 {
  width: 100%;
  border: solid 1px transparent;
  border-bottom-color: #000000;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>