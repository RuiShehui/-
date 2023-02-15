<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-06-30 15:27:11
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\components\accountList\RecentAccts.vue
-->
<template>
  <el-dialog
    class="dialog-box"
    width="980px"
    top="0vh"
    :title="$t('PAYMENT.IMPORT_NEAREST_PEYEE')"
    :center="true"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onDialogClose"
  >
    <main v-loading="isLoading">
      <!-- 查询区 -->
      <search-bar ref="searchBar" :data="searchBarData" :payType="payType" @handleQuery="handleQuery" />
      <el-table
        v-if="tableColumns.length > 0"
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
              v-if="
                [
                  'payeeIdentifyMethod',
                  'creditAcctIdentificationType'
                ].includes(col.prop)
              "
              class="payee-method-col"
            >{{ row[col.prop] | FPStransTypeFilers }}</span>
            <!-- 收款账户 -->
            <span v-else-if="col.prop === 'creditAcct'">
              <!-- {{ row[col.prop] }} -->
              <template v-if="!row.creditAcctIdentificationType">{{ acctFilter(row) }}</template>
              <template v-if="row.creditAcctIdentificationType === 'BBAN'">{{ acctFilter(row) }}</template>
              <template
                v-if="
                  row.creditAcctIdentificationType &&
                    row.creditAcctIdentificationType !== 'BBAN'
                "
              >
                {{
                `${row.creditAcct} ${
                row.creditAcctIdentificationType === 'BBAN'
                ? row.creditCcy
                : ''
                }`
                }}
              </template>
            </span>
            <!-- 动态显示值 -->
            <span v-else-if="col.prop === 'acctName'">{{ row | identifyMethodValueFilter }}</span>
            <span
              v-else-if="
                ['payeeBank', 'payeeBankCode', 'creditBankCode'].includes(
                  col.prop
                )
              "
            >
              <template v-if="payType === 'inline'">{{ $t('PAYMENT.CHUANGXING_BANK') }}</template>
              <template v-if="payType === 'fast'">
                <template
                  v-if="
                    row.creditAcctIdentificationType &&
                      row.creditAcctIdentificationType !== 'BBAN'
                  "
                >
                  <template
                    v-if="
                      row.designBank === 'PRE' || row.selectBankType === 'PRE'
                    "
                  >{{ $t('PAYMENT.PRESET_PAYEE_BANK') }}</template>
                  <template
                    v-if="
                      row.designBank === 'DEF' || row.selectBankType === 'DEF'
                    "
                  >{{ $t('PAYMENT.CHUANGXING_BANK') }}</template>
                  <template
                    v-if="
                      row.designBank === 'OPT' || row.selectBankType === 'OPT'
                    "
                  >{{ filterBankInfo(row.creditBankCode) || row.payeeBank }}</template>
                </template>
                <template v-else>{{ filterBankInfo(row.creditBankCode) || row.payeeBank }}</template>
              </template>
              <template v-else>{{ filterBankInfo(row.creditBankCode) }}</template>
            </span>
            <span
              v-else-if="
                ['bankCountry', 'creditRegion', 'creditBankRegion'].includes(
                  col.prop
                )
              "
            >{{ findCountryName(row[col.prop]) }}</span>
            <!-- 文本渲染 -->
            <span class="common-table-col" v-else>{{ row[col.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
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
        :type="3"
        :isDelete="true"
        @handleCancel="handleCancel"
        @handleConfirm="handleConfirm"
        @handleDelete="handleDelete"
      />
    </template>
  </el-dialog>
</template>

<script>
import accountListMixin from './accountListMixin';
import { recentPayeeQuery, recentPayeeDelete } from '@/api/paymentRemittance';
import business from '@/filters/business.js';
import { formatAcctNo } from '@bank-transfer/utils/function';
import aM from '@/filters/accountManagement';

function getQueryType(payType) {
  switch (payType) {
    case 'fast':
      return '2';
    case 'localtransfer':
      return '3';
    case 'remittance':
      return '4';
    default:
      return '1';
  }
}

export default {
  name: 'RecentAccts',
  mixins: [accountListMixin],
  props: {
    dialogVisible: Boolean
  },
  computed: {
    getList() {
      return (params = {}) => {
        return recentPayeeQuery({
          ...params,
          queryType: getQueryType(this.payType)
        });
      };
    }
  },
  filters: {
    FPStransTypeFilers:business.FPStransTypeFilers,
  },
  methods: {
    filterAccount() {},
    acctFilter({ creditAcct = '', creditCcy = '', creditAcctType = '' }) {
      if (this.payType === 'inline') {
        return `${formatAcctNo(creditAcct)} ${creditAcctType === 'MULTICURRENCY' ? '' : creditCcy}${
          creditAcctType && creditAcctType.length
            ? ` ${aM.accountType(creditAcctType)}`
            : ''
        }`;
      }
      return `${(creditAcct)} ${
        creditAcctType && creditAcctType.length
          ? ` ${aM.accountType(creditAcctType)}`
          : ''
      }`;
    },

    async getTableData(searchData = this.searchData) {
      searchData.creditBankCode = searchData.payeeBankCode;
      this.isLoading = true;
      const result = await this.getList(searchData);
      if (result) {
        this.setPageInfo(result);
        this.setTableData(result);
      }
      this.isLoading = false;
    },
    onDialogClose() {
      this.handleReset();
      this.initPageInfo();
      this.$emit('update:dialogVisible', false);
    },
    handleDelete() {
      if (this.selectItem === null) {
        this.$message({
          message: this.$t('PAYMENT.CHECK_ERROR'),
          type: 'warn',
          delay: 3000
        });
      } else {
        this.$confirm({
          title: this.$t('COMMON.TISHI'),
          message: this.$t('PAYMENT.DELETE_PAYEE'),
          btnText: {
            confirmText: this.$t('COMMON.CONFIRM'),
            cancleText: this.$t('COMMON.CANCEL')
          },
          isCancle: true
        })
          .then(() => {
            this.confirmDelete();
          })
          .catch(() => {});
      }
    },
    async confirmDelete() {
      // const result = await recentPayeeDelete({
      //   ...this.selectItem,
      //   queryType: getQueryType(this.payType)
      // });
      const result = await recentPayeeDelete({
        recentList: [{ ...this.selectItem }],
        opType: getQueryType(this.payType)
      });
      if (result) {
        console.log(result);
      }
      this.getTableData();
    }
  }
};
</script>

<style scoped lang="scss">
@import './page.scss';
</style>
