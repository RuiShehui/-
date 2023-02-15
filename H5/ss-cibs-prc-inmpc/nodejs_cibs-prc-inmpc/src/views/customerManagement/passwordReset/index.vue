<!--
 * @Author: your name
 * @Date: 2022-10-08 10:03:43
<<<<<<< HEAD
<<<<<<< HEAD
 * @LastEditTime: 2022-10-13 09:58:10
=======
<<<<<<< Updated upstream
 * @LastEditTime: 2022-10-10 10:12:38
=======
 * @LastEditTime: 2022-10-13 16:59:02
>>>>>>> Stashed changes
>>>>>>> 0bed6cf6c10fedf4d9de33adc5291066c6821000
=======
 * @LastEditTime: 2022-10-13 14:11:26
>>>>>>> defdb87edd778c13f7c800675ee627d3d498e053
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\customerManagement\passwordReset\index.vue
-->
<template>
  <div class="contain" v-show="showPage">
    <customer-query v-show="showQuery" @showIndex="showIndex" route-name="PasswordReset" />
    <div v-if="showAccountOpen">
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <!-- <el-table-column width="80" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column> -->
        <el-table-column label="用戶編號">
          <template slot-scope="scope">
            <span class="f-btnColor" @click="toDetail(scope.row.userCode)">{{scope.row.userCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userEglsName" label="用戶英文名稱"></el-table-column>
         <el-table-column width="150" prop="tfaStatus" label="密碼重試次數">
          <template v-slot="{ row }">{{ row.canRetryCount }}</template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')">
          <template slot-scope="scope">{{userStatusFilter(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column width="150" prop="tfaStatus" label="操作">
          <template v-slot="{ row }">
            <span
              v-if="row.status==='0' && row.canRetryCount===0 "
              @click="resetLoginCount(row,row.userCode)"
              class="f-btnColor resetPwd"
            >重設密碼重試次數</span>
          </template>
        </el-table-column>
        <el-empty
          slot="empty"
          :image="require('@/img/table-empty.png')"
          :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
        ></el-empty>
      </el-table>
      <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page="current"
          :page-size="size"
          :total="total"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="g-bottom">
        <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryOperatorPage,
  resetLoginCount
} from '@/api/customer-management/user';
import queryCusomer from './components/customerQuery.vue';
export default {
  components: {
    queryCusomer
  },
  inject: ['onBackTop'],
  props: {
  
  },
  data() {
    return {
      showPage: true,
      showQuery: true,
      showAccountQuery: true,
      showAccountOpen: false,
      tableData: [],
      current: 1,
      size: 10,
      total: 1,
      ebankCstmNo:''
    };
  },
  watch: {},
  computed: {},
  created() {
    console.log(this.ebankCstmNo,'ebankCstmNo')
    // 授權結果頁重新編輯
  },
  methods: {
    async resetLoginCount(row,userCode) {
      const result = await resetLoginCount({ ...row,userCode });
      if(result.head.returnCode !== '000000'){
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      }else{
         this.$showMsg({
          message: result.head.returnMessage,
           type: 'success',
        });
      }
      this.init();
    },
    showIndex(data) {
      console.log(data,'data')

      this.showAccountOpen = true;
      this.showQuery = false;
      this.showAccountQuery = false;
      this.ebankCstmNo = data.ebankCstmNo
      this.init(data);
    },
    async init(data) {
      console.log(data, 'datadata');
      let result = await queryOperatorPage({
        ebankCstmNo:  this.ebankCstmNo,
        size: this.size,
        current: this.current
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
      console.log(result);
    },
    showConfirm() {},
    handleSizeChange(val) {
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.init();
    },
    query() {
      this.current = 1;
      this.init();
    },
    toDetail(userCode) {
      this.$emit('toUserInfoDetail', userCode);
    },
    back() {
      // this.$refs['ruleForm'].resetFields();
      this.showAccountOpen = false;
      this.showQuery = true;
      
    },
    userStatusFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    },
    empowerGroupFilter(val) {
      switch (val) {
        case 'A':
          return 'A';
        case 'B':
          return 'B';
        case 'C':
          return 'C';
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NONE');
        default:
          return '';
      }
    },
    tfaStatusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO');
        case '1':
        default:
          return this.$t('CUSTOMER_MANAGEMENT.YES');
      }
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ADMAIN');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.AUTH_USER');
        case '3':
          return this.$t('CUSTOMER_MANAGEMENT.INPUT_USER');
        default:
          return '';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
::v-deep .el-tabs__item.is-active {
  color: #f06b00;
}
::v-deep .el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
::v-deep .el-tabs__content {
  box-sizing: border-box;
}
.g-table-form {
  margin-bottom: 0px;
}
.g-margin {
  margin: 12px 0px 18px;
}
::v-deep .is-process {
  color: #c0c4cc;
  border-color: #c0c4cc;
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.g-bottom {
  margin: 40px 0 50px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
}
.f-btnColor {
  color: #4181fa;
  cursor: pointer;
}
</style>
