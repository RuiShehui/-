<template>
  <div class="g-list-content">
    <el-checkbox-group v-model="checkList" @change="checkBox">
      <div class="g-list-item" v-for="(item, index) in list" :key="index">

        <div class="m-cardList-wrapper">
          <component
            v-if="item.transactionType !== '0303'"
            :is="`cardList${item.transactionType}`"
            :item="item"
          ></component>
          <component v-else :is="`cardList${item.transactionDescribe.bsnCode}`" :item="item"></component>
          <div class="m-cardList-wrapper__right">
            <div class="u-money" v-if="item.transactionType == '03010401'">
              {{ item.transactionDescribe.cur }}
              {{ item.transactionDescribe.tradeAmount | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '03010501'">
              {{ item.transactionDescribe.cur }}
              {{ item.transactionDescribe.tradeAmount | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '060101'">
              {{ item.transactionDescribe.currency }}
              {{ item.transactionDescribe.tranAmt | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '060103'">
              {{ item.transactionDescribe.currency }}
              {{ item.transactionDescribe.payAmt | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '10'"></div>
            <div class="u-money" v-if="item.transactionType == '050102'">
              {{ item.transactionDescribe.debitCurrency }}
              <span
                v-if="item.transactionDescribe.amountDebited"
              >{{ item.transactionDescribe.amountDebited | formatMoneyNew}}</span>
              <span v-else>{{ item.transactionDescribe.amount | formatMoneyNew}}</span>
            </div>
            <!-- 转数快，行内转账，外币转账，电汇 -->
            <div
              class="u-money"
              v-if="
                ['030103', '030101', '03010201', '03010202'].includes(
                  item.transactionType
                )
              "
            >
              {{ item.transactionDescribe.ccy }}
              {{ item.transactionDescribe.amount | formatMoneyNew}}
            </div>

            <!-- 预约交易 -->
            <div class="u-money" v-if="item.transactionType === '0303'">
              {{ item.transactionDescribe.transDetail.ccy }}
              {{ item.transactionDescribe.transDetail.amount | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '0402'">
              {{ item.transactionDescribe.fixedAccountCur }}
              {{ item.transactionDescribe.depositAmount | formatMoneyNew}}
            </div>
            <div class="u-money" v-if="item.transactionType == '0403'">
              {{ item.transactionDescribe.depositCurrency }}
              {{ item.transactionDescribe.depositAmount | formatMoneyNew }}
            </div>
            <!-- 开立定期结束 -->
            <div
              class="u-moneyTip"
              v-if="
                ['030103', '03010201', '03010202', '030101','060101'].includes(
                  item.transactionType
                )
              "
            >{{ $t('BILLPAYMENT.TRANSACTION_AMOUNT') }}</div>
            <div
              class="u-moneyTip"
              v-if="item.transactionType === '050201'"
            >{{ $t('FUND.SUBSCRIPTION_AMOUNT') }}</div>
            <div
              class="u-moneyTip"
              v-if="
                item.transactionType === '050202' &&
                  item.transactionDescribe.tranType === '2'
              "
            >{{ $t('FUND.SWITCH_OUT_QUANTITY') }}</div>
            <div
              class="u-moneyTip"
              v-if="
                item.transactionType === '050202' &&
                  item.transactionDescribe.tranType === '3'
              "
            >{{ $t('FUND.REDEEM_QUANTITY') }}</div>
            <div class="g-btns">
              <v-button
                v-if="scene === '0' && item.cancelable == '1'"
                class="u-hasMargin"
                size="w96"
                @click="revoke(item)"
                :class="item.transactionType == '030107' ? 'u-third' : ''"
              >{{ $t('COMMON.REVOKE') }}</v-button>
              <v-button
                v-if="scene === '1' && item.authState !== '1' && reEditList.indexOf(item.businessCode)  > -1 "
                class="u-hasMargin"
                size="w96"
                @click="reEdit(item)"
              >
                <!-- 重新编辑 -->
                {{$t('AUTHORIZE.REEDIT')}}
              </v-button>
              <v-button
                size="w96"
                :class="item.transactionType == '030107' ? 'u-third' : ''"
                type="primary"
                @click="goDetail(item)"
              >{{ $t('COMMON.DETAIL') }}</v-button>
            </div>
          </div>
        </div>
      </div>
    </el-checkbox-group>
    <PopUp
      ref="dialog"
      width="400px"
      :options="true"
      :confirmField="$t('FUND.CONFIRM')"
      @confirm="sure"
    >
      <div class="dialog">
        <img src="@/images/common/warning.png" />
        <!-- 确定撤销该业务吗？ -->
        <p>{{$t('AUTHORIZE.REVOCK_WORD')}}</p>
      </div>
    </PopUp>
  </div>
</template>

<script>
import { transactionRevoke } from '@/api/authorizeCenter.js';
import cardList030101 from './cardList/cardList030101';
import cardList030107 from './cardList/cardList030107';
import cardList0402 from './cardList/cardList0402';
import cardList0403 from './cardList/cardList0403';
import cardList050201 from './cardList/cardList050201';
import cardList050202 from './cardList/cardList050202';
import cardList03010401 from './cardList/cardList03010401';
import cardList03010501 from './cardList/cardList03010501';
import cardList10 from './cardList/cardList10';
import cardList050102 from './cardList/cardList050102';
import cardList03010201 from './cardList/cardList03010201';
import cardList060101 from './cardList/cardList060101';
import cardList03010202 from './cardList/cardList03010202';
import cardList030103 from './cardList/cardList030103';
import cardList0303 from './cardList/cardList0303';
import cardList060103 from './cardList/cardList060103';
import cardList060102 from './cardList/cardList060102';
import cardList16 from "./cardList/cardList16"
import { formatMoney } from '@/utils/tools.js';
import { authPathMap } from '@auth/service/constant';
import { getActiveClickArr } from '@/utils/index';
import { mapMutations, mapGetters } from 'vuex';
import { formatMoneyNew } from '@/utils/tools';

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    isAuthoriza: {
      //是否授权，具体看接口再改
      type: Boolean,
      default: true
    },
    scene: {
      type: String,
      default: '0' //0为我提交的待授权场景，1为我提交的已结束场景，2为待我授权场景，3为已授权场景
    }
  },
  components: {
    cardList030101,
    cardList0402,
    cardList0403,
    cardList050201,
    cardList050202,
    cardList03010401,
    cardList03010501,
    cardList10,
    cardList050102,
    cardList03010201,
    cardList060101,
    cardList030107,
    cardList03010202,
    cardList030103,
    cardList0303,
    cardList060103,
    cardList060102,
    cardList16
  },
  data() {
    return {
      status: 'wait',
      type: '9',
      withDrawDialog: false,
      isAgree: false, //已授权
      checkList: [],
      transactionDescribe: {},
      path: '',
      flowNo: '', //流水号
      bsnCode: '', //交易码
      // 有重新交易的功能
      reEditList: [
        '030101',
        '03010201',
        '03010202',
        '030103',
        '03010401',
        '03010402',
        '03010501',
        '03010502',
        '030106',
        '030107',
        '0303'
      ]
    };
  },
  filters: {
    formatMoneyNew: formatMoneyNew
  },
  created() {
    this.path = window.location.href.split('#')[1];
    // 处理预约数据
    this.list.forEach(item => {
      if (item.transactionType === '0303') {
        item.transactionDescribe.transDetail = JSON.parse(
          item.transactionDescribe.transDetail
        );
      }
    });
  },
  watch: {
    list: n => {
      n.forEach(item => {
        if (item.transactionType === '0303') {
          item.transactionDescribe.transDetail = JSON.parse(
            item.transactionDescribe.transDetail
          );
        }
      });
    }
  },
  computed: {
    ...mapGetters(['getSliderMenusAct', 'getActiveClickArr']),
    disabled() {
      return this.checkList.length >= 10;
    }
  },
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    formatMoney,
    revoke(item) {
      this.flowNo = item.flowNo;
      this.bsnCode = item.businessCode;
      this.$refs['dialog'].showDialog();
    },
    sure() {
      let params = {
        flowNo: this.flowNo,
        bsnCode: this.bsnCode
      };
      transactionRevoke(params).then(res => {
        if (res) {
          // '撤销交易成功'
          this.$message({
            type: 'success',
            message: this.$t('AUTHORIZE.REVOCK_SUCCESS'),
            delay: 3000
          });
          this.flowNo = '';
          this.$emit('refresh');
        }
      });
      this.$refs['dialog'].closeHandle();
    },
    reEdit(item) {
      const { businessCode, transactionDescribe } = item;
      const path = authPathMap[businessCode];
      if (!path) {
        return;
      }
      /**
       * @todo slide-menu
       * @todo cur userMenuPermissionList
       */

      let id = item.businessCode;
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === '03';
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(id);
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);

      this.$router.push({
        path,
        query: {
          /** 统一格式, 勿动!!!!!!!!!! */
          params: JSON.stringify({
            ...(transactionDescribe || {})
          })
        }
      });
    },
    checkBox() {
      this.$emit('checkbox', this.checkList);
    },
    // 详情
    goDetail(item) {
      this.$router.push({
        path: '/authorizeCenter/detail',
        query: {
          scene: this.scene,
          flowNo: item.flowNo,
          authState: item.authStat,
          transactionDescribe: item.transactionDescribe,
          businessCode: item.businessCode,
          item
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-list-content {
  .g-list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .m-checkBox {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 24px;
      margin-top: -30px;
    }
  }
}
.m-cardList-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  justify-content: space-between;
  box-sizing: border-box;
  height: 150px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.11);
  border-radius: 3px;
  font-size: 14px;
  padding: 16px 24px;
  margin: 0 4px;
  margin-bottom: 16px;
  .m-cardList-wrapper__left {
    flex: 1;
    .m-cardList-wrapper__left-top {
      .type {
        display: inline-block;
        line-height: 24px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
      }
    }
    &-middle {
      .u-name,
      .u-account,
      .u-bankName {
        display: inline-block;
        height: 20px;
        font-size: 14px;
        margin-bottom: 9px;
        :first-child {
          color: rgba(0, 0, 0, 0.45);
        }
        :last-child {
          color: rgba(0, 0, 0, 0.65);
        }
      }
      .u-account,
      .u-handleDate,
      .u-charge {
        margin-left: 64px;
      }
      .u-bankName {
        display: block;
        margin-bottom: 12px;
        p {
          display: inline-block;
          margin-left: 54px;
        }
      }
      .u-subTime,
      .u-handleDate,
      .u-charge {
        height: 17px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  .m-cardList-wrapper__right {
    .u-money,
    .u-moneyTip {
      text-align: right;
    }
    .u-money {
      color: #f07b00;
      line-height: 28px;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .u-moneyTip {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 24px;
    }
    .g-btns {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      right: 30px;
      bottom: 10px;
    }
  }
}
.g-withDrawDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 44px;
    width: 44px;
  }
  p {
    margin: 24px 0;
  }
  .g-withDrawBtn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.u-hasMargin {
  margin-right: 16px;
}
::v-deep .oButton {
  margin-left: 24px;
}
.dialog {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  img {
    width: 54px;
    height: 54px;
  }
  p {
    margin-top: 16px;
    color: #1b1b1b;
    text-align: center;
    font-size: 16px;
  }
}
</style>
