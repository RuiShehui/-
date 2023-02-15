<template>
  <div class="g-safeProblem">
    <!-- :rules="rules" -->
    <el-form ref="formData" :model="formData" :rules="rule"  label-width="245px" class="m-formData">
      <!-- 证件类型 -->
      <el-form-item :label="$t('RESET_USERNAME.TYPE_OF_ID')" prop="certType">
        <el-select v-model="formData.certType" @change="chooseQuestion">
          <el-option
            v-for="(item,index) in questionList"
            :key="index"
            :label="item.fiedlDescrible"
            :value="item.fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 证件号码 -->
      <el-form-item :label="$t('RESET_USERNAME.ID_NUMBER')" prop="certNo">
        <el-input
          v-model="formData.certNo"
          maxlength="20"
          :placeholder="$t('RESET_USERNAME.PLEASE_ENTER_THE_ID_NUMBER')"
        ></el-input>
      </el-form-item>
      <!-- 账户号码 -->
      <el-form-item :label="$t('RESET_USERNAME.ACCOUNT_NUMBER')" prop="accountNo">
        <el-input
          v-model="formData.accountNo"
          maxlength="20"
          :placeholder="$t('RESET_USERNAME.ACCOUNT_INPUT')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('FIRST_LOGIN.PREVIOUS')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        @click="next"
      >{{$t('FIRST_LOGIN.NEXT')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('FIRST_LOGIN.TIPS')}}</p>
      <p class="u-content">{{$t('RESET_USERNAME.INFORMATION_REGISTERED')}}</p>
      <p class="u-content">{{$t('RESET_USERNAME.ANY_LINKED')}}</p>
    </div>
  </div>
</template>

<script>
import { retrieveQuestion, personalVerify, userType } from '@/api/login.js';
import CONTATNS from '@/utils/contants.js';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          certType: '',
          certNo: '',
          accountNo: ''
        };
      }
    }
  },
  data() {
    return {
      questionList: [],
      
    };
  },
  computed: {
    // ...mapState(['lang']),
    rule() {
      return {
        certType: [
          {
            required: true,
            message: this.$t('RESET_USERNAME.PLEASE_SELECT_TYPE_OF_ID'),
            trigger: 'blur'
          }
        ],
        certNo: [
          {
            required: true,
            message: this.$t('RESET_USERNAME.PLEASE_ENTER_THE_ID_NUMBER'),
            trigger: 'blur'
          }
        ],
        accountNo: [
          {
            required: true,
            message: this.$t('RESET_USERNAME.ACCOUNT_INPUT'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  mounted() {
    this.getType();
    // this.getQuestionList();
  },
  methods: {
    next() {
      console.log(this.formData.certType, '222');
      // 校验个人信息
      personalVerify({
        certType: this.formData.certType, // 证件类型 后台未提供接口，先写死 20220409
        certNo: this.formData.certNo, // 证件号码
        accountNo: this.formData.accountNo // 账户号码
      }).then(res => {
        if (res) {
          console.log(res, 'res');
          res.certNo = this.formData.certNo;
          res.certType = this.formData.certType;
          this.formData = res;
          this.$emit('next', this.formData);
        }
      });
    },
    reset() {
      this.$refs['formData'].resetFields();
    },
    back() {
      this.$router.push('/login');
    },
    chooseQuestion(val) {
      console.log(val);
    },
    // 获取账户类型
    getType() {
       this.questionList = []
      userType().then(res => {
        console.log(res, 'res');
        if (res) {
          this.questionList = res
        }
        console.log(this.questionList, 'console.log(this.questionList)');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-formData {
  margin-left: 22%;
  ::v-deep .el-input__inner {
    width: 320px;
  }
  ::v-deep .el-input--suffix {
    width: 320px;
  }
}
.u-btn {
  display: flex;
  margin-left: 38%;
  margin-top: 36px;
}
.u-tips {
  margin-top: 40px;
  margin-left: 24px;
  // position: absolute;
  // bottom: 0px;
  .u-title {
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 400;
  }
  .u-content {
    margin-top: 16px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
  }
}
</style>