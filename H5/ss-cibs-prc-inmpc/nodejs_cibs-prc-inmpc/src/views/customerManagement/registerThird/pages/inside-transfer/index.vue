<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 20:05:42
 * @LastEditTime: 2022-05-24 09:19:19
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\pages\inside-transfer\index.vue
-->
<template>
  <div>
    <query-menu
      :properties="{
        registerCode: $t('CUSTOMER_MANAGEMENT.REGISTER_CODE'),
        payeeName: $t('CUSTOMER_MANAGEMENT.PAYEE_NAME')
      }"
      @handleAdd="handleAdd"
      @handleSearch="handleSearch"
    />
    <el-table
      class="g-table"
      :data="tableData"
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
        prop="payeeBank"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK')"
        min-width="120"
      >
        <template v-slot="{ row }">
          <!-- row.payeeBank -->
          {{ '演示銀行有限公司' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="payeeName"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')"
        min-width="120"
      />
      <el-table-column
        prop="payeeAccount"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')"
        min-width="120"
      >
        <template v-slot="{ row }">
          {{ row | filterAccount }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" min-width="180">
        <template v-slot="{ row }">
          <div class="f-span-btns">
            <span class="f-edit" @click="handleEdit(row)">{{
              $t('COMMON.UPDATE')
            }}</span>
            <span @click="handleDelete(row)">{{ $t('COMMON.DELETE') }}</span>
          </div>
          <!-- <el-button class="g-op-btn transfer-btn" type="text">转账</el-button> -->
          <!-- 内管表格无转账功能 -->
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

import {
  getInsideList as requestListFn,
  deleteInsideItem
} from '@/api/customer-management/third-register';
import pageMixin from '@/mixins/table-page';
import clientManageFilters from '@/filters/clientManage';

export default {
  name: 'InsideTransfer',
  components: {
    QueryMenu
  },
  mixins: [pageMixin],
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
  filters: {
    ...clientManageFilters
  },
  computed: {},
  mounted() {
    this.getContentData(this.requestParams);
  },
  methods: {
    requestListFn,
    handleSearch(params) {
      const requestParams = {
        ...params,
        ...this.requestParams
      };
      this.getContentData(requestParams);
    },
    // 跳转到新增页面
    handleAdd() {
      this.$router.push({
        name: 'AddLocalThirdRegister',
        query: {}
      });
    },
    // 跳转到编辑页面
    handleEdit(crtItem) {
      this.$router.push({
        name: 'EditLocalThirdRegister',
        query: {
          crtItem: {
            ...crtItem,
            payeeAccount: crtItem.payeeAccount || new Date().getTime(),
            registerCode: crtItem.registerCode || new Date().getTime()
          }
        }
      });
    },
    // 删除当前第三方收款人
    handleDelete(row) {
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.IS_REMOVE_CURRENT_ACCOUNT'),
        confirm: () => this.confirmDelete(row)
      });
    },
    async confirmDelete(row) {
      const { body } = await deleteInsideItem({
        ...row
      });
      if (body === true) {
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
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  .f-edit {
    color: #f06b00;
  }
  span:nth-of-type(2) {
    margin-left: 10px;
  }
}
.g-pagination-area {
  width: 100%;
  text-align: right;
  margin-top: 1.2rem;
  padding: 0.5rem 0;
}
</style>
