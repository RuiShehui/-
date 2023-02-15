<template>
  <div>
    <el-form
      :model="userInfo"
      ref="ruleForm"
      label-position="right"
      label-width="calc(50% - 170px)"
      label-suffix=":"
      :rules="rules"
    >
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EBANK_STATUS')">
        <el-checkbox
          v-model="ebankStatus"
          :disabled="true"
        >{{$t('CUSTOMER_MANAGEMENT.ENT_AND_MOBILE')}}</el-checkbox>
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
          <div class="f-tabel-box">
            <div>
              <div>{{$t('CUSTOMER_MANAGEMENT.SYMBOL')}}</div>
              <div>{{'0'+(index+1)}}</div>
            </div>
            <div>
              <div>{{$t('CUSTOMER_MANAGEMENT.CARD_TYPE')}}</div>
              <div>{{cardInfoFilter(item.cardType,cardTypeList)}}</div>
            </div>
            <div>
              <div>{{$t('CUSTOMER_MANAGEMENT.CARD_NO')}}</div>
              <div>{{item.cardNo}}</div>
            </div>
            <div>
              <div>{{$t('CUSTOMER_MANAGEMENT.CARD_AREA')}}</div>
              <div>{{cardInfoFilter(item.cardArea,cardAreaList)}}</div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_NAME')" prop="contactsName">
        <el-input
          v-model="userInfo.contactsName"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')" required>
        <div style="display: flex">
          <el-form-item prop="countryNo">
            <money-input
              v-model="userInfo.countryNo"
              :is-all-num="true"
              maxlength="10"
              class="f-w-100"
              :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            />
          </el-form-item>
          <span class="interval">-</span>
          <el-form-item prop="areaNo">
            <money-input
              v-model="userInfo.areaNo"
              :is-all-num="true"
              maxlength="10"
              class="f-w-100"
              :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
            />
          </el-form-item>
          <span class="interval">-</span>
          <el-form-item prop="phoneNo">
            <money-input
              v-model="userInfo.phoneNo"
              :is-all-num="true"
              class="f-w-100"
              maxlength="11"
              :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')+'2'">
        <div style="display: flex">
          <el-form-item prop="countryNo2">
            <money-input
              v-model="userInfo.countryNo2"
              :is-all-num="true"
              maxlength="10"
              class="f-w-100"
              :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            />
          </el-form-item>
          <span class="interval">-</span>
          <el-form-item prop="areaNo2">
            <money-input
              v-model="userInfo.areaNo2"
              :is-all-num="true"
              maxlength="10"
              class="f-w-100"
              :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
            />
          </el-form-item>
          <span class="interval">-</span>
          <el-form-item prop="phoneNo2">
            <money-input
              v-model="userInfo.phoneNo2"
              :is-all-num="true"
              class="f-w-100"
              maxlength="11"
              :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')" required>
        <div style="display: flex">
          <el-form-item prop="mobilePhoneArea">
            <money-input
              v-model="userInfo.mobilePhoneArea"
              :is-all-num="true"
              maxlength="10"
              class="f-w-100"
              :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
            />
          </el-form-item>
          <span class="interval">-</span>
          <el-form-item prop="mobilePhoneNo">
            <money-input
              v-model="userInfo.mobilePhoneNo"
              :is-all-num="true"
              maxlength="11"
              class="f-w-220"
              :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')" prop="emailAddress">
        <el-input
          v-model="userInfo.emailAddress"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          maxlength="34"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_ADDRESS')" prop="entAddress">
        <el-input
          v-model="userInfo.entAddress"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.ENT_TYPE')" :required="true">
        <el-select class="f-w-340" v-model="userInfo.entType" @change="changeEntType">
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
        <!-- <el-button type="primary" @click="nextStep">{{$t('CUSTOMER_MANAGEMENT.NEXTSTEP')}}</el-button> -->
        <el-button type="primary" @click="nextStep">{{$t('CUSTOMER_MANAGEMENT.SAVE')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { setValidateForm } from '@/utils/tools';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import { moneyFormat } from '@/utils/tools';
import { getLimitLevels } from '@/api/business-management/limit-assets';
export default {
  name: 'OpenStepOne',
  props: {
    userMerchantSave: {
      type: Object,
      default: () => {
        return {};
      }
    },
    stepOneData: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    ['userInfo.entType'](newVal, preVal) {
      if (newVal === '1') {
        this.userInfo.adminEmpower = '2';
      }
      if (newVal === '2') {
        this.userInfo.setStatus = '0';
        this.userInfo.limitAmount = '0.00';
      }
    },
    'userInfo.setStatus'(newVal) {
      console.log('newVal', newVal);
      if (newVal === '0') {
        this.userInfo.limitAmount = '0.00';
        this.$refs['ruleForm'].clearValidate();
      }
    }
  },
  data() {
    return {
      option: 'option',
      ebankStatus: true,
      customerClazzList: [],
      userInfo: {
        ebankStatus: '1', // 开通渠道
        // bankEntStatus: '', // 银企直连（一期不展示）
        entChsName: '', // 公司中文名
        entEglsName: '', // 英文名
        cardType: '', // 证件类型
        cardNo: '', // 证件号码
        cardArea: '', // 证件签发地
        contactsName: '', // 联络人姓名
        contactsPhone: '', // 联络电话
        contactsPhone2: '', // 联络电话2
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
        accountManagerTeam: '',
        accountManagerName: '',
        applicationDate: '',
        mobilePhoneArea: '',
        mobilePhoneNo: ''
      },
      isShortPhone: false,
      cardTypeList: [],
      cardAreaList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date();
        }
      },
      rules: {
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
            required: true,
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
      }
    };
  },
  methods: {
    formatDel(e) {
      e.target.value = e.target.value.split(',').join('');
    },
    handleMaxChange(value, userInfo) {

      userInfo.limitAmount = value;
    },
    limitAmountRules() {
      let rule = (rule, value, callback) => {
        console.log('this.userInfo-------1', this.userInfo);
        if (this.userInfo.setStatus === '1') {
          if (!value) {
            return callback(new Error('請輸入每日轉賬限額'));
          }
          console.log(value);
          const str = value.split(',').join('');
          if (Number(str) > 10000) {
            return callback(new Error('每日小額轉賬限額不得超過HKD10,000.00'));
          }
          callback();
        }else {
          callback();
        }
      };
      return [{ required: true, validator: rule, trigger: 'blur' }];
    },
    changeSetStatus() {
      this.userInfo.limitAmount = '0';
      this.$refs['ruleForm'].clearValidate();
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
    nextStep() {
      // const submitForm = this.$refs['ruleForm'];
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.userInfo.areaNo !== '') {
            this.userInfo.contactsPhone =
              this.userInfo.countryNo +
              '-' +
              this.userInfo.areaNo +
              '-' +
              this.userInfo.phoneNo;
          } else {
            this.userInfo.contactsPhone =
              this.userInfo.countryNo + '-' + this.userInfo.phoneNo;
          }
          if (this.userInfo.areaNo !== '') {
            this.userInfo.contactsPhone2 =
              this.userInfo.countryNo2 +
              '-' +
              this.userInfo.areaNo2 +
              '-' +
              this.userInfo.phoneNo2;
          } else {
            this.userInfo.contactsPhone2 =
              this.userInfo.countryNo2 + '-' + this.userInfo.phoneNo2;
          }
          this.userInfo.mobilePhone =
            this.userInfo.mobilePhoneArea + '-' + this.userInfo.mobilePhoneNo;
          if (
            !(
              this.userInfo.countryNo2 === '' && this.userInfo.phoneNo2 === ''
            ) &&
            !(this.userInfo.countryNo2 !== '' && this.userInfo.phoneNo2 !== '')
          ) {
            this.$showMsg({
              message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
              type: 'error'
            });
            return;
          }
          const limitAmount = this.userInfo.limitAmount
          this.$emit('nextStepOne', { ...this.userInfo, limitAmount });
        }
      });
    },
    changeEntType(val) {
      if (val === '1') {
        this.userInfo.adminEmpower = '2';
      } else {
        this.userInfo.adminEmpower = '0';
      }
    },
    // 返回查询
    backQuery() {
      this.$emit('backQuery');
    },
    // 表格颜色
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    async getListCardType() {
      const result = await getListCardType({
        bigGroupCode: 'language',
        fieldName: 'cardTypeEnt'
      });
      if (result.body) {
        this.cardTypeList = result.body.cardTypeList;
      }
    },
    async getListCardArea() {
      const result = await getListCardArea({
        bigGroupCode: 'language',
        fieldName: 'cardArea'
      });
      if (result.body) {
        this.cardAreaList = result.body.cardAreaList;
      }
    },
    cardInfoFilter(val, array) {
      if (array && array.length !== 0) {
        const result = array.find(item => item.fieldValue === val);
        // console.log(result, val, array);
        if (result) {
          return result.fiedlDescrible;
        } else {
          return val;
        }
      }
    }
  },
  async created() {
    await this.getListCardType();
    await this.getListCardArea();
    await this.getLimitLevels();
    // 请求用户数据
    if (this.userMerchantSave.contactsPhone) {
      let phoneArray = this.userMerchantSave.contactsPhone.split('-');
      if (phoneArray.length === 2) {
        this.userMerchantSave.countryNo = phoneArray[0];
        this.userMerchantSave.phoneNo = phoneArray[1];
        this.userMerchantSave.areaNo = '';
      } else {
        this.userMerchantSave.countryNo = phoneArray[0];
        this.userMerchantSave.areaNo = phoneArray[1];
        this.userMerchantSave.phoneNo = phoneArray[2];
      }
    } else {
      this.userMerchantSave.countryNo = '';
      this.userMerchantSave.areaNo = '';
      this.userMerchantSave.phoneNo = '';
    }
    if (this.userMerchantSave.contactsPhone2) {
      let phoneArray2 = this.userMerchantSave.contactsPhone2.split('-');
      if (phoneArray.length === 2) {
        this.userMerchantSave.countryNo2 = phoneArray2[0];
        this.userMerchantSave.phoneNo2 = phoneArray2[1];
        this.userMerchantSave.areaNo2 = '';
      } else {
        this.userMerchantSave.countryNo2 = phoneArray2[0];
        this.userMerchantSave.areaNo2 = phoneArray2[1];
        this.userMerchantSave.phoneNo2 = phoneArray2[2];
      }
    } else {
      this.userMerchantSave.countryNo2 = '';
      this.userMerchantSave.areaNo2 = '';
      this.userMerchantSave.phoneNo2 = '';
    }

    this.stepOneData.limitAmount = moneyFormat((this.userInfo.limitAmount+''))
    console.log(this.stepOneData, 'this.stepOneData-------1');
    if (this.userMerchantSave.mobilePhone) {
      let phoneArray = this.userMerchantSave.mobilePhone.split('-');
      this.userMerchantSave.mobilePhoneArea = phoneArray[0];
      this.userMerchantSave.mobilePhoneNo = phoneArray[1];
    } else {
      this.userMerchantSave.mobilePhoneArea = '';
      this.userMerchantSave.mobilePhoneNo = '';
    }
    this.userInfo = {
      ...this.userInfo,
      ...this.userMerchantSave,
      ...this.stepOneData
    };
  }
};
</script>

<style lang="scss" scoped>
.f-w-340 {
  width: 340px;
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
::v-deep .el-descriptions-item__cell {
  width: 50%;
}
.g-h-20 {
  height: 20px;
}
.f-tabel-box {
  > div {
    display: flex;
    width: 340px;
    > div {
      width: 50%;
    }
    > div:nth-of-type(1) {
      color: #606266;
    }
  }
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