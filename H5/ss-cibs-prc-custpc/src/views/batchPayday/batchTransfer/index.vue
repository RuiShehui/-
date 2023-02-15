<template>
  <div class="g-recordManuallly" v-loading="requestLoading">
    <el-tabs v-model="activeName" class="g-tabs" :before-leave="leaveTab">
      <el-tab-pane :label="$t('BRANCH_TRANSFER.ONLINE_EDIT')" name="onlineEditing"></el-tab-pane>
      <el-tab-pane :label="$t('BRANCH_TRANSFER.FILE_UPLOAD')" name="fileUpload"></el-tab-pane>
    </el-tabs>
    <div class="g-onlineEditing">
      <steps :stepsList="stepsList" class="steps" :activeIndex="activeIndex"></steps>
      <div v-show="activeIndex === 0">
        <payeeInform
          ref="payeeform"
          @next="next"
          @activeNames="activeNames"
          :activeName="activeName"
          :oldactiveName="oldactiveName"
          :formDataObj="formData"
          :isJumpIn="isJumpIn"
          v-if="show"
        ></payeeInform>
      </div>
      <div v-if="activeIndex === 1">
        <comfirm @next="next" @back="back" :formDataObj="formData"></comfirm>
      </div>
      <div v-if="activeIndex === 2">
        <result @back="back" :message="message" :formDataObj="formData"></result>
      </div>
    </div>
  </div>
</template>

<script>
import payeeInform from './components/payeeInformation';
import comfirm from './components/comfirm';
import result from './components/result';
import { mapState } from 'vuex';
import { newTradeToken } from '@/api/paymentRemittance';
export default {
  components: {
    payeeInform,
    comfirm,
    result
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      activeName: 'onlineEditing',
      oldactiveName: '',
      activeIndex: 0,
      isJumpIn: '1', //0是别的页面跳转过来
      // 步骤条
      stepsList: [
        {
          title: this.$t('PAYMENT.FILL_TRANSFER_INFO'),
          description: ''
        },
        {
          title: this.$t('PAYMENT.CONFIRM_TRANSFER_INFO'),
          description: ''
        },
        {
          title: this.$t('PAYMENT.SUBMIT_RESULT'),
          description: '',
          status: ''
        }
      ],
      formData: {
        acctNo: '',
        payAcctNo: '', //付款账户
        payAcctNoMoney: '', //付款账户可用结余
        payAcctNoStatus: '', //付款账户状态
        cutPayAcctNoStatus: '', //扣款账户状态
        company: '', //付款账户名称
        payString: '', //付款账户拼接
        cutcompany: '', //扣款账户名称
        cutString: '', //扣款账户拼接
        allMonth: '',
        authorNum: '',
        checked: false,
        cutPayAcctNoMoney: '',
        transOutDate: '',
        redebitChecked: false,
        total: '',
        totalMoney: '',
        remindNameList: [],
        tableData: [],
        payBank: [],
        payObject: null, //付款人列表
        cutObject: null, //扣款
        fileId: '', //文件的id
        authInfo: {
          AlevelList: [],
          BlevelList: [],
          ClevelList: []
        }
      },
      message: {},
      show: true
    };
  },
  methods: {
    init() {
      if (this.$route.query.params) {
        const { params = '{}' } = this.$route.query;
        this.formData = JSON.parse(params);
        this.formData.tdId = this.$route.query.tdId
      }
      if (this.$route.query.jumpType) {
        this.isJumpIn = this.$route.query.jumpType;
      }
    },
    active(val) {
      console.log(val, 'fus');
      this.activeName = val;
    },
    back() {
      if (this.activeIndex === 2) {
        this.stepsList[2].status = '';
        this.formData = {
          acctNo: '',
          payAcctNo: '', //付款账户
          payAcctNoMoney: '', //付款账户可用结余
          payAcctNoStatus: '', //付款账户状态
          cutPayAcctNoStatus: '', //扣款账户状态
          company: '', //付款账户名称
          payString: '', //付款账户拼接
          cutcompany: '', //扣款账户名称
          cutString: '', //扣款账户拼接
          allMonth: '',
          authorNum: '',
          checked: false,
          cutPayAcctNoMoney: '',
          transOutDate: '',
          redebitChecked: false,
          total: '',
          totalMoney: '',
          remindNameList: [],
          tableData: [],
          payBank: [],
          payObject: null, //付款人列表
          cutObject: null, //扣款
          fileId: '', //文件的id
          authInfo: {
            AlevelList: [],
            BlevelList: [],
            ClevelList: []
          }
        };
        this.show = true;
        this.activeIndex = 0;
      } else {
        this.activeIndex--;
      }
    },
    async next(val) {
      this.formData = val;
      console.log('上个页面的数据', this.formData);
      if (this.activeIndex == 2) {
        console.log(1);
        return (this.activeIndex = 0);
      } else if (this.activeIndex == 1) {
        // 调用接口
        // 接口状态返回正常
        this.show = false;
        console.log('上个页面的数据', val);
        let message = {};
        if (val.returnCode == '000000') {
          let state = val.authResultInfo.authResultState;
          console.log('state', state);
          //03 60 90 显示提交成功
          //20显示银行处理中
          if (state == '03') {
            message = {
              status: 'success',
              title: this.$t('COMMON.SUBMIT_SUCCESS'),
              desc: `${this.$t('COMMON.FLOW_NO')}: ${
                val.authResultInfo.flowNo
              }`,
              succ: true,
              flag: true
            };
          } else {
            message = {
              status: 'success',
              title: this.$t('COMMON.SUBMIT_SUCCESS'),
              desc: `${this.$t('COMMON.FLOW_NO')}: ${
                val.authResultInfo.flowNo
              }`,
              succ: true
            };
          }
        } else {
          message = {
            status: 'fail',
            title: this.$t('COMMON.SUBMIT_FAIL'),
            desc: `${this.$t('PAYMENT.FAIL_REASON')}: ${val.returnMessage}`,
            succ: false
          };
        }
        this.message = message;
        this.stepsList[2].status = 'success';
        console.log(this.message, 'msgee');
        return this.activeIndex++;
      } else {
        const tokResult = await newTradeToken();
        if (tokResult) {
          console.log(tokResult);
          sessionStorage.setItem('tranToken', tokResult.body);
        }
        console.log(this.activeIndex);
        return this.activeIndex++;
      }
    },
    activeNames() {
      this.activeName = 'fileUpload';
    },
    leaveTab(active, oldactive) {
      this.activeName = active;
      this.oldactiveName = oldactive;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 4px solid #f06b00 !important;
  border-bottom-color: #fff !important;
}
.steps {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.g-tabs {
  // margin-left: 24px;
  // margin-right: 24px;
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
</style>