<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-11-16 14:25:43
 * @LastEditors: Please set LastEditors
 * @Description: 修改客户信息报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\change-customer-info\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form
      v-if="showForm"
      class="transverse-form"
      ref="formRef"
      :model="mySubmitForm"
      label-width="auto"
      label-position="right"
    >
      <el-form-item label="個人網銀客戶號:" prop="ebankCstmNo">
        <el-input class="g-w-270" v-model="mySubmitForm.ebankCstmNo" placeholder="請輸入"></el-input>
      </el-form-item>
      <el-form-item label=" 個人類型:" prop="transType">
        <el-select class="g-w-270" v-model="mySubmitForm.transType" placeholder="請選擇">
          <el-option
            v-for="(item,index) in transTypeList"
            :key="index"
            :label="item.transType"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改日期:" prop="transDate">
        <el-date-picker
          class="g-w-270"
          v-model="mySubmitForm.transDate"
          type="daterange"
          range-separator
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="search"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="showForm">
      <el-button size="w70" @click="downLoad">下載</el-button>
      <el-button size="w70" @click="custmInfo">客戶信息</el-button>
      <el-button size="w70" @click="accountInfo">賬戶信息</el-button>
      <el-button size="w70" @click="UserInfo">用戶信息</el-button>
    </div>

    <!-- 列表数据区 -->
    <div v-if="showIndex" class="m-t-20">
      <el-table
        height="550px"
        :data="tableData"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column width="125px" prop="ebankCstmNo" label="個人網銀客戶號"></el-table-column>
        <el-table-column width="120px" prop="entType" label="個人類型"></el-table-column>
        <el-table-column width="145px" prop="cardType" label="證件類型"></el-table-column>
        <el-table-column width="140px" prop="cardNo" label="證件號碼"></el-table-column>
        <el-table-column width="140px" prop="cardArea" label="證件簽發地/國家"></el-table-column>
        <el-table-column width="120px" prop="entEglsName" label="客戶名稱"></el-table-column>
        <el-table-column width="300px" prop="entAddress" label="地址"></el-table-column>
        <el-table-column width="120px" prop="contactsPhone" label="聯絡電話"></el-table-column>
        <el-table-column width="120px" prop="emailAddress" label="電郵地址"></el-table-column>
        <el-table-column width="140px" prop="remark" label="備註"></el-table-column>
        <el-table-column width="110px" prop="applicationDate" label="申請日期"></el-table-column>
        <el-table-column width="110px" prop="modifyDate" label="修改日期"></el-table-column>
        <el-table-column width="100px" prop="modifyTime" label="修改時間"></el-table-column>
        <el-table-column width="90px" label="賬戶信息">
          <template v-slot="{row}">
            <div class="detail" @click="toAccDetail(row)">詳情</div>
          </template>
        </el-table-column>
        <el-table-column width="90px" label="用戶信息">
          <template v-slot="{row}">
            <div class="detail" @click="toUseDetail(row)">詳情</div>
          </template>
        </el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
      </el-table>

      <!-- 分页区 -->
      <!-- <div class="g-bolck">
        <div class="total">
          <span>總計：{{total}}</span>
        </div>
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
      </div>-->
    </div>
    <Detail
      class="mt-40"
      v-else
      @backIndex="backIndex"
      :showUserInfo="showUserInfo"
      :showAcctInfo="showAcctInfo"
      :showData="showData"
    />
    <div v-if="acctNoInfo">
      <accountInfo @backIndex="backIndex" :showData="showData"></accountInfo>
    </div>
    <div v-if="userIn">
      <userInfo @backIndex="backIndex" :showData="showData"></userInfo>
    </div>
    <!-- 分页区 -->
    <div class="g-bolck" v-if="showForm">
      <div class="total">
        <span>總計：{{total}}</span>
      </div>
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
    <!-- 详情 -->
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import Detail from './components/Detail.vue';
import {
  queryList,
  // infoQueryList,
  operatorQueryList,
  downloadUpdateUser,
  downloadOpera,
  updateDownloadUser,
  updateInfoQueryList,
  queryOperatorList,
  queryAccountList,
  updatedownloadUsers,
  updownloadOperas
} from '@/api/statiscal-query/index.js';
import CONSTANT from '@/utils/constant.js';
import { formatAcctNo } from '@/utils/tools.js';
import { downUrl } from '@/utils/downLoadTools';
import accountInfo from './components/accountInfo.vue';
import userInfo from './components/userInfo.vue';
export default {
  name: 'ChangeCustomerInfo',
  components: {
    FormButton,
    Detail,
    accountInfo,
    userInfo
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
        ebankCstmNo: '',
        transType: '',
        transDate: [initDate, initDate],
        startTime: initDate,
        endTime: initDate
      },
      transTypeList: [
        {
          transType: '全部',
          value: ''
        },
        {
          transType: 'SA個人',
          value: '1'
        },
        {
          transType: 'MAM個人',
          value: '2'
        }
      ],
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
              time.getTime() > Date.now() - 24 * 3600 * 1000
            );
          }

          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      showIndex: true,
      showAcctInfo: false,
      showUserInfo: false,
      custNo: '',
      showData: [],
      acctNoInfo: false,
      userIn: false,
      showForm: true
      // showData:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getOperatorList() {
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        endTime: this.mySubmitForm.transDate[1],
        startTime: this.mySubmitForm.transDate[0],
        transType:this.mySubmitForm.transType,
        ebankCstmNo:this.mySubmitForm.ebankCstmNo
      };
      const result = await queryOperatorList(params);
      console.log(result, 'queryOperatorList');
      if (result && result.body.updateCustomerInfoOperat) {
        this.total = result.body.total;
        this.showData = result.body.updateCustomerInfoOperat;
      } else {
        this.total = 0;
        this.showData = [];
      }
    },
    async queryAccountList() {
      let params = {
         current: this.currentPage,
        size: this.pageSize,
        endTime: this.mySubmitForm.transDate[1],
        startTime: this.mySubmitForm.transDate[0],
        transType:this.mySubmitForm.transType,
        ebankCstmNo:this.mySubmitForm.ebankCstmNo
      };
      const result = await queryAccountList(params);
      console.log(result, 'queryOperatorList');
      if (result && result.body.updateCustomerInfoUser) {
        this.total = result.body.total;
        this.showData = result.body.updateCustomerInfoUser;
        this.showData.forEach(item => {
          CONSTANT.ACCOUNT_TYPE_LIST.forEach(accountType => {
            if (accountType.value === item.accountType) {
              item.accountType = accountType.label;
            }
          });
          CONSTANT.CONTACT_CURRENCY.forEach(currencyType => {
            if (currencyType.value == item.currencyType) {
              item.currencyType = currencyType.label;
            }
          });
        });
      } else {
        this.total = 0;
        this.showData = [];
      }
    },
    async getList() {
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        endTime: this.mySubmitForm.transDate[1],
        startTime: this.mySubmitForm.transDate[0],
        transType:this.mySubmitForm.transType,
        ebankCstmNo:this.mySubmitForm.ebankCstmNo

        // ...this.mySubmitForm
      };
      const result = await queryList(params);
      if (result && result.body) {
        this.tableData = result.body.updateCustomerInfos.list;
        this.total = result.body.num;
        this.tableData.forEach(item => {
          this.transTypeList.forEach(itm => {
            if (item.entType == itm.value) {
              item.entType = itm.transType;
            }
          });
        });
      } else {
        this.tableData = [];
      }
    },
    // 账户详情
    async toAccDetail(row) {
      this.showIndex = false;
      this.showUserInfo = false;
      this.showAcctInfo = true;
      this.showForm = false;
      const result = await updateInfoQueryList({
        ebankCstmNo: row.ebankCstmNo,
        startTime: this.mySubmitForm.startTime,
        endTime: this.mySubmitForm.endTime
      });
      // console.log(result, 'restus');
      this.showData = result.body.updateCustomerInfoUser;
      this.ebankCstmNo = row.ebankCstmNo;
      this.showData.forEach(item => {
        item.accountNo = formatAcctNo(item.accountNo);
        CONSTANT.CONTACT_CURRENCY.forEach(currencyType => {
          if (currencyType.value == item.currencyType) {
            item.currencyType = currencyType.label;
          }
        });
        CONSTANT.ACCOUNT_TYPE_LIST.forEach(accountType => {
          if (accountType.value === item.accountType) {
            item.accountType = accountType.label;
          }
        });
      });
    },
    // 用户详情
    async toUseDetail(row) {
      let params = {
        ebankCstmNo: row.ebankCstmNo,
        startTime: this.mySubmitForm.startTime,
        endTime: this.mySubmitForm.endTime
      };
      const result = await operatorQueryList(params);
      this.showData = result.body.updateCustomerInfoOperat;
      this.ebankCstmNo = row.ebankCstmNo;
      this.showIndex = false;
      this.showUserInfo = true;
      this.showAcctInfo = false;
      this.showForm = false;

      // console.log(result,'rusetuuuuuuuuu')
    },

    // 回到首页
    backIndex() {
      this.showIndex = true;
      //  this.showIndex = false;
      this.showUserInfo = true;
      this.showAcctInfo = false;
      this.showForm = true;
      this.ebankCstmNo = '';
    },
    // 查询
    search() {
      this.currentPage = 1;
      // this.showIndex = true;
      // this.showUserInfo = false;
      // this.showAcctInfo = false;
      if (this.showIndex) {
        this.acctNoInfo = false;
        this.showIndex = true;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getList();
        return;
      }
      if (this.userIn) {
        this.acctNoInfo = false;
        this.showIndex = false;
        this.userIn = true;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getOperatorList();
        return;
      }
      if (this.acctNoInfo) {
        this.acctNoInfo = true;
        this.showIndex = false;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.queryAccountList();
        return;
      }

      // this.getOperatorList()
    },
    // 重置
    handleReset() {
     
      this.$refs['formRef'].resetFields();
      this.acctNoInfo = false;
      this.showIndex = true;
      this.userIn = false;
      this.showUserInfo = false;
      this.showAcctInfo = false;
      this.getList();
    },
    // 改变页面条数
    handleSizeChange(val) {
      // console.log(val,'val')
      this.pageSize = val;
      this.currentPage = 1;
      if (this.showIndex) {
        this.acctNoInfo = false;
        this.showIndex = true;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getList();
        return;
      }
      if (this.userIn) {
        this.acctNoInfo = false;
        this.showIndex = false;
        this.userIn = true;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getOperatorList();
        return;
      }
      if (this.acctNoInfo) {
        this.acctNoInfo = true;
        this.showIndex = false;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.queryAccountList();
        return;
      }
    },
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.showIndex) {
        this.acctNoInfo = false;
        this.showIndex = true;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getList();
        return;
      }
      if (this.userIn) {
        this.acctNoInfo = false;
        this.showIndex = false;
        this.userIn = true;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.getOperatorList();
        return;
      }
      if (this.acctNoInfo) {
        this.acctNoInfo = true;
        this.showIndex = false;
        this.userIn = false;
        this.showUserInfo = false;
        this.showAcctInfo = false;
        this.queryAccountList();
        return;
      }
    },
    // 下载
    async downLoad() {
      console.log(this.ebankCstmNo, 'this.ebankCstmNo');
      console.log(this.acctNoInfo, 'this.acctNoInfo');
      if (this.showUserInfo) {
        // 用用
        const result = await downloadOpera({
          current: this.currentPage,
          size: this.pageSize,
          ebankCstmNo: this.mySubmitForm.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.showIndex) {
        // 表表
        console.log(1);
        const result = await downloadUpdateUser({
          current: this.currentPage,
          size: this.pageSize,
          ...this.mySubmitForm
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.acctNoInfo) {
        console.log('账户');
        const result = await updatedownloadUsers({
          current: this.currentPage,
          size: this.pageSize,
          ...this.mySubmitForm
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.userIn) {
        console.log('修改');
        const result = await updownloadOperas({
          current: this.currentPage,
          size: this.pageSize,
          ...this.mySubmitForm
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      }
    },
    custmInfo() {
      this.acctNoInfo = false;
      this.showIndex = true;
      this.userIn = false;
      this.showUserInfo = false;
      this.showAcctInfo = false;
      this.getList();
    },
    accountInfo() {
      this.acctNoInfo = true;
      this.showIndex = false;
      this.userIn = false;
      this.showUserInfo = false;
      this.showAcctInfo = false;
      this.queryAccountList();
    },
    UserInfo() {
      this.userIn = true;
      this.acctNoInfo = false;
      this.showIndex = false;
      this.showUserInfo = false;
      this.showAcctInfo = false;
      this.getOperatorList();
    }
    //  const result = await do{wnloadUpdateUser({
    //    current: this.currentPage,
    //     size: this.pageSize,
    //     ...this.mySubmitForm
    //  })
    //  if (result && result.body) {
    //     downUrl(result.body.url);
    //   }
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
  .mt-40 {
    margin-top: 40px;
  }
  .m-t-20 {
    margin-top: 20px;
  }
  .g-bolck {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 20px;
    .total {
      span:not(:nth-of-type(1)) {
        margin-left: 20px;
      }
    }
  }
  .detail {
    color: #e34141;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>