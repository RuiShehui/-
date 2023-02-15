<template>
  <div class="g-authorziationSetting">
    <div>
      <div>
        <span class="title">我提交的</span>
      </div>
      <div>
        <div class="g-liner-crude"></div>
        <div class="g-line-fine"></div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="g-form" label-width="210px">
        <el-form-item label="待授权即将过期邮件提醒:" prop="emailReminder">
          <el-radio v-model="ruleForm.emailReminder" label="1">是</el-radio>
          <el-radio v-model="ruleForm.emailReminder" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="授权拒绝邮件提醒:" prop="rejectEmailReminder">
          <el-radio v-model="ruleForm.rejectEmailReminder" label="1">是</el-radio>
          <el-radio v-model="ruleForm.rejectEmailReminder" label="2">否</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 40px">
      <div>
        <span class="title">待我授权</span>
      </div>
      <div>
        <div class="g-liner-crude"></div>
        <div class="g-line-fine"></div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="g-form" label-width="210px">
        <el-form-item label="待我授权邮件通知:" prop="subjectAuthorizationEmailReminder">
          <el-radio v-model="ruleForm.subjectAuthorizationEmailReminder" label="1">是</el-radio>
          <el-radio v-model="ruleForm.subjectAuthorizationEmailReminder" label="2">否</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="cancel">取消</el-button>
      <el-button class="f-submit" @click="submit">提交</el-button>
    </div>

    <!-- 删除dialog -->
    <Pop-Up ref="remind" class="m-popUp" width="513px">
      <img src="@/img/logOut.png" alt />
      <p>确定要设置授权提醒设置么?</p>
    </Pop-Up>
  </div>
</template>

<script>
import PopUp from "@/components/common/dialog/PopUp.vue";
export default {
  components: { PopUp },

  data() {
    return {
      ruleForm: {
        emailReminder: "1", //即将过期邮件提醒
        rejectEmailReminder: "1", //授权拒绝邮件提醒
        subjectAuthorizationEmailReminder: "1" //待我授权邮件通知
      },
      rules: {
        emailReminder: [
          { required: true, message: "请选择邮件设置", trigger: "blur" }
        ],
        rejectEmailReminder: [
          {
            required: true,
            message: "请选择是否拒绝授权邮件提醒",
            trigger: "blur"
          }
        ],
        subjectAuthorizationEmailReminder: [
          {
            required: true,
            message: "请选择是否待我授权邮件通知",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  created() {},

  mounted() {
    // this.tableData[0] = this.$route.query;
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return "background:#f3f6fc;";
      } else {
        return "background:#ffffff";
      }
    },
    //取消
    cancel() {},
    //提交
    submit() {
      this.$refs.remind.showDialog();
    }
  }
};
</script>

<style lang='scss' scoped>
.g-authorziationSetting {
  padding: 20px 1%;
  background: #ffffff;
  height: 100%;
}
.g-form {
  padding-left: 37%;
}
.g-bottom {
  margin-top: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.f-cancel {
  font-size: 18px;
  margin-top: 20px;
  //   width: 210px;
  width: 170px;
  height: 40px;
  text-align: center;
}
.f-submit {
  font-size: 18px;
  margin-top: 20px;
  //   width: 210px;
  width: 170px;
  height: 40px;
  background: #f06b00;
  color: #fff;
  text-align: center;
}
.g-liner-crude {
  width: 100px;
  border: 2px solid #000;
  margin-top: 15px;
}
.g-line-fine {
  width: 100%;
  border: 1px solid #000;
  margin-bottom: 10px;
}
.title {
  margin-left: 18px;
  font-weight: 600;
}
.m-popUp {
  p {
     
    font-size: 18px;
    color: #323c41;
    letter-spacing: 0;
    text-align: center;
    line-height: 26px;
    font-weight: 500;
  }
}
</style>