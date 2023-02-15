<template>
  <div class="g-card-detail-wrapper">
    <div v-if="stateAll">
      <component
        v-for="(item,index) in filterTableArr"
        :key="index"
        :is="`cardDetail${item.transactionType}`"
        :authState="authState"
        :tableData="item"
        :scene="scene"
        :jump030103="Rjump030103"
        :flowList="flowList"
        @authRpc="authRpc"
        :stt="stt"
        :res="res"
      ></component>
    </div>
    <template v-else>
      <component
        v-if="tableData.transactionType"
        :is="`cardDetail${tableData.transactionType}`"
        :authState="authState"
        :tableData="tableData"
        :jump030103="Rjump030103"
        :scene="Rscene ? Rscene:scene"
        :isProcess="isProcess"
        @authRpc="authRpc"
        :stt="stt"
        :res="res"
      ></component>
    </template>
    <div class="g-card-detail-wrapper"></div>
    <div class="btns" v-if="scene!=='2'">
      <!-- 返回 -->
      <v-button @click="goBack">{{$t('AUTHORIZE.BACK')}}</v-button>
    </div>
  </div>
</template>

<script>
import { action } from '@/api/public.js';
import cardDetail030101 from './cardDetail/cardDetail030101';
import cardDetail03010201 from './cardDetail/cardDetail03010201';
import cardDetail0402 from './cardDetail/cardDetail0402';
import cardDetail0403 from './cardDetail/cardDetail0403';
import cardDetail03010401 from './cardDetail/cardDetail03010401';
import cardDetail10 from './cardDetail/cardDetail10';
import cardDetail03010501 from './cardDetail/cardDetail03010501';
import cardDetail050102 from './cardDetail/cardDetail050102';
import cardDetail060101 from './cardDetail/cardDetail060101';
import cardDetail050201 from './cardDetail/cardDetail050201';
import cardDetail050202 from './cardDetail/cardDetail050202';
import cardDetail030107 from './cardDetail/cardDetail030107';
import cardDetail03010202 from './cardDetail/cardDetail03010202';
import cardDetail030103 from './cardDetail/cardDetail030103';
import cardDetail0303 from './cardDetail/cardDetail0303';
import cardDetail060103 from './cardDetail/cardDetail060103';
import cardDetail060102 from './cardDetail/cardDetail060102';
import cardDetail0901 from './cardDetail/cardDetail-user-managent';
import cardDetail0902 from './cardDetail/cadrDetail-account-details';
import cardDetail090301 from './cardDetail/cardDetail-template-mainten';
import cardDetail090302 from './cardDetail/cardDetail-trans-author-set';
import cardDetail090401 from './cardDetail/cardDetail-set-service';
import cardDetail090402 from './cardDetail/cardDetail-FPS';
import cardDetail090403 from './cardDetail/cardDetail-set-transfer';
import cardDetail090404 from './cardDetail/cardDetail-set-EDDA';
import cardDetail090405 from './cardDetail/cardDetail-set-statement';
import cardDetail090406 from './cardDetail/cardDetail-set-transa-tips';
import cardDetail16 from "./cardDetail/cardDetail16.vue"
function filterArr(arr) {
  return arr.reduce((prev, cur) => {
    if (!prev.includes(cur)) {
      prev.push(cur);
    }
    return prev;
  }, []);
}

export default {
  components: {
    cardDetail030101,
    cardDetail03010201,
    cardDetail0402,
    cardDetail050202,
    cardDetail0403,
    cardDetail0901,
    cardDetail0902,
    cardDetail03010401,
    cardDetail10,
    cardDetail03010501,
    cardDetail050102,
    cardDetail060101,
    cardDetail050201,
    cardDetail030107,
    cardDetail03010202,
    cardDetail030103,
    cardDetail0303,
    cardDetail060103,
    cardDetail060102,
    cardDetail090301,
    cardDetail090302,
    cardDetail090401,
    cardDetail090402,
    cardDetail090403,
    cardDetail090404,
    cardDetail090405,
    cardDetail090406,
    cardDetail16
  },
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    },
    tableDataArr: {
      type: Array,
      default() {
        return [];
      }
    },
    scene: {
      type: String,
      default: '0'
    },
    jump030103: {
      type: String,
      default: 'N'
    },
    authState: {
      type: String,
      default: ''
    },
    stateAll: {
      type: Boolean,
      default: false
    },
    stt: {
      type: String,
      default: ''
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    },
    currentPage: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    filterTableArr() {
      return filterArr(this.tableDataArr);
    }
  },
  filters: {
    showMaxOpinion(val) {
      if (typeof val === 'undefined') return;
      if (val.length <= 30) {
        return val;
      } else {
        return val.substr(0, 30) + '...';
      }
    }
  },

  data() {
    return {
      isProcess: true,
      name: '',
      accountNo: '',
      accountName: '',
      toName: '',
      toAccountNo: '',
      toAccountName: '',
      bankName: '',
      active: 2,
      approveList: [],
      status: '0',
      accountList: [],
      tableList: [],

      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      processStatus: '', //步骤进度当前的状态
      flowList: [],
      Rscene: 0,
      Rjump030103: 'N'
    };
  },
  created() {
    console.log(this.$route.query.isProcess, 'this.$route.query.isProcess');
    this.Rscene = this.$route.query.scene;
    this.Rjump030103 = this.$route.query.jump030103;
    this.isProcess = this.$route.query.isProcess === '0' ? false : true;
    if (this.tableDataArr.length > 0) {
      this.tableDataArr.map(item => {
        this.flowList.push(item.flowNo);
      });
    }
    console.log('传入前',this.isProcess)
  },
  methods: {
    filterArr,
    // 统一授权接口，部分模块支持，后面会改成全部支持 20220407
    async authRpc(params) {
      const result = await action(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    },
    goBack() {
      localStorage.setItem('scene', this.scene);
      if (this.stt) {
        this.$router.push({
          path: '/seriveQuery/historyQuery',
          query: {
            type: '1',
            currentPage: this.currentPage
            // authState
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  &__middle {
    margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 36px;
      &__item {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        &__left {
          width: 222px;
          text-align: right;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          line-height: 22px;
          // margin-left: 82px;
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          line-height: 22px;
          margin-left: 24px;
        }
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
  margin-bottom: 20px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
}
</style>