<!--
 * @Author: your name
 * @Date: 2021-12-02 16:18:12
 * @LastEditTime: 2022-09-26 14:23:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\internationalBusiness\forexListPrice\forexListPrice.vue
-->
<template>
  <div class="g-accountManagent">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="m-topTabs">
      <el-tab-pane :label="$t(`FOREXLISTPRICE.BANKNOTE`)" name="first">
        <forexTable
          :head="$t('FOREXLISTPRICE.BANKNOTE_RATES')"
          :tableData="tableData"
          :time="time"
          :loading="loading"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></forexTable>
      </el-tab-pane>
      <el-tab-pane :label="$t('FOREXLISTPRICE.TELEGRAPHIC_TRANSFER')" name="second">
        <forexTable
          :head="$t('FOREXLISTPRICE.TELEGRAPHIC_TRANSFER_RATES')"
          :tableData="tableDataone"
          :time="time"
          :loading="loading"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></forexTable>
      </el-tab-pane>
      <el-pagination
        v-if="total*1>=10"
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
    <div class="g-btns" v-if="jumpToInter">
      <v-button size="w160" type="primary" @click="$router.go(-1)">
        {{
        $t('COMMON.BACK')
        }}
      </v-button>
    </div>
  </div>
</template>

<script>
import forexTable from './components/forexTable';
import { cashRateQuery } from '@/api/internationalBusiness.js';
import { transferRateQuery } from '@/api/internationalBusiness.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
let lang = localStorage.getItem('lang');
export default {
  components: {
    forexTable
  },
  computed: {
    ...mapState(['lang'])
  },
  mounted() {
    console.log(this.lang);
    this.Datalist();
    //     this.Datalistone()
  },
  data() {
    return {
      total: 0,
      loading: true, //加载标识
      activeName: 'first',
      time: '2021-10-11 10:06',
      tableData: [
        {
          currency: '',
          customersBuy: '',
          customersSell: ''
        }
      ],
      tableDataone: [
        {
          currency: '',
          customersBuy: '',
          customersSell: ''
        }
      ],
      currentPage: 1,
      pageSize: 10,
      jumpToInter:false
    };
  },
  created() {
    // this.Datalist();
    // console.log("语言的状态：",lang)
    if(this.$route.query.jumpToInter){
         this.jumpToInter = this.$route.query.jumpToInter
    }
  },

  methods: {
    //外币电汇接口查询
    async Datalistone() {
      this.loading = true;
      let params = {
        current: this.currentPage,
        size: this.pageSize
      };
      const resone = await transferRateQuery(params);
      if (resone == null) {
        this.tableDataone = resone;
        this.loading = false;
      } else {
        this.total = resone.total;
        this.tableDataone = resone.rateList;
        for (let i = 0; i < this.tableDataone.length; i++) {
          if (this.tableDataone[i].currency == 'AUD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.AUD');
          } else if (this.tableDataone[i].currency == 'CAD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.CAD');
          } else if (this.tableDataone[i].currency == 'CNY') {
            this.tableDataone[i].currencyone = this.$t(
              'REMITTANCECONFIRM.CNY'
            );
          } else if (this.tableDataone[i].currency == 'EUR') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.EUR');
          } else if (this.tableDataone[i].currency == 'GBP') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.GBP');
          } else if (this.tableDataone[i].currency == 'JPY') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.JPY');
          } else if (this.tableDataone[i].currency == 'NZD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.NZD');
          } else if (this.tableDataone[i].currency == 'SGD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.SGD');
          } else if (this.tableDataone[i].currency == 'TWD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.TWD');
          } else if (this.tableDataone[i].currency == 'USD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.USD');
          } else if (this.tableDataone[i].currency == 'CHF') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.CHF');
          } else if (this.tableDataone[i].currency == 'HKD') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.HKD');
          } else if (this.tableDataone[i].currency == 'DKK') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.SEK');
          } else if (this.tableDataone[i].currency == 'SEK') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.DKK');
          } else if (this.tableDataone[i].currency == 'THB') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.THB');
          } else if (this.tableDataone[i].currency == 'KRW') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.KRW');
          } else if (this.tableDataone[i].currency == 'MOP') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.MOP');
          } else if (this.tableDataone[i].currency == 'MYR') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.MYR');
          } else if (this.tableDataone[i].currency == 'PHP') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.PHP');
          } else if (this.tableDataone[i].currency == 'CNH') {
            this.tableDataone[i].currencyone = this.$t('REMITTANCECONFIRM.CNH');
          }
        }
        switch (this.lang) {
          case 'zh-CN':
            for (let i = 0; i < this.tableDataone.length; i++) {
              if (this.tableDataone[i].currency == 'AUD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.AUD'
                );
                console.log('数组下标：', i);
                console.log('遍历后的数据:', this.tableData[i].currency);
              } else if (this.tableDataone[i].currency == 'CAD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CAD'
                );
              } else if (this.tableDataone[i].currency == 'CNY') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNY'
                );
              } else if (this.tableDataone[i].currency == 'EUR') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.EUR'
                );
              } else if (this.tableDataone[i].currency == 'GBP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.GBP'
                );
              } else if (this.tableDataone[i].currency == 'JPY') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.JPY'
                );
              } else if (this.tableDataone[i].currency == 'NZD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.NZD'
                );
              } else if (this.tableDataone[i].currency == 'SGD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SGD'
                );
              } else if (this.tableDataone[i].currency == 'TWD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.TWD'
                );
              } else if (this.tableDataone[i].currency == 'USD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.USD'
                );
              } else if (this.tableDataone[i].currency == 'CHF') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CHF'
                );
              } else if (this.tableDataone[i].currency == 'HKD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.HKD'
                );
              } else if (this.tableDataone[i].currency == 'DKK') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SEK'
                );
              } else if (this.tableDataone[i].currency == 'SEK') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.DKK'
                );
              } else if (this.tableDataone[i].currency == 'THB') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.THB'
                );
              } else if (this.tableDataone[i].currency == 'KRW') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.KRW'
                );
              } else if (this.tableDataone[i].currency == 'MOP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.MOP'
                );
              } else if (this.tableDataone[i].currency == 'MYR') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.MYR'
                );
              } else if (this.tableDataone[i].currency == 'PHP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.PHP'
                );
              } else if (this.tableDataone[i].currency == 'CNH') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNH'
                );
              }
            }
            break;
          case 'zh-HK':
            for (let i = 0; i < this.tableDataone.length; i++) {
              if (this.tableDataone[i].currency == 'AUD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.AUD'
                );
              } else if (this.tableDataone[i].currency == 'CAD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CAD'
                );
              } else if (this.tableDataone[i].currency == 'CNY') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNY'
                );
              } else if (this.tableDataone[i].currency == 'EUR') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.EUR'
                );
              } else if (this.tableDataone[i].currency == 'GBP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.GBP'
                );
              } else if (this.tableDataone[i].currency == 'JPY') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.JPY'
                );
              } else if (this.tableDataone[i].currency == 'NZD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.NZD'
                );
              } else if (this.tableDataone[i].currency == 'SGD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SGD'
                );
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.TWD'
                );
              } else if (this.tableDataone[i].currency == 'USD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.USD'
                );
              } else if (this.tableDataone[i].currency == 'CHF') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CHF'
                );
              } else if (this.tableDataone[i].currency == 'HKD') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.HKD'
                );
              } else if (this.tableDataone[i].currency == 'DKK') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.DKK'
                );
              } else if (this.tableDataone[i].currency == 'SEK') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SEK'
                );
              } else if (this.tableDataone[i].currency == 'THB') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.THB'
                );
              } else if (this.tableDataone[i].currency == 'KRW') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.KRW'
                );
              } else if (this.tableDataone[i].currency == 'MOP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.MOP'
                );
              } else if (this.tableDataone[i].currency == 'MYR') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.MYR'
                );
              } else if (this.tableDataone[i].currency == 'PHP') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.PHP'
                );
              } else if (this.tableDataone[i].currency == 'CNH') {
                this.tableDataone[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNH'
                );
              }
            }
            break;
          case 'en':
            for (let i = 0; i < this.tableDataone.length; i++) {
              if (this.tableDataone[i].currency == 'AUD') {
                this.tableDataone[i].currencyone = 'Australian Dollars';
                console.log('数组下标：', i);
                console.log('遍历后的数据:', this.tableData[i].currency);
              } else if (this.tableDataone[i].currency == 'CAD') {
                this.tableDataone[i].currencyone = 'Canadian Dollars';
              } else if (this.tableDataone[i].currency == 'CHF') {
                this.tableDataone[i].currencyone = 'Swiss Francs';
              } else if (this.tableDataone[i].currency == 'CNY') {
                this.tableDataone[i].currencyone = 'Renminbi(Onshore)';
              } else if (this.tableDataone[i].currency == 'EUR') {
                this.tableDataone[i].currencyone = 'Euro';
              } else if (this.tableDataone[i].currency == 'GBP') {
                this.tableDataone[i].currencyone = 'Sterling';
              } else if (this.tableDataone[i].currency == 'JPY') {
                this.tableDataone[i].currencyone = 'Japanese Yen';
              } else if (this.tableDataone[i].currency == 'NZD') {
                this.tableDataone[i].currencyone = 'New Zealand Dollars';
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableDataone[i].currencyone = 'Singapore Dollars';
              } else if (this.tableDataone[i].currency == 'TWD') {
                this.tableDataoneone[i].currencyone = 'New Taiwan Dollars';
              } else if (this.tableDataone[i].currency == 'USD') {
                this.tableDataone[i].currencyone = 'U.S.Dollars';
              } else if (this.tableDataone[i].currency == 'CNH') {
                this.tableDataone[i].currencyone = 'Renminbi(Offshore)';
              } else if (this.tableDataone[i].currency == 'DKK') {
                this.tableDataone[i].currencyone = 'Danish Kroners';
              } else if (this.tableDataone[i].currency == 'SEK') {
                this.tableDataone[i].currencyone = 'Swedish Kroners';
              } else if (this.tableDataone[i].currency == 'THB') {
                this.tableDataone[i].currencyone = 'Thai Bahts';
              } else if (this.tableDataone[i].currency == 'SGD') {
                this.tableDataone[i].currencyone = 'Singapore Dollars';
              }
            }
            break;
        }
        this.loading = false;
      }
    },
    //外币现钞接口查询
    async Datalist() {
      this.loading = true;
      let params = {
        current: this.currentPage,
        size: this.pageSize
      };
      const res = await cashRateQuery(params);
      if (res == null) {
        this.tableData = res;
        this.loading = false;
      } else {
        this.time = res.lastUpdateTime;
        this.total = res.total;
        this.tableData = res.rateList;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].currency == 'AUD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.AUD');
            console.log('数组下标：', i);
            console.log('遍历后的数据:', this.tableData[i].currency);
          } else if (this.tableData[i].currency == 'CAD') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.CAD');
          } else if (this.tableData[i].currency == 'CNY') {
            this.tableData[i].currencyone = this.$t('REMITTANCECONFIRM.CNYONE');
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
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.AUD'
                );
                console.log('数组下标：', i);
                console.log('遍历后的数据:', this.tableData[i].currency);
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CAD'
                );
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNYONE'
                );
              } else if (this.tableData[i].currency == 'EUR') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.EUR'
                );
              } else if (this.tableData[i].currency == 'GBP') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.GBP'
                );
              } else if (this.tableData[i].currency == 'JPY') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.JPY'
                );
              } else if (this.tableData[i].currency == 'NZD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.NZD'
                );
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SGD'
                );
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.TWD'
                );
              } else if (this.tableData[i].currency == 'USD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.USD'
                );
              } else if (this.tableData[i].currency == 'CHF') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CHF'
                );
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.HKD'
                );
              }
            }
            break;
          case 'zh-HK':
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].currency == 'AUD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.AUD'
                );
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CAD'
                );
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CNYONE'
                );
              } else if (this.tableData[i].currency == 'EUR') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.EUR'
                );
              } else if (this.tableData[i].currency == 'GBP') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.EUR'
                );
              } else if (this.tableData[i].currency == 'JPY') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.JPY'
                );
              } else if (this.tableData[i].currency == 'NZD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.NZD'
                );
              } else if (this.tableData[i].currency == 'SGD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.SGD'
                );
              } else if (this.tableData[i].currency == 'TWD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.TWD'
                );
              } else if (this.tableData[i].currency == 'USD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.USD'
                );
              } else if (this.tableData[i].currency == 'CHF') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.CHF'
                );
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currencyone = this.$t(
                  'REMITTANCECONFIRM.HKD'
                );
              }
            }
            break;
          case 'en':
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].currency == 'AUD') {
                this.tableData[i].currencyone = 'Australian Dollars';
                console.log('数组下标：', i);
                console.log('遍历后的数据:', this.tableData[i].currency);
              } else if (this.tableData[i].currency == 'CAD') {
                this.tableData[i].currencyone = 'Canadian Dollars';
              } else if (this.tableData[i].currency == 'CNY') {
                this.tableData[i].currencyone = 'Renminbi';
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
                this.tableData[i].currency = 'Swiss Francs';
              } else if (this.tableData[i].currency == 'HKD') {
                this.tableData[i].currency = 'HKD';
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
      this.Datalistone();
    },
    async handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.activeName == 'second') {
        this.Datalistone();
      } else {
        this.Datalist();
      }
      //  this.Datalist()
      //  this.Datalistone()
    },
    handleClick(tab, event) {
      if (this.currentPage == 1) {
        console.log('tab', tab);
        switch (tab.name) {
          case 'first':
            // this.tableHeade = '外币现钞兑港元牌价'
            break;
          case 'second':
            this.Datalistone();
            // this.tableHeade = '外币电汇兑港元牌价'
            break;
        }
      } else {
        this.currentPage = 1;
        this.Datalist();
        console.log('tab', tab);
        switch (tab.name) {
          case 'first':
            // this.tableHeade = '外币现钞兑港元牌价'
            break;
          case 'second':
            this.Datalistone();
            // this.tableHeade = '外币电汇兑港元牌价'
            break;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0 0 24px;
}
.g-btns {
  position: fixed;
  left: 50%;
  transform: translateX(50%);
  margin: 20px 0 0 0;
}
.g-accountManagent {
  position: relative;
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
