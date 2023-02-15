<!--
 * @Author: zhangcheng
 * @Date: 2022-04-22 09:44:52
 * @LastEditTime: 2022-09-19 10:16:40
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\seriveQuery\components\tables.vue
-->
<template>
  <div class="rate-table" v-loading="requestLoading">
    <div class="announce">
      <span>{{$t('FOREXLISTPRICE.THE_FOLLOWING_INFORMATION_IS_FOR_REFERENCE_ONLY')}}</span>
      <span>{{$t('FOREXLISTPRICE.LAST_UPDATE_TIMES')}}{{ updateDate }}</span>
    </div>
    <header>
      <div class="ccy-money">
        <div class="ccy">{{$t('TRANSFR_INFO.CUR')}}</div>
        <div class="money-title">{{$t('TRANSFR_INFO.AMOUNT')}}</div>
      </div>
      <div class="des-date">
        <div class="title">{{$t('FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR')}}</div>
        <div class="date">
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.ONE_DAY')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.ONE_WEEK')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.TWO_WEEK')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.ONE_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.TWO_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.THREE_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.SIX_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.NINE_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.TWELEVE_MONTHS')}}</div>
          <div>{{$t('FIXED_DEPOSIT_OVERVIEW.TWENTY_MONTHS')}}</div>
        </div>
      </div>
    </header>
    <div class="content" v-for="(item,index) in tableData" :key="index">
      <div class="ccy">
        <div class="image jpy">
          <img :src="require(`@/images/internationalBusiness/${ item[0].CCY }.png`)" alt />
        </div>
        <div class="zh" style="width:100px">{{ item[0].CCY | ccyFilter }}</div>
        <div class="en">{{ item[0].CCY }}</div>
      </div>
      <div class="rate">
        <div v-for="(itm,idx) in item" :key="idx">
          <div class="money-num">
            <span
              v-if="idx > 0 && idx < item.length - 1"
            >{{ toInt(item[idx-1].AMOUNT,itm.CCY) }} {{$t('ACCOUNT_MANAGEMENT.DATESPAN_TO')}}</span>
            <span
              v-if="idx === 0 && itm.CCY !== 'JPY'"
            >0.00 {{$t('ACCOUNT_MANAGEMENT.DATESPAN_TO')}}</span>
            <span v-if="idx === 0 && itm.CCY === 'JPY'">0 {{$t('ACCOUNT_MANAGEMENT.DATESPAN_TO')}}</span>
            <span
              v-if="idx === item.length - 1"
            >{{ toInt(item[idx-1].AMOUNT,itm.CCY) }} {{$t('INTERESTRATEQUERY.ABOVE')}}</span>
            {{ formatMoney(itm.AMOUNT) }}
          </div>
          <div>{{ itm['1D'] }}</div>
          <div>{{ itm['7D'] }}</div>
          <div>{{ itm['14D'] }}</div>
          <div>{{ itm['1M'] }}</div>
          <div>{{ itm['2M'] }}</div>
          <div>{{ itm['3M'] }}</div>
          <div>{{ itm['6M'] }}</div>
          <div>{{ itm['9M'] }}</div>
          <div>{{ itm['12M'] }}</div>
          <div>{{ itm['24M'] }}</div>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(tableData).length === 0" class="no-data">
      <img src="@/images/queryNot.png" />
      <div class="text">{{$t('USER_MANAGERMENT.TRADE_TYPE_SMALL_00')}}</div>
    </div>
  </div>
</template>

<script>
import { rateQuery } from '@/api/internationalBusiness.js';
import { mapState } from 'vuex';
import filters from '@/filters/ccy.js';
function formatRateTable(origin) {
  /**
   * 1. 先判断原列表中是否含有此对象
   *   1.1 有 把对象筛出来, 不用push
   *   1.2 没有 新建一个对象, 并将此对象push到目标数组中
   *
   * 2. 把相应key的金额赋值给目标对象
   */
  const flattenList = origin.reduce((prev, cur) => {
    let curItem;
    if (prev.some(item => item.CCY === cur.CCY && item.AMOUNT === cur.AMOUNT)) {
      curItem = prev.find(
        item => item.CCY === cur.CCY && item.AMOUNT === cur.AMOUNT
      );
    } else {
      curItem = {
        CCY: cur.CCY,
        AMOUNT: cur.AMOUNT
      };
      prev.push(curItem);
    }

    const { PERIOD } = cur;

    curItem[PERIOD] = cur['AVG.RATE'];

    return prev;
  }, []);
  const target = flattenList.reduce((prev, cur) => {
    if (prev.hasOwnProperty(cur.CCY)) {
      prev[cur.CCY].push({ ...cur });
    } else {
      prev[cur.CCY] = [{ ...cur }];
    }
    return prev;
  }, {});
  Object.keys(target).forEach(item => {
    target[item] = target[item].sort((a, b) => {
      if (a.AMOUNT === '' || b.AMOUNT === '') {
        return Number(b.AMOUNT) - Number(a.AMOUNT);
      } else {
        return Number(a.AMOUNT) - Number(b.AMOUNT);
      }
    });
  });
  return target;
}

export default {
  name: 'TimeDepositRate',
  created() {
    this.init();
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      tableData: {},
      updateDate: ''
    };
  },
  filters,
  methods: {
    async init() {
      const restwo = await rateQuery();
      if (restwo) {
        this.updateDate = restwo.updateDate;
        const { rateList } = restwo;
        this.tableData = formatRateTable(rateList);
        console.log(this.tableData);
      }
    },
    //向上取整
    toInt(money, ccy) {
      return this.formatMoney(Math.ceil(money), ccy);
    },
    formatMoney(money, ccy) {
      if (!money) {
        return '';
      }
      if (ccy === 'JPY') {
        return String(money).toJPY();
      }
      return String(money).toMoney();
    }
  }
};
</script>

<style lang="scss" scoped>
.rate-table {
  font-size: 14px;
  padding-bottom: 20px;
  max-height: 680px;
  .announce {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.45);
    height: 22px;
    margin: 20px 0 12px;
  }
  header {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: rgba(0, 0, 0, 0.85);
    display: flex;
    .ccy-money {
      background: #f3f3f3;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 46px;
      .ccy {
        width: 100px;
      }
      .money-title {
        width: 200px;
      }
    }
    .des-date {
      flex-grow: 1;
      min-height: 92px;
      .title {
        background: #f3f3f3;
        text-align: center;
        min-height: 46px;
        line-height: 46px;
      }
      .date {
        color: rgba(0, 0, 0, 0.65);
        display: flex;
        > div {
          padding: 14px 10px;
          box-sizing: border-box;
          flex: 1;
        }
      }
    }
  }
  .content {
    display: flex;
    margin-top: 16px;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.1);
    .ccy {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 135px;
      text-align: center;
      // background: #f9f9f9;
      .image {
        width: 45px;
        height: 30px;
        border-radius: 3px;
        img {
          width: 45px;
          height: 30px;
        }
      }
      .jpy {
        border: 1px solid rgba(239, 239, 239, 0.75);
      }
      .zh {
        color: rgba(0, 0, 0, 0.85);
        margin-top: 8px;
        font-size: 16px;
      }
      .en {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 2px;
        line-height: 22px;
        height: 22px;
      }
    }
    .rate {
      color: rgba(0, 0, 0, 0.65);
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
      > div {
        display: flex;
        align-items: center;
        cursor: pointer;
        > div:not(:nth-of-type(1)) {
          padding: 14px 10px;
          word-break: break-all;
          box-sizing: border-box;
          flex: 1;
        }
        .money-num {
          padding-left: 24px;
          word-break: break-all;
          box-sizing: border-box;
          width: 200px;
        }
      }
      > div:hover {
        background: #fffaf7;
      }
      > div:nth-of-type(2n-1) {
        background: #fffaf7;
      }
    }
  }
}
.pagination {
  padding: 16px 0;
}
.no-data {
  text-align: center;
  img {
    margin: 10px auto;
  }
  .text {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin: 0 auto 10px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
