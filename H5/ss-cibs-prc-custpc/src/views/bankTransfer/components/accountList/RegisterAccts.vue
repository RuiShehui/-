<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-23 16:20:08
 * @LastEditTime: 2022-10-25 21:00:14
 * @LastEditors: Please set LastEditors
 * @Description: 转数快-已登记第三者账户
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\accountList\RegisterAccts.vue
-->
<template>
  <el-dialog
    class="dialog-box"
    width="980px"
    top="0vh"
    :title="$t('PAYMENT.REGISTERED_ACCOUNT')"
    :center="true"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onDialogClose"
  >
    <main v-loading="isLoading">
      <!-- 查询区 -->
      <search-bar
        ref="searchBar"
        :data="searchBarData"
        :payType="payType"
        @handleQuery="handleQuery"
      />
      <!-- 列表区 -->
      <el-table
        class="mb16"
        :data="tableData"
        :stripe="true"
        max-height="340px"
      >
        <el-table-column width="80">
          <template v-slot="{ $index }">
            <el-radio :label="$index" v-model="selectIndex" />
          </template>
        </el-table-column>
        <el-table-column
          v-for="(col, colIdx) of tableColumns"
          :key="`${colIdx + 1} ${col.prop}`"
          v-bind="col"
        >
          <template v-slot="{ row }">
            <!-- 收款人识别方式render -->
            <span
              v-if="col.prop === 'payeeIdentifyMethod'"
              class="payee-method-col"
              >{{ row[col.prop] | FPStransTypeFilers }}</span
            >
            <span v-else-if="col.prop === 'payeeAccount' && payType === 'inline'">
              {{
                // 收款银行
                `${formatAcctNo(row.payeeAccount)} ${row.payeeType === 'MULTICURRENCY' ? '' :( ccyFilter(row.payeeCcy) || '')} ${row.payeeType ? filterAccountType(row.payeeType) : ''}`
              }}
            </span>
            <span v-else-if="col.prop === 'payeeAccount' && payType !== 'inline'">
              {{
                // 收款银行
                `${row.payeeAccount} ${row.payeeType === 'MULTICURRENCY' ? '' :( ccyFilter(row.payeeCcy) || '')} ${row.payeeType ? filterAccountType(row.payeeType) : ''}`
              }}
            </span>
            <span v-else-if="col.prop === 'payeeAddress' && payType === 'remittance'">
              {{ findCountryName(row.payeeCountryCode) + ' ' }}{{`${row.payeeAddress}`}}
            </span>
            <span v-else-if="col.prop === 'payeeBankCode'">
              <template v-if="payType === 'inline'">
                {{ $t('PAYMENT.CHUANGXING_BANK') }}
              </template>
              <template v-if="payType === 'fast'">
                <template
                  v-if="
                    row.payeeIdentifyMethod &&
                      row.payeeIdentifyMethod !== 'BBAN'
                  "
                >
                  <template
                    v-if="
                      row.designBank === 'PRE' || row.selectBankType === 'PRE'
                    "
                  >
                    {{ $t('PAYMENT.PRESET_PAYEE_BANK') }}
                  </template>
                  <template
                    v-if="
                      row.designBank === 'DEF' || row.selectBankType === 'DEF'
                    "
                  >
                    {{ $t('PAYMENT.CHUANGXING_BANK') }}
                  </template>
                  <template
                    v-if="
                      row.designBank === 'OPT' || row.selectBankType === 'OPT'
                    "
                  >
                    {{ filterBankInfo(row.payeeBankCode) }}
                  </template>
                </template>
                <template v-else>
                  {{ filterBankInfo(row.payeeBankCode) }}
                </template>
              </template>
              <template v-else>
                {{ filterBankInfo(row.payeeBankCode) }}
              </template>
            </span>
            <!-- 动态显示值 -->
            <span v-else-if="col.prop === 'acctName'">
              {{ row | identifyMethodValueFilter }}
            </span>
            <span v-else-if="col.prop === 'countryCode'">
              {{ findCountryName(row[col.prop]) }}
            </span>
            <span v-else-if="col.prop === 'payeeBank'">
              {{ filterBankInfo(row.payeeBankCode) }}
            </span>
            <template v-else-if="col.prop === 'accountNo'">
              {{ `${row[col.prop]} ` }}
            </template>
            <!-- 常规渲染 -->
            <span class="common-table-col" v-else>{{ row[col.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        :current-page="pageInfo.current"
        :total="pageInfo.total"
        :page-size="pageInfo.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="prev, pager, next, sizes, jumper"
        @current-change="changePageInfo($event, 'current')"
        @size-change="changePageInfo($event, 'size')"
      />
    </main>
    <template #footer>
      <select-footer
        :type="2"
        @handleCancel="handleCancel"
        @handleConfirm="handleConfirm"
      />
    </template>
  </el-dialog>
</template>

<script>
import { bankInfos, countryInfos } from '@/mixins';

import accountListMixin from './accountListMixin';

import {
  initQueryData,
  initTableColumns,
  getSearchBarData,
  getRegisteredList,
  transToCreditAcct
} from './utils/tools';
import { formatAcctNo } from '@bank-transfer/utils/function';
import filters from '@/filters/accountManagement';
import business from '@/filters/business.js';
import { mapState } from 'vuex';

export default {
  name: 'RegisterAcct',
  components: {},
  mixins: [bankInfos, countryInfos, accountListMixin],
  computed: {
    ...mapState(['requestLoading']),
    /** 获取列表的方法 */
    getList() {
      const getList = getRegisteredList(this.payType);

      return getList;
    }
  },
  filters: {
    FPStransTypeFilers:business.FPStransTypeFilers,
  },
  watch: {
    pageInfo: {
      deep: true,
      handler() {
        this.selectIndex = 0;
      }
    }
  },

  mounted() {
  },
  methods: {
    ccyFilter:filters.ccyFilter,
    filterAccountType: filters.accountType,
    formatAcctNo,

    async getTableData(searchData = this.searchData) {
      this.isLoading = true;

      const result = await this.getList(searchData);
      this.setPageInfo(result);
      this.setTableData(result);

      this.isLoading = false;
    },

    handleConfirm() {
      const selectItem = transToCreditAcct(this.selectItem);
      this.$emit('confirmClick', {
        ...selectItem,
        acctIdentificationType: '2'
      });
    },

    getBankName(row) {
      const { selectBankType, payeeBankCode } = row;
      if (this.payType === 'inline') {
        return this.$t('PAYMENT.CHUANGXING_BANK');
      }
      if (this.payType === 'fast') {
        if (selectBankType === 'PRE') {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        }
        if (selectBankType === 'DEF') {
          return this.$t('PAYMENT.CHUANGXING_BANK');
        }
      }
      return this.filterBankInfo(payeeBankCode);
    }
  }
};
</script>
