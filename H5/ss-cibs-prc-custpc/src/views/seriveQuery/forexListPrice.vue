<!--
 * @Author: your name
 * @Date: 2021-12-02 16:18:12
 * @LastEditTime: 2022-09-26 14:41:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\seriveQuery\forexListPrice.vue
-->
<template>
  <div class="g-accountManagent">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="m-topTabs">
      <el-tab-pane :label="$t('INTERESTRATEQUERY.EXCHANGE_RATE_QUERY')" name="first">
        <forexTable
          :head="$t('FOREXLISTPRICE.BANKNOTE_RATES')"
          :tableData="tableData"
          :time="time"
          :loading="loading"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></forexTable>
      </el-tab-pane>
      <el-tab-pane :label="$t('INTERESTRATEQUERY.INTEREST_RATE_QUERY')" name="second">
        <el-tabs v-if="activeName === 'second'">
          <tables :tableData="fixedData" :loading="loading" :time="timeone"></tables>
        </el-tabs>
      </el-tab-pane>
      <el-pagination
        v-if="total*1>=10 && activeName ==='first'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, sizes, jumper"
        :total="Number(total)"
        :current-page="Number(currentPage)"
        :page-size="Number(pageSize)"
        :page-sizes="[10, 20, 30, 50]"
        class="pagination"
        style="padding-top: 16px;"
      ></el-pagination>
    </el-tabs>
  </div>
</template>

<script>
import forexTable from './components/forexTable';
import { cashRateQuery } from '@/api/internationalBusiness.js';
import { transferRateQuery } from '@/api/internationalBusiness.js';
import { rateSavingQuery } from '@/api/serveQuery.js';
import { createNamespacedHelpers } from 'vuex';
import tables from './components/tables';
import { rateQuery } from '@/api/internationalBusiness.js';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
let lang = localStorage.getItem('lang');
export default {
  components: {
    forexTable,
    tables
  },
  computed: {
    ...mapState(['lang'])
  },
  mounted() {
    console.log(this.lang);
    this.Datalist();
    
  },
  data() {
    return {
      total: 0,
      loading: true, //加载标识
      activeName: 'first',
      time: '2021-10-11 10:06',
      timeone: '2021-10-11 10:06',
      tableData: [
        {
          currency: '',
          rate: ''
        }
      ],
      tableDataone: [
        {
          currency: '',
          customersBuy: '',
          customersSell: ''
        }
      ],
      fixedData: [
        {
          CCY: '',
          AMOUNT: '',
          rate: '',
          oneDay: '',
          sevenDay: '',
          twoWeeks: '',
          oneMonth: '',
          twoMonth: '',
          threeMonth: '',
          sixMonth: '',
          nineMonth: '',
          oneYear: '',
          twoYear: ''
        }
      ],
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
  
  },

  methods: {
    //储蓄存款利率接口
    async Datalist() {
      this.loading = true;
      let params = {
        current: this.currentPage,
        size: this.pageSize
      };
      const res = await rateSavingQuery(params);
      if (res == null) {
        this.tableData = res;
        this.loading = false;
      } else {
        this.time = res.updateDate;
        this.total = res.total;
        this.tableData = res.rateSavingList;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].currency == 'AUD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.AUD');
          } else if (this.tableData[i].currency == 'CAD') {
            this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CAD');
          } else if (this.tableData[i].currency == 'CNY') {
            this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CNY');
          } else if (this.tableData[i].currency == 'EUR') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.EUR');
          } else if (this.tableData[i].currency == 'GBP') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.GBP');
          } else if (this.tableData[i].currency == 'JPY') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.JPY');
          } else if (this.tableData[i].currency == 'NZD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.NZD');
          } else if (this.tableData[i].currency == 'SGD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.SGD');
          } else if (this.tableData[i].currency == 'TWD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.TWD');
          } else if (this.tableData[i].currency == 'USD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.USD');
          } else if (this.tableData[i].currency == 'CHF') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.CHF');
          } else if (this.tableData[i].currency == 'HKD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.HKD');
          }
        }

        switch (this.lang) {
          case 'zh-CN':
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].currency == 'AUD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.AUD');
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CAD');
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CNY');
              } else if (this.tableData[i].currency == 'EUR') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.EUR');
              } else if (this.tableData[i].currency == 'GBP') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.GBP');
              } else if (this.tableData[i].currency == 'JPY') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.JPY');
              } else if (this.tableData[i].currency == 'NZD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.NZD');
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.SGD');
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.TWD');
              } else if (this.tableData[i].currency == 'USD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.USD');
              } else if (this.tableData[i].currency == 'CHF') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.CHF');
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.HKD');
              }
            }
            break;
          case 'zh-HK':
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].currency == 'AUD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.AUD');
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CAD');
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.CNY');
              } else if (this.tableData[i].currency == 'EUR') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.EUR');
              } else if (this.tableData[i].currency == 'GBP') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.GBP');
              } else if (this.tableData[i].currency == 'JPY') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.JPY');
              } else if (this.tableData[i].currency == 'NZD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.NZD');
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.SGD');
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.TWD');
              } else if (this.tableData[i].currency == 'USD') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.USD');
              } else if (this.tableData[i].currency == 'CHF') {
                this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.CHF');
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currencyone =this.$t('REMITTANCECONFIRM.HKD');
              }
            }
            break;
          case 'en':
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].currency == 'AUD') {
                this.tableData[i].currencyone = 'Australian Dollars';
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone = 'Canadian Dollars';
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone = 'China Yuan';
              } else if (this.tableData[i].currency == 'EUR') {
                this.tableData[i].currencyone = 'Euro';
              } else if (this.tableData[i].currency == 'GBP') {
                this.tableData[i].currencyone = 'Sterling';
              } else if (this.tableData[i].currency == 'JPY') {
                this.tableData[i].currencyone = 'Japanese Yen';
              } else if (this.tableData[i].currency == 'NZD') {
                this.tableData[i].currencyone = 'New Zealand Dollars';
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableData[i].currencyone = 'Singapore Dollars';
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableData[i].currencyone = 'New Taiwan Dollars';
              } else if (this.tableData[i].currency == 'USD') {
                this.tableData[i].currencyone = 'U.S.Dollars';
              } else if (this.tableData[i].currency == 'CHF') {
                this.tableData[i].currencyone = 'Swiss Francs';
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currencyone = 'HKD ';
              }
            }
            break;
        }
        this.loading = false;
      }
    },
    async handleSizeChange(size) {
      this.pageSize = size;
      this.Datalist();
      
    },
    async handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.Datalist();
      
    },
    handleClick(tab, event) {
      if (this.currentPage == 1) {
        console.log('tab', tab);
        switch (tab.name) {
          case 'first':
            this.Datalist();
            
            break;
          case 'second':
            this.total = '';
            
            break;
        }
      } else {
        this.currentPage = 1;
        this.Datalist();
        console.log('tab', tab);
        switch (tab.name) {
          case 'first':
            
            break;
          case 'second':
            this.total = '';
            this.Datalistone();
            
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0 0 0px;
}
.g-accountManagent {
  position: relative;
  height:650px;
  .m-topTabs {
    /deep/ .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #d9d9d9;
    }
    /deep/.el-tabs__item {
      position: relative;
      line-height: 26px;
      border: solid 1px #d9d9d9;
      margin-right: 8px;
      padding: 7px 32px;
      border-radius: 2px;
      background-color: #f4f4f4;
      &.is-top:nth-child(2) {
        padding-left: 32px;
      }
      &.is-top:last-child {
        padding-right: 32px;
      }

      &.is-active {
        background-color: #fff;
        border-bottom: none;
        &::after {
          position: absolute;
          content: '';
          width: 100%;
          height: 8px;
          bottom: -3px;
          left: 0;
          background-color: #fff;
          z-index: 1;
        }
        &:before {
          position: absolute;
          content: '';
          width: 101%;
          height: 4px;
          top: -1px;
          left: -1px;
          background-color: #f06b00;
        }
      }
    }
    /deep/ .el-tabs__active-bar {
      display: none;
    }
  }
}
</style>
