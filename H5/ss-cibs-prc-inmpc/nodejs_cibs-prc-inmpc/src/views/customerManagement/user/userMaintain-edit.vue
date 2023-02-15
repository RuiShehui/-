<template>
  <div class="g-form">
    <el-form
      :model="userSetting"
      label-position="right"
      label-width="150px"
      ref="userSetting"
      :rules="userRules"
      label-suffix=":"
    >
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')" prop="userType">
        <el-radio-group v-model="userSetting.userType" @change="changeUserType">
          <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.ADMAIN')}}</el-radio>
          <el-radio label="2">{{$t('CUSTOMER_MANAGEMENT.AUTH_USER')}}</el-radio>
          <el-radio label="3">{{$t('CUSTOMER_MANAGEMENT.INPUT_USER')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')" prop="loginName">
        <el-input
          disabled
          v-model="userSetting.loginName"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')" prop="userChsName">
        <el-input
          v-model="userSetting.userChsName"
          disabled
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')" prop="userEglsName">
        <el-input
          v-model="userSetting.userEglsName"
          disabled
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')" prop="cardType">
        <el-select
          disabled
          class="f-w-340"
          v-model="userSetting.cardType"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        ></el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')" prop="cardNo">
        <el-input
          v-model="userSetting.cardNo"
          disabled
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')" prop="cardArea">
        <el-input
          v-model="userSetting.cardArea"
          disabled
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item
        v-if="userSetting.userType!=='2'"
        :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
        prop="empowerGroup"
        :rules="[]"
      >
        <el-select
          v-model="userSetting.empowerGroup"
          :disabled="userSetting.userType==='3'"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.NONE')" value="0"></el-option>
        </el-select>
        <div
          v-if="userSetting.userType==='1'"
          class="son"
        >{{$t('CUSTOMER_MANAGEMENT.ADMAIN_AND_AUTH')}}</div>
      </el-form-item>
      <el-form-item
        v-if="userSetting.userType==='2'"
        :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')"
        prop="empowerGroup"
      >
        <el-select
          v-model="userSetting.empowerGroup"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
        >
          <el-option label="A" value="A"></el-option>
          <el-option label="B" value="B"></el-option>
          <el-option label="C" value="C"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')" prop="status">
        <el-radio label="1" v-model="userSetting.status">{{$t('CUSTOMER_MANAGEMENT.ENABLE')}}</el-radio>
        <el-radio label="0" v-model="userSetting.status">{{$t('CUSTOMER_MANAGEMENT.DISABLE')}}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')" prop="tfaStatus">
        <el-select
          class="f-w-340"
          v-model="userSetting.tfaStatus"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
          :disabled="userSetting.userType !== '2'"
        >
          <el-option :label="$t('CUSTOMER_MANAGEMENT.YES')" value="1"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.NO')" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')" class="g-formitems">
        <el-form-item prop="userPhoneCountry">
          <money-input
            v-model="userSetting.userPhoneCountry"
            :is-full-number="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhoneArea">
          <money-input
            v-model="userSetting.userPhoneArea"
            :is-full-number="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.AREA_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="userPhonePhone">
          <money-input
            v-model="userSetting.userPhonePhone"
            :is-full-number="true"
            class="f-w-100"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')" prop="email">
        <el-input
          v-model="userSetting.email"
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
            v-model="userSetting.mobilePhoneCountry"
            :is-full-number="true"
            class="f-w-160"
            :placeholder="$t('CUSTOMER_MANAGEMENT.COUNTRY_NO')"
          />
        </el-form-item>
        <span class="num-span">-</span>
        <el-form-item prop="mobilePhonePhone">
          <money-input
            v-model="userSetting.mobilePhonePhone"
            :is-full-number="true"
            class="f-w-160"
            :placeholder="$t('CUSTOMER_MANAGEMENT.PHONE_NO')"
            maxlength="11"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')"
        prop="mailAddress"
        :rules="userSetting.userType === '1' ? userRules.mailAddress : []"
      >
        <el-input
          v-model="userSetting.mailAddress"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
    </el-form>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button
        class="f-reset"
        @click="handleReset('userSetting')"
      >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
    </div>
  </div>
</template>

<script>
import { queryOperatorDetail } from '@/api/customer-management/user';
export default {
  name: 'UserMaintainEdit',
  data() {
    return {
      option: 'option',
      infoStatus: 'userSetting',
      userSetting: {},
      userRules: {
        userType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.USER_TYPE_RULES'),
            trigger: 'blur'
          }
        ],
        loginName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')
            }),
            trigger: 'blur'
          },
          {
            pattern: /^(\d|\w){3,24}$/,
            message: this.$t('CUSTOMER_MANAGEMENT.LOGIN_NAME_RULES'),
            trigger: 'blur'
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
        status: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.USER_STATUS')
            }),
            trigger: 'blur'
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
            pattern: /^(\w|\d|\_|\-)+\@(\w|\d)+(\.+|\w)+$/,
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
      } // 验证规则
    };
  },
  methods: {
    handleReset(formName) {
      this.queryOperatorDetail();
    },
    changeUserType(val) {
      if (val === '3') {
        this.userSetting.tfaStatus = '0';
        this.userSetting.empowerGroup = '0';
      } else {
        this.userSetting.tfaStatus = '1';
        this.userSetting.empowerGroup = '';
      }
    },
    submit() {
      if (
        !(
          this.userSetting.userPhoneCountry === '' &&
          this.userSetting.userPhoneArea === '' &&
          this.userSetting.userPhonePhone === ''
        ) &&
        !(
          this.userSetting.userPhoneCountry !== '' &&
          this.userSetting.userPhonePhone !== ''
        )
      ) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.INPUT_COMPLETE'),
          type: 'error'
        });
        return;
      }
      this.$refs['userSetting'].validate(valid => {
        if (valid) {
          if (
            this.userSetting.userPhoneCountry !== '' &&
            this.userSetting.userPhoneArea !== '' &&
            this.userSetting.userPhonePhone !== ''
          ) {
            this.userSetting.userPhone = `${this.userSetting.userPhoneCountry}-${this.userSetting.userPhoneArea}-${this.userSetting.userPhonePhone}`;
          } else if (
            this.userSetting.userPhoneCountry !== '' &&
            this.userSetting.userPhonePhone !== ''
          ) {
            this.userSetting.userPhone = `${this.userSetting.userPhoneCountry}-${this.userSetting.userPhonePhone}`;
          } else {
            this.userSetting.userPhone = '';
          }
          this.userSetting.mobilePhone = `${this.userSetting.mobilePhoneCountry}-${this.userSetting.mobilePhonePhone}`;
          if (this.userSetting.empowerGroup === '') {
            this.userSetting.empowerGroup = '0';
          }
          this.userSetting.cardTypeLabel = this.userSetting.cardType;
          this.userSetting.cardAreaLabel = this.userSetting.cardArea;
          this.$router.push({
            name: 'UserMaintainEditConfirm',
            params: this.userSetting
          });
        } else {
          return false;
        }
      });
    },
    back() {
      this.$router.replace({
        name: 'UserMaintain'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/userMaintain/edit' 
      );
    },
    async queryOperatorDetail() {
      const result = await queryOperatorDetail({
        userCode: this.userCode
      });
      this.userSetting = result.body;
      const mobilePhone = this.userSetting.mobilePhone;
      const userPhone = this.userSetting.userPhone;
      if (mobilePhone) {
        const mobilePhoneArray = mobilePhone.split('-');
        this.$set(this.userSetting, 'mobilePhoneCountry', mobilePhoneArray[0]);
        this.$set(this.userSetting, 'mobilePhonePhone', mobilePhoneArray[1]);
      } else {
        this.$set(this.userSetting, 'mobilePhoneCountry', '');
        this.$set(this.userSetting, 'mobilePhonePhone', '');
      }
      if (userPhone) {
        const userPhoneArray = userPhone.split('-');
        this.$set(
          this.userSetting,
          'userPhoneCountry',
          userPhoneArray[0] ? userPhoneArray[0] : ''
        );
        this.$set(
          this.userSetting,
          'userPhoneArea',
          userPhoneArray[1] ? userPhoneArray[1] : ''
        );
        this.$set(
          this.userSetting,
          'userPhonePhone',
          userPhoneArray[2] ? userPhoneArray[2] : ''
        );
      } else {
        this.$set(this.userSetting, 'userPhoneCountry', '');
        this.$set(this.userSetting, 'userPhoneArea', '');
        this.$set(this.userSetting, 'userPhonePhone', '');
      }
    }
  },
  created() {
    if (this.$route.params.backEdit) {
      this.userSetting = this.$route.params.userSetting;
      this.userCode = this.userSetting.userCode;
    } else {
      this.userCode = this.$route.params.userCode;
      this.queryOperatorDetail();
    }
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
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
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
</style>