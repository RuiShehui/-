<!--
 * @Author: your name
 * @Date: 2021-12-02 16:57:09
 * @LastEditTime: 2022-09-20 11:32:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\forexListPrice\components\forexTable.vue
-->
<template>
  <div class="g-table-wrapper meted">
    <div class="m-table-heade" v-if="head">{{head}}</div>
    <div
      class="m-time"
    >{{$t('FOREXLISTPRICE.THE_FOLLOWING_INFORMATION_IS_FOR_REFERENCE_ONLY')}}{{$t('FOREXLISTPRICE.LAST_UPDATE_TIMES')}}{{time | formatTime}}</div>
    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      :element-loading-text="$t('AUTHORIZE.LOADING')"
      height="375px"
    >
      <el-table-column
        :label="$t('FOREXLISTPRICE.CURRENCY')"
        width
        align="left"
        style="margin-left: 56px;"
        
      >
        <!-- src="@/images/internationalBusiness/CNY.png" -->
        <template slot-scope="scope">
          <img
            v-if="scope.row.currency=='CNY'"
            src="@/images/internationalBusiness/CNY.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='AUD'"
            src="@/images/internationalBusiness/AUD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='CAD'"
            src="@/images/internationalBusiness/CAD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='NZD'"
            src="@/images/internationalBusiness/NZD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='GBP'"
            src="@/images/internationalBusiness/GBP.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='EUR'"
            src="@/images/internationalBusiness/EUR.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='USD'"
            src="@/images/internationalBusiness/USD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='CHF'"
            src="@/images/internationalBusiness/CHF.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='JPY'"
            src="@/images/internationalBusiness/JPY.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='MOP'"
            src="@/images/internationalBusiness/MOP.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='DKK'"
            src="@/images/internationalBusiness/DKK.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='KRW'"
            src="@/images/internationalBusiness/KRW.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='SGD'"
            src="@/images/internationalBusiness/SGD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='TWD'"
            src="@/images/internationalBusiness/TWD.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='THB'"
            src="@/images/internationalBusiness/THB.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='MYR'"
            src="@/images/internationalBusiness/MYR.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='SEK'"
            src="@/images/internationalBusiness/SEK.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <img
            v-if="scope.row.currency=='PHP'"
            src="@/images/internationalBusiness/PHP.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <!--  src="@/images/internationalBusiness/CNY.png" -->
          <img
            v-if="scope.row.currency=='CNH'"
            src="@/images/internationalBusiness/CNY.png"
            alt
            style="width: 45px;height: 30px;padding-left: 50px;"
          />
          <div style="padding-left:100px;margin-top:-39px;">{{scope.row.currencyone}}</div>
          <span class="u-font" style="padding-left:100px">{{scope.row.currency}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('FOREXLISTPRICE.CUSTOMER_BUYS')" width align="center">
        <template slot-scope="scope">
          <span class="u-font" style="padding-right:13px;">{{scope.row.customersBuy}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('FOREXLISTPRICE.CUSTOMER_SELLS')" width align="right">
        <template slot-scope="scope">
          <span class="u-font" style="padding-right:58px;">{{scope.row.customersSell}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    head: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    currentPage: {
      type: Number
    },
    pageSize: {
      type: Number,
      default: 10
    },
    tableData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },

  filters: {
    formatTime(value) {
      //todo 等待获取时间再进行格式化
      if (typeof value === 'string') {
        return value;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-table-heade {
  height: 26px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 26px;
  border-left: 4px solid #f06b00;
  padding-left: 16px;
  font-weight: 500;
}
::v-deep .cell {
  color: rgba(0, 0, 0, 0.85) !important;
}
// ::v-deep.el-table .cell {
//     padding-left: 56px !important;
//     padding-right: 75px !important;
// }
::v-deep.el-table th > .cell {
  padding-left: 56px !important;
  padding-right: 75px !important;
  color: rgba(0, 0, 0, 0.85);
}
.m-time {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  font-weight: 400;
  text-align: right;
  margin-top: 24px;
  margin-bottom: 12px;
}
.u-font {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-weight: 400;
}

// ::v-deep.el-table th > .cell {
//     color: rgba(0, 0, 0, 0.85);
//     margin-left: 20px;
// }
</style>
<style lang="scss">
.meted{
.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
    height: 329px !important;
}
}
</style>