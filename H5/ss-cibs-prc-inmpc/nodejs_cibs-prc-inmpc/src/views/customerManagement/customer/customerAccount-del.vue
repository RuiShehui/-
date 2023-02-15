<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:06:32
 * @LastEditTime: 2022-01-20 15:58:07
 * @LastEditors: zhangcheng
 * @Description: 客户销户
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerAccount-del.vue
-->
<template>
  <div class="contain">
    <customer-query v-show="showQueryFlag" @showIndex="showIndex" />
    <div v-if="!showQueryFlag">
      <div class="transverse-table">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') }}</div>
          <div>{{ tableData.ebankStatus | ebankStatus }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME') }}</div>
          <div>{{ tableData.entChsName }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME') }}</div>
          <div>{{ tableData.entEglsName }}</div>
        </div>
        <div v-for="(item,index) in tableData?tableData.cardList:[]" :key="index">
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (index+1) }}</div>
            <div>{{ item.cardType }}</div>
            <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') + (index+1) }}</div>
            <div>{{ item.cardNo }}</div>
          </div>
          <div class="row">
            <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') + (index+1) }}</div>
            <div>{{ item.cardArea }}</div>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_NAME') }}</div>
          <div>{{ tableData.contactsName }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
          <div>{{ tableData.contactsPhone }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
          <div>{{ tableData.emailAddress }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
          <div>{{ tableData.entAddress }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
          <div>{{ tableData.entType | entType }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
          <div>{{ tableData.adminEmpower | adminEmpower }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
          <div>{{ tableData.accountManagerTeam }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
          <div>{{ tableData.accountManagerName }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
          <div>{{ tableData.applicationDate }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
          <div>{{ tableData.remark }}</div>
        </div>
      </div>
      <el-form :model="form" ref="form" label-suffix=":">
        <el-form-item :label="$t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT_REASON')" class="g-form">
          <el-input
            type="textarea"
            rows="3"
            v-model="form.reason"
            maxlength="300"
            :show-word-limit="true"
            resize="none"
            :disabled="formDisabled"
          />
        </el-form-item>
        <div class="g-bottom">
          <el-button class="f-cancel" @click="backQuery">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
          <el-button
            type="primary"
            @click="cancellationFun"
            :disabled="formDisabled"
          >{{$t('CUSTOMER_MANAGEMENT.LOGOUT')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  closeUserMerchant,
  queryMerchantDetail,
  checkCustomerInTransitTrans
} from '@/api/customer-management/customer';
import filters from '@/filters/clientManage';
export default {
  name: 'CustomerAccountDel',
  data() {
    return {
      params: {},
      showQueryFlag: true,
      queryStatus: false,
      tableData: [], // 基本信息确认
      form: { reason: '' },
      ebankCstmNo: '',
      formDisabled: true,
      status: true
      // rules: {
      //   reason: [
      //     {
      //       required: true,
      //       message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
      //         msg: this.$t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT_REASON')
      //       }),
      //       trigger: 'blur'
      //     }
      //   ]
      // }
    };
  },
  filters,
  created() {
    // console.log(this.tableData);
  },
  methods: {
    showIndex(data) {
      this.showQueryFlag = false;
      this.init(data);
    },
    init(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      // this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
      this.queryMerchantDetail();
    },
    async queryMerchantDetail() {
      let result = await queryMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.tableData = result.body;
        this.formDisabled = false;
      }
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;width:180px';
      } else {
        return 'background:#ffffff';
      }
    },
    backQuery() {
      this.showQueryFlag = true;
    },
    cancellationFun() {
      if (this.form.reason === '' || this.form.reason === null) {
        this.$showMsg({
          message: '銷戶原因不能為空！',
          type: 'error'
        });
      } else {
        this.checkCustomerInTransitTrans();
      }
    },
    async checkCustomerInTransitTrans() {
      let result = await checkCustomerInTransitTrans({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        console.log('result.body', result.body);
        if (
          result.body.authTransaction > 0 ||
          result.body.reservationTransaction > 0
        ) {
          let msgs = null;
          if (
            result.body.authTransaction > 0 &&
            result.body.reservationTransaction > 0
          ) {
            msgs = this.$t('CUSTOMER_MANAGEMENT.ALL_TRANSACTION_ERROR');
          } else if (
            result.body.authTransaction > 0 &&
            result.body.reservationTransaction == 0
          ) {
            msgs = this.$t('CUSTOMER_MANAGEMENT.AUTH_TRANSACTION_ERROR');
          } else if (
            result.body.authTransaction == 0 &&
            result.body.reservationTransaction > 0
          ) {
            msgs = this.$t('CUSTOMER_MANAGEMENT.RESERVA_TRANSACTION_ERROR');
          }
          this.$showMsg({
            message: msgs,
            type: 'error'
          });
        } else if (
          result.body.authTransaction == 0 &&
          result.body.reservationTransaction == 0
        ) {
          this.del();
        }
      }
    },
    del() {
      // 删除请求 返回查询
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$showBox({
            content: this.$t('CUSTOMER_MANAGEMENT.USER_LOGOUT_CONFIRM'),
            confirm: async () => {
              const result = await closeUserMerchant({
                ...this.tableData,
                closeTips: this.form.reason
              });
              if (result.body) {
                this.$showMsg({
                  message: this.$t('CUSTOMER_MANAGEMENT.SUBMIT_SUCCESS', {
                    msg: this.$t('CUSTOMER_MANAGEMENT.USER_LOGOUT')
                  }),
                  type: 'success'
                });
                this.showQueryFlag = true;
              }
            }
          });
        } else {
          return false;
        }
      });
    }
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
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    &.f-cancel {
      border-color: #f06b00;
      color: #f06b00;
    }
  }
}
.g-form {
  margin-top: 20px;
  display: flex;
  ::v-deep .el-form-item__content {
    flex-grow: 1;
  }
}
</style>