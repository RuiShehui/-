<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 20:07:48
 * @LastEditTime: 2022-05-25 09:00:53
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\elec-transfer\index.vue
-->
<template>
  <div class="g-elec-transfer-wrapper">
    <query-menu
      :properties="{
        registerCode: $t('CUSTOMER_MANAGEMENT.REGISTER_CODE'),
        countryCode: $t('CUSTOMER_MANAGEMENT.PAYEE_COUNTRY_CODE'),
        swiftCode: $t('CUSTOMER_MANAGEMENT.SWIFT_CODE'),
        //payeeName: $t('CUSTOMER_MANAGEMENT.REMITTEE_NAME'),
        //payeeCountryCode: $t('CUSTOMER_MANAGEMENT.COUNTRY_CODE'),
        bankName: $t('CUSTOMER_MANAGEMENT.BANK_NAME')
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
        min-width="150"
      />
      <el-table-column
        prop="payeeName"
        :label="$t('CUSTOMER_MANAGEMENT.REMITTEE_NAME')"
        min-width="100"
      />
      <el-table-column
        prop="payeeAddress"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ADDRESS')"
        min-width="100"
      >
        <template v-slot="{ row }">
          {{
          countryList.find(item => item.countryId === row.payeeCountryCode)
          ? countryList.find(
          item => item.countryId === row.payeeCountryCode
          ).countryShortName
          : ''
          }}
          {{ row.payeeAddress }}
        </template>
      </el-table-column>
      <!-- IBAN -->
      <el-table-column
        prop="accountNo"
        :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_IBAN')"
        min-width="100"
      />
      <!-- SwiftCode -->
      <el-table-column
        prop="swiftCode"
        :label="$t('CUSTOMER_MANAGEMENT.SWIFT_CODE')"
        min-width="100"
      />
      <!-- <el-table-column prop="payeeAccount" label="收款账户" width="130" /> -->
      <el-table-column
        prop="countryCode"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_COUNTRY_CODE')"
        min-width="130"
      >
        <template v-slot="{ row }">
          {{
          countryList.find(item => item.countryId === row.countryCode)
          ? countryList.find(item => item.countryId === row.countryCode)
          .countryShortName
          : ''
          }}
        </template>
      </el-table-column>
      <el-table-column prop="bankName" :label="$t('CUSTOMER_MANAGEMENT.BANK_NAME')" min-width="150"></el-table-column>
      <el-table-column
        prop="bankAddress"
        :label="$t('CUSTOMER_MANAGEMENT.BANK_ADDRESS')"
        min-width="150"
      >
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="100px">
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
import QueryMenu from '@/components/query-menu';
import countries from '@/mixins/country-list';

import {
  getElecList as requestListFn,
  deleteElecItem
} from '@/api/customer-management/third-register';

import pageMixin from '@/mixins/table-page';

export default {
  name: 'ElecTransfer',
  components: {
    QueryMenu
  },
  mixins: [pageMixin, countries],
  props: {},
  data() {
    return {
      tableData: [],
      requestParams: {
        current: 1,
        size: 10,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo')
      }
    };
  },
  computed: {},
  mounted() {
    this.getContentData(this.requestParams);
  },
  methods: {
    requestListFn,

    handleSearch(params) {
      console.log('params', params);
      const requestParams = {
        ...params,
        ...this.requestParams
      };
      this.getContentData(requestParams);
    },
    handleAdd() {
      this.$router.push({
        name: 'AddElecTransfer'
      });
    },
    handleEdit(crtItem) {
      this.$router.push({
        name: 'EditElecTransfer',
        query: {
          crtItem
        }
      });
    },
    handleDelete(crtItem) {
      // arguments: [crtItem]
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM_DELETE')}"${this.$t(
          'CUSTOMER_MANAGEMENT.ELEC_TRAN_ACCOUNT'
        )}"`,
        confirm: () => this.confirmDelete(crtItem)
      });
    },
    async confirmDelete(row) {
      const result = await deleteElecItem({ ...row });
      if (result.hasOwnProperty('body') && result.body === true) {
        this.$showMsg({
          message: this.$t('COMMON.DELETE_SUCCESS'),
          type: 'success'
        });
      }
      this.getContentData(this.requestParams);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-elec-transfer-wrapper {
  width: 100%;
  z-index: 2;
  .g-op-btn {
    position: relative;
    right: 5px;
    cursor: pointer;
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
