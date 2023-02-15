<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-31 10:45:17
 * @LastEditTime: 2022-09-16 16:15:13
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\home\recent-card-list\item.vue
-->
<template>
  <el-card
    class="trans-item"
    v-if="isShowItem"
    @click.native="toTransRecordDetail"
  >
    <div class="order-num">
      <span>
        {{ `0${index + 1}` }}
      </span>
    </div>
    <div class="trans-content">
      <h3 class="upper" v-if="item.businessCode !=='03010401'|| item.businessCode !=='03010501'">
        {{ item.displayCreditAcctName }}
      </h3>
      <p class="lower" v-if="item.businessCode !=='03010401' || item.businessCode !=='03010501'">
        {{ `${formatAcctNo(item.debitAcct)} ${item.ccy ? item.ccy : ''}` }}
      </p>


      <h3 class="upper" v-if="item.businessCode =='03010401'">
       {{$t('OPERATORLOG.BULK_TRANSFER')}}
      </h3>
      <p class="lower" v-if="item.businessCode =='03010401'">
      {{$t('TRANSCTIONS.TOTAL_OF_RECORDS')}}：{{item.totalNum}}
      </p>
      <h3 class="upper" v-if="item.businessCode =='03010501'">
     {{$t('OPERATORLOG.BULK_PAYROLL')}}
      </h3>
      <p class="lower" v-if="item.businessCode =='03010501'">
     {{$t('TRANSCTIONS.TOTAL_OF_RECORDS')}}：{{item.totalNum}}
      </p>
    </div>
    <label class="trans-amount" >
      {{'-'+ String(item.amount).toMoney() }}
    </label>
  </el-card>
</template>

<script>
import { confirm } from '@bank-transfer/mixins';

export default {
  name: 'RecentCardItem',
  mixins: [confirm],
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isShowItem() {
      return Object.getOwnPropertyNames(this.item).length;
    }
  },
  mounted() {
    console.log('ITEMTETETETMETEm', this.item);
  },
  methods: {
    toTransRecordDetail() {
      this.$emit('toTransRecordDetail', {
        index: this.index,
        ...this.item
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.trans-item {
  width: 100%;
  cursor: pointer;
  border: none;
  margin-bottom: 5px;
  box-shadow: none;

  &:hover {
    box-shadow: 0 5px 0.5px #ddd;
  }

  ::v-deep .el-card__body {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .order-num {
    flex: 1;
  }
  .trans-amount {
    flex: 1.3;
    color: #f06b00;
    font-weight: 600;
  }
  .trans-content {
    flex: 3;

    .upper,
    .lower {
      width: 100%;
      // text-align: center;
    }
    .upper {
      font-size: 14px;
    }
    .lower {
      font-size: 14px;
    }
  }

  .order-num span {
    font-size: 25px;
    padding: 8px;
    box-sizing: border-box;
    color: #ccc;
    font-weight: 700;
    background: #fff;
    border: 1px solid hsla(0, 0%, 92.9%, 0.71);
    width: 34px;
    height: 34px;
    line-height: 1;
    -webkit-box-shadow: 0 5px 10px 0 hsla(0, 0%, 65.5%, 0.12);
    box-shadow: 0 5px 10px 0 hsla(0, 0%, 65.5%, 0.12);
    border-radius: 8px;
    text-align: center;
  }
}
</style>
