<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-27 11:18:00
 * @LastEditTime: 2022-09-29 16:13:51
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\transferRecord\record-detail\single-record.vue
-->
<template>
  <div>
    <!-- 注意，因为电汇（电汇）展示内容较多，较为复杂，所以在这个分开使用，global-record.vue《------这个页面用于展示电汇内容 -->
    <div v-if="showItem.businessCode !== '030103'" class="m-detail-content">
      <!-- 参考编号 -->
      <detail-item :title="$t('PAYMENT.WEBBANK_FLOW_NO')" :content="showItem.flowNo" />
      <!-- 转账类型 -->
      <detail-item
        :title="$t('PAYMENT.TRANS_TYPE')"
        :content="escapeTransType(showItem.businessCode)"
      />
      <!-- 付款账户 -->
      <detail-item
        :title="$t('PAYMENT.PAYMENT_ACCOUNT')"
        :content="
        `${formatAcctNo(showItem.debitAcct)} ${
         getType(showItem.ccy) 
        } ${getProcessType(showItem.debitAcctType)}`
      "
      />
      <!-- 收款户名 -->
      <detail-item :title="$t('PAYMENT.PAYEE_NAME')" :content="showItem.creditAcctName" />
      <!-- 收款账户 -->
      <template>
        <!-- 行内转账-收款账户 -->
        <detail-item
          v-if="showItem.businessCode === '030101'"
          :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
          :content="
          `${showItem.creditAcct} ${showItem.creditCcy}  ${getProcessType(showItem.creditAcctType)}`
        "
        />
        <!-- FPS转账-收款账户 -->
        <template v-if="showItem.businessCode === '03010201'">
          <detail-item
            v-if="showItem.creditAcctIdentificationType === 'EMAL'"
            :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
            :content="`${(showItem.creditAcct)} ${'('+$t('PAYMENT.EMAIL_ADDRESS')+')'}`"
          />
          <detail-item
            v-if="showItem.creditAcctIdentificationType === 'MOBN'"
            :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
            :content="`${(showItem.creditAcct)} ${'('+$t('PAYMENT.MOBILE_PHONE_NUMBER')+')'}`"
          />
          <detail-item
            v-if="showItem.creditAcctIdentificationType === 'SVID'"
            :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
            :content="`${(showItem.creditAcct)} ${'('+'FPS ID'+')'}`"
          />
          <detail-item
            v-if="
            ['BBAN', 'AIIN'].includes(
              showItem.creditAcctIdentificationType
            )
          "
            :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
            :content="`${(showItem.creditAcct)} ${showItem.creditCcy}`"
          />
        </template>
        <!-- CHATS转账-收款账户 -->
        <detail-item
          v-if="showItem.businessCode === '03010202'"
          :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
          :content="
          `${showItem.creditAcct} ${showItem.creditCcy}`
        "
        />
        <!-- TT转账-收款账户 -->
        <detail-item
          v-if="showItem.businessCode === '030103'"
          :title="$t('PAYMENT.RECEIVE_ACCOUNT')"
          :content="showItem.creditAcct"
        />
      </template>
      <!-- 收款银行机构 -->
      <template>
        <!-- 行内转账-收款银行 -->
        <detail-item
          v-if="showItem.businessCode === '030101'"
          :title="$t('PAYMENT.RECEIVE_BANK')"
          :content="$t('PAYMENT.CHUANGXING_BANK')"
        />
        <!-- FPS-收款银行 -->
        <detail-item
          v-if="showItem.businessCode === '03010201'"
          :title="$t('PAYMENT.RECEIVE_BANK')"
          :content="filterFpsBank(showItem)"
        />
        <!-- CHATS-收款银行 -->
        <detail-item
          v-if="showItem.businessCode === '03010202'"
          :title="$t('PAYMENT.RECEIVE_BANK')"
          :content="filterBankInfo(showItem.creditBankCode)"
        />
      </template>
      <!-- 附言 :content="showItem.postscript" -->
      <detail-item
        v-if="!['030101'].includes(showItem.businessCode)"
        :title="$t('PAYMENT.POSTSCRIPT')"
        :content="showItem.additionalComment"
      />
      <!-- 转账金额 -->
      <detail-item
        :title="$t('PAYMENT.TRANSFER_AMOUNT')"
        :content="`${showItem.ccy} ${formatMoneyNew(showItem.amount)}`"
      />
      <!-- 手续费扣款账户 -->
      <template>
        <!-- 转数快 && 外币转账 -->
        <detail-item
          :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
          :content="
          `${formatAcctNo(showItem.chargeAcct)} ${
           getType(showItem.chargeCcy) 
          } ${getProcessType(showItem.chargeAcctType)}`
        "
          v-if="[ '03010202'].includes(showItem.businessCode)"
        />
        <!-- 电汇 -->
        <template v-if="['030103'].includes(showItem.businessCode)">
          <detail-item
            :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')"
            :content="
            `${formatAcctNo(showItem.chargeAcct)} ${
              showItem.chargeCcy
            } ${getProcessType(showItem.chargeAcctType)}`
          "
          />
        </template>
      </template>
      <!-- 手续费 -->
      <template>
        <detail-item
          :title="$t('PAYMENT.CHARGE_CCY')"
          :content="`${showItem.chargeCcy} ${showItem.chargeAmt.toMoney()}`"
          v-if="['03010202'].includes(showItem.businessCode)"
        />
      </template>
      <template v-if="['030103'].includes(showItem.businessCode)">
        <!-- 手续费 -->
        <detail-item
          :title="$t('PAYMENT.CHARGE_CCY')"
          :content="`${showItem.chargeCcy} ${showItem.chargeAmt}`"
        />
        <!-- 电报费 -->
        <detail-item :title="$t('PAYMENT.ELEC_FEE')" :content="`HKD ${showItem.commissionAmt}`" />
      </template>
      <!-- 提交时间 -->
      <detail-item
        :title="$t('APPOINTTRACTION.SUBMIT_TIME')"
        :content="showItem.submitTime | filterLinkTime"
      />
    </div>
    <!-- 電匯详情 -->
    <global-record v-else :detailItem="detailItem" />
  </div>
</template>

<script>
import { confirm } from '@bank-transfer/mixins';
import { transWrite } from '@bank-transfer/mixins';
import { escapeTransType } from '@bank-transfer/utils/filters';
import GlobalRecord from './global-record.vue';
import filters from '@/filters/public';
export default {
  name: 'SingleRecord',
  components: {
    GlobalRecord
  },
  mixins: [confirm, transWrite],
  props: {
    detailItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showItem: {}
    };
  },
  filters: {
    ...filters,
    ccyFilter:filters.ccyFilter
  },
  mounted() {
    console.log('detailItem------>详情页面内-单笔交易', this.detailItem);
    if (Object.getOwnPropertyNames(this.detailItem).length) {
      this.$set(this, 'showItem', this.detailItem);
    }
    if (this.$route.query.params) {
      this.$set(this, 'showItem', this.$route.query.params);
    }
  },
  methods: {
    init(){},
    escapeTransType,
    getType(val){
      return filters.ccyFilter(val)
    },
        /** 过滤fps银行 */
    filterFpsBank({
      creditBankCode,
      creditAcctIdentificationType,
      designBank
    }) {
        if(creditAcctIdentificationType === 'SVID'){
          return '--';
        }
        if (['MOBN', 'EMAL'].includes(creditAcctIdentificationType)){
          if (designBank === 'PRE') {
            return this.$t('PAYMENT.PRESET_PAYEE_BANK');
          }
          if (designBank === 'DEF') {
            return this.$t('PAYMENT.CHUANGXING_BANK');
          }
        }
        const curBank = this.bankInfoList.find(
          item => item.value === creditBankCode
        );
        if (curBank && curBank.bankName) {
          return curBank.bankName;
        }
        return '--';
    },
  }
};
</script>

<style lang="scss" scoped>
.m-detail-content {
  width: 940px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  .detailItem {
    margin-bottom: 16px;
    &:nth-child(2n) {
      margin-left: 52px;
    }
  }
}
</style>
