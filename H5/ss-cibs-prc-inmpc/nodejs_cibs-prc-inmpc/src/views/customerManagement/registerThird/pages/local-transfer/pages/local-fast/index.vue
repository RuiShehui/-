<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-23 20:23:18
 * @LastEditTime: 2022-05-26 14:22:58
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\local-transfer\pages\local-fast\index.vue
-->
<template>
  <div class="local-fast-page">
    <query-menu
      :properties="{
        registerCode: $t('CUSTOMER_MANAGEMENT.REGISTER_CODE'),
        payeeName: $t('CUSTOMER_MANAGEMENT.PAYEE_NAME'),
        payeeBankCode: $t('CUSTOMER_MANAGEMENT.PAYEE_BANK')
      }"
      :is-show-hk="true"
      :localTransferType="localTransferType"
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
      <el-table-column
        prop="number"
        :label="$t('COMMON.SERIAL_NUMBER')"
        min-width="80"
      />
      <el-table-column
        prop="registerCode"
        :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')"
        min-width="200"
      />
      <el-table-column
        prop="payeeBankCode"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK')"
        min-width="160"
      >
        <template v-slot="{ row }">
          {{
            chatsBankList.find(item => item.value === row.payeeBankCode)
              ? chatsBankList.find(item => item.value === row.payeeBankCode).label
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payeeName"
        :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NAME_PAYEE')"
        min-width="120"
      />
      <el-table-column
        prop="payeeAccount"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')"
        min-width="230"
      />
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="180">
        <template v-slot="{ row }">
          <span
            class="g-op-btn update-btn"
            type="text"
            @click="handleEdit(row)"
            >{{ $t('COMMON.UPDATE') }}</span
          >
          <span
            class="g-op-btn delete-btn"
            type="text"
            @click="handleDelete(row)"
            >{{ $t('COMMON.DELETE') }}</span
          >
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
import pageMixin from '@/mixins/table-page';
import hkBanks from '@/mixins/bank-infos';
import {
  getLocalFastList as requestListFn,
  deleteLocalFastItem
} from '@/api/customer-management/third-register';

const { mapMutations } = createNamespacedHelpers('tabs');

export default {
  name: 'FastLocal',
  components: {
    QueryMenu
  },
  mixins: [pageMixin, hkBanks],
  props: {},
  data() {
    return {
      localTransferType:"local",

      tableData: [
        // {
        //   number: '序号',
        //   registerCode: '登记编号',
        //   payeeBankCode: '收款机构/银行',
        //   payeeName: '收款人名称',
        //   payeeAccount: '收款账户',
        // }
      ],
      requestParams: {
        current: 1,
        size: 10,
        registerCode: '',
        payeeName: '',
        payeeBankCode: '',
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo') // 网银客户号
      }
    };
  },
  mounted() {
    this.getContentData(this.requestParams);
  },
  methods: {
    ...mapMutations(['DELETE_TABS']),
    requestListFn,
    handleSearch(params = {}) {
      const requestParams = {
        ...this.requestParams,
        ...params
      };
      this.getContentData(requestParams);
    },
    handleAdd() {
      this.$router.push({
        name: 'AddLocalFast',
        query: {}
      });
    },
    handleEdit(crtItem) {
      this.$router.push({
        name: 'EditLocalFast',
        query: {
          crtItem
        }
      });
    },
    handleDelete(crtItem) {
      // arguments: [crtItem]
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM_DELETE')}`,
        confirm: async () => {
          const { body } = await deleteLocalFastItem({ ...crtItem });
          if (body === true) {
            this.$showMsg({
              message: `${this.$t('COMMON.DELETE')}${this.$t(
                'COMMON.SUCCESS'
              )}`,
              type: 'success',
              duration: 3000
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
      });
    }
  }
};
</script>

<style scoped lang="scss">
.local-fast-page {
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
