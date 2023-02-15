
<!-- 交易草稿-->
<template>
  <el-table
    class="todo-list"

    :header-cell-style="{'background-color':'transparent !important','border':'none'}"
    :data="tableData"
    @row-click="handleRowClick"
  >
    <el-table-column type="index" align="center" :label="$t(`Tasks.NUMBER`)" width="80"></el-table-column>
    <el-table-column prop="transactionType" align="center" :label="$t(`Tasks.TRANSACTION_TYPE`)">
      <template v-slot="{row}">{{filterTransTypeName(row.transactionType)}}</template>
    </el-table-column>
    <el-table-column
      prop="uploadMethod"
      align="center"
      :label="$t(`DRAFT_TRANSACTION.UPLOAD_METHOD`)"
    >
      <template v-slot="{row}">{{uploadType(row.uploadMethod)}}</template>
    </el-table-column>
    <el-table-column
      prop="temporaryStorageTime"
      align="center"
      :label="$t(`DRAFT_TRANSACTION.TEMPORARY_STORAGE_TIME`)"
    ></el-table-column>
  </el-table>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getActiveClickArr } from '@/utils/index';
import CONSTANTS from '@/utils/contants.js';

export default {
  name: 'DraftTransaction',
  computed: {
    ...mapGetters(['getSliderMenusAct', 'getActiveClickArr'])
  },
  props: {
    tableData: Array
  },
  data() {
    return {
      current: 0,
      size: 0
    };
  },
  mounted() {},
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    //  点击跳转
    handleRowClick(row, column, event) {
      let id = '03';
      let data = {};
      this.$nextTick(() => {
        const { transactionText, tdId } = row;
        //1：行内；2：转数快；3：外币；4：全球；5：批量转账；6：批量发薪；7：自动转账收款
        switch (row.transactionType) {
          case '1':
            id = '030101';
            data = JSON.parse(transactionText);
            this.$router.push({
              path: '/bankTransfer/paymentSettlement/intraBankTransfer',
              query: {
                tdId,
                params: JSON.stringify({
                  ...data,
                  isJumpTo: true,
                  JumpBusinessCode: id
                })
              }
            });
            break;
          case '2':
            id = '03010201';
            data = JSON.parse(transactionText);
            this.$router.push({
              path: '/bankTransfer/paymentSettlement/fast',
              query: {
                tdId,
                params: JSON.stringify({
                  ...data,
                  isJumpTo: true,
                  JumpBusinessCode: id
                })
              }
            });
            break;
          case '3':
            id = '03010202';
            data = JSON.parse(transactionText);
            this.$router.push({
              path: '/bankTransfer/paymentSettlement/localtransfer',
              query: {
                tdId,
                params: JSON.stringify({
                  ...data,
                  isJumpTo: true,
                  JumpBusinessCode: id
                })
              }
            });
            break;
          case '4':
            id = '030103';
            data = JSON.parse(transactionText);
            this.$router.push({
              path: '/bankTransfer/paymentSettlement/remittance',
              query: {
                tdId,
                params: JSON.stringify({
                  ...data,
                  isJumpTo: true,
                  JumpBusinessCode: id
                })
              }
            });
            break;
          case '5':
            id = '03010401';
            this.$router.push({
              path: '/paymentSettlement/batchTransfer/recordManually',
              query: {
                tdId,
                jumpType: '0',
                params: transactionText
              }
            });
            break;
          case '6':
            id = '03010501';
            this.$router.push({
              path: '/paymentSettlement/payDay/recordManually',
              query: {
                tdId,
                jumpType: '0',
                params: transactionText
              }
            });
            break;
        }
      });
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === '03';
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(id);
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);
    },

    // 表格轉換文字
    filterTransTypeName(value) {
      return value
        ? CONSTANTS.filterTransType().find(tpye => tpye.value == value).label
        : '';
    },
    uploadType(value) {
      return value
        ? CONSTANTS.uploadType().find(tpye => tpye.value == value).label
        : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.todo-list {
  margin-bottom: 0;
  border: 0;
  width: 100%;
  ::v-deep {
    th .cell {
      color: rgba($color: #000000, $alpha: 0.65);
    }
    .el-table__body tr:hover td {
      font-size: 14px;
      font-weight: 400;
      color: #f57e00 !important;
      background-color: rgba(245, 126, 0, 0.04);
    }
    .el-table__row {
      cursor: pointer;
    }

    th {
      padding-top: 11px !important;
      padding-bottom: 11px !important;

      &.is-leaf {
        color: #bebebe;
        font-weight: 400;
      }
    }
    td {
      padding: 12px 0;
    }
  }
}
.el-table tbody tr:hover td {
  color: #f06b00;
}

/deep/ .el-select {
  width: 100px !important;
}
</style>