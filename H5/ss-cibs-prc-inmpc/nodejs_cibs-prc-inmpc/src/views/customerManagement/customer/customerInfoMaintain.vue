<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:36:21
 * @LastEditTime: 2022-09-28 20:00:05
 * @LastEditors: zhangcheng
 * @Description: 客户信息维护
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerInfoMaintain.vue
-->
<template>
  <div class="contain">
    <customer-query v-show="showQuery" @showIndex="showIndex" />
    <el-form
      v-if="showIndexInfo"
      :model="userInfo"
      ref="ruleForm"
      label-position="right"
      label-width="calc(50% - 170px)"
      label-suffix=":"
      :rules="rules"
    >
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EBANK_STATUS')">
        <el-checkbox
          v-model="checkStatus"
          @change="changeEbankStatus"
        >{{$t('CUSTOMER_MANAGEMENT.ENT_AND_MOBILE')}}</el-checkbox>
        <!-- <el-checkbox v-if="userInfo.bankEntStatus" v-model="userInfo.bankEntStatus">银企直连</el-checkbox> -->
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME')">
        <p>{{userInfo.entChsName}}</p>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME')">
        <p>{{userInfo.entEglsName}}</p>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CAED_INFO')">
        <div v-for="(item,index) in userInfo.cardList" :key="index">
          <div v-if="index>0" class="g-h-20"></div>
          <el-descriptions :column="1" border class="f-w-340">
            <el-descriptions-item :label="$t('CUSTOMER_MANAGEMENT.SYMBOL')">{{ '0'+(index+1) }}</el-descriptions-item>
            <el-descriptions-item :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')">{{ item.cardType }}</el-descriptions-item>
            <el-descriptions-item :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')">{{ item.cardNo }}</el-descriptions-item>
            <el-descriptions-item :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')">{{ item.cardArea }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_NAME')" prop="contactsName">
        <el-input
          v-model="userInfo.contactsName"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')" required>
        <el-form-item style="display:inline-block" prop="countryNo">
          <el-input
            v-model="userInfo.countryNo"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            maxlength="10"
            class="f-w-100"
          />
        </el-form-item>
        <el-form-item style="display:inline-block" prop="areaNo">
          <span class="interval">-</span>
          <el-input
            v-model="userInfo.areaNo"
            :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
            maxlength="10"
            class="f-w-100"
          />
        </el-form-item>
        <span class="interval">-</span>
        <el-form-item style="display:inline-block" prop="phoneNo">
          <el-input
            v-model="userInfo.phoneNo"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            class="f-w-100"
            maxlength="11"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+ '2'">
        <el-form-item style="display:inline-block" prop="countryNo2">
          <el-input
            v-model="userInfo.countryNo2"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            maxlength="10"
            class="f-w-100"
          />
        </el-form-item>
        <el-form-item style="display:inline-block" prop="areaNo2">
          <span class="interval">-</span>
          <el-input
            v-model="userInfo.areaNo2"
            :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
            maxlength="10"
            class="f-w-100"
          />
        </el-form-item>
        <span class="interval">-</span>
        <el-form-item style="display:inline-block" prop="phoneNo2">
          <el-input
            v-model="userInfo.phoneNo2"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            class="f-w-100"
            maxlength="11"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')" required>
        <el-form-item style="display:inline-block" prop="mobilePhoneArea">
          <el-input
            v-model="userInfo.mobilePhoneArea"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            maxlength="10"
            class="f-w-100"
          />
        </el-form-item>
        <el-form-item style="display:inline-block" prop="mobilePhoneNo">
          <span class="interval">-</span>
          <el-input
            v-model="userInfo.mobilePhoneNo"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            maxlength="11"
            class="f-w-220"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')" prop="emailAddress">
        <el-input
          v-model="userInfo.emailAddress"
          maxlength="34"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_ADDRESS')" prop="entAddress">
        <el-input
          v-model="userInfo.entAddress"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_TYPE')" prop="entType">
        <el-select
          class="f-w-340"
          v-model="userInfo.entType"
          @change="changeEntType"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option :label="$t('CUSTOMER_MANAGEMENT.SIMPLEX_AUTH')" value="1"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.UNITE_AUTH')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="userInfo.entType === '1'"
        :label="$t('CUSTOMER_MANAGEMENT.OBANK_AUTH_MODEL')"
        class="radio-item"
      >
        <p>{{$t('CUSTOMER_MANAGEMENT.SIMPLE_AUTH_MODEL')}}</p>
      </el-form-item>
      <div ref="radioItem" v-show="userInfo.entType === '2'">
        <el-form-item
          :label="$t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL')"
          prop="adminEmpower"
          class="radio-item"
        >
          <el-radio-group v-model="userInfo.adminEmpower">
            <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.NO_NEED_AUTH')}}</el-radio>
            <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.MUTUAL_AUTH')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MANAGE_TEAM')" prop="accountManagerTeam">
        <el-select class="f-w-340" v-model="userInfo.accountManagerTeam">
          <el-option label="JCC1" value="JCC1"></el-option>
          <el-option label="JCC2" value="JCC2"></el-option>
          <el-option label="BHC1U" value="BHC1U"></el-option>
          <el-option label="BHC1W" value="BHC1W"></el-option>
          <el-option label="BHC1V" value="BHC1V"></el-option>
          <el-option label="BHC1X" value="BHC1X"></el-option>
          <el-option label="BHC1Y" value="BHC1Y"></el-option>
          <el-option label="BHC2E" value="BHC2E"></el-option>
          <el-option label="BHC2F" value="BHC2F"></el-option>
          <el-option label="BHC2G" value="BHC2G"></el-option>
          <el-option label="BHC2P" value="BHC2P"></el-option>
          <el-option label="BHC2R" value="BHC2R"></el-option>
          <el-option label="BHC2S" value="BHC2S"></el-option>
          <el-option label="BHC2Z" value="BHC2Z"></el-option>
          <el-option label="BHC3H" value="BHC3H"></el-option>
          <el-option label="BHC3I" value="BHC3I"></el-option>
          <el-option label="BHC3J" value="BHC3J"></el-option>
          <el-option label="BHC3K" value="BHC3K"></el-option>
          <el-option label="BHC4A" value="BHC4A"></el-option>
          <el-option label="BHC4B" value="BHC4B"></el-option>
          <el-option label="BHC4C" value="BHC4C"></el-option>
          <el-option label="BHC4D" value="BHC4D"></el-option>
          <el-option label="BHC4L" value="BHC4L"></el-option>
          <el-option label="BHC4M" value="BHC4M"></el-option>
          <el-option label="BHC4N" value="BHC4N"></el-option>
          <el-option label="KSBD" value="KSBD"></el-option>
          <el-option label="KFID" value="KFID"></el-option>
          <el-option label="ZBAM1" value="ZBAM1"></el-option>
          <el-option label="ZBAM2" value="ZBAM2"></el-option>
          <el-option label="ZBAM3" value="ZBAM3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MANAGE_NAME')" prop="accountManagerName">
        <el-input
          class="f-w-340"
          v-model="userInfo.accountManagerName"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.APPLICATION_DATA')" prop="applicationDate">
        <el-date-picker
          class="f-w-340"
          v-model="userInfo.applicationDate"
          value-format="yyyy-MM-dd"
          type="date"
          :picker-options="pickerOptions"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.REMARK')">
        <el-input
          type="textarea"
          rows="3"
          v-model="userInfo.remark"
          maxlength="200"
          resize="none"
          show-word-limit
          class="f-w-340"
        />
      </el-form-item>
      <el-form-item label="小額轉賬狀態" prop="limitAmount" :rules="limitAmountRules()">
        <!-- <el-radio-group @change="changeSetStatus" v-model="userInfo.setStatus">
          <el-radio label="1">開</el-radio>
          <el-radio label="0">關</el-radio>
        </el-radio-group>-->
        <el-select
          class="f-w-110"
          v-model="userInfo.setStatus"
          :disabled="userInfo.entType !== '1'"
        >
          <el-option label="開" value="1"></el-option>
          <el-option label="關" value="0"></el-option>
        </el-select>
        <money-input
          v-if="userInfo.setStatus==='1'"
          class="f-w-220 mgl10"
          v-model="userInfo.limitAmount"
          :isSaveDot="true"
          :isThousand="true"
          @changeBlur="handleMaxChange($event, userInfo)"
          @focus="formatDel"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item label="限額級別" prop="customerClazz">
        <el-select class="f-w-340" v-model="userInfo.customerClazz">
          <el-option
            v-for="(item,index) in customerClazzList"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="g-bottom">
        <el-button class="f-cancel" @click="backQuery">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
        <el-button type="primary" @click="nextStep">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
      </div>
    </el-form>
    <customer-info-maintain-confirm
      :tableData="userInfo"
      :ebankCstmNo="ebankCstmNo"
      v-if="showConfirm"
      @backIndex="backIndex"
      @finish="finish"
    />
  </div>
</template>

<script>
import { queryMerchantDetail } from '@/api/customer-management/customer';
import { getLimitLevels } from '@/api/business-management/limit-assets';
import { moneyFormat } from '@/utils/tools';
// import { setValidateForm } from '@/utils/tools';
import CustomerInfoMaintainConfirm from '../components/customer-info-maintain/CustomerInfoMaintainConfirm.vue';
export default {
  name: 'CustomerInfoMaintain',
  components: {
    CustomerInfoMaintainConfirm
  },
  ['userInfo.entType'](newVal, preVal) {
    if (newVal === '2') {
      this.userInfo.setStatus = '0';
      this.userInfo.limitAmount = '0';
    }
  },
  data() {
    return {
      showConfirm: false, // 显示确认
      showIndexInfo: false, // 显示信息
      showQuery: true, // 显示查询
      customerClazzList: [],
      userInfo: {
        ebankStatus: '', // 开通渠道
        // bankEntStatus: '', // 银企直连（一期不展示）
        entChsName: '', // 公司中文名
        entEglsName: '', // 英文名
        cardType: '', // 证件类型
        cardNo: '', // 证件号码
        cardArea: '', // 证件签发地
        contactsName: '', // 联络人姓名
        contactsPhone: '', // 联络电话
        mobilePhone: '', // 流动电话
        entAddress: '', // 公司地址
        entType: '1', // 个人类型
        adminEmpower: '2', // 管理员授权模式
        remark: '', // 备注
        setStatus: '0',
        limitAmount: '0',
        customerClazz: '',
        countryNo: '',
        areaNo: '',
        phoneNo: '',
        countryNo2: '',
        areaNo2: '',
        phoneNo2: '',
        mobilePhoneArea: '',
        mobilePhoneNo: '',
        accountManagerTeam: '',
        accountManagerName: '',
        applicationDate: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date();
        }
      },
      entType: '',
      adminEmpower: '',
      ebankCstmNo: '',
      checkStatus: false // 开通渠道状态（多选框状态转换）
    };
  },
  computed: {
    rules() {
      let isAdminEmpowerType = true
      if(this.entType === '1' && this.userInfo.adminEmpower === '') {
        isAdminEmpowerType = false
      }
      return {
        contactsName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_CONTACTS_NAME'),
            trigger: 'blur'
          }
        ],
        entAddress: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_ENT_ADDRESS'),
            trigger: 'blur'
          }
        ],
        emailAddress: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_ENT_EMAILADDRESS'),
            trigger: 'blur'
          },
          {
            pattern: /^(\w|\W)+\@(\w|\W)+$/,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_TRUE_EMAIL'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('CUSTOMER_MANAGEMENT.EMAIL_ADRESS_LENGTH'),
            trigger: 'blur'
          }
        ],
        entType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.SELECT_ENT_TYPE'),
            trigger: 'changes'
          }
        ],
        adminEmpower: [
          {
            required: isAdminEmpowerType,
            message: this.$t('CUSTOMER_MANAGEMENT.SELECT_ADMIN_EMPOWER'),
            trigger: 'change'
          }
        ],
        countryNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')
            }),
            trigger: 'blur'
          }
        ],
        phoneNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.PHONE_NO')
            }),
            trigger: 'blur'
          }
        ],
        mobilePhoneArea: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')
            }),
            trigger: 'blur'
          }
        ],
        mobilePhoneNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.PHONE_NO')
            }),
            trigger: 'blur'
          }
        ],
        accountManagerTeam: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.MANAGE_TEAM')
            }),
            trigger: 'change'
          }
        ],
        accountManagerName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.MANAGE_NAME')
            }),
            trigger: 'blur'
          }
        ],
        applicationDate: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.APPLICATION_DATA')
            }),
            trigger: 'blur'
          }
        ],
        customerClazz: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: '限額級別'
            }),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  methods: {
    moneyFormat,
    formatDel(e) {
      e.target.value = e.target.value.split(',').join('');
    },
    handleMaxChange(value, userInfo) {
      userInfo.limitAmount = value;
    },
    async getLimitLevels() {
      const { body = '' } = await getLimitLevels();
      if (body) {
        let array = [];
        let letter = '';
        for (let i = 0; i < body.length; i++) {
          letter = String.fromCharCode(65 + i);
          array.push({
            label: letter + this.$t('BUSINESS_MANAGEMENT.CLAZZ'),
            value: i + ''
          });
        }
        this.customerClazzList = array;
      }
    },
    limitAmountRules() {
      let rule = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('請輸入每日轉賬限額'));
        }
        console.log(value);
        const str = value.split(',').join('');
        if (Number(str) > 10000) {
          return callback(new Error('每日小額轉賬限額不得超過HKD10,000.00'));
        }
        callback();
      };
      return [{ required: true, validator: rule, trigger: 'blur' }];
    },
    changeSetStatus() {
      this.userInfo.limitAmount = '0';
      this.$refs['ruleForm'].clearValidate();
    },
    backIndex() {
      this.showConfirm = false;
      this.showIndexInfo = true;
    },
    showIndex(data) {
      this.init(data);
    },
    finish() {
      this.showQuery = true;
      this.showConfirm = false;
    },
    nextStep() {
      const submitForm = this.$refs['ruleForm'];
      submitForm.validate(valid => {
        if (valid) {
          if (
            !(
              this.userInfo.countryNo2 === '' &&
              this.userInfo.phoneNo2 === '' &&
              this.userInfo.areaNo2 === ''
            ) &&
            !(this.userInfo.countryNo2 !== '' && this.userInfo.phoneNo2 !== '')
          ) {
            this.$showMsg({
              message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
              type: 'error'
            });
            return;
          }
          if (this.userInfo.entType === '1' && this.entType !== '1') {
            this.$showBox({
              content: this.$t('CUSTOMER_MANAGEMENT.ADD_USER'),
              confirm: () => {
                this.showConfirm = true;
                this.showIndexInfo = false;
              }
            });
            return;
          }
          if (this.userInfo.entType === '2' && this.entType !== '2') {
            this.$showBox({
              content: this.$t('CUSTOMER_MANAGEMENT.ADD_ADMIN'),
              confirm: () => {
                this.showConfirm = true;
                this.showIndexInfo = false;
              }
            });
            return;
          }
          this.userInfo.contactsPhone = `${this.userInfo.countryNo}${
            this.userInfo.areaNo ? '-' : ''
          }${this.userInfo.areaNo}-${this.userInfo.phoneNo}`;
          if (this.userInfo.areaNo2) {
            this.userInfo.contactsPhone2 = `${this.userInfo.countryNo2}-${this.userInfo.areaNo2}-${this.userInfo.phoneNo2}`;
          } else if (this.userInfo.countryNo2) {
            this.userInfo.contactsPhone2 = `${this.userInfo.countryNo2}-${this.userInfo.phoneNo2}`;
          } else {
            this.userInfo.contactsPhone2 = '';
          }
          this.userInfo.mobilePhone = `${this.userInfo.mobilePhoneArea}-${this.userInfo.mobilePhoneNo}`;
          this.showConfirm = true;
          this.showIndexInfo = false;
        }
      });
    },
    changeEntType(val) {
      console.log(val);
      if (val === '1') {
        this.userInfo.adminEmpower = '2';
      } else {
        this.userInfo.adminEmpower = '0';
      }
    },
    changeEbankStatus(status) {
      console.log(status);
      if (status) {
        this.userInfo.ebankStatus = '1';
      } else {
        this.userInfo.ebankStatus = '0';
      }
    },
    backQuery() {
      this.showQuery = true;
      this.showIndexInfo = false;
    },
    async queryMerchantDetail() {
      let result = await queryMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        let limitAmountStr = '';
        if (
          result.body.limitAmount === null ||
          result.body.limitAmount === undefined
        ) {
          limitAmountStr = '0';
        } else {
          limitAmountStr = result.body.limitAmount;
        }
        this.userInfo = {
          ...this.userInfo,
          ...result.body,
          limitAmount: moneyFormat(String(limitAmountStr))
        };
        if (this.userInfo.ebankStatus === '0') {
          this.checkStatus = false;
        } else {
          this.checkStatus = true;
        }
      }
    },
    async init(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      await this.queryMerchantDetail();
      if (this.userInfo.ebankStatus === '1') {
        this.checkStatus = true;
      }
      let contactsPhone = [];
      let contactsPhone2 = [];
      if (this.userInfo.contactsPhone) {
        contactsPhone = this.userInfo.contactsPhone.split('-');
      }
      if (this.userInfo.contactsPhone2) {
        contactsPhone2 = this.userInfo.contactsPhone2.split('-');
      }
      let mobilePhoneArr = [];
      if (this.userInfo.mobilePhone) {
        mobilePhoneArr = this.userInfo.mobilePhone.split('-');
      }
      if (contactsPhone.length === 2) {
        this.userInfo.countryNo = contactsPhone[0];
        this.userInfo.phoneNo = contactsPhone[1];
      } else if (contactsPhone.length === 1) {
        this.userInfo.phoneNo = contactsPhone[0];
      } else {
        this.userInfo.countryNo = contactsPhone[0];
        this.userInfo.areaNo = contactsPhone[1];
        this.userInfo.phoneNo = contactsPhone[2];
      }
      if (contactsPhone2.length === 2) {
        this.userInfo.countryNo2 = contactsPhone2[0];
        this.userInfo.phoneNo2 = contactsPhone2[1];
      } else if (contactsPhone2.length === 1) {
        this.userInfo.phoneNo2 = contactsPhone2[0];
      } else {
        this.userInfo.countryNo2 = contactsPhone2[0] || '';
        this.userInfo.areaNo2 = contactsPhone2[1] || '';
        this.userInfo.phoneNo2 = contactsPhone2[2] || '';
      }
      if (mobilePhoneArr.length) {
        this.userInfo.mobilePhoneArea = mobilePhoneArr[0];
        this.userInfo.mobilePhoneNo = mobilePhoneArr[1];
      } else {
        this.userInfo.mobilePhoneArea = '';
        this.userInfo.mobilePhoneNo = '';
      }
      this.entType = this.userInfo.entType;
      this.adminEmpower = this.userInfo.adminEmpower;

      this.showIndexInfo = true;
      this.showQuery = false;
    }
  },
  async created() {
    await this.getLimitLevels();
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
.f-w-340 {
  width: 340px;
}
.g-bottom {
  margin: 40px;
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
}
.f-w-100 {
  width: 100px;
}
.interval {
  display: inline-block;
  width: 20px;
  text-align: center;
}
.radio-item {
  ::v-deep .el-form-item__label {
    line-height: 20px;
  }
  ::v-deep .el-form-item__content {
    line-height: 20px;
  }
}
.g-h-20 {
  height: 20px;
}
.f-w-220 {
  width: 220px;
}
.mgl10 {
  margin-left: 12px;
}
.f-w-110 {
  width: 110px;
}
</style>