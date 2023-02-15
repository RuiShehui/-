<template>
  <div class="g-safeProblem">
    <el-form ref="formData" :model="formData" :rules="rules"  label-width="245px" class="m-formData">
      <el-form-item :label="$t('FIRST_LOGIN.QUESTION_ONE')" prop="questionOne">
        <p style="padding-top:8px">{{questionList[0].question}}</p>
      </el-form-item>
      <el-form-item :label="$t('FIRST_LOGIN.ANSWER')" prop="answerOne">
        <el-input v-model="formData.answerOne" maxlength="20" :placeholder="$t('FIRST_LOGIN.PLEASE_ENTER_ANSWER')"></el-input>
      </el-form-item>

    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('FIRST_LOGIN.PREVIOUS')}}</VButton>
      <VButton size="w160" type="primary" style="margin-left:20px;" @click="next">{{$t('FIRST_LOGIN.NEXT')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('FIRST_LOGIN.TIPS')}}</p>
      <p class="u-content">{{$t('RESET_USERNAME.SAFE_QUESITON')}}</p>
      <p class="u-content">{{$t('RESET_USERNAME.RESET_USERNAMES')}}</p>
    </div>
  </div>
</template>

<script>
import {
  retrieveQuestion,
  getPrivateAnswerVerify,
  privateAnswerVerify
} from '@/api/login.js';

export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          questionOne: '',
          answerOne: '',
          questionTwo: '',
          answerTwo: ''
        };
      }
    }
  },
  computed: {
    rules() {
      return {
        answerOne: [
          {
            required: true,
            message: this.$t('LOGON.ANSWER_REQUIRED'),
            trigger: 'blur'
          }
        ],
        answerTwo: [
          {
            required: true,
            message:this.$t('LOGON.ANSWER_REQUIRED'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  data() {
    return {
      questionList: [],
      questionOne: '',
      questionTwo: ''
      // answerList: {}
    };
  },
  created() {
    this.getQuestionList();
  },
  methods: {
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let answerList = [
            {
              answer: this.formData.answerOne,
              questionId: this.questionList[0].questionIdPk,
              userCode: this.formData.userCode
            }
          ];
          let params = answerList;
          console.log(params, 'formData');
          privateAnswerVerify(params).then(({ head = {} }) => {
            const { returnCode } = head;
            console.log(returnCode, 'returnCode');
            if (returnCode === '000000') {
              this.$emit('next', this.formData);
            }
          });
        }
      });
    },
    back() {
      console.log(this.formData,'formData')
      this.$emit('back', this.formData);
    },
    getQuestionList() {
      getPrivateAnswerVerify(this.formData).then(res => {
        if (res) {
          this.questionList = res;
        }
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