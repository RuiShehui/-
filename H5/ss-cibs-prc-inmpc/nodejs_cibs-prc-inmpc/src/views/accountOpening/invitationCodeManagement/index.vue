<!-- 邀请码查询 -->
<template>
  <div>
    <!-- 查询表单 -->
    <el-form class="transverse-form" :model="formData" :rules="rules" label-width="auto" ref="ruleForm">
      <el-form-item :label="$t('RAO_CHECK.REFERRER_NO_SYMBOL')" prop="referrerCode">
        <el-input
          class="g-w-270"
          v-model="formData.referrerCode"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.REFERRER_TYPE_SYMBOL')" prop="referrerType">
        <el-select
          class="g-w-270"
          v-model="formData.referrerType"
          clearable
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          "
        >
          <el-option
            v-for="(item, key) in referrerTypeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.CHANNEL_CODE_SYMBOL')" prop="recommendationCode">
        <el-input
          class="g-w-270"
          v-model="formData.recommendationCode"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="6"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.AVCTIVITY_ID_SYMBOL')" prop="activityId">
        <el-input
          class="g-w-270"
          v-model="formData.activityId"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.USAGE_STATE_SYMBOL')" prop="status">
        <el-select
          class="g-w-270"
          v-model="formData.status"
          clearable
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          "
        >
          <el-option
            v-for="(item, key) in statusList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.BRANCH_DISTRICT_SYMBOL')" prop="imBranchArea">
        <el-select
          class="g-w-270"
          v-model="formData.imBranchArea"
          :filterable="true"
          @change="selectBranchArea"
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
      <el-form-item :label="$t('RAO_CHECK.BRANCH_SYMBOL')" prop="imBranch">
        <el-select
          class="g-w-270"
          v-model="formData.imBranch"
          :filterable="true"
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
      <el-form-item :label="$t('RAO_CHECK.CUSTOMER_INFO_SYMBOL')" prop="acctInfo">
        <el-input
          class="g-w-270"
          v-model="formData.acctInfo"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <div style="float:right;">
            <Form-Button style="float:right" @add="add" @submit="search" @handleReset="handleReset('formData')"></Form-Button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column width="80" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column prop="recommendationCode" :label="$t('RAO_CHECK.CHANNEL_CODE')" width="110">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.recommendationCode }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="referrerCode" :label="$t('RAO_CHECK.REFERRER_NO')" width="150"></el-table-column>
      <el-table-column :label="$t('RAO_CHECK.REFERRER_TYPE')" width="120">
        <template slot-scope="scope">
          <div>{{ valueToLabel(referrerTypeList, scope.row.referrerType) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="activityID" :label="$t('RAO_CHECK.AVCTIVITY_ID')" width="130"></el-table-column>
      <el-table-column prop="createrTime" :label="$t('RAO_CHECK.CREATE_TIME')" width="200"></el-table-column>
      <el-table-column :label="$t('RAO_CHECK.VALID_TIME')" width="320">
        <template slot-scope="scope">
          <div>{{ scope.row.effectiveTimeFrom }} - {{ scope.row.effectiveTimeTo }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('RAO_CHECK.BRANCH_DISTRICT')" width="140">
        <template slot-scope="scope">
          <div>{{ allBranchObj[scope.row.imBranchArea] }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('RAO_CHECK.BRANCH')" width="130">
        <template slot-scope="scope">
          <div>{{ allBranchObj[scope.row.imBranch] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="acctInfo" :label="$t('RAO_CHECK.CUSTOMER_INFO')" width="140"></el-table-column>
      <el-table-column :label="$t('RAO_CHECK.USAGE_STATE')" width="130" fixed="right">
        <template slot-scope="scope">
          <div :class="scope.row.status === '0' ? 'disabled' : 'activated'">{{ valueToLabel(statusList, scope.row.status) }}</div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>{{ $t('RAO_CHECK.QUERY_NO_RECORDS') }}</span>
      </div>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import CONSTANTS from '@/utils/constant';
import {
  getRecommendationCodeList,
} from '@/api/accountOpening/invitationCodeManagement';
import branchMixin from '@/mixins/branch-list'
const {
  REFFERRER_TYPE_LIST,
  REFERRAL_CODE_STATUS_LIST
} = CONSTANTS;
export default {
  name: 'InvitationCodeManagement',
  mixins: [branchMixin],
  components: {
    FormButton
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
      formData: {
        recommendationCode: "", // 邀请码
        referrerCode: "", // 推荐人编号
        referrerType: "", // 推荐人类型
        activityId: "", // 活动id
        status: "", // 状态
        acctInfo: "", // 客户信息
        imBranchArea: "", // 分行区域
        imBranch: "", // 分行
      },
      referrerTypeList: REFFERRER_TYPE_LIST, // 推荐人类型
      allBranchObj: {}, // 所有分行地址obj
      branchAreaList: [], // 分行区域
      branchList: [], // 分行
      statusList: REFERRAL_CODE_STATUS_LIST, // 使用状态列表
      tableData: [], // table数据
      currentPage: 1,
      pageSize: 10,
      total: 1,
      rules: {
        recommendationCode: [
          { validator: validateEngNumber, trigger: 'blur' }
        ],
        referrerCode: [
          { validator: validateEngNumber, trigger: 'blur' }
        ],
        activityId: [
          { validator: validateEngNumber, trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    
  },
  async created() {
    await this.queryTableData();
  },

  activated() {
    this.search();
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
  },

  methods: {
    // 查詢邀请码列表
    search() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.queryTableData()
        } else {
          return false
        }
      });
    },
    // 查询列表数据
    async queryTableData() {
      let params = {
        ...this.formData,
        current: this.currentPage,
        size: this.pageSize,
        orderByField: ''
      };
      let result = await getRecommendationCodeList(params)
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.recommdationCodes || []
        this.total = result.body.total
      }
    },
    // 选择分行区域
    selectBranchArea() {
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
    // value转label
    valueToLabel(list, val) {
      let label = '';
      list.forEach(item => {
        if(item.value === val) {
          label = item.label
        }
      });
      return label
    },
    // 详情
    async handleCell(row) {
      console.log("row", row)
      row.allBranchObj = this.allBranchObj
      this.$router.push({
        path: '/accountOpening/invitationCodeManagement/detail',
        query: row
      });
    },
    // 重置
    handleReset(formName) {
      this.$refs[formName].resetFields();
      // this.search();
    },
    // 新增
    add() {
      this.$router.push(
        {
          name: 'InvitationCodeAdd',
          params: {
            operateType: 'add'
          }
        }
      )
    },
    // pageSize 改变是触发
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    // currentPage 改变是触发
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.search();
    },
  }
};
</script>

<style lang="scss" scoped>
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 20px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
  }
}
.g-bolck {
  text-align: right;
  padding: 24px;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
}
.g-w-270 {
  width: 270px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.activated {
  width: 60px;
  padding: 4px 16px;
  background-color: #0cc71A;
  border-radius: 4px;
  color: #ffffff;
}
.disabled {
  width: 60px;
  padding: 4px 16px;
  background-color: #F23F47;
  border-radius: 4px;
  color: #ffffff;
}
</style>
