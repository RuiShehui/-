<!-- 邀请码新增、修改 -->
<template>
  <div>
    <header class="g-form">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="calc(50% - 170px)">
        <el-form-item :label="$t(`RAO_CHECK.REFERRER_TYPE_SYMBOL`)" prop="referrerType">
          <el-select
            :disabled="isSubmit"
            v-model="formData.referrerType"
            clearable
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            class="g-w-340"
          >
            <el-option
              v-for="item in referrerTypeList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t(`RAO_CHECK.REFERRER_NO_SYMBOL`)" prop="referrerCode">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model.trim="formData.referrerCode"
            maxlength="20"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('RAO_CHECK.AVCTIVITY_ID_SYMBOL')" prop="activityID">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model.trim="formData.activityID"
            maxlength="20"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('RAO_CHECK.VALID_TIME_SYMBOL')" prop="validTime">
          <el-date-picker
            class="g-w-340"
            v-model="formData.validTime"
            type="datetimerange"
            align="right"
            unlink-panels
            :disabled="isSubmit"
            :range-separator="$t('AUTHORIZATION_CENTER.TO')"
            :start-placeholder="
              $t('COMMON.START_TIME')
            "
            :end-placeholder="
              $t('COMMON.END_TIME')
            "
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('RAO_CHECK.BRANCH_DISTRICT_SYMBOL')" prop="branchArea">
        <el-select
          class="g-w-340"
          v-model="formData.imBranchArea"
          :filterable="true"
          @change="selectBranchArea"
          :disabled="isSubmit"
          clearable
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          "
        >
          <el-option
            v-for="(item, key) in branchAreaList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.BRANCH_SYMBOL')" prop="branch">
        <el-select
          class="g-w-340"
          v-model="formData.imBranch"
          :filterable="true"
          :disabled="isSubmit"
          clearable
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          "
        >
          <el-option
            v-for="(item, key) in branchList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item :label="$t(`RAO_CHECK.CUSTOMER_INFO_SYMBOL`)" prop="acctInfo">
          <el-input
            class="g-w-340"
            :disabled="isSubmit"
            v-model.trim="formData.acctInfo"
            maxlength="20"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
      </el-form>
    </header>
    <footer class="g-btn" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">{{ $t(`COMMON.CANCEL`) }}</el-button>
      <el-button class="f-confirm" @click="submitForm('ruleForm')">{{ $t(`COMMON.SUBMIT`) }}</el-button>
    </footer>

    <footer class="g-btn" v-if="isSubmit">
      <el-button class="f-cancel" @click="perviousStep">{{ $t(`COMMON.PREVIOUS_STEP`) }}</el-button>
      <el-button class="f-confirm" @click="confirm()">{{ $t(`COMMON.CONFIRM`) }}</el-button>
    </footer>
  </div>
</template>

<script>
import {
  addCode,
  updateCode
} from '@/api/accountOpening/invitationCodeManagement'
import { deepClone } from '@/utils/tools';
import { getRoleDetail } from '@/utils/user';
import dateTools from '@/utils/dateTools';
import branchMixin from '@/mixins/branch-list'
import CONSTANTS from '@/utils/constant';
const {
  REFFERRER_TYPE_LIST,
} = CONSTANTS;
export default {
  name: 'InvitationCodeManagementAdd',
  mixins: [branchMixin],
  components: {},
  computed: {
  },
  data() {
    var validateEngNumber = (rule, value, callback) => {
      if (value) {
        if (/[^\da-zA-Z]/g.test(value)) {
          callback(new Error(this.$t('RAO_CHECK.DATA_NO_SURE')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      statusFlag: false, //菜单状态判断描述是否为必填，停用为false，启用为true
      isSubmit: false, //是否提交，false未提交，true已提交
      formData: {
        referrerType: '', // 推荐人类型
        referrerCode: '', // 推荐人编号
        createrByID: getRoleDetail().userName, // 创建人id
        activityID: '', // 活动ID
        validTime: ['', ''], // 有效时间
        effectiveTimeFrom: '', // 有效时间 开始
        effectiveTimeTo: '', // 有效时间 结束
        imBranchArea: '', // 分行区域
        imBranch: '', // 分行
        acctInfo: '', // 客户信息
      },
      branchAreaList: [], // 分行区域
      branchList: [], // 分行
      referrerTypeList: REFFERRER_TYPE_LIST, // 推荐人类型
      pickerOptions: {
        // disabledDate(time) {
        //   let curDate = new Date().getTime();
        //   let three = 365 * 24 * 3600 * 1000;
        //   let threeMonth = curDate - three;
        //   return (
        //     time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
        //   );
        // }
      },
      rules: {
        referrerCode: [
          {
            required: true,
            message: this.$t('RAO_CHECK.PLEASE_INPUT_REFERRER_NO'),
            trigger: 'blur'
          },
          { validator: validateEngNumber, trigger: 'blur' }
        ],
        referrerType: [
          {
            required: true,
            message: this.$t('RAO_CHECK.REFERRER_TYPE_RULES'),
            trigger: 'change'
          }
        ],
        activityID: [
          {
            required: true,
            message: this.$t('RAO_CHECK.PLEASE_INPUT_AVCTIVITY_ID'),
            trigger: 'blur'
          },
          { validator: validateEngNumber, trigger: 'blur' }
        ],
        validTime: [
          {
            required: true,
            message: this.$t('RAO_CHECK.VALID_TIME_RULES'),
            trigger: 'blur'
          }
        ],
        acctInfo: [
          {
            required: true,
            message: this.$t('RAO_CHECK.PLEASE_INPUT_CUSTOMER_INFO'),
            trigger: 'blur'
          }
        ],
      },
      operateType: '', // 操作类型 add update
    };
  },
  watch: {},
  created() {
    if(this.$route.params.detailInfo) {
      let detailInfo = this.$route.params.detailInfo
      this.formData.referrerType = detailInfo.referrerType
      this.formData.referrerCode = detailInfo.referrerCode
      this.formData.createrByID = detailInfo.createrByID
      this.formData.activityID = detailInfo.activityID
      this.formData.validTime[0] = detailInfo.effectiveTimeFrom
      this.formData.validTime[1] = detailInfo.effectiveTimeTo
      this.formData.effectiveTimeFrom = detailInfo.effectiveTimeFrom
      this.formData.effectiveTimeTo = detailInfo.effectiveTimeTo
      this.formData.imBranchArea = detailInfo.imBranchArea
      this.formData.imBranch = detailInfo.imBranch
      this.formData.acctInfo = detailInfo.acctInfo
      this.formData.recommendationCode = detailInfo.recommendationCode
      this.allBranchObj = this.$route.params.allBranchObj
      this.operateType = this.$route.params.operateType
    }
  },

  async mounted() {
    this.allBranchList = await this.initBranchList();
    this.allBranchList.map(item => {
      // 筛选分行区域
      if (item.brhLevel === '2' && item.brhParentId === 'CHbank') {
        this.branchAreaList.push({
          label: item.brhName,
          value: item.brhId
        })
      }
    })
    // 将所有分行列表的brhId作key，brName为value转成对象
    this.allBranchList.forEach(item => {
      this.$set(this.allBranchObj, item.brhId, item.brhName)
    })
    // 分行
    if (this.formData.imBranchArea) {
      let list = this.allBranchList.filter(item => {
        return item.brhParentId === this.formData.imBranchArea
      })
      list.map(item => {
        this.branchList.push({
          label: item.brhName,
          value: item.brhId
        })
      })
    }
  },

  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSubmit = true
        } else {
          return false;
        }
      })
    },
    // 选择分行区域
    selectBranchArea() {
      this.formData.imBranch = ''
      if (this.formData.imBranchArea) {
        let list = this.allBranchList.filter(item => {
          return item.brhParentId === this.formData.imBranchArea
        })
        this.branchList = []
        this.formData.imBranch = ''
        list.map(item => {
          this.branchList.push({
            label: item.brhName,
            value: item.brhId
          })
        })
      } else {
        this.branchList = []
        this.formData.imBranch = ''
      }
    },
    // 取消
    cancel() {
      if(this.operateType === 'update') {
        // this.$router.push('/accountOpening/invitationCodeManagement/detail');
        this.$router.push({
          path: '/accountOpening/invitationCodeManagement/detail',
          // name: 'Detail',
          query: {
            recommendationCode: this.formData.recommendationCode,
            allBranchObj: this.allBranchObj
          }
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/invitationCodeManagement/update' || this.$store.getters.getActiveTab
        );
      } else {
        this.$router.push('/accountOpening/invitationCodeManagement');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/invitationCodeManagement/add' || this.$store.getters.getActiveTab
        );
      }
    },

    // 确认
    async confirm() {
      let params = deepClone(this.formData);
      params.effectiveTimeFrom = params.validTime[0]
      params.effectiveTimeTo = params.validTime[1]
      delete params.validTime;
      let result = {}
      if (this.operateType === 'update') {
        params.updateType = 'update'
        result = await updateCode(params)
      } else {
        result = await addCode(params)
      }
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        if (result.body) {
          this.$showMsg({
            type: 'success',
            message: this.operateType === 'update'
              ? this.$t('RAO_CHECK.UPDATE_SUCCESS') 
              : this.$t('RAO_CHECK.ADD_SUCCESS') 
          });
          this.cancel();
        } else {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.FAIL')
          });
        }
      }
    },

    // 上一步
    perviousStep() {
      this.isSubmit = false
    },
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 30px 24px;
  box-sizing: border-box;
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  .g-btn {
    display: flex;
    justify-content: center;
    align-content: center;
    // margin-top: 3.6%;
    padding-bottom: 30px;
    margin-left: 3%;
    button {
      width: 210px;
      height: 40px;
      border-radius: 4px;
      font-size: 18px;
      text-align: center;
      border-color: #f06b00;
    }
    .f-cancel {
      color: #f06b00;
    }
    .f-confirm {
      background: #f06b00;
      color: #ffffff;
    }
  }
}
.g-w-340 {
  width: 340px;
}
.g-w-180 {
  width: 200px;
}
.g-w-20 {
  display: inline-block;
  text-align: center;
  width: 20px;
}
.g-w-120 {
  width: 120px;
}
.phone {
  ::v-deep .el-form-item__content {
    display: flex;
  }
}
</style>
