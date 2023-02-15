<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-08-10 10:34:11
 * @LastEditors: zhangcheng
 * @Description: 网银密码生成汇总报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\webbank-psd-created\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="queryData" label-width="auto">
      <el-form-item label="個人類型:" prop="entType">
        <el-select class="g-w-270" v-model="queryData.entType" placeholder="請選擇">
          <el-option
            v-for="(item,index) in transTypeList"
            :key="index"
            :label="item.entType"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道:" prop="chnnel">
        <el-select class="g-w-270" v-model="queryData.chnnel" placeholder="請選擇">
          <el-option
            v-for="(item,index) in channelList"
            :key="index"
            :label="item.chnnel"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="個人網銀客戶號:" prop="ebankCstmNo">
        <el-input class="g-w-270" v-model="queryData.ebankCstmNo" placeholder="請輸入"></el-input>
      </el-form-item>
      <el-form-item label="生成日期:" prop="transDate">
        <el-date-picker
          class="g-w-270"
          v-model="queryData.transDate"
          type="daterange"
          range-separator
          :clearable="false"
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="query"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下載</el-button>
    <!-- 列表数据区 -->
    <div class="mt-20">
      <el-table
        :data="tableData"
        stripe
        height="550px"
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="entType" label="個人類型">
          <template v-slot="{row}">{{ entTypeFilter(row.entType) }}</template>
        </el-table-column>
        <el-table-column prop="ebankCstmNo" label="個人網銀客戶號"></el-table-column>
        <el-table-column prop="userName" label="客戶名稱"></el-table-column>
        <el-table-column prop="userType" label="用戶類型">
          <template v-slot="{row}">{{ userTypeFilter(row.userType) }}</template>
        </el-table-column>
        <el-table-column prop="loginName" label="用戶名"></el-table-column>
        <el-table-column prop="chnnel" label="渠道">
          <template v-slot="{ row }">{{ channelFilter(row.chnnel) }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作員"></el-table-column>
        <el-table-column prop="batchCode" label="系統批次號">
          <template v-slot="{row}">{{ row.batchCode || '--' }}</template>
        </el-table-column>
        <el-table-column prop="mailTime" label="郵寄日期">
          <template v-slot="{row}">{{ row.mailTime || '--' }}</template>
        </el-table-column>
        <el-table-column prop="resetDate" label="生成日期"></el-table-column>
        <el-table-column prop="resetTime" label="生成時間"></el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
      </el-table>
      <!-- 分页区 -->
      <div class="g-bolck">
        <div>SA個人：{{ saNum }} MAM個人：{{ mamNum }} 總計：{{ allNum }}</div>
        <el-pagination
          :background="true"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import { downUrl } from '@/utils/downLoadTools';
import {
  resetPwdTotalReport,
  downloadResetPwdTotalReport
} from '@/api/statiscal-query';
export default {
  name: 'WebbankPsdCreated',
  components: {
    FormButton
  },
  watch: {
    'queryData.transDate': {
      handler(newVal) {
        const [startDate = '', endDate = ''] = newVal;
        this.queryData.startDate = startDate;
        this.queryData.endDate = endDate;
      }
    }
  },
  data() {
    return {
      queryData: {
        ebankCstmNo: '',
        entType: '',
        transDate: [initDate, initDate],
        startDate: initDate,
        endDate: initDate,
        chnnel: ''
      },
      transTypeList: [
        {
          value: '1',
          entType: 'SA個人'
        },
        {
          value: '2',
          entType: 'MAM個人'
        }
      ],
      channelList: [
        {
          value: '1',
          chnnel: '內管'
        },
        {
          value: '2',
          chnnel: '網銀端'
        }
      ],
      min: '',
      pickOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        disabledDate: time => {
          if (this.min) {
            const m = 90 * 24 * 60 * 60 * 1000;
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              // time.getTime() > Date.now() - 24 * 3600 * 1000
              time.getTime() > Date.now()
            );
          }

          // return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
           return time.getTime() > new Date().getTime();
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      allNum: 0,
      saNum: 0,
      mamNum: 0,
      tableData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.search();
    },
    // 用戶類型過濾
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return '管理員';
        case '2':
          return '授權員';
        case '3':
          return '錄入員';
        default:
          return val;
      }
    },
    // 个人类型过滤
    entTypeFilter(val) {
      switch (val) {
        case '1':
          return 'SA 個人';
        case '2':
          return 'MAM 個人';
        default:
          return val;
      }
    },
    // 渠道過濾
    channelFilter(val) {
      switch (val) {
        case '1':
          return '內管';
        case '2':
          return '網銀';
        case '3':
          return 'App';
        default:
          return val;
      }
    },
    // 查询
    query() {
      this.current = 1;
      this.pageSize = 10;
      this.search();
    },
    async search() {
      this.showIndex = true;
      const params = {
        pageSize: this.pageSize,
        current: this.currentPage,
        ...this.queryData
      };
      const result = await resetPwdTotalReport(params);
      if (result || result.body) {
        this.tableData = result.body.resetPwdDtosList.list;
        this.total = result.body.resetPwdDtosList.total || 0;
        this.allNum = result.body.total || 0;
        this.saNum = result.body.satotal || 0;
        this.mamNum = result.body.mamtotal || 0;
      }
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    // 改变页面条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },
    // 下载
    async downLoad() {
      const result = await downloadResetPwdTotalReport({
        pageSize: this.pageSize,
        current: this.currentPage,
        ...this.queryData
      });
      if (result && result.body) {
        downUrl(result.body);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
  .transverse-form {
    display: flex;
    flex-wrap: wrap;
    .g-w-270 {
      width: 270px;
    }
    .el-form-item {
      display: flex;
      margin-right: 40px;
      ::v-deep .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .g-bolck {
    display: flex;
    justify-content: space-between;
    padding: 10px 0px 10px;
  }
}
</style>