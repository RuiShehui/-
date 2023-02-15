<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 14:40:37
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-06-09 10:12:41
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\bank-limit-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t(`CUSTOMER_MANAGEMENT.CSTM_LEVEL`) }}</div>
        <div>{{ tableData.customerClazz }}</div>
      </div>
    </div>

    <el-table
      :data="showClazzList"
      :tree-props="{ children:'children',haChildren:'hasChildren' }"
      row-key="tradeTypeSmall"
      :default-expand-all="true"
      :header-cell-style="{
        background: '#f3f6fc',
        color: '#606266',
        fontSize: '14px',
        fontWeight: '400',
      }"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TRANS_TYPE')" prop="tradeTypeName"></el-table-column>
      <el-table-column
        :label="$t('CUSTOMER_MANAGEMENT.SINGLE_TRANSACTION_LIMIT')"
        prop="singleTransctionLimit"
      ></el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TRADING_LIMIT')" prop="limitDaily"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatTreeData } from '@/utils/tools';
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [
        //列表数组
        {
          customerClazz: '客户级别1', //客户级别
          tradeTypeName: '交易类型1', //交易类型
          limitDaily: '每日交易总限额（等值港元）1', //每日交易总限额（等值港元）
          singleTransctionLimit: '单笔交易限额（等值港元）1' //单笔交易限额（等值港元）
        }
      ],
      arrList: []
    };
  },
  computed: {
    showClazzList() {
      if (this.arrList.length) {
        return formatTreeData(this.arrList, 'tradeTypeSmall', 'tradeType');
      }
      return [];
    }
  },
  watch: {
    showClazzList(newVal) {
      console.log(newVal);
    }
  },
  mounted() {
    const { body } = JSON.parse(this.options.temp.afterMdJson);

    if (body) {
      this.initArrList(body);
      this.initQuotaClazz(body);
    }
  },

  methods: {
    // columnStyle({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex == 0) {
    //     return 'background:#f3f6fc;';
    //   } else {
    //     return 'background:#ffffff';
    //   }
    // },
    /** 初始化限额数据列表 */
    initArrList(body) {
      this.arrList = [];
      const { list } = body;

      if (Array.isArray(list) && list.length) {
        this.arrList = list.map(item => {
          if (item.tradeTypeSmall === '0301') {
            return {
              ...item,
              singleTransctionLimit:
                item.limitSingleStart + '-' + item.limitSingleEnd
            };
          }
          return item;
        });
      }
      // this.arrList = JSON.parse(this.options.temp.afterMdJson).body.list;
      // this.arrList.forEach((item, index) => {
      //   // if (item.limitSingleStart !== '0') {
      //   if (index === this.arrList.length - 1) {
      //     item.singleTransctionLimit =
      //       item.limitSingleStart + '-' + item.limitSingleEnd;
      //   } else {
      //     item.singleTransctionLimit = '';
      //   }
      // });
    },
    /** 初始化限额级别 */
    initQuotaClazz({ customerClazz = '0' }) {
      this.tableData.customerClazz = this.$t(
        `BUSINESS_MANAGEMENT.${String.fromCharCode(
          Number(customerClazz) + 65
        )}_LEVEL`
      );
      // this.tableData[0].tradeTypeName = bankObj.tradeTypeName;
      // this.tableData[0].limitDaily = bankObj.limitDaily;
      // this.tableData[0].singleTransctionLimit = bankObj.singleTransctionLimit;
      // parseInt(bankObj.limitSingleEnd).toFixed(2) -
      // parseInt(bankObj.limitSingleStart).toFixed(2);
      // console.log(bankObj);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
