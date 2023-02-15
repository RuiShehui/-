<!--代办任务-->
<template>
  <el-table
    class="todo-list"
 
    :header-cell-style="{'background-color':'transparent !important','border':'none'}"
    :data="tableData"
    @row-click="handleRowClick"
  >
    <el-table-column type="index" align="center" :label="$t(`Tasks.NUMBER`)" width="80"></el-table-column>
    <el-table-column prop="flowNo" :label="$t(`Tasks.REFERENCE_NUMBER`)" width="190"></el-table-column>
    <el-table-column prop="businessCode" :label="$t(`Tasks.TRANSACTION_TYPE`)" width="150">
      <template slot-scope="scope">{{ scope.row.businessCode | tradeTypeFilter }}</template>
    </el-table-column>
    <el-table-column prop="userName" :label="$t(`Tasks.PRESENTOR`)" width="125"></el-table-column>
    <el-table-column prop="updateTime" :label="$t(`Tasks.SUBMISSION_TIME`)" width="140"></el-table-column>
  </el-table>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getActiveClickArr } from '@/utils/index';
import filters from '@/filters/public';

// const { mapActions, mapState, mapMutations,mapGetters } = createNamespacedHelpers('app');
export default {
  name: 'DraftTransaction',
  computed: {
    ...mapGetters(['getSliderMenusAct', 'getActiveClickArr'])
  },
  props: {
    tableData: Array
  },
    filters: {
    ...filters
  },
  data() {
    return {
      current: 0,
      size: 0
    };
  },

  mounted() {
    console.log(this.tableData,'tableData')
  },
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    // 点击跳转
    handleRowClick(row, column, event) {
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === '07';
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr('0701');
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);

      this.$router.push({
        path: '/authorizeCenter/detail',
        query: {
          scene: '2',
          flowNo: row.flowNo,
          authState: row.authState
        }
      });
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
    .el-table th {
      background-color: transparent !important;
    }
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
        // border-top: 1px solid #f6f6f8;
        // border-bottom: 1px solid #f6f6f8;
        color: #bebebe;
        font-weight: 400;
        word-break:break-word;
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
</style>