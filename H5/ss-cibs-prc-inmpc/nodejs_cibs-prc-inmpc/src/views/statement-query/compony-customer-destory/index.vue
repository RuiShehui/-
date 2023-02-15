<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-08-10 19:14:55
 * @LastEditors: zhangcheng
 * @Description: 密码生成/重置异常报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\compony-customer-destory\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="mySubmitForm" label-width="auto">
      <el-form-item label="個人網銀客戶號:" prop="custNo">
        <el-input class="g-w-270" v-model="mySubmitForm.custNo" placeholder="請輸入"></el-input>
      </el-form-item>
      <el-form-item label="個人類型:" prop="entType">
        <el-select class="g-w-270" v-model="mySubmitForm.entType" placeholder="全部">
          <el-option
            v-for="(item,index) in entTypeList"
            :key="index"
            :label="item.value"
            :value="item.entType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="註銷日期:" prop="transDate">
        <el-date-picker
          class="g-w-280"
          v-model="mySubmitForm.transDate"
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
        <div style="width:100px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="search"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下載</el-button>
    <!-- 列表数据区 -->
    <el-table
      height="550px"
      :data="tableData"
      class="mt-20"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column prop="ebankCstmNo" label="個人網銀客戶號"></el-table-column>
      <el-table-column prop="entType" label="個人類型">
        <template slot-scope="scope">
          <span>{{scope.row.entType === '1' ? 'SA個人' : 'MAM個人'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cardNo" label="個人證件號"></el-table-column>
      <el-table-column prop="accountOpenDate" label="開戶日期"></el-table-column>
      <el-table-column prop="closeTips" label="註銷理由"></el-table-column>
      <el-table-column prop="closeDate" label="註銷日期"></el-table-column>
      <el-table-column prop="maintainer" label="操作員"></el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
    <!-- 分页区 -->
    <div class="g-bolck">
      <div>SA個人：{{saNum}} MAM個人：{{mamNum}} 總計：{{total}}</div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import { closeAccountQuery, closeAccountDownLoad } from '@/api/apply-checkbook';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'ComponyCustomerDestory',
  components: {
    FormButton
  },
  watch: {
    'mySubmitForm.transDate': {
      handler(val) {
        this.mySubmitForm.startTime = val[0];
        this.mySubmitForm.endTime = val[1];
      }
    }
  },
  data() {
    return {
      mySubmitForm: {
        entType: '',
        custNo: '',
        transDate: [initDate, initDate],
        startTime: initDate,
        endTime: initDate
      },
      entTypeList: [
        {
          entType: '',
          value: '全部'
        },
        {
          entType: '1',
          value: 'SA個人'
        },
        {
          entType: '2',
          value: 'MAN個人'
        }
      ],
      tableData: [],
      min: '',
      pickOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过3个月的
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now() - 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      },
      current: 1,
      size: 10,
      total: 0,
      mamNum: 0,
      saNum: 0
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    // 查询
    search() {
      this.current = 1;
      this.queryList();
      // const params = {
      //   currentPage: this.currentPage,
      //   pageSize: this.pageSize
      // };
    },
    queryList() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        size: this.size
      };
      closeAccountQuery(params).then(res => {
        this.tableData = res.body.companyCustomerCloseAccounts;
        this.total = res.body.num;
        this.saNum = res.body.saNum;
        this.mamNum = res.body.mamNum;
        //  for(var k in this.tableData){
        //    this.tableData[k].entType =='1'?this.tableData[k].entType='SA个人':this.tableData[k].entType='MAN个人'
        //  }
      });
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
      this.mySubmitForm.startTime = this.mySubmitForm.transDate[0];
      this.mySubmitForm.endTime = this.mySubmitForm.transDate[1];
    },
    // 改变页面条数
    handleSizeChange(val) {
      this.size = val;
      // this.currentPage = 1;
      this.queryList();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    },
    // 下载
    async downLoad() {
      const result = await closeAccountDownLoad(this.mySubmitForm);
      if (result && result.body) {
        downUrl(result.body.url);
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
      width: 200px;
    }
    .g-w-280 {
      width: 240px;
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
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px 10px;
  }
}
</style>