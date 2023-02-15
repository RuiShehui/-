<!--
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-29 09:20:31
 * @Description: 消息提醒
 * @FilePath: \ss-cibs-prc-custpc\src\components\home\TransactionReminer.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <el-table
    class="todo-list"
    :data="tableData"
    @row-click="handleRowClick"
    :header-cell-style="{'background-color':'transparent !important','border':'none'}"

  >
    <el-table-column type="index" align="center" :label="$t(`Tasks.NUMBER`)" width="80"></el-table-column>
    <el-table-column
      prop="commonTitle"
      align="center"
      :show-overflow-tooltip="true"
      :label="$t(`NOTIFICATION.REMINDER_NOTIFICATION`)"
    ></el-table-column>
    <el-table-column
      prop="receivingTime"
      align="center"
      :show-overflow-tooltip="true"
      :label="$t(`NOTIFICATION.TIME_OF_RECEIPT`)"
    ></el-table-column>
  </el-table>
</template>

<script>
import { updateOneMsgMark } from '@/api/home.js';
import { mapMutations, mapGetters } from 'vuex';
import { searchBySubmitter } from '@/api/authorizeCenter.js';
import { getActiveClickArr } from '@/utils/index';
export default {
  name: 'TransactionReminder',
  props: {
    tableData: Array
  },
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),

    handleRowClick(row, column, event) {
      console.log(row, 'row');
      let categoryCode = [
        '0901',
        '0902',
        '090301',
        '090302',
        '090401',
        '090402',
        '090403',
        '090404',
        '090405',
        '090406',
        '090501',
        '090502',
        '0906'
      ];
      if (categoryCode.indexOf(row.categoryCode) > -1) {
        console.log('存在');
        let params = {
          current: 1, //分页参数
          // authState: '0', //标识是未授权
          endTime: '', //条件：结束时间
          tcTransactionAbstract: {
            transactionType: '' //条件：交易类型
          },
          flowNo: row.flowNum,
          size: 10, //分页参数
          startTime: '', //条件：开始时间
          transType: '9' //1普通交易9管理台交易
        };
        console.log('提交人未授权数据参数', params);
        searchBySubmitter(params).then(res => {
          if (res && res.records.length > 0) {
            this.jumpFun(row, 0, res.records[0]);
          }
        });
      } else {
        console.log('不存');
        this.jumpFun(row, 1, '');
      }
    },
    async jumpFun(row, num, data) {

      let idNum = '';
      let menuCodeNum = '';
      if (num === 0) {
        idNum = '09';
        menuCodeNum = '090501';
      } else {
        idNum = '07';
        menuCodeNum = '0701';
      }
      let entType = localStorage.getItem('entType');
      const res = await updateOneMsgMark({ mnId: row.mnId });
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      
      let menuItem = menu.filter(item => {
        return item.id === idNum;
      });

      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(menuCodeNum);
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });

      this.setSliderMenus(...menuItem);

      if (num === 0) {
        data.authorizationType = 'MY_SUBMIT';
        this.$router.push({
          path: '/_businessManagement/authorizeCenter/detail',
          query: data
        });
      } else {
        this.$router.push({
          path: '/authorizeCenter/detail',
          query: {
            scene: 1,
            flowNo: row.flowNum,
            authState: 1
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.todo-list {
  margin-bottom: 0;
  border: 0;
  ::v-deep {
    th .cell {
      color: rgba($color: #000000, $alpha: 0.65);
      background-color: transparent;
    }
    .el-table__body {
      tr:hover {
        & > td {
          font-size: 14px;
          font-weight: 400;
          color: #f57e00 !important;
          background-color: rgba(245, 126, 0, 0.04);
        }
      }
    }
    th {
      padding-top: 11px !important;
      padding-bottom: 11px !important;
      background-color: transparent;
      &.is-leaf {
        color: #bebebe;
        font-weight: 400;
      }
      &.is-leaf:hover {
        color: #f06b00;
      }
    }

    td {
      padding: 12px 0;
    }
  }
}
</style>