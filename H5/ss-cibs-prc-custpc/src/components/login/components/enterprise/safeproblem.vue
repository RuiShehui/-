<template>
  <div class="g-safeProblem">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="220px" class="m-formData">
      <!-- 安全问题一 -->
      <el-form-item :label="$t('FIRST_LOGIN.QUESTION_ONE')" prop="questionOne">
        <el-select v-model="formData.questionOne" @change="chooseQuestion">
          <el-option
            v-for="item in questionList"
            :key="item.questionIdPk"
            :label="item.question"
            :value="item.questionIdPk"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 答案一 -->
      <el-form-item :label="$t('FIRST_LOGIN.ANSWER')" prop="answerOne">
        <el-input
          v-model="formData.answerOne"
          maxlength="20"
          :placeholder="$t('FIRST_LOGIN.PLEASE_ENTER_ANSWER')"
        ></el-input>
      </el-form-item>
      <!-- 安全问题二 -->
      <el-form-item :label="$t('FIRST_LOGIN.QUESITON_TWO')" prop="questionTwo">
        <el-select v-model="formData.questionTwo">
          <el-option
            v-for="item in questionList"
            :key="item.questionIdPk"
            :label="item.question"
            :value="item.questionIdPk"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 答案二 -->
      <el-form-item :label="$t('FIRST_LOGIN.ANSWER')" prop="answerTwo">
        <el-input
          v-model="formData.answerTwo"
          maxlength="20"
          :placeholder="$t('FIRST_LOGIN.PLEASE_ENTER_ANSWER')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        @click="next"
      >{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <p class="u-content">{{$t('FIRST_LOGIN.EASE_OF_RETRIEVING_YOUR_LOGON')}}</p>
    </div>
  </div>
</template>

<script>
import { retrieveQuestion, createPrivateAnswer } from '@/api/login.js';

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
      var confirmQuestion = (rules, value, callback) => {
        console.log(value, 'value');
        if (this.formData.questionTwo == this.formData.questionOne) {
          callback(new Error(this.$t('FIRST_LOGIN.PLEASE_SELECT_AGAIN')));
        }
        callback();
      };
      return {
        questionOne: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_SELECT_QUESTION_ONE'),
            trigger: 'blur'
          }
        ],
        answerOne: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.ANSWER_CANNOT_BE_MISSING'),
            trigger: 'blur'
          }
        ],
        questionTwo: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_SELECT_QUESTION_TWO'),
            trigger: 'blur'
          },
          {
            validator: confirmQuestion,
            message: this.$t('FIRST_LOGIN.PLEASE_SELECT_AGAIN')
            // trigger: 'blur'
          }
        ],
        answerTwo: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.ANSWER_CANNOT_BE_MISSING'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  data() {
    return {
      questionList: []
      // answerList: {}
    };
  },
  mounted() {
    this.getQuestionList();
  },
  methods: {
    next() {
      //  this.$emit('next',this.formData);
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let answerList = [
            {
              answer: this.formData.answerOne,
              questionId: this.formData.questionOne
            },
            {
              answer: this.formData.answerTwo,
              questionId: this.formData.questionTwo
            }
          ];
          let params = {
            userName: this.formData.userName,
            answerList: answerList
          };
          // 创建安全问题
          createPrivateAnswer(params).then(res => {
            console.log(params, 'ss');
            if (res) {
              this.$emit('next', this.formData);
            }
          });
          // console.log(answerList)
          // this.$emit('next', this.formData);
        }
      });
    },
    back() {
      this.$emit('back', this.formData);
    },
    getQuestionList() {
      retrieveQuestion().then(res => {
        console.log(res);
        this.questionList = res.userQuestionList;
      });
    },
    chooseQuestion(val) {
      console.log(val);
      // console.log(this.formData, 'form');
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