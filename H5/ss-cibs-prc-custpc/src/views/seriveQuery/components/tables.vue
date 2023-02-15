<!--
 * @Author: zhangcheng
 * @Date: 2022-04-22 09:44:52
 * @LastEditTime: 2022-10-26 18:54:28
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\seriveQuery\components\tables.vue
-->
<template>

  <div class="rate-table overflow-y:scroll;" v-loading="requestLoading">
   <div >
       <div class="announce ">
      <span>{{$t('FOREXLISTPRICE.THE_FOLLOWING_INFORMATION_IS_FOR_REFERENCE_ONLY')}}</span>
      <span class="grleft">{{$t('FOREXLISTPRICE.LAST_UPDATE_TIMES')}} {{ updateDate }}</span>
    </div>
   </div>
    <header>
      <div class="ccy-money setchaBar isFixed"  id='setchaBar' :class="searFixed?'isFixed':''">
        <div class="ccy">{{ $t('REMITTANCECONFIRM.CURRENCY') }}</div>
        <div class="money-title">{{ $t('INTERESTRATEQUERY.DEPOSIT_AMOUNT') }}</div>
        <div class="title">{{ $t('INTERESTRATEQUERY.DEPOSIT_TENOR') }}</div>
      </div>
      <div class="des-date">
        <div class="date">
          <div class="leftstyle">{{ $t('INTERESTRATEQUERY.ONE_DAY') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.SEVEN_DAY') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.FOUR_DAY') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.ONE_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.TWO_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.THREE_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.SIX_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.NINE_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.EVE_MONTH') }}</div>
          <div>{{ $t('INTERESTRATEQUERY.TWO_tHERR') }}</div>
        </div>
      </div>
    </header>
     <div class="divdss">
        <div class="content" style="" v-for="(item,index) in tableData" :key="index">
      <div class="ccy">
        <div class="image jpy">
          <img :src="require(`@/images/internationalBusiness/${ item[0].CCY }.png`)" alt />
        </div>
        <div class="zh">{{ item[0].CCY | ccyFilter }}</div>
        <div class="en">{{ item[0].CCY }}</div>
      </div>
      <div class="rate">
        <div v-for="(itm,idx) in item" :key="idx">
          <div class="money-num">
            <span
              v-if="idx > 0 && idx < item.length - 1"
            >{{ toInt(item[idx-1].AMOUNT,itm.CCY) }} {{ $t('INTERESTRATEQUERY.TO') }}</span>
            <span v-if="idx === 0 && itm.CCY !== 'JPY'">0.00  {{ $t('INTERESTRATEQUERY.TO') }}</span>
            <span v-if="idx === 0 && itm.CCY === 'JPY'">0   {{ $t('INTERESTRATEQUERY.TO') }}</span>
            <span
              v-if="idx === item.length - 1"
            >{{ toInt(item[idx-1].AMOUNT,itm.CCY) }} {{ $t('INTERESTRATEQUERY.ABOVE') }}</span>
            {{ formatMoney(itm.AMOUNT) }}
          </div>
          <div>{{ itm['1D']?itm['1D']:'-' }}</div>
          <div>{{ itm['7D']?itm['7D']:'-' }}</div>
          <div>{{ itm['14D']?itm['14D']:'-' }}</div>
          <div>{{ itm['1M']?itm['1M']:'-' }}</div>
          <div>{{ itm['2M']?itm['2M']:'-' }}</div>
          <div>{{ itm['3M']?itm['3M']:'-' }}</div>
          <div>{{ itm['6M']?itm['6M']:'-' }}</div>
          <div>{{ itm['9M']?itm['9M']:'-' }}</div>
          <div>{{ itm['12M']?itm['12M']:'-'}}</div>
          <div>{{ itm['24M']?itm['24M']:'-' }}</div>
        </div>
      </div>
    </div>
     </div>
    <div v-if="Object.keys(tableData).length === 0" class="no-data">
      <img src="@/images/queryNot.png" />
      <div class="text">{{ $t('TRANSFR_INFO.NO_DATA') }}</div>
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

  data() {
    return {
      tableData: {},
      searFixed:false,
      updateDate: '',
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  filters,
    created(){
    this.init();
     this.$nextTick(()=>{
       window.addEventListener('scroll',this.handleScroll)
     })
  },
  methods: {
    async init() {
      // 获取币种
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
    handleScroll(){
     var scrollTop=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||document.scrollingElement.scrollTop||0
     console.log('this.scrollTop',scrollTop);
     var offsetTop=document.querySelector('#setchaBar').offsetTop
     if(scrollTop>offsetTop){
       this.searFixed=true
     }else{
       this.searFixed=false
     }
     
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
  width: 100%;
  font-size: 14px;
  padding-bottom: 20px;
  position: relative;
  .announce {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    color: rgba(0, 0, 0, 0.45);
    height: 22px;
    margin: 20px 0 12px;
    .grleft{
      margin-left: 677px
    }
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
      // justify-content: space-between;
      align-items: center;
      width: 1064px;
      height: 46px;

      .ccy {
        width: 100px;
      }
      .money-title {
        width: 200px;
      }
      .title{
        margin-left: 252px
      }
    }
    .des-date {
      margin-top: 40px;
      flex-grow: 1;
      // min-height: 92px;
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
    // margin-top: 16px;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.1);
    .ccy {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100px;
     
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
.rate-table .content .ccy .zh {
    text-align: center !important;
}
.isFixed{
  position: fixed;
  top:260px !important;
  z-index:9999999;
  overflow: hidden;
}
.isFixedd{
  position: fixed;
  // top:380;
  z-index:9999999;
  overflow: hidden;
}
.leftstyle{
  margin-left: 285px;
}
.divsg{
  height: 16px;
  overflow: hidden;
}
.divdss{
  overflow-y: scroll;
  height: 450px;
}
</style>
