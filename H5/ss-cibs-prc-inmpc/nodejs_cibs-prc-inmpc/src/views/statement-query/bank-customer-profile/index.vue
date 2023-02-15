
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
      <!-- 交易日期 -->
      <el-form-item label="交易日期" prop="companyType">
        <el-select 　v-model="queryData.companyType" class="f-w-270">
          <el-option
            v-for="(item,index) in dateArray"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <el-button class="m-t-20">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <el-table
      class="m-t-40"
      :data="tableData"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 活跃度 -->
      <el-table-column label="活跃度" prop="sendTime"></el-table-column>
      <!-- 数量（Single Authority） -->
      <el-table-column label="数量（Single Authority）" prop="accountNo"></el-table-column>
      <!--数量（Joint Authodities）-->
      <el-table-column label="数量（Joint Authodities）" prop="cry"></el-table-column>
      <!-- 总计 -->
      <el-table-column label="总计" prop="submitTime"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <!-- 合计 -->
    <div class="g-bolck">
      <div class="total">
        <span>{{$t('STATEMENT_QUERY.TOTAL')}}：{{total}}</span>
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
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import FormButton from '@/components/common/FormButton.vue';
import { checkApplyQuery } from '@/api/apply-checkbook';
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
        companyType: 1,
        startStopTime: ''
      },
      tableData: [],
      endTime: '20220530',
      startTime: '20220527',
      dateArray: [
        // {
        //   value: '0',
        //   label: '2021/03/20'
        // },
        // {
        //   value: '1',
        //   label: '2021/03/21'
        // }
      ]
    };
  },
  created() {
    this.initTime();
    this.queryList();
  },
  watch: {
    'queryData.startStopTime': {
      handler(val) {
        this.startTime = val[0].replace(/-/g, '');
        this.endTime = val[1].replace(/-/g, '');
      }
    }
  },
  methods: {
    //初始化时间　默认查询近一个月的记录
    initTime() {
      for (let i = 1; i < 30; i++) {
        this.dateArray.unshift({
          value: i,
          label: new Date(
            new Date().setDate(new Date().getDate() - i)
          ).toLocaleDateString()
        });
      }
    },
    queryList() {
      let params = {
        endTime: this.endTime,
        startTime: this.startTime,
        current: this.current,
        size: this.size
      };
      checkApplyQuery(params).then(res => {
        this.tableData = res.body.checkStatisticsList;
        this.total = res.body.num;
        console.log('queryList', res);
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    },
    query() {
      // 发起查询请求
      this.current = 1;
      this.queryList();
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
      margin-left: 20px;
    }
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
  margin-top: 30px;
}
.m-t-20 {
  margin-top: 20px;
}
</style>