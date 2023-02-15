<template>
  <div class="u-new-wapper">
    <steps
      :stepsList="stepsList"
      :activeIndex="activeIndex"
      :class="serviceFalg ? 'u-stpes1' :'u-stpes2'"
    />

    <!-- 基本信息 -->
    <div v-if="activeIndex === 0">
      <basic-info :options="base_info" @next="next0" @back="back0" />
    </div>
    <!-- 服务设定 -->
    <div v-if="activeIndex === 1">
      <server-setting
        @next="next1"
        @back="back"
        :options="settingObj"
        :serverSettingObj="basicInfo"
      />
    </div>
    <div v-if="activeIndex === 2">
      <account :options="settingObj" @next="next2" @back="back" :accountObj="serverSettingObj" />
    </div>
    <div v-if="activeIndex === 3">
      <confirm-info
        v-loading="userLoading"
        :options="settingObj"
        @next="next3"
        @back="back"
        :confirmInfo="accountObj"
      />
    </div>
    <div v-if="activeIndex === 4">
      <result :message="message" />
    </div>
    <div class="mt36" v-if="activeIndex === 0">
      <p class="f14 mb16">{{$t('COMMON.TIPS')}}</p>
      <p class="f14 gray3 lh20">{{$t('USER_MANAGEMENT.TO_OPEN')}}</p>
    </div>
    <div class="mt36" v-if="activeIndex === 1">
      <p class="f14 mb16">{{$t('COMMON.TIPS')}}</p>
      <p class="f14 gray3 lh20">{{$t('USER_MANAGEMENT.TO_CHECK')}}</p>
    </div>
  </div>
</template>
<script>
import BasicInfo from './components/basicInfo';
import ServerSetting from './components/serverSetting';
import Account from './components/account';
import ConfirmInfo from './components/confirmInfo';
import mathTools from '@/utils/mathTools.js';
import Result from './components/result';
import { log } from 'util';
import { updateOperator } from '@/api/userManagement.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
  sessionStorage.getItem('userInfo')
);
export default {
  components: {
    BasicInfo,
    ServerSetting,
    Account,
    ConfirmInfo,
    Result
  },

  data() {
    return {
      jumpdata: {}, //存上个页面调过来的数据
      userLoading: false,
      base_info: {}, //用户基本信息
      settingObj: {}, //服务设定信息
      // 步骤条1
      stepsList: [
        {
          title: this.$t('USER_MANAGEMENT.NORMAL_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGEMENT.SERVE_SETTING'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGEMENT.ACCOUNT_SETTING'),
          description: ''
        },
        {
          title: this.$t('COMMON.CONFIRM'),
          description: ''
        },
        {
          title: this.$t('COMMON.COMPLETE'),
          description: ''
        }
      ],
      // 当前激活的索引
      activeIndex: 0,
      // 接口的返回值信息
      message: {},
      // 是否从列表的服务与设定跳转过来
      serviceFalg: false,
      rowData: {}, // 上个页面传递的值
      basicInfo: {}, // 基本信息页的值
      serverSettingObj: {}, // 服务设定页的值
      accountObj: {}, // 账户设定页的值
      loading: false
    };
  },

  created() {
    this.jumpdata = this.$route.query.data;
    const {
      rowJson = '',
      activeIndex = 0,
      isRead = false,
      isModify = false
    } = this.$route.query.resp;
    if (isRead) {
      this.activeIndex = activeIndex * 1;
      this.accountObj = JSON.parse(rowJson);
    }
  },
  methods: {
    //   返回
    back(baseInfo) {
      this.settingObj = baseInfo;
      if (this.activeIndex === 1) {
        this.base_info = baseInfo;
        // return this.$router.go(-1);
      }
      if (this.activeIndex === 2) {
        console.log('打印，，，，，', baseInfo, this.activeIndex);
        this.settingObj = baseInfo;
      }
      if (this.activeIndex === 3) {
        this.settingObj = baseInfo;
      }
      if (this.activeIndex === 4) {
        return this.$router.go(-1);
      }
      this.activeIndex--;
    },

    next0(basicInfo) {
      this.activeIndex++;
      this.basicInfo = basicInfo;
    },
    back0() {
      // this.$router.go(-1);
      this.$router.push({
        path: '/_businessManagement/operatorMaintain/seeUser',
        query: {
          resp:this.jumpdata,
          isRead: true
        }
      });
    },

    next1(serverSettingObj) {
      this.serverSettingObj = serverSettingObj;
      this.activeIndex++;
    },

    next2(accountObj) {
      this.accountObj = accountObj;
      this.activeIndex++;
    },

    //操作员，编辑
    next3(confirmInfo) {
      this.userLoading = true;
      confirmInfo.menuPermission.forEach(item => {
        if (item.createFlag) {
          item.queryFlag = true;
        }
        if (
          item.transType == '2' ||
          item.transType == '3' ||
          item.transType == 'P'
        ) {
          if (!item.createFlag) {
            item.queryFlag = false;
          }
        }
      });

      let params = {
        menuPermissions: confirmInfo.menuPermission,
        operatorUpadate: confirmInfo.operator,
        operatorAccounts: confirmInfo.operatorAccounts
      };
      let menuId = localStorage.getItem('sliderMenusAct');
      const tradeInfo = JSON.stringify({...confirmInfo,operationType:'2'});
      updateOperator(params).then(resp => {
        this.userLoading = false;
        const { returnCode } = resp.head;
        // const {authResultInfo} = resp.body.authResultInfo
        console.log(returnCode, 'returnCode');
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '2'
            // status: status
          }).then(() => {
            this.next3(confirmInfo);
          });
        } else if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.next3(confirmInfo);
          });
        } else {
          if (resp.body.authResultState === '03') {
            resp.body.authorMessage = this.$t(
              'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
            );
            this.message = resp.body.authResultInfo;
            return this.activeIndex++;
          } else {
            this.message = resp.body.authResultInfo;
            return this.activeIndex++;
          }
        }
      });
      this.userLoading = false;
    },

    // 下一步
    next() {
      if (this.activeIndex === 4) {
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 3) {
        // 调用接口
        // 接口状态返回正常
        let message = {
          status: 'success',
          title: this.$t('COMMON.SUBMIT_SUCCESS'),
          desc:  this.$t('COMMON.FLOW_NO')+': 1231213213213'
        };
        this.message = message;

        return this.activeIndex++;
      } else {
        return this.activeIndex++;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>