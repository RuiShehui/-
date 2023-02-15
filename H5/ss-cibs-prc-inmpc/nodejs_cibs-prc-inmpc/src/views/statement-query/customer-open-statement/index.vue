<!--
 * @Author: zhutao
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-10-19 19:20:09
 * @LastEditors: Please set LastEditors
 * @Description: 公司客户开户报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\customer-open-statement\index.vue
-->
<template>
  <div class="waitAuth">
    <el-form
      ref="mySubmitFormRef"
      :model="mySubmitForm"
      label-width="auto"
      class="transverse-form"
      label-suffix=":"
      label-position="right"
      v-if="showForm"
    >
      <el-form-item label="個人網銀客戶號" prop="ebankCstmNo">
        <el-input class="f-w-270" v-model="mySubmitForm.ebankCstmNo" placeholder="請輸入"></el-input>
      </el-form-item>

      <el-form-item label="個人類型" prop="entType">
        <el-select class="f-w-270" v-model="mySubmitForm.entType" placeholder="請選擇">
          <el-option
            v-for="(item,index) in authStatusList"
            :key="index"
            :label="item.authStatus"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="開戶日期" prop="transDate">
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
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <div  v-if="showForm">
      <el-button @click="download">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
      <el-button size="w70" @click="custmInfo">客戶信息</el-button>
      <el-button size="w70" @click="accountInfo">賬戶信息</el-button>
      <el-button size="w70" @click="UserInfo">用戶信息</el-button>
    </div>

    <!-- 列表数据区 -->
    <div v-if="accountList">
      <el-table
        height="550px"
        :data="mySubData"
        style="width: 100%"
        class="m-t-20"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column prop="ebankCstmNo" label="個人網銀客戶號" width="130px"></el-table-column>
        <el-table-column prop="entType" label="個人類型" width="120px"></el-table-column>
        <el-table-column prop="cardType" label="證件類型" width="120px"></el-table-column>
        <el-table-column prop="cardNo" label="證件號碼" width="120px"></el-table-column>
        <el-table-column prop="cardArea" label="證件簽發地/國家" width="150px"></el-table-column>
        <el-table-column prop="contactsName" label="客戶名稱" width="120px"></el-table-column>
        <el-table-column prop="entAddress" label="地址" width="300px"></el-table-column>
        <el-table-column prop="contactsPhone" label="聯絡電話" width="120px"></el-table-column>
        <el-table-column prop="emailAddress" label="電郵地址" width="120px"></el-table-column>
        <el-table-column prop="remark" label="備註" width="120px"></el-table-column>
        <el-table-column prop="applicationDate" label="申請日期" width="120px"></el-table-column>
        <el-table-column prop="accountOpenDate" label="開戶日期" width="120px"></el-table-column>
        <el-table-column prop="accountOpenTime" label="開戶時間" width="120px"></el-table-column>
        <el-table-column label="賬戶資訊" width="90px">
          <template slot-scope="scope">
            <el-button @click="detailAccount(scope.row)" type="text" size="small">詳情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用戶資訊" width="90px">
          <template slot-scope="scope">
            <el-button @click="detailBtn(scope.row)" type="text" size="small">詳情</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="accountInfo" label="账户信息" min-width="10%"></el-table-column>
        <el-table-column prop="userInfo" label="用户信息" min-width="10%"></el-table-column>-->
      </el-table>
      <!-- 分页区 -->
    </div>

    <!-- 分页区 -->

    <!-- </div> -->
    <!-- 查询区 -->

    <accountDetail
      v-if="isDetail"
      @back="backIndex"
      :accountDetails="accountDetails"
      :ebankCstmNo="ebankCstmNo"
    ></accountDetail>
    <userDetail v-if="isUserDetail" @back="backIndex" :userDetailList="userDetailList"></userDetail>

    <accountInfo v-if="accountIn" :showData="showData" @backIndex="backIndex"></accountInfo>
    <userInfo v-if="userIn" :showData="showData" @backIndex="backIndex"></userInfo>
    <div class="g-bolck">
      <div class="total">
        <span>總計：{{total}}</span>
      </div>
      <el-pagination
        style="margin-top:10px"
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
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import {
  openAccount,
  infoQueryList,
  operatorQuery,
  openQueryAccountList,
  openQueryOpenOperatorList
} from '@/api/statiscal-query/index.js';
import FormButton from '@/components/common/FormButton.vue';
import accountDetail from './account-detail.vue';
import userDetail from './user-detail.vue';
import userInfo from './userInfo.vue';
import accountInfo from './accountInfo.vue';
import CONSTANT from '@/utils/constant.js';
import { formatAcctNo } from '@/utils/tools.js';
import {
  openDownload,
  downloadUser,
  openUser,
  opendownloadAccount,
  opendownloadOpera
} from '@/api/statiscal-query';
import { downUrl } from '@/utils/downLoadTools';
export default {
  name: 'CustomerOpenStatement',
  components: {
    FormButton,
    accountDetail,
    userDetail,
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
      accountList: true,
      isDetail: false,
      isUserDetail: false,
      mySubmitForm: {
        ebankCstmNo: '',
        entType: '',
        transDate: [initDate, initDate],
        startTime: initDate,
        endTime: initDate
        // isDown:true
      },
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
              time.getTime() > Date.now() - 24 * 3600 * 1000
            );
          }

          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      authStatusList: [
        {
          authStatus: '全部',
          value: ''
        },
        {
          authStatus: 'SA個人',
          value: '1'
        },
        {
          authStatus: 'MAM個人',
          value: '2'
        }
      ],
      mySubData: [],
      accountDetails: [],
      userDetailList: [],
      ebankCstmNo: '',
      showData: [],
      // 分页
      current: 1,
      size: 10,
      total: 0,
      accountIn: false,
      userIn: false,
      showForm: true
    };
  },
  created() {
    this.openList();
    // this.queryAuthsInManagmentInit();
  },
  methods: {
    async openList() {
      let params = {
        current: this.current,
        size: this.size,
        ...this.mySubmitForm
        // startTime: ''
      };
      const result = await openAccount(params);
      // console.log(result,'result')
      if (result.body && result.body.userMerchantPage) {
        this.total = result.body.total;
        this.mySubData = result.body.userMerchantPage;
        let entType = [
          {
            value: '1',
            label: 'SA個人'
          },
          {
            value: '2',
            label: 'MAM個人'
          }
        ];
        this.mySubData.forEach(item => {
          entType.forEach(itm => {
            if (item.entType == itm.value) {
              item.entType = itm.label;
            }
          });
          
        });
      } else {
        this.mySubData = [];
        this.total = 0;
      }
    },
    async openQueryOpenOperatorList() {
      let params = {
        current: this.current,
        size: this.size,
        ...this.mySubmitForm
        // startTime: ''
      };
      const result = await openQueryOpenOperatorList(params);
      if (result.body && result.body.userMerchantOperators) {
        this.showData = result.body.userMerchantOperators;
        this.total = result.body.total;
      } else {
        this.showData = [];
        this.total = 0;
      }

      console.log(result, 'result');
    },
    async openQueryAccountList() {
      let params = {
        current: this.current,
        size: this.size,
        ...this.mySubmitForm
        // startTime: ''
      };
      const result = await openQueryAccountList(params);
      if (result.body && result.body.userAccountInfs) {
        this.showData = result.body.userAccountInfs;
        this.total = result.body.total;
        this.showData.forEach(item => {
          CONSTANT.ACCOUNT_TYPE_LIST.forEach(accountType => {
            if (accountType.value === item.accountType) {
              item.accountType = accountType.label;
            }
            CONSTANT.CONTACT_CURRENCY.forEach(currencyType => {
              if (currencyType.value == item.currencyType) {
                item.currencyType = currencyType.label;
              }
            });
          });
        });
      } else {
        this.showData = [];
        this.total = 0;
      }
      // this.showData = result.body.userAccountInfs
      //  this.total = result.body.total;
      console.log(result, 'result');
    },
    // 賬戶按鈕
    async detailAccount(row) {
      this.isDetail = true;
      this.accountList = false;
      this.isUserDetail = false;
      this.showForm = false;
      this.showForm = false;
      this.accountIn = false;
      this.userIn = false;
      const result = await infoQueryList({ ebankCstmNo: row.ebankCstmNo });
      this.accountDetails = result.body.userAccountInfs;
      this.ebankCstmNo = row.ebankCstmNo;
      this.accountDetails.forEach(item => {
        item.accountNo = formatAcctNo(item.accountNo);
        CONSTANT.CONTACT_CURRENCY.forEach(currencyType => {
          if (currencyType.value == item.currencyType) {
            item.currencyType = currencyType.label;
          }
        });
        CONSTANT.ACCOUNT_TYPE_LIST.forEach(accountType => {
          if (accountType.value == item.accountType) {
            item.accountType = accountType.label;
          }
        });
      });
    },
    // 用戶按鈕
    async detailBtn(row) {
      this.isDetail = false;
      this.accountList = false;
      this.isUserDetail = true;
      this.showForm = false;
      this.accountIn = false;
      this.userIn = false;
      const result = await operatorQuery({ ebankCstmNo: row.ebankCstmNo });
      // console.log(result,'result')
      this.ebankCstmNo = row.ebankCstmNo;
      this.userDetailList = result.body.userMerchantOperators;
      this.userDetailList.forEach(item => {
        let stataus = [
          {
            value: '0',
            label: '停用'
          },
          {
            value: '1',
            label: '啟用'
          },
          {
            value: '2',
            label: '啟用'
          }
        ];
        stataus.forEach(type => {
          if (item.status === type.value) {
            item.status = type.label;
          }
        });
      });
      // console.log(this.userDetailList, ' this.userDetailList');
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      if (this.accountList) {
        this.accountIn = false;
        this.accountList = true;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openList();
      }
      if (this.accountIn) {
        this.accountIn = true;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openQueryAccountList();
      }
      if (this.userIn) {
        this.userIn = true;
        this.accountIn = false;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.openQueryOpenOperatorList();
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      if (this.accountList) {
        this.accountIn = false;
        this.accountList = true;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openList();
      }
      if (this.accountIn) {
        this.accountIn = true;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openQueryAccountList();
      }
      if (this.userIn) {
        this.userIn = true;
        this.accountIn = false;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.openQueryOpenOperatorList();
      }
    },
    // 重置
    handleReset() {
      this.$refs.mySubmitFormRef.resetFields();
    },
    // 查询
    query() {
      this.current = 1;
      this.openList();
      if (this.accountList) {
        this.accountIn = false;
        this.accountList = true;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openList();
      }
      if (this.accountIn) {
        this.accountIn = true;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.userIn = false;
        this.openQueryAccountList();
      }
      if (this.userIn) {
        this.userIn = true;
        this.accountIn = false;
        this.accountList = false;
        this.isDetail = false;
        this.isUserDetail = false;
        this.openQueryOpenOperatorList();
      }
    },
    backIndex() {
      this.isDetail = false;
      this.accountList = true;
      this.isUserDetail = false;
      this.accountIn = false;
      this.userIn = false;
      this.showForm =true;
      this.ebankCstmNo = '';
    },
    async download() {
      // if (this.mySubmitForm.ebankCstmNo !=='') {
      //   console.log(1);
      //   this.ebankCstmNo = this.mySubmitForm.ebankCstmNo;
      // } else {
      //   console.log(2);
      //   this.ebankCstmNo = '';
      // }
      if (this.accountList) {
        const result = await openDownload({
          current: this.currentPage,
          size: this.pageSize,
          ...this.mySubmitForm
          // ebankCstmNo: this.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.isDetail) {
        const result = await downloadUser({
          current: this.currentPage,
          size: this.pageSize,
          ebankCstmNo: this.ebankCstmNo
          // ebankCstmNo: this.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.isUserDetail) {
        const result = await openUser({
          current: this.currentPage,
          size: this.pageSize,
          ebankCstmNo: this.ebankCstmNo
          // ebankCstmNo: this.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.accountIn) {
        const result = await opendownloadAccount({
          current: this.currentPage,
          size: this.pageSize,
          ebankCstmNo: this.ebankCstmNo
          // ebankCstmNo: this.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      } else if (this.userIn) {
        const result = await opendownloadOpera({
          current: this.currentPage,
          size: this.pageSize,
          ebankCstmNo: this.ebankCstmNo
          // ebankCstmNo: this.ebankCstmNo
        });
        // console.log(result, 'result');
        if (result && result.body) {
          downUrl(result.body.url);
        }
      }
    },
    custmInfo() {
      this.accountIn = false;
      this.accountList = true;
      this.isDetail = false;
      this.isUserDetail = false;
      this.userIn = false;
      this.openList();
    },
    accountInfo() {
      this.accountIn = true;
      this.accountList = false;
      this.isDetail = false;
      this.isUserDetail = false;
      this.userIn = false;
      this.openQueryAccountList();
    },
    UserInfo() {
      this.userIn = true;
      this.accountIn = false;
      this.accountList = false;
      this.isDetail = false;
      this.isUserDetail = false;
      this.openQueryOpenOperatorList();
    }
  }
};
</script>
<style lang="scss" scoped>
.waitAuth {
  background: #fff;
  min-width: 600px;
  padding: 32px 24px;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
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
  .m-t-20 {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 24px;
  }
  .flexc {
    margin-top: 2px;
  }
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
/deep/ div.cell {
  margin-left: 0px !important;
}
/deep/ .el-pagination {
  text-align: right !important;
}
</style>