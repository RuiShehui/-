<template>
  <div class="modifyInfo">
    <el-form
      :model="modifyInfo"
      ref="modifyInfo"
      :rules="rules"
      class="formW_515"
      label-width="182px"
    >
      <el-form-item :label="$t('AUTHORIZE.AUTH_PAYMENTTYPE')+':'">
        <el-input :value="modifyInfo.supportType | supporyType" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_SERVICENUMBER')+':'">
        <el-input v-model="modifyInfo.paymentCode" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.CREDITNAME')+':'">
        <el-input v-model="modifyInfo.remitteeName" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('ACCOUNT_MAINTENACE.ACCOUNT_NUMBER')+':'">
        <el-input v-model="modifyInfo.accountNo" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_FREQUENCY')+':'">
        <el-input :value="modifyInfo.paymentFreq | paymentFreqType" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('ACCOUNT_MANAGEMENT.START_DATE')+':'" prop="startDate">
        <!-- <el-input v-model="modifyInfo.startDate"></el-input> -->
        <el-date-picker
          v-model="modifyInfo.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('ACCOUNT_MANAGEMENT.END_DATE')+':'" prop="endDate">
        <el-date-picker
          v-model="modifyInfo.endDate"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_LIMIT')+':'" prop="transLimit">
        <MoneyInput
          v-model.trim="modifyInfo.transLimit"
          class="u-sel"
          :placeholder="$t('TRANSFR_INFO.IPUT_AMOUNT')"
          maxlength="17"
          :isSaveDot="true"
        ></MoneyInput>
      </el-form-item>
    </el-form>
    <el-row class="flexc mt36" style="margin-bottom: 56px">
      <v-button class="mr16" @click="back">{{$t('COMMON.BACK')}}</v-button>
      <v-button type="primary" @click="comfirmClick">{{$t('COMMON.DETERMINE')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { parse } from 'url';
import filter from '@/filters/accountManagement';
import business from '@/filters/business.js';
export default {
  props: {
    modifyInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    rules() {
      var validate_Type = (rules, value, callback) => {
        if (this.ruleForm.type == '') {
          return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
        } else {
          callback();
        }
      };

      var checkDate = (rules, value, callback) => {
        let start = new Date(this.modifyInfo.startDate).getTime();
        let end = new Date(this.modifyInfo.endDate).getTime();
        if (start > end) {
          return callback(new Error(this.$t('message.rule.qxzdhzjlx')));
        } else {
          callback();
        }
      };


      return {
        startDate: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.STRAT_DATE'),
            trigger: 'blur'
          },
          {
            required: false,
            validator: checkDate,
            message: this.$t('USER_MANAGERMENT.STRATMAX_END')
          }
        ],
        endDate: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.END_DATE'),
            trigger: 'blur'
          },
          {
            required: false,
            validator: checkDate,
            message: this.$t('USER_MANAGERMENT.STRATMAX_END')
          }
        ],
        transLimit: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.PAY_LIMIT_EMPRTY'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  data() {
    return {
      oldData: {},
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          return time.getTime() < new Date().getTime() - 24 * 3600 * 1000;
        }
      }
    };
  },
  filters: {
    paymentFreqType:filter.paymentFreqType,
    supporyType:business.supporyType,
  },
  mounted() {
    this.oldData = { ...this.modifyInfo };
  },
  methods: {
    //确定
    comfirmClick() {
      this.$refs['modifyInfo'].validate(valid => {
        if (valid) {
          if (
            this.modifyInfo.startDate === this.oldData.startDate &&
            this.modifyInfo.endDate === this.oldData.endDate &&
            this.modifyInfo.transLimit === this.oldData.transLimit
          ) {
            return this.$confirm({
              title: this.$t('COMMON.TISHI'),
              message: this.$t('USER_MANAGERMENT.MESSAGE_NO'),
              btnText: {
                confirmText: this.$t('COMMON.CONFIRM')
              },
              isCancle: false
            });
          }
          this.$emit('next', this.modifyInfo);
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },
    back() {
      this.$router.push({
        path: '/_businessManagement/serviceSetting/edda',
        query: { activeName: this.oldData.activeName }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.formW_515 {
  width: 515px;
  //   margin: 0 auto;
  margin-left: 203px;
  /deep/ .el-input {
    width: 320px !important;
  }
}
</style>