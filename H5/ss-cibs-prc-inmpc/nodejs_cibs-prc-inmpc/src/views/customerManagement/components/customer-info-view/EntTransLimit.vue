<!--
 * @Author: zhangcheng
 * @Date: 2021-12-14 16:32:21
 * @LastEditTime: 2022-09-29 19:33:51
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\EntTransLimit.vue
-->
<template>
  <div>
    <el-table
      class="g-table"
      :data="tableData"
      default-expand-all
      stripe
      row-key="tradeTypeSmall"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      :tree-props="{children:'children'}"
    >
      <el-table-column prop="tradeTypeName" label="交易類別" width="500">
      </el-table-column>
      <el-table-column prop="bankLimitDaily" label="銀行每日交易總限額（等值港元）">
        <template v-slot="{row}">{{ moneyFormat(row.bankLimitDaily) }}</template>
      </el-table-column>
      <el-table-column prop="limitDaily" label="個人每日累計限額（等值港元）">
        <template v-slot="{row}">{{ moneyFormat(row.limitDaily) }}</template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="最後更新時間"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
  </div>
</template>

<script>
import { queryCustLimit } from '@/api/customer-management/customer';
import { formatTreeData } from '@/utils/tools';
export default {
  data() {
    return {
      tableData: []
    };
  },
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    const result = await queryCustLimit({ ebankCstmNo: this.ebankCstmNo });
    console.log(result);
    if (result.body) {
      const list = result.body;
      list.map(item => {
        if (item.tradeTypeSmall === '010101') {
          item.tradeTypeSmallS = '0103';
          item.tradeTypeS = '01';
        } else if (item.tradeTypeSmall === '010201') {
          item.tradeTypeSmallS = '0104';
          item.tradeTypeS = '01';
        } else {
          item.tradeTypeSmallS = item.tradeTypeSmall;
          item.tradeTypeS = item.tradeType;
        }
      });
      this.tableData = formatTreeData(list, 'tradeTypeSmallS', 'tradeTypeS');
    }
  },
  methods: {
    tradeTypeSmallFilter(val) {
      switch (val) {
        case '01':
          return '轉賬';
        case '0101':
          return '轉賬至演示銀行第三者已登記賬戶';
        case '010101':
          return '轉賬至演示銀行第三者未登記賬戶（佔用上述每日累計限額）';
        case '0102':
          return '轉賬（匯款）至其他銀行已登記賬戶';
        case '010201':
          return '轉賬（匯款）至其他銀行未登記賬戶（佔用上述每日累計限額）';
        case '02':
          return '繳付賬單';
        case '0201':
          return '繳付賬單';
        case '020101':
          return '繳付賬單至未登記高風險商戶（佔用上述每日累計限額）';
        case '0202':
          return '繳付稅款';
        case '03':
          return '外幣兌換';
        case '0301':
          return '外幣兌換';
        case '04':
          return '批量發薪';
        case '0401':
          return '批量發薪';
      }
    },
    moneyFormat(val) {
      console.log(val);
      if (val) {
        const strArray = val.split('.');
        if (strArray[1]) {
          return (
            val
              .split('')
              .reverse()
              .reduce((pre, next, idx) => {
                return (idx % 3 !== 0 ? next : next + ',') + pre;
              }) + strArray[1]
          );
        }
        return (
          val
            .split('')
            .reverse()
            .reduce((pre, next, idx) => {
              return (idx % 3 !== 0 ? next : next + ',') + pre;
            }) + '.00'
        );
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
}
.left-tip {
  display: inline-block;
  width: 5px;
  height: 16px;
  background: #f06b00;
  margin-right: 8px;
}
</style>