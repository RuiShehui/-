<template>
  <div class="g-high-risk-wrapper" v-loading="requestLoading">
    <div class="g-table-wrapper" v-if="status">
      <el-table
        :data="tableData"
        style="width: 100%;"
        :stripe="true"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="merchantAlias" :label="$t('BILLPAYMENT.PAYEE_NICKNAME')"></el-table-column>
        <el-table-column prop="merchantName" :label="$t('BILLPAYMENT.MERCHANT_NAME')"></el-table-column>
        <el-table-column prop="billTypeInfo" :label="$t('BILLPAYMENT.BILL_TYPE')"></el-table-column>
        <el-table-column prop="billNo" :label="$t('BILLPAYMENT.BILL_NO')"></el-table-column>
        <el-table-column prop="billCode" label="$t('BILLPAYMENT.BILL_NO')" v-if="statusone"></el-table-column>
        <el-table-column :label="$t('BILLPAYMENT.OPERATE')" fixed="right">
          <template slot-scope="scope">
            <span
              class="g-button"
              type="text"
              @click="goBillPayment(scope.row)"
              style="color:#F06B00"
            >{{$t('BILLPAYMENT.PAY')}}</span>

            <div class="u-line"></div>
            <span
              class="g-button"
              type="text"
              @click="edit(scope.row)"
              style="color:#F06B00"
            >{{$t('BILLPAYMENT.REVISE')}}</span>
            <div class="u-line"></div>
            <span
              class="g-button"
              type="text"
              @click="handleDelete(scope.row)"
              style="color:#F23F47"
            >{{$t('BILLPAYMENT.DELETE')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, sizes, jumper"
      :total="Number(total)"
      :current-page="Number(currentPage)"
      :page-size="Number(pageSize)"
      :page-sizes="[10, 20, 30, 50]"
      class="pagination"
      style="padding-bottom: 36px;"
    ></el-pagination>
    <div class="g-btns">
      <v-button size="w210" type="primary" @click="goBusinessInfo">{{$t('BILLPAYMENT.ADD_PAYEE')}}</v-button>
    </div>
    <div class="g-dialog-wrapper" v-if="dialogVisible">
      <el-dialog :visible.sync="dialogVisible" width="500px" top="0vh">
        <div class="m-content-wrapper">
          <div style="text-align: center;">
            <img src="@/images/common/warning.png" alt />
          </div>
          <p>{{$t('BILLPAYMENT.SELECT_ACCOUNT',{name:name})}}</p>
        </div>
        <div slot="footer" class="g-btns">
          <v-button
            class="u-hasMargin"
            @click="dialogVisible = false"
            size="w120"
          >{{$t('COMMON.CANCEL')}}</v-button>
          <v-button @click="confirm" size="w120" type="primary">{{$t('BILLPAYMENT.SURE')}}</v-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryMerchantListPage } from '@/api/payService.js';
import { deleteMyMerchantSubmit } from '@/api/payService.js';
import { mapState } from 'vuex';
import { sendEmail } from '@/api/sendMsg';
import { softToken } from '@/components/messageBox';
export default {
  data() {
    return {
      name: '',
      status: true,
      satsu: false,
      total: 0,
      pageSize: 10,
      currentPage: '1',
      billCode: '',
      statusone: false,
      deletetatol: '',
      tableData: [],
      dialogVisible: false
    };
  },
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  created() {
    this.Datalist();
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  methods: {
    async Datalist() {
      const lang = localStorage.getItem('lang');
      let langFlag = lang == 'zh-CN' ? '0' : lang == 'zh-HK' ? '1' : '2';
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        langFlag: langFlag
      };
      const res = await queryMerchantListPage(params);
      this.tableData = res.total == 0 ? null : res.records;
      if (this.tableData.length == 0) {
        this.status = false;
        this.total = 0;
      } else {
        this.status = true;
        this.total = res.total;
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.Datalist();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.Datalist();
    },
    goBusinessInfo() {
      this.$router.push('/payService/highRiskBusiness/busniessInfo');
    },
    goBillPayment(scope) {
      let paramsObj = {};
      paramsObj = {
        ...scope,
        type: 'edit'
      };
      sessionStorage.setItem('paramsObj', JSON.stringify(paramsObj));
      this.$router.push({
        path: '/payService/billPayment'
      });
    },
    edit(scope) {
      console.log(scope.billCode, 'scope');
      this.billCode = scope.billCode;
      let paramsObj = {};
      paramsObj = {
        ...scope,
        type: 'edit',
        billCode: this.billCode
      };
      sessionStorage.setItem('paramsObj', JSON.stringify(paramsObj));
      this.$router.push({
        path: '/payService/highRiskBusiness/busniessInfo'
      });
    },
    handleDelete(scope) {
      this.deletetatol = scope;
      this.dialogVisible = true;
    },
    async confirm() {
      this.dialogVisible = false;
      let paramsone = {
        billCode: this.deletetatol.billCode,
        billNo: this.deletetatol.billNo,
        billType: this.deletetatol.billType,
        merchantAlias: this.deletetatol.merchantAlias,
        merchantName: this.deletetatol.merchantName,
        merchantType: this.deletetatol.merchantType,
        merchantTypeInfo: this.deletetatol.merchantTypeInfo,
        billTypeInfo: this.deletetatol.billTypeInfo,
        type: 'del'
      };
      deleteMyMerchantSubmit(paramsone).then(({ body = {}, head = {} }) => {
        if (head.returnCode == 'OTP000107') {
          const tradeInfo = JSON.stringify({ ...paramsone, type: '3' });
          softToken({
            softTokenCode: '',
            otpType: '060102',
            tradeInfo: tradeInfo
          }).then(() => {
            this.confirm();
          });
        }
        if (body) {
          this.sendEmail(this.deletetatol);
          const { authResultInfo = {} } = body;
          if (authResultInfo.authResultState !== '91') {
            let message = '';
            if (authResultInfo.authResultState === '03') {
              message = this.$t('BILLPAYMENT.SUBMIT_SUCCESS');
            } else {
              message = this.$t('COMMON.SUBMIT_SUCCESS');
            }
            this.$message({
              type: 'success',
              message,
              delay: 3000
            });
          } else {
            this.$message({
              type: 'fail',
              message: this.$t('COMMON.SUBMIT_FAIL'),
              delay: 3000
            });
          }
          this.Datalist();
        }
      });
      // const { authResultInfo = {} } = await deleteMyMerchantSubmit(paramsone);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-table-wrapper {
  // min-height: 300px;
  padding-bottom: 16px;
}
.g-btns {
  display: flex;
  justify-content: center;
}
.g-dialog-wrapper {
  img {
    width: 80px;
    height: 80px;
  }
  p {
    text-align: center;
    margin: 0 auto;
  }
}
.m-content-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  p {
    width: 336px;
    height: 24px;
    font-size: 16px;
    color: #1b1b1b;
    letter-spacing: 0;
    text-align: center;
    line-height: 24px;
    font-weight: 400px;
    padding-top: 24px;
  }
}
.u-hasMargin {
  margin-right: 24px;
}
.u-line {
  width: 1px;
  height: 10px;
  display: inline-block;
  margin-left: 8px;
  margin-right: 8px;
  background-color: #f0f0f0;
}
/deep/.el-table .cell {
  padding-left: 24px !important;
  padding-right: 12px !important;
}
.g-button {
  cursor: pointer;
}
</style>