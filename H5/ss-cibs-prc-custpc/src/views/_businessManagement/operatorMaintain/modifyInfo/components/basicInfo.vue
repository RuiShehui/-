<template>
  <div class="basicInfo-wapper">
    <el-form ref="basicInfoRef" :model="basicInfoForm" :rules="rules" label-width="auto">
      <el-form-item :label="$t('USER_MANAGEMENT.USER_TYPE_COLON')" prop="userType" required>
        <el-radio-group v-model="basicInfoForm.userType">
          <el-radio label="3">{{$t('USER_MANAGEMENT.REPORTER')}}</el-radio>
          <el-radio label="2">{{$t('USER_MANAGEMENT.AUTHORIZER')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USERNAME')" prop="userName">
        <el-input v-model="basicInfoForm.userName" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USERNAME')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_CHINESE_NAME')" prop="chinaName">
        <el-input v-model="basicInfoForm.chinaName" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_CHINESE_NAME')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ENGLISH_COLON')" prop="elishName">
        <el-input v-model="basicInfoForm.elishName" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_ENGLISH_COLON')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')" prop="certTypeValue">
        <el-select v-model="basicInfoForm.certTypeValue" :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')
        })">
          <el-option
            v-for="(item,index) in certTypeList"
            :key="index"
            :label="item.certType"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_NUMBER')" prop="certNo">
        <el-input v-model="basicInfoForm.certNo" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_NUMBER')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_STATUS')" prop="userStatus" required>
        <el-radio-group v-model="basicInfoForm.userStatus">
          <el-radio label="1">{{$t('USER_MANAGEMENT.ENABLE')}}</el-radio>
          <el-radio label="0">{{$t('USER_MANAGEMENT.DEACTIVATE')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.AUTHORIZATION_LEVEL')" v-if="basicInfoForm.userType==='0'">
        <el-select v-model="basicInfoForm.auth" :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
          input:$t('USER_MANAGEMENT.AUTHORIZATION_LEVEL')
        })">
          <el-option value="A" :label="$t('RIGHTS_TEMPLATE.A_LEVEL')"></el-option>
          <el-option value="B" :label="$t('RIGHTS_TEMPLATE.B_LEVEL')"></el-option>
          <el-option value="C" :label="$t('RIGHTS_TEMPLATE.C_LEVEL')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.FA')" prop="isOpen2FA">
        <el-input v-model="basicInfoForm.isOpen2FA" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_ADDRESS')" prop="certAddress">
        <el-input v-model="basicInfoForm.certAddress" :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_ADDRESS')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_PHONE')">
        <el-row class="rowStyle flexsb">
          <el-input class="input1" v-model="basicInfoForm.floatPhone1" :placeholder="$t('USER_MANAGEMENT.COUNTRY_NUMBER')"></el-input>
          <div class="line">-</div>
          <el-input class="input1" v-model="basicInfoForm.floatPhone2" :placeholder="$t('USER_MANAGEMENT.LOCAL_NUMBER')"></el-input>
          <div class="line">-</div>
          <el-input class="input2" v-model="basicInfoForm.floatPhone3" :placeholder="$t('USER_MANAGEMENT.CODE')"></el-input>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('USER_MANAGEMENT.USER_EMAIL')" prop="emailAddress">
        <el-input v-model="basicInfoForm.emailAddress" :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_EMAIL')
        })"></el-input>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.SMS')">
        <el-row class="rowStyle flexsb">
          <el-input class="input3" v-model="basicInfoForm.floatPhone4" :placeholder="$t('USER_MANAGEMENT.USER_COUNTRY')"></el-input>
          <div class="line">-</div>
          <el-input class="input2" v-model="basicInfoForm.floatPhone5" :placeholder="$t('USER_MANAGEMENT.USER_PHONE')"></el-input>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('USER_MANAGEMENT.USER_SMS_ADDRESS')" prop="mailAddress">
        <el-input v-model="basicInfoForm.mailAddress" :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
          input:$t('USER_MANAGEMENT.USER_SMS_ADDRESS')
        })"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="newBtn">
          <v-button class="mr16" @click="back">{{$t('COMMON.BACK')}}</v-button>
          <v-button @click="next" type="primary">{{$t('COMMON.NEXT_STEP')}}</v-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { email, telephone } from '@/utils/rules';
export default {
  props: {
    basicInfoForm: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 证件类型列表
      certTypeList: [
        {
          certType: this.$t('USER_MANAGERMENT.ID_CARD'),
          value: '01'
        },
        {
          certType: this.$t('USER_MANAGERMENT.HK_MACAU_PASS'),
          value: '02'
        },
        {
          certType: this.$t('USER_MANAGERMENT.PASSPORT'),
          value: '03'
        },
        {
          certType: this.$t('USER_MANAGERMENT.HOUSEHOLD_REG_BOOK'),
          value: '04'
        }
      ],
      rules: {
        chinaName: [
          { required: true, message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('USER_MANAGEMENT.USER_CHINESE_NAME')
          }), trigger: 'blur' }
        ],
        elishName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('USER_MANAGEMENT.USER_ENGLISH_NAME')
          }),
            trigger: 'blur'
          }
        ],
        certTypeValue: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:this.$t('USER_MANAGEMENT.CARDTYPE_COLON')
          }),
            trigger: 'change'
          }
        ],
        certNo: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('USER_MANAGEMENT.USER_NUMBER')
          }),
            trigger: 'blur'
          }
        ],
        isOpen2FA: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:this.$t('USER_MANAGEMENT.FA')
          }),
            trigger: 'change'
          }
        ],
        certAddress: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('USER_MANAGEMENT.USER_ADDRESS')
          }),
            trigger: 'blur'
          }
        ],
        data: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:this.$t('USER_MANAGEMENT.BIRTHDAY')
          }),
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: telephone,
            trigger: 'blur'
          }
        ],
        emailAddress: [
          {
            required: true,
            validator: email,
            trigger: 'blur'
          }
        ],
        mailAddress: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:this.$t('USER_MANAGEMENT.USER_SMS_ADDRESS')
          }),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    next() {
      this.$refs['basicInfoRef'].validate(volid => {
        if (volid) {
          return this.$emit('next', this.basicInfoForm);
        } else {
          return false;
        }
      });
    },
    back() {
      this.$emit('back');
    }
  }
};
</script>
<style lang="scss" scoped>
.basicInfo-wapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .newBtn {
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
  /deep/ .rowStyle {
    width: 320px;
    .input1 {
      width: 80px !important;
    }
    .input2 {
      flex: 1;
    }
    .input3 {
      width: 120px !important;
    }
    .line {
      margin: 0 6px;
    }
  }
  /deep/.el-date-editor {
    .el-input__inner {
      padding-left: 15px !important;
    }
  }
}
</style>