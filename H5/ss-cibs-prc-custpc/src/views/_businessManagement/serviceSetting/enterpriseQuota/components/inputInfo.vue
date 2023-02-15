<template>
  <div class="u-inputInfo" v-loading="requestLoading">
    <el-table :data="tableData" stripe>
      <el-table-column prop="tradeTypeSmall" :label="$t('Tasks.TRANSACTION_TYPE')" min-width="20%">
        <template slot-scope="{ row }">
          <span class="u-circle" v-if="row.category"></span>
          <span
            v-if="row.category"
            style="font-weight: bold"
          >{{row.tradeTypeSmall | tradeTypeSmallFilter}}</span>
          <span
            v-else-if="row.empty"
            style="color: #aaa"
          >{{row.tradeTypeSmall | tradeTypeSmallFilter}}</span>
          <span v-else>{{row.tradeTypeSmall | tradeTypeSmallFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="limitDaily" :label="$t('AUTHORIZE.AUTH_LIMITHKD')" min-width="22%"></el-table-column>
      <el-table-column
        prop="updateLimitDaily"
        :label="$t('AUTHORIZE.AUTH_LIMITTOTAL')"
        min-width="22"
      >
        <template slot-scope="{ row }" v-if="!row.category && !row.empty">
          <el-input
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"
            v-model.trim="row.updateLimitDaily"
            @blur="blurUpdate(row)"
            @focus="focusUpdate(row)"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column
        prop="updateTime"
        :label="$t('FIXED_DEPOSIT_OVERVIEW.LAST_UPDATE_TIME')"
        min-width="16%"
      ></el-table-column>
    </el-table>

    <el-row class="flexc mt36">
      <v-button @click="reset()" class="mr16">{{ $t('HEAD.Reset') }}</v-button>
      <v-button type="primary" @click="gotolink()">{{ $t('COMMON.SUBMIT') }}</v-button>
    </el-row>
  </div>
</template>
<script>
import { queryQuotaInfo, queryQuotaSetResult } from '@/api/setServiceQuota.js';
import { formatTreeData, deepClone } from '@/utils/tree-table.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/public';
import _ from 'lodash';
import { mapState } from 'vuex';
export default {
  props: {
    confirmInfo: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    ...filters
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      updateArr: [], //更改数组
      tableData: [],
      oldTableData: [], //存储初始数组
      changeUpdateLimitDaily: false
    };
  },
  watch: {
    updateLimitDaily(n, o) {
      if ((n = o)) {
        return (this.changeUpdateLimitDaily = false);
      } else {
        return (this.changeUpdateLimitDaily = true);
      }
    }
  },
  mounted() {
    if (
      this.confirmInfo &&
      this.confirmInfo.tableData &&
      this.confirmInfo.tableData.length > 0
    ) {
      this.tableData = this.confirmInfo.tableData;
      this.oldTableData = this.confirmInfo.oldTableData;
    } else {
      this.search();
    }
  },
  methods: {
    reset() {
      this.search();
    },

    //提交
    gotolink() {
      const chargedArray = this.tableData.filter(
        item => item.updateLimitDaily && parseInt(item.updateLimitDaily) >= 0
      );
      const oldChargedArray = this.oldTableData.filter(
        item => item.updateLimitDaily && parseInt(item.updateLimitDaily) >= 0
      );
      if (chargedArray.length > 0) {
        let updateFlag = this.judgeUpdate(chargedArray, oldChargedArray);
        if (updateFlag) {
          let tableObj = {
            oldTableData: this.oldTableData,
            tableData: this.tableData,
            updateArr: this.updateArr
          };
          this.$emit('next', tableObj);
        } else {
          this.$message({
            title: '',
            message: this.$t('USER_MANAGERMENT.NOUPDATE_LIMIT'),
            type: 'warn',
            delay: 3000,
            clickModal: false
          });
        }
      } else {
        this.$message({
          title: '',
          message: this.$t('USER_MANAGERMENT.MONEY_NOT'),
          type: 'warn',
          delay: 3000,
          clickModal: false
        });
      }
      console.log('打印this', this.tableData);
    },

    //判断是否已修改
    judgeUpdate(newData, oldData) {
      this.updateArr = [];
      let flag = false;
      if (newData.length === oldData.length) {
        newData.forEach((item, index) => {
          if (item.updateLimitDaily !== oldData[index].updateLimitDaily) {
            flag = true;
            this.updateArr.push(item);
          }
        });
      } else {
        flag = true;
      }
      return flag;
    },

    //查询列表数据
    search() {
      this.tableData = [];
      Promise.all([
        queryQuotaInfo({ customerClazz: '2' }),
        queryQuotaSetResult()
      ]).then(resp => {
        resp[0].sort((a, b) => {
          return Number(a.title) - Number(b.title);
        });
        const tempData = [];
        let obj = {
          '01': '01',
          '02': '02',
          '03': '03',
          '04': '04'
        };
        resp[0].forEach(item => {
          if (item.limitSingleStart && item.limitDaily) {
            item.updateLimitDaily = parseInt(0).toFixed(2);
          }
          item.list.forEach(serItem => {
            //处理银行单笔交易限额金额显示
            if (serItem.limitSingleStart) {
              serItem.limitSingleStart = tool.currencyFormat(
                serItem.limitSingleStart,
                '',
                2
              );
            }
            //处理银行每日交易总限额金额显示
            if (serItem.limitDaily) {
              serItem.limitDaily = tool.currencyFormat(
                serItem.limitDaily,
                '',
                2
              );
            }
            if (resp[1].list && resp[1].list.length > 0) {
              resp[1].list.forEach(setItem => {
                //处理更新每日交易总限额金额显示
                if (serItem.tradeTypeSmall === setItem.limitSmallType) {
                  serItem.updateTime = setItem.updateTime;
                  serItem.updateLimitDaily = tool.currencyFormat(
                    setItem.updateLimitDaily,
                    '',
                    2
                  );
                }
              });
            }
          });
          tempData.push({ category: true, tradeTypeSmall: obj[item.title] });
          if (item.list && item.list.length > 0) {
            item.list.sort((a, b) => {
              return Number(a.sort) - Number(b.sort);
            });
            console.log('item', item.list);
            item.list.forEach(liItem => {
              if (!liItem.updateLimitDaily) {
                if (
                  liItem.tradeTypeSmall === '0101' ||
                  liItem.tradeTypeSmall === '0102' ||
                  liItem.tradeTypeSmall === '0201' ||
                  liItem.tradeTypeSmall === '0202' ||
                  liItem.tradeTypeSmall === '0301'
                ) {
                  liItem.updateLimitDaily = liItem.limitDaily;
                } else {
                  liItem.updateLimitDaily = '0.00';
                }
              }
            });
            tempData.push(...item.list);
          } else {
            // 00暂无数据
            tempData.push({ empty: true, tradeTypeSmall: '00' });
          }
        });
        this.tableData = tempData;
        this.oldTableData = _.cloneDeep(tempData);
      });
    },

    //输入框聚焦事件
    focusUpdate(row) {
      row.updateLimitDaily = mathTools.delDecollator(row.updateLimitDaily);
    },

    //输入框失焦事件
    blurUpdate(row) {
      console.log('row', row);
      let updateMoney = '';
      if (row.updateLimitDaily && row.updateLimitDaily >= 0) {
        updateMoney = mathTools.delDecollator(row.updateLimitDaily);
      } else {
        updateMoney = 0;
      }
      let limitMoney = mathTools.delDecollator(row.limitDaily);
      let limitSingleStartMoney = mathTools.delDecollator(row.limitSingleStart);
      console.log('aa', updateMoney, limitMoney);

      if (row.tradeType === '03') {
        if (parseFloat(updateMoney) < parseFloat(limitSingleStartMoney)) {
          row.updateLimitDaily = parseInt(0).toFixed(2);
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('USER_MANAGERMENT.TISP_SINGLE_LIMIT'),
            isCancle: false
          });
        } else if (parseFloat(updateMoney) > parseFloat(limitMoney)) {
          row.updateLimitDaily = parseInt(0).toFixed(2);
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('USER_MANAGERMENT.TISP_TOTAL_LIMIT'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        } else {
          row.updateLimitDaily = tool.currencyFormat(updateMoney, '', 2);
        }
      } else {
        if (parseFloat(updateMoney) > parseFloat(limitMoney)) {
          row.updateLimitDaily = parseInt(0).toFixed(2);
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('USER_MANAGERMENT.TISP_TOTAL_LIMIT'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        } else {
          row.updateLimitDaily = tool.currencyFormat(updateMoney, '', 2);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.u-circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #f06b00;
}
/deep/ .el-input {
  width: 180px;
  .el-input__inner {
    height: 28px;
  }
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}

.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  margin-left: 18px;
}

.el-table tr {
  background-color: #ffffff;
}

/deep/ .el-table td.el-table__cell div {
  position: relative;
  margin-left: 16px;
}
</style>