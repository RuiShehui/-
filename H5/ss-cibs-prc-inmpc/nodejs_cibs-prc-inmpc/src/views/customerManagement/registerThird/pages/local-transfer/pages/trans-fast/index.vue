<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-23 19:37:15
 * @LastEditTime: 2022-07-18 11:46:25
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\local-transfer\pages\trans-fast\index.vue
-->
<template>
  <div class="transfer-fast-page">
    <query-menu
      :properties="{
        registerCode: $t('CUSTOMER_MANAGEMENT.REGISTER_CODE'),
        payeeName: $t('CUSTOMER_MANAGEMENT.PAYEE_NAME'),
        payeeBankCode: $t('CUSTOMER_MANAGEMENT.PAYEE_BANK'),
        payeeIdentifyMethod: $t('CUSTOMER_MANAGEMENT.PAYEE_IDENTIFY_METHOD')
      }"
      :is-show-hk="true"
      :localTransferType="localTransferType"
      :default-value="{
        registerCode: '',
        payeeName: '',
        payeeBankCode: '',
        payeeIdentifyMethod: ''
      }"
      @handleSearch="handleSearch"
      @handleAdd="handleAdd"
    />
    <el-table
      :data="tableData"
      class="g-table"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column prop="number" :label="$t('COMMON.SERIAL_NUMBER')" min-width="80" />
      <el-table-column
        prop="registerCode"
        :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')"
        min-width="200"
      />
      <el-table-column
        prop="payeeIdentifyMethod"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_IDENTIFY_METHOD')"
        min-width="200"
      >
        <template v-slot="{ row }">
          {{
          payeeIdentifyMethodList.find(
          item => item.value === row.payeeIdentifyMethod
          )
          ? payeeIdentifyMethodList.find(
          item => item.value === row.payeeIdentifyMethod
          ).label
          : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payeeBankCode"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK')"
        min-width="200"
      >
        <template v-slot="{ row }">
          <template v-if="['EMAL', 'MOBN'].includes(row.payeeIdentifyMethod)">
            <template v-if="row.selectBankType === 'PRE'">預設收款銀行</template>
            <template v-if="row.selectBankType === 'DEF'">演示銀行</template>
            <template v-if="row.selectBankType === 'OPT'">
              <!-- {{ row.payeeBank }} -->
              {{
              fpsBankList.find(item => item.value === row.payeeBankCode)
              ? fpsBankList.find(item => item.value === row.payeeBankCode)
              .label
              : row.payeeBank
              }}
            </template>
          </template>
          <template v-else>
            {{
            fpsBankList.find(item => item.value === row.payeeBankCode)
            ? fpsBankList.find(item => item.value === row.payeeBankCode)
            .label
            : row.payeeBank
            }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="payeeName"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')"
        min-width="120"
      />
      <!-- <el-table-column prop="payeeAccount" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')" min-width="230" /> -->
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACNO')" min-width="230">
        <template v-slot="{ row }">
          <!-- getInfoByPayeeMethod(payeeIdentifyMethod, row) -->
          {{ getInfoByPayeeMethod(row.payeeIdentifyMethod, row) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="150">
        <template v-slot="{ row }">
          <span
            class="g-op-btn update-btn"
            type="text"
            @click="handleEdit(row)"
          >{{ $t('COMMON.UPDATE') }}</span>
          <span
            class="g-op-btn delete-btn"
            type="text"
            @click="handleDelete(row)"
          >{{ $t('COMMON.DELETE') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-pagination-area">
      <el-pagination
        :background="true"
        :current-page.sync="requestParams.current"
        :page-size="requestParams.size"
        :total="requestParams.total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="getContentByPageInfo($event, 'size')"
        @current-change="getContentByPageInfo($event, 'current')"
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import QueryMenu from '@/components/query-menu';
import {
  getTransCountFastList as requestListFn,
  deleteTransCountFast
} from '@/api/customer-management/third-register';
import { getInfoByPayeeMethod } from '@/utils/tools';
import pageMixin from '@/mixins/table-page';
import hkBanks from '@/mixins/bank-infos';
import constant from '@/utils/constant';

const { mapMutations } = createNamespacedHelpers('tabs');
const { PAYEE_IDENTIFY_METHOD_LIST } = constant;

export default {
  name: 'TransferFast',
  components: {
    QueryMenu
  },
  mixins: [pageMixin, hkBanks],
  data() {
    return {
      localTransferType:"trans",
      tableData: [],
      requestParams: {
        current: 1,
        size: 10,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo')
        // registerCode: '',
        // payeeName: '',
        // payeeBankCode: '',
        // payeeIdentifyMethod: ''
      },
      payeeIdentifyMethodList: PAYEE_IDENTIFY_METHOD_LIST
    };
  },
  mounted() {
    this.getContentData(this.requestParams);
  },
  methods: {
    ...mapMutations(['DELETE_TABS']),
    requestListFn,
    getInfoByPayeeMethod,
    handleSearch(params) {
      for (let k in this.requestParams) {
        if (k !== 'ebankCstmNo') {
          if (params.hasOwnProperty(k)) {
            this.requestParams[k] = params[k];
          }
        }
      }
      let data = {
        ...params,
        ...this.requestParams
      };
      this.getContentData(data);
    },
    // open-add-page
    handleAdd() {
      this.$router.push({
        name: 'AddFastTransfer',
        query: {}
      });
      // this.DELETE_TABS('/customerManagement/registerThird');
    },
    // edit-current-item
    handleEdit(crtItem = {}) {
      console.log('crtItem', crtItem);
      // arguments: [crtItem]
      this.$router.push({
        name: 'EditFastTransfer',
        query: {
          crtItem
        }
      });
      // this.DELETE_TABS('/customerManagement/registerThird');
    },
    // delete-current-item
    handleDelete(crtItem) {
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM_DELETE')} ?`,
        confirm: () => {
          this.confirmDelete(crtItem);
        }
      });
    },
    async confirmDelete(params = {}) {
      const { body } = await deleteTransCountFast({
        ...params,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo')
      });
      if (body === true) {
        this.$showMsg({
          type: 'success',
          message: this.$t('COMMON.DELETE_SUCCESS')
        });
      } else {
        this.$showMsg({
          type: 'error',
          message: this.$t('COMMON.DELETE_FAIL'),
          duration: 3000
        });
      }

      this.getContentData(this.requestParams);
    }
  }
};
</script>

<style lang="scss" scoped>
.transfer-fast-page {
  width: 100%;
  z-index: 2;
  .g-op-btn {
    cursor: pointer;
    position: relative;
    right: 5px;
    &.update-btn {
      color: #f06b00;
    }
    &.delete-btn {
      color: #e34141;
    }
    &.transfer-btn {
      color: #666;
    }
  }
  .g-pagination-area {
    width: 100%;
    text-align: right;
    margin-top: 1.2rem;
    padding: 0.5rem 0;
  }
}
</style>
