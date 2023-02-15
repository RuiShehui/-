<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:36:21
 * @LastEditTime: 2022-03-21 14:36:53
 * @LastEditors: zhangcheng
 * @Description: 用户维护
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\high-risk\index.vue
-->
<template>
  <div class="contain">
    <el-form
      :model="queryData"
      class="transverse-form"
      label-width="auto"
      ref="formRef"
      label-suffix=":"
      label-position="right"
    >
      <!-- 分行号 -->
      <el-form-item label="分行号" class="g-project" prop="crn">
        <el-input
          v-model="queryData.crn"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-270"
        ></el-input>
      </el-form-item>
      <!-- 个人类型 -->
      <el-form-item :label="$t('STATEMENT_QUERY.ENTERPRISK_TYPE')" prop="companyType">
        <el-select v-model="queryData.companyType" class="f-w-270">
          <el-option :label="$t('STATEMENT_QUERY.ALL')" value="0"></el-option>
          <el-option :label="$t('STATEMENT_QUERY.SINGLE_AUTH')" value="1"></el-option>
          <el-option :label="$t('STATEMENT_QUERY.JOINT_AUTH')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 个人网银客户号 -->
      <el-form-item label="个人网银客户号" class="g-project" prop="crn">
        <el-input
          v-model="queryData.crn"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-270"
        ></el-input>
      </el-form-item>
      <!--交易日期 -->
      <el-form-item label="交易日期" class="g-project" prop="startStopTime">
        <el-date-picker
          class="f-w-270"
          v-model="queryData.startStopTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="~"
          :start-placeholder="$t('AUTHORIZATION_CENTER.START_DATE')"
          :end-placeholder="$t('AUTHORIZATION_CENTER.END_DATE')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button class="m-t-20">下載</el-button>
    <el-table
      class="m-t-40"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 分行号-->
      <el-table-column label="分行号" prop="companyType"></el-table-column>
      <!-- 个人类型 -->
      <el-table-column label="个人类型" prop="crn"></el-table-column>
      <!-- 个人网银客户号 -->
      <el-table-column label="个人网银客户号" prop="startStopTime"></el-table-column>
      <!-- 交易日期 -->
      <el-table-column label="交易日期" prop="optionType"></el-table-column>
      <!-- 交易时间 -->
      <el-table-column label="交易时间" prop="lastTime"></el-table-column>
      <!-- 交易类型 -->
      <el-table-column label="交易类型" prop="operator"></el-table-column>
      <!-- 可疑场景ID -->
      <el-table-column label="可疑场景ID" prop="operatorType"></el-table-column>
      <!-- 账户号码 -->
      <el-table-column label="账户号码" prop="operatorType"></el-table-column>
      <!-- 金额 -->
      <el-table-column label="金额" prop="operatorType"></el-table-column>
      <!-- Follow Up -->
      <el-table-column label="Follow Up" prop="operatorType"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <div class="total">
        <div>
          <span>分行号：12221</span>
          <span>总计：12221</span>
        </div>
        <div>
          <span>分行号：12221</span>
          <span>总计：12221</span>
        </div>
        <div>
          <span>分行号：12221</span>
          <span>总计：12221</span>
        </div>
        <div>
          <span>总计：12221</span>
        </div>
      </div>

      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="shuoming">
      <p>处理说明：</p>
      <p>1) 根据CIF电话号码致电客户，确认启动网上银行用户ID和上面列出的交易。</p>
      <p>2) 通话必须录音。</p>
      <p>3) 呼叫结果必须记录在报告中，报告保存3个月。</p>
      <p>4) 如果客户基于其他业务部门，或分行两次致电客户后仍无法联系到客户，请将报告发送至IEBD进一步跟进。如果检测到未经授权的交易，将事件报告给RBMD。</p>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import FormButton from '@/components/common/FormButton.vue';
export default {
  name: 'UserMaintain',
  filters,
  components: {
    FormButton
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0,
      queryData: {
        crn: '',
        companyType: '0',
        startStopTime: ''
      },
      tableData: [
        {
          companyType: '1',
          crn: '1',
          startStopTime: '1',
          optionType: '1',
          lastTime: '1',
          operator: '1',
          operatorType: '1'
        }
      ],
      SAStart: '1',
      SAStop: '0',
      MAMStart: '1',
      MAMStop: '0'
    };
  },
  methods: {
    handleSizeChange(val) {
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryOperatorPage();
    },
    query() {
      // 发起查询请求
      this.current = 1;
      this.queryOperatorPage();
    },
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    async queryOperatorPage() {}
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.g-bolck {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding: 0 20px;
  .total {
    span:not(:nth-of-type(1)) {
      line-height: 10px;
      margin-left: 20px;
    }
  }
}
.shuoming{
  margin-top: 10px;
  color: #888888;
  & p:nth-child(2){
    margin-top: 10px;
  }
}
.f-w-270 {
  width: 270px;
}

.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.m-t-40 {
  margin-top: 40px;
}
.m-t-20 {
  margin-top: 20px;
}
</style>