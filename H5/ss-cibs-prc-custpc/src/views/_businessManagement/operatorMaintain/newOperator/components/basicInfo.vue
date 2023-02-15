<template>
  <div class="u-basicInfo-wapper">
    <el-form ref="basicInfoRef" :model="basicInfoForm" :rules="rules" label-width="auto">
      <el-form-item
        :label="$t('USER_MANAGEMENT.USER_TYPE')"
        prop="userType"
        style="margin-top: 24px"
      >
        <el-radio-group
          v-model="basicInfoForm.userType"
          style="margin-top: 11px"
          @change="handleChange"
        >
          <el-radio style="margin-left: 11px" label="3">{{$t('USER_MANAGEMENT.REPORTER')}}</el-radio>
          </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('USER_MANAGEMENT.USER_CHINESE_NAME')" prop="userChsName">
        <el-input
          maxlength="120"
          v-model="basicInfoForm.userChsName"
          @blur="blurChange"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:$t('USER_MANAGEMENT.USER_CHINESE_NAME')
          })"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ENGLISH_COLON')" prop="userEglsName">
        <el-input
          onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9 ]/g,'')"
          v-model="basicInfoForm.userEglsName"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:$t('USER_MANAGEMENT.USER_ENGLISH_COLON')
          })"
          maxlength="120"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')" prop="cardType">
        <el-select
          v-model="basicInfoForm.cardType"
          filterable
          :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{select:$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')})"
          @change="cardTypeChange"
        >
          <el-option
            v-for="(item,index) in certTypeList"
            :key="index"
            :label="item.certType"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_NUMBER')" prop="cardNoHead">
        <el-row class="u-rowStyle flexsb">
          <el-input
            maxlength="34"
            minlength="1"
            v-model="basicInfoForm.cardNoHead"
            :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:$t('USER_MANAGEMENT.USER_NUMBER')})"
          ></el-input>
          <span style="font-size: 20px" v-if="basicInfoForm.cardType === 'HKID'">（</span>
          <el-form-item prop="cardNoBrack">
            <el-input
              v-if="basicInfoForm.cardType === 'HKID'"
              class="u-input1"
              maxlength="1"
              minlength="1"
              onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9 ]/g,'')"
              v-model="basicInfoForm.cardNoBrack"
              placeholder
            ></el-input>
          </el-form-item>

          <span style="font-size: 20px" v-if="basicInfoForm.cardType === 'HKID'">）</span>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_STATUS')" prop="status" required>
        <el-radio-group v-model="basicInfoForm.status" style="margin-top: 11px">
          <el-radio style="margin-left: 11px" label="1">{{$t('USER_MANAGEMENT.ENABLE')}}</el-radio>
          <el-radio label="0">{{$t('USER_MANAGEMENT.DEACTIVATE')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="basicInfoForm.status === '0'" label prop="revokeReason">
        <el-input type="textarea" v-model="basicInfoForm.revokeReason" style="margin-bottom: 20px" />
      </el-form-item>
      <el-form-item
        v-if="entryClerkFlag"
        :label="$t('USER_MANAGEMENT.AUTHORITH_LEVEL')"
        prop="empowerGroup"
        required
      >
        <el-select
          v-model="basicInfoForm.empowerGroup"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:$t('USER_MANAGEMENT.AUTHORITH_LEVEL')})"
        >
          <el-option value="A" label="A"></el-option>
          <el-option value="B" label="B"></el-option>
          <el-option value="C" label="C"></el-option>
          <el-option value="0" :label="$t('USER_MANAGERMENT.NONE')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.FA')" prop="tfaStatus">
        <el-input v-model="basicInfoForm.tfaStatus" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.ONEC_ATHOR')" prop="cuSoleAuthorizerInd">
        <el-radio-group
          v-model="basicInfoForm.cuSoleAuthorizerInd"
          style="margin-top: 11px"
          disabled
        >
          <el-radio style="margin-left: 11px" label="1">{{$t('USER_MANAGEMENT.OPEN')}}</el-radio>
          <el-radio label="0">{{$t('USER_MANAGEMENT.CLOSE')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ADDRESS')" prop="cardArea">
        <el-select
          v-model="basicInfoForm.cardArea"
          filterable
          :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                  select: $t('USER_MANAGEMENT.USER_ADDRESS')
                })"
          @change="cardAreaChange"
        >
          <el-option
            v-for="(item,index) in cardAreaList"
            :key="index"
            :label="item.fiedlDescrible"
            :value="item.fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.BIRTHDAY')" prop="birthday">
        <el-date-picker
          v-model="basicInfoForm.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                  select: $t('USER_MANAGEMENT.BIRTHDAY')
                })"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_PHONE')">
        <el-row class="u-rowStyle flexsb">
          <el-input
            class="u-input1"
            maxlength="4"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.countryCode"
            :placeholder="$t('USER_MANAGEMENT.COUNTRY_NUMBER')"
          ></el-input>
          <div class="u-line">-</div>
          <el-input
            class="u-input1"
            maxlength="4"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.areaCode"
            :placeholder="$t('USER_MANAGEMENT.LOCAL_NUMBER')"
          ></el-input>
          <div class="u-line">-</div>
          <el-input
            class="u-input2"
            mixlength="8"
            maxlength="11"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.contactPhoneNo"
            :placeholder="$t('USER_MANAGEMENT.CODE')"
          ></el-input>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('USER_MANAGEMENT.USER_PHONE_TWO')">
        <el-row class="u-rowStyle flexsb">
          <el-input
            class="u-input1"
            maxlength="4"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.countryCodeTow"
            :placeholder="$t('USER_MANAGEMENT.COUNTRY_NUMBER')"
          ></el-input>
          <div class="u-line">-</div>
          <el-input
            class="u-input1"
            maxlength="4"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.areaCodeTow"
            :placeholder="$t('USER_MANAGEMENT.LOCAL_NUMBER')"
          ></el-input>
          <div class="u-line">-</div>
          <el-input
            class="u-input2"
            mixlength="8"
            maxlength="11"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            v-model="basicInfoForm.contactPhoneNoTow"
            :placeholder="$t('USER_MANAGEMENT.CODE')"
          ></el-input>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('USER_MANAGEMENT.USER_EMAIL')" prop="email">
        <el-input
          maxlength="34"
          minlength="6"
          v-model="basicInfoForm.email"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_EMAIL')
        })"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.SMS')" prop="countryArea">
        <el-row class="u-rowStyle1 flexsb">
          <el-input
            class="u-input3"
            minlength="2"
            maxlength="4"
            v-model="basicInfoForm.countryArea"
            :placeholder="$t('USER_MANAGEMENT.USER_COUNTRY')"
          ></el-input>
          <div class="u-line">-</div>
          <el-form-item prop="mobileNo">
            <el-input
              class="u-input2"
              mixlength="8"
              maxlength="11"
              v-model="basicInfoForm.mobileNo"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              ref="mobileNo"
              :placeholder="$t('USER_MANAGEMENT.PHONE_NUMBER')"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_SMS_ADDRESS')" prop="mailAddress">
        <el-input
          maxlength="120"
          v-model="basicInfoForm.mailAddress"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_SMS_ADDRESS')
        })"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <div class="u-newBtn">
          <v-button class="mr16" @click="back">{{$t('COMMON.BACK')}}</v-button>
          <v-button :disabled="butFlag" @click="next" type="primary">{{$t('COMMON.NEXT_STEP')}}</v-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { email, telephone } from '@/utils/rules';
import { checkOperatorInfo, getListCardArea } from '@/api/userManagement';
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var checkUsername = (rule, value, callback) => {
      // 请求接口，获取是否存在标识 existingUsername
      if (this.existingUsername) {
        callback(this.$t('USER_MANAGEMENT.ALREADY_USERNAME'));
      } else {
        callback();
      }
    };
    var checkChinaName = (rule, value, callback) => {
      // 请求接口，获取是否存在标识 existingChinaName
      if (this.existingChinaName) {
        callback(this.$t('USER_MANAGEMENT.ALREADY_EXISTINGCHINANAME'));
      } else {
        callback();
      }
    };
    var checkElishName = (rule, value, callback) => {
      // 请求接口，获取是否存在标识 existingChinaName
      if (this.existingElishName) {
        callback(this.$t('USER_MANAGEMENT.ALREADY_EXISTINGELISHNAME'));
      } else {
        callback();
      }
    };

    var checkCertNo = (rule, value, callback) => {
      if (this.basicInfoForm.cardType === 'HKID') {
        if (value.length !== 7) {
          return callback(this.$t('USER_MANAGEMENT.SEVEN_LONG'));
        }
        var reg = /^[a-zA-Z][0-9]{2,7}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(this.$t('USER_MANAGEMENT.TRUE_NUMBER'));
        }
      }
      // 请求接口，获取是否存在标识 existingChinaName
      if (this.existingCertNo) {
        callback(this.$t('USER_MANAGEMENT.ACCOUNTNO_ALREADY'));
      } else {
        callback();
      }
    };

    var checkMobileNo = (rule, value, callback) => {
      let reg = /^\d{2,4}$/;
      if (reg.test(value)) {
        callback();
      } else {
        if (!value) {
          callback(
            this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_COUNTRY')
            })
          );
        }
        if (!reg.test(value)) {
          callback(this.$t('USER_MANAGEMENT.PLEASE_INPUT_COUNTRY'));
        }
      }
    };

    var checkPhone = (rule, value, callback) => {
      if (value.length === 8 || value.length === 11) {
        callback();
      } else {
        return callback(this.$t('USER_MANAGEMENT.PHONE_LONG'));
      }
    };

    var checkEmail = (rules, value, callback) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
      if (regEmail.test(value)) {
        callback();
      } else {
        return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      }
    };

    return {
      entryClerkFlag: false,
      // 表单的数据项
      basicInfoForm: {
        loginName: '', //用户名
        userType: '3', //用户类型
        userChsName: '', //中文名称
        userEglsName: '', //英文名称
        cardType: '', //证明类型
        cardTypeName: '', //证明类型名称
        cardNo: '', //证件号码
        cardNoHead: '', //证件号码
        cardNoBrack: '0', //证件类型为香港才显示
        status: '1', //状态
        revokeReason: '', //停用原因
        tfaStatus: this.$t('AUTHORIZE.NO'), //双重认证
        cuSoleAuthorizerInd: '0', //单一批核者
        cardArea: '', //证件签发地
        birthday: '', //出生日期
        cardAreaName: '', //证件签发地名称
        empowerGroup: '', //授权级别
        countryArea: '', // 国家/地区编号
        mobileNo: '', // 流动号码
        email: '', // 电邮地址
        countryCode: '', // 国家编号
        areaCode: '', // 地区编号
        contactPhoneNo: '', // 号码
        contactsPhone: '', //联络电话2
        countryCodeTow: '', //国家编号2
        areaCodeTow: '', //地区编号2
        contactPhoneNoTow: '', //号码2
        mailAddress: '' // 邮寄地址
      },

      butFlag: false, //控制按钮置灰——是否已点击发送请求

      existingUsername: false, // 是否已存在用户名
      existingChinaName: false, // 是否已存在中文名称
      existingElishName: false, // 是否已存在英文名称
      existingCertNo: false, // 是否已存在证件号码

      // 证件类型列表
      certTypeList: [],
      //证件签证地
      cardAreaList: [],
      rules: {
        userType: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('USER_MANAGEMENT.USER_TYPE_COLON')
            }),
            trigger: 'blur'
          }
        ],
        userChsName: [
          {
            required: false,
            validator: checkChinaName,
            trigger: 'blur'
          }
        ],
        userEglsName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_ENGLISH_COLON')
            }),
            trigger: 'blur'
          },
          {
            validator: checkElishName,
            trigger: 'blur'
          }
        ],
        cardType: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')
            }),
            trigger: 'blur'
          }
        ],
        cardNoHead: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_NUMBER')
            }),
            trigger: 'blur'
          },
          {
            validator: checkCertNo,
            trigger: 'blur'
          }
        ],
        cardNoBrack: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_NUMBER')
            }),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('USER_MANAGEMENT.USER_STATUS')
            }),
            trigger: 'blur'
          }
        ],
        tfaStatus: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('USER_MANAGEMENT.FA')
            }),
            trigger: 'change'
          }
        ],
        cardArea: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_ADDRESS')
            }),
            trigger: 'change'
          }
        ],
        countryArea: [
          {
            type: 'number',
            required: true,
            validator: checkMobileNo,
            trigger: 'blur'
          }
        ],

        mobileNo: [
          {
            type: 'number',
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],

        email: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_SMS_ADDRESS')
            }),
            trigger: 'blur'
          },

          {
            required: true,
            validator: checkEmail,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('USER_MANAGEMENT.USER_SMS_ADDRESS')
            })
          }
        ],
        empowerGroup: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('USER_MANAGEMENT.AUTHORIZATION_LEVEL')
            }),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    console.log('打印this', this.options);
    if (this.options && this.options.tfaStatus) {
      this.basicInfoForm = this.options;
      console.log('basicInfoForm', this.basicInfoForm);
      this.handleChange(this.options.userType);
    }
    //查询签证地，证件类型
    this.queryArea();
  },
  created() {},
  computed: {},
  methods: {
    // 下一步
    next() {
      console.log('basicInfoForm', this.basicInfoForm);
      this.$refs['basicInfoRef'].validate(valid => {
        console.log(valid, 'volid');
        if (valid) {
          if (
            this.basicInfoForm.status === '0' &&
            !this.basicInfoForm.revokeReason
          ) {
            return this.$message({
              type: 'warn',
              message: this.$t('USER_MANAGEMENT.DISORDER_USER'),
            });
          }
          //流动电话
          this.handlePhone();
          //联络电话2
          this.handlePhoneTow();
          if (this.basicInfoForm.countryArea && this.basicInfoForm.mobileNo) {
            this.basicInfoForm.mobilePhone =
              this.basicInfoForm.countryArea +
              '-' +
              this.basicInfoForm.mobileNo;
          }
          if (this.basicInfoForm.cardType === 'HKID') {
            this.basicInfoForm.cardNo =
              this.basicInfoForm.cardNoHead + this.basicInfoForm.cardNoBrack;
          } else {
            this.basicInfoForm.cardNo = this.basicInfoForm.cardNoHead;
          }
          console.log('basicInfoForm', this.basicInfoForm);
          let obj = { ...this.basicInfoForm };
          obj.opeType = 'save';
          obj.tfaStatus = '0';
          this.butFlag = true;
          checkOperatorInfo(obj).then(resp => {
            this.butFlag = false;
            if (resp) {
              return this.$emit('next', this.basicInfoForm);
            }
          });
          return this.$emit('next', this.basicInfoForm);
        } else {
          return false;
        }
      });
    },
    //联络电话
    handlePhone() {
      if (
        this.basicInfoForm.countryCode &&
        this.basicInfoForm.areaCode &&
        this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone =
          this.basicInfoForm.countryCode +
          '-' +
          this.basicInfoForm.areaCode +
          '-' +
          this.basicInfoForm.contactPhoneNo;
      }
      if (
        this.basicInfoForm.countryCode &&
        this.basicInfoForm.areaCode &&
        !this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
      if (
        this.basicInfoForm.countryCode &&
        !this.basicInfoForm.areaCode &&
        this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone =
          this.basicInfoForm.countryCode +
          '-' +
          this.basicInfoForm.contactPhoneNo;
      }
      if (
        !this.basicInfoForm.countryCode &&
        this.basicInfoForm.areaCode &&
        this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
      if (
        this.basicInfoForm.countryCode &&
        !this.basicInfoForm.areaCode &&
        !this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
      if (
        !this.basicInfoForm.countryCode &&
        this.basicInfoForm.areaCode &&
        !this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
      if (
        !this.basicInfoForm.countryCode &&
        !this.basicInfoForm.areaCode &&
        this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
      if (
        !this.basicInfoForm.countryCode &&
        !this.basicInfoForm.areaCode &&
        !this.basicInfoForm.contactPhoneNo
      ) {
        this.basicInfoForm.userPhone = '';
      }
    },
    //联络电话2
    handlePhoneTow() {
      if (
        this.basicInfoForm.countryCodeTow &&
        this.basicInfoForm.areaCodeTow &&
        this.basicInfoForm.contactPhoneNoTow
      ) {
        this.basicInfoForm.contactsPhone =
          this.basicInfoForm.countryCodeTow +
          '-' +
          this.basicInfoForm.areaCodeTow +
          '-' +
          this.basicInfoForm.contactPhoneNoTow;
      } else if (
        this.basicInfoForm.countryCodeTow &&
        !this.basicInfoForm.areaCodeTow &&
        this.basicInfoForm.contactPhoneNoTow
      ) {
        this.basicInfoForm.contactsPhone =
          this.basicInfoForm.countryCodeTow +
          '-' +
          this.basicInfoForm.contactPhoneNoTow;
      } else if (
        !this.basicInfoForm.countryCodeTow &&
        !this.basicInfoForm.areaCodeTow &&
        !this.basicInfoForm.contactPhoneNoTow
      ) {
        this.basicInfoForm.contactsPhone = '';
      } else {
        this.basicInfoForm.contactsPhone = '';
        return this.$message({
          type: 'warn',
          message: this.$t('USER_MANAGEMENT.COUNTRY_CODE'),
          delay: 3000
        });
      }
    },
    handleChange(e) {
      console.log('e', e);
      if (e === '3') {
        this.entryClerkFlag = false;
      } else {
        this.entryClerkFlag = true;
      }
      console.log('entryClerkFlag', this.entryClerkFlag);
    },
    //查询签证地
    queryArea() {
      let lang = 'zh-CN';
      if (localStorage.getItem('lang') == 'zh-CN') {
        lang = 'zh-CN';
      }
      if (localStorage.getItem('lang') == 'zh-HK') {
        lang = 'zh-HK';
      }
      if (localStorage.getItem('lang') == 'en') {
        lang = 'en';
      }

      console.log('lang', lang);
      let params = {
        bigGroupCode: 'language',
        bigGroupName: lang,
        fieldName: 'cardArea'
      };
      let paramsType = {
        bigGroupCode: 'language',
        bigGroupName: lang,
        fieldName: 'cardTypeInd'
      };
      //证件签发地
      getListCardArea(params).then(resp => {
        console.log('resp', resp);
        this.cardAreaList = resp.cardAreaList;
      });
      //证件类型
      getListCardArea(paramsType).then(resp => {
        console.log('respType', resp);
        resp.cardAreaList.forEach(item => {
          this.certTypeList.push({
            certType: item.fiedlDescrible,
            value: item.fieldValue
          });
        });
      });
    },
    //证件类型选择
    cardTypeChange(e) {
      this.certTypeList.forEach(item => {
        console.log('item', item);
        if (e === 'HKID') {
          this.basicInfoForm.cardNoBrack = '';
        } else {
          this.basicInfoForm.cardNoBrack = '0';
        }
        if (item.value == e) {
          this.basicInfoForm.cardTypeName = item.certType;
        }
      });
      console.log('e', e, this.basicInfoForm.cardTypeName);
    },
    //证件签发地选择
    cardAreaChange(e) {
      this.cardAreaList.forEach(item => {
        console.log('item', item);
        if (item.fieldValue == e) {
          this.basicInfoForm.cardAreaName = item.fiedlDescrible;
        }
      });
      console.log('e', e, this.basicInfoForm.cardAreaName);
    },
    back() {
      this.$emit('back');
    },
    blurChange(e) {
      e.target.value = e.target.value.replace(/[^\u4E00-\u9FA5]/g, '');
      this.basicInfoForm.userChsName = e.target.value.replace(
        /[^\u4E00-\u9FA5]/g,
        ''
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.u-basicInfo-wapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .u-newBtn {
    display: flex;
    margin-top: 20px;
  }
  ::v-deep.el-form {
    .el-select > .el-input {
      width: 320px !important;
    }
    .el-input {
      width: 320px !important;
      .el-input__inner {
        padding: 0 12px !important;
        height: 36px !important;
        line-height: 36px !important;
      }
    }
  }
  /deep/ .u-rowStyle {
    width: 320px;
    .u-input1 {
      width: 80px !important;
    }
    .u-input2 {
      flex: 1;
    }
    .u-input3 {
      width: 120px !important;
    }
    .u-line {
      margin: auto 6px;
    }
  }
  /deep/ .u-rowStyle1 {
    width: 170px;
    .u-input1 {
      width: 80px !important;
    }
    .u-input2 {
      flex: 1;
      width: 183px !important;
    }
    .u-input3 {
      width: 120px !important;
      display: inline-table;
      .el-input__inner {
        width: 120px !important;
      }
    }
    .u-line {
      margin: auto 6px;
    }
  }
  /deep/ .el-date-editor {
    .el-input__inner {
      padding-left: 15px !important;
    }
  }
}
</style>