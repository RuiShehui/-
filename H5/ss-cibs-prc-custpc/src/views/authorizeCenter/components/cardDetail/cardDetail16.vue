<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <div class="u-content__item__left" style="padding-left:3px">{{$t('USER_COMMON.USER_CODE')}}</div>
          <div class="u-content__item__right">{{dataDep.ebankCstmNo}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{$t('SPECIAL_INSTRUACTION.ENGLISH_NAME')}}</div>

          <div class="u-content__item__right">{{dataDep.linkUserName}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{$t('AUTHORIZE.TYPE')}}</div>
          <div class="u-content__item__right">{{this.$t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{$t('SPECIAL_INSTRUACTION.EMAIL')}}</div>
          <div class="u-content__item__right">{{dataDep.linkEmail}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{$t('AUTHORIZE.createTime')}}</div>
          <div class="u-content__item__right">{{dataItem.createTime}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{$t('AUTHORIZE.flowNo')}}</div>
          <div class="u-content__item__right">{{dataItem.flowNo}}</div>
        </div>
        
        <div class="u-content__item" v-if="isProcess">
          <div class="u-content__item__left">{{$t('AUTHORIZE.authState')}}</div>
          <div class="u-content__item__right status">{{dataItem.authState | authStateFilter}}</div>
        </div>
      </div>
      <div class="table">
        <el-table :data="fileList">
          <el-table-column :label="$t('SPECIAL_INSTRUACTION.REQUIRED_SERVICE')" prop="fileType">
            <template slot-scope="scope">
              {{scope.row.fileType  | service}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('SPECIAL_INSTRUACTION.SELECT_FILE')" prop="originalFilename"></el-table-column>
        </el-table>
      </div>
    </div>
    <authorizetionProcess
      :authStatus="dataItem.authState"
      v-if="isProcess"
      :flowNo="dataItem.flowNo"
      :menuCode="tableData.transactionType"
    ></authorizetionProcess>
    <authOpinion
      :creditType="3"
      :transactionType ="transactionType"
      :detailData="this.dataDep"
      hasAuthorization="0"
      v-if="scene ==='2'"
      @confirm="confirm"
    ></authOpinion>
  </div>
</template>

<script>
import authOpinion from '../authOpinion';
import authorizetionProcess from '../authorizetionProcess';
import { action } from '@/api/public.js'
import filter from "@/filters/public.js"
export default {
  components: {
    authOpinion,
    authorizetionProcess
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    authState: {
      type: String,
      default: ''
    },
    scene: {
      type: String,
      default: '0'
    },
    isProcess: {
      type: Boolean,
      default: false
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    },
    stt: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0
      /**
       * 0行内转账
       * 1转数
       * 2本地特快
       * 3电汇
       * 4批量转账
       * 5批量发薪 ----delete
       * 6登记第三者账户
       * 7自动转账收款
       * 8申领支票簿
       * 9开立定期存款
       * 10更改到期指示
       * 11货币兑换
       * 12基金认购
       * 13基金转换
       * 14基金赎回
       * 15缴付账单
       * 16高风险商户维护
       * 17预约交易管理
       * 18预约缴付管理
       */
    }
  },
  filters: {
   ...filter,
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
      dataItem: {},
      dataDep: {},
      stepTitle1: '', //授权流程标题
      stepTitle2: '',
      stepTitle3: '',
      stepTitle4: '',
      stepTitle5: '',
      newTableData: [],
      processStatus: '', //步骤进度当前的状态
      authActionMessage: '', //授权意见
      flowNoList: [],
      authActionType: '', //待授权动作 : submit 提交-0 | AUTH接口必输: pass 授权通过-1 refuse 授权拒绝-2
      transactionType: '',
      fileList:[]
    };
  },
  created() {
    console.log('上個頁面', this.stt);
    // this.dataItem = this.tableData;
    this.dataItem =  this.stt? this.res : this.tableData;
    this.transactionType = this.dataItem.transactionType;
    this.dataDep = this.stt
      ? JSON.parse(this.dataItem.transactionDescribe)
      : this.dataItem.transactionDescribe;
    this.accountList = this.dataDep.bthDetailList;
    this.fileList = this.dataDep.fileList
    this.flowNoList.push(this.dataItem.flowNo);
  },
  methods: {
    goList() {
      this.$emit('golist');
    },
    submit() {
      this.$emit('submit');
    },
    async chequeBookAuthInit(form) {
      let flowNo = this.tableData.flowNo,
        account = this.tableData.transactionDescribe.fixedAccount,
        amount = this.tableData.transactionDescribe.depositAmount;
      this.authActionType = form.radio;
      this.authActionMessage = form.opinion;
      let params = {
        authReqInfo: {
          authActionType: this.authActionType,
          authActionMessage: this.authActionMessage,
          flowNo: this.tableData.flowNo,
          opType: this.tableData.operationType
            ? this.tableData.operationType.charAt(0)
            : null,
          bsnCode: this.tableData.transactionType
        },
        // dueDate:this.ta
        flowNoList: [flowNo]
      };
      console.log('授权接口参数', params);
      const result = await action(params);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
      // chequeBookAuth(params).then(res => {
      //   // '提交成功'
      //   this.$message({
      //     type: 'success',
      //     message: this.$t('AUTHORIZE.Success'),
      //     delay: 1500
      //   });
      //   this.$router.go(-1);
      // });
    },
    confirm(form) {
      this.authActionType = form.radio;
      this.authActionMessage = form.opinion;
      console.log('-----submit', form);
      this.chequeBookAuthInit(form);
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
      padding-left: 12px;
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
          margin-left: 12px;
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
.table{
  margin: 48px 0px;
}
</style>