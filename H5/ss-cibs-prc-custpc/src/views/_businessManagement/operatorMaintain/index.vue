<template>
  <div class="u-operator-wapper mt24" style="margin-top: 0">
    <!-- 查询区 -->
    <el-form ref="operatorFormRef" :model="operatorForm" label-width="auto">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('USER_MANAGEMENT.USER_TYPE')" prop="userType">
            <el-select
              v-model="operatorForm.userType"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING')"
            >
              <el-option :label="$t('RIGHTS_TEMPLATE.ALL')" value></el-option>
              <el-option :label="$t('USER_MANAGEMENT.ADMINISTRATOR')" value="1"></el-option>
              <el-option :label="$t('USER_MANAGEMENT.REPORTER')" value="3"></el-option>
              <el-option :label="$t('USER_MANAGEMENT.AUTHORIZER')" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="2">
          <el-form-item :label="$t('USER_MANAGEMENT.USER_ENGLISH_COLON')" prop="userName">
            <el-input
              v-model="operatorForm.userName"
              :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:$t('USER_MANAGEMENT.USER_ENGLISH_COLON')
            })"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="4">
          <el-form-item :label="$t('USER_MANAGEMENT.USER_STATUS_COLON')" prop="userStatus">
            <el-select
              v-model="operatorForm.userStatus"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING')"
            >
              <el-option :label="$t('RIGHTS_TEMPLATE.ALL')" value></el-option>
              <el-option :label="$t('USER_MANAGEMENT.ENABLE')" value="1"></el-option>
              <el-option :label="$t('USER_MANAGEMENT.DEACTIVATE')" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="flexc">
        <v-button
          :disabled="butFlag"
          size="w70"
          @click="fResetForm"
          class="mr16"
        >{{$t('COMMON.RESET')}}</v-button>
        <v-button
          :disabled="butFlag"
          size="w96"
          type="primary"
          @click="fQueryClick"
          class="mr16"
        >{{$t('COMMON.SEARCH')}}</v-button>
        <v-button size="w112" @click="fNewClick">+&nbsp;{{$t('COMMON.ADD')}}</v-button>
      </el-row>
    </el-form>
    <!-- 列表数据区 -->
    <el-table :data="operatorData" stripe class="u-table mt16" height="398px">
      <el-table-column :label="$t('COMMON.SERIAL_NUMBER')" type="index" width="80"></el-table-column>
      <el-table-column
        :label="$t('USER_MANAGEMENT.USER_ENGLISH_NAME')"
        prop="userEglsName"
        width="130"
      ></el-table-column>
      <el-table-column :label="$t('USER_MANAGEMENT.USER_TYPE')" prop="userType" width="130">
        <template
          slot-scope="scope"
        >{{ scope.row.userType === "1" ? $t('USER_MANAGEMENT.ADMINISTRATOR') :scope.row.userType === "3" ? $t('USER_MANAGEMENT.REPORTER') : $t('USER_MANAGEMENT.APPROVER') }}</template>
      </el-table-column>

      <el-table-column :label="$t('USER_MANAGEMENT.USER_STATUS')" prop="status" width="130">
        <template
          slot-scope="scope"
        >{{ scope.row.status === "1" ? $t('USER_MANAGEMENT.ENABLE') : $t('USER_MANAGEMENT.DEACTIVATE') }}</template>
      </el-table-column>

      <el-table-column
        :label="$t('USER_MANAGEMENT.AUTHORIZATION_LEVEL')"
        prop="empowerGroup"
        width="150"
      >
       <template slot-scope="scope">{{ scope.row.empowerGroup === "0" ? $t('USER_MANAGEMENT.NONE') : scope.row.empowerGroup  }}
       </template>
      </el-table-column>
      <el-table-column :label="$t('USER_MANAGEMENT.FA')" prop="tfaStatus" width="260">
        <template
          slot-scope="scope"
        >{{ scope.row.tfaStatus === "0" ? $t('COMMON.NO') : $t('COMMON.YES') }}</template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('COMMON.OPERATION')"
        align="center"
        :width="lang=='en'?'600':'450'"
      >
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button
              @click="fModifyBtn(scope.row)"
              type="text"
            >{{$t('USER_MANAGEMENT.CHECH_DETAIL')}}</el-button>
            <div class="u-divider" v-if="scope.row.userType !== '1'"></div>
            <el-button
              v-if="scope.row.userType !== '1'"
              @click="fEnAble(scope.row)"
              type="text"
            >{{scope.row.status === '0' ? $t('USER_MANAGEMENT.ENABLE') : $t('USER_MANAGEMENT.DEACTIVATE')}}</el-button>
            <div class="u-divider" v-if="scope.row.userType !== '1'"></div>

            <el-button
              class="delete_user"
              v-if="scope.row.userType !== '1'"
              @click="fDeleteClick(scope.row)"
              type="text"
            >{{$t('COMMON.DELETE')}}</el-button>
            <div v-if="scope.row.userType === '3'" class="u-divider"></div>
            <el-button
              v-if="scope.row.userType === '3'"
              @click="fResendPass(scope.row)"
              type="text"
            >{{$t('COMMON.RESET_PASSWORD')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt16"
      @size-change="fSizeChange"
      @current-change="fCurrentChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="[10,20,30,50]"
      layout="prev,pager,next,sizes,total,jumper"
      :total="totalCount"
    />
    <div v-if="resendPassFlag" class="updatePass">
      <confirm-box :visible="resendPassFlag" @confirm="fConfirmPass" @close="fClose">
        <p class="desc">{{$t('USER_MANAGEMENT.RESET_PASSWORD_TIPS')}}</p>
        <el-form :model="whyObj" label-width="80px">
          <el-form-item
            :label="$t('USER_MANAGEMENT.RESAON_RESET_PASSWORD')"
            prop="resource"
            required
          >
            <el-radio
              v-model="whyObj.resource"
              label="1"
              style="margin-top: 12px"
            >{{$t('USER_MANAGEMENT.FORGOT_PASSWORD')}}</el-radio>
            <el-radio
              v-model="whyObj.resource"
              label="0"
              style="margin-top: 12px"
            >{{$t('USER_MANAGEMENT.PASSWORD_NOT_RECEIVED')}}</el-radio>
          </el-form-item>
        </el-form>
      </confirm-box>
    </div>
    <div v-if="enableFlag">
      <confirm-box :visible="enableFlag" @confirm="enableConfirm" @close="enableClose">
        <p class="desc">{{enaleTitle}}</p>
        <el-input
          style="margin: 20px 0"
          v-if="userObj.status == '0'"
          type="textarea"
          v-model="revokeReason"
        />
      </confirm-box>
    </div>
  </div>
</template>
<script>
import ConfirmBox from '../components/confirmBox';
import {
  queryOperationListPage,
  queryOperatorInfo,
  delelteOperator,
  checkUpdateAuthStatus,
  getTopVerificationCode,
  updateSecret,
  updateStatus,
  queryOperatorEncryption
} from '@/api/userManagement';
import { proSendOtpCode, proCheckOtpCode } from '@/api/public';
import { isAddZero } from '@/utils/tools';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('app');
export default {
  components: {
    ConfirmBox
    // Popup
  },
  data() {
    return {
      revokeReason: '', //停用原因
      butFlag: false, //控制按钮置灰——是否已点击发送请求
      interval: null,
      isdisabled: false,
      btnValue: this.$t('COMMON.GET_VR_CODE'),
      userObj: {}, // 保存选择的用户对象
      confirmField: this.$t('COMMON.DETERMINE'),
      formData: {
        phone: '',
        number: '327873827'
      },
      rules: {
        phone: [
          {
            required: true,
            message: this.$t('LOGON.VERIFINCATION_CODE'),
            trigger: 'blur'
          }
        ]
      },
      numberFlag: false, //短讯编号显示
      // 查询条件
      operatorForm: {
        userType: '',
        userName: '',
        userStatus: ''
      },
      totalCount: 0, //列表总条数
      //列表数据
      operatorData: [],
      // 分页区
      currentPage: 0,
      resendPassFlag: false, //重置密码
      enableFlag: false, //停用、启用
      enaleTitle: '',
      whyObj: {
        resource: '0'
      },
      userName: '',

      // 分页控制
      page: {
        currentPage: 1,
        pageSize: 10
      },
      refid: ''
    };
  },
  computed: {
    ...mapState(['lang'])
  },
  created() {
    this.SET_LANG();
  },
  mounted() {
    this.fQueryClick();
  },

  methods: {
    ...mapActions(['SET_LANG']),
    // 查询
    fQueryClick() {
      // console.log("调用查询接口");
      let self = this;
      self.operatorData = [];
      let params = {
        size: self.page.pageSize,
        current: self.page.currentPage,
        userName: self.operatorForm.userName,
        userStatus: self.operatorForm.userStatus,
        userType: self.operatorForm.userType
      };
      self.butFlag = true;
      queryOperationListPage(params).then(resp => {
        self.butFlag = false;
        console.log('打印resp', resp.records);
        if (resp.records) {
          resp.records.forEach(item => {
            if (!item.empowerGroup) {
              item.empowerGroup = this.$t('USER_MANAGEMENT.NONE');
            }
          });
          self.totalCount = resp.total;
          self.operatorData = resp.records;
        }
      });
    },
    // 重置
    fResetForm() {
      this.$refs['operatorFormRef'].resetFields();
      this.fQueryClick();
    },
    // 新增操作员
    fNewClick() {
      this.$router.push('/_businessManagement/operatorMaintain/newOperator');
    },
    // 查看
    fModifyBtn(row) {
      console.log('row', row);
      let params = {
        userCode: row.userCode
      };
      queryOperatorEncryption(params).then(resp => {
        if (resp) {
          resp.userCode = row.userCode;
          this.$router.push({
            path: '/_businessManagement/operatorMaintain/seeUser',
            query: {
              resp,
              isRead: true
            }
          });
        }
      });
    },

    //获取验证码
    getEmailCode() {
      let params = {
        event: 'CIBS_TEST_SMS',
        flag: '1',
        channel: 'PC'
      };
      proSendOtpCode(params).then(res => {
        console.log(res, 'RES');
        if (res) {
          this.refid = res;
          let messageTip = this.$t('USER_MANAGERMENT.SMS_HAS_YOUR_EMAILADD');
          if (this.formData.emailAddress) {
            messageTip = this.$t('USER_MANAGERMENT.SMS_HAS_YOUR_EMAILADD');
          }
          if (this.formData.phone) {
            messageTip = this.$t('USER_MANAGERMENT.SMS_HAS_YOUR_TEL');
          }
          this.time();
          this.$message({
            type: 'success',
            message: messageTip,
            delay: '3000'
          });
        } else {
          this.time();
        }
      });
    },
    time(o) {
      let wait = 100;
      this.isdisabled = true;
      this.sendEmail = true;
      this.interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait < 0) {
          this.btnValue = this.$t('FIRST_LOGIN.SEND_AGNIN');
          wait = 100;
          this.isdisabled = false;
          this.sendEmail = false;
          window.clearInterval(this.interval);
        }
      }, 1000);
    },

    // 重置密码
    fResendPass(row) {
      this.userObj = row;
      this.userName = row.userName;
      this.resendPassFlag = true;
    },
    // 确认密码的弹窗确认按钮
    fConfirmPass() {
      console.log('打印。。。');
      checkUpdateAuthStatus({
        operationType: '6',
        userCode: this.userObj.userCode
      }).then(resp => {
        if (resp === '1') {
          this.updatePassWord(this.userObj);
        } else {
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_CHECK'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      });
    },
    updatePassWord(row) {
      let params = {
        pwdStatus: 1,
        repeatPwdType: this.whyObj.resource,
        userCode: this.userObj.userCode
      };
      const tradeInfo = JSON.stringify(row);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      updateSecret(params).then(resp => {
        console.log('重置密码', resp);
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '8'
            // status: status
          }).then(() => {
            this.updatePassWord(row);
          });
        } else {
          if (resp.body.authResultInfo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );
              this.$router.push({
                path: '/_businessManagement/operatorMaintain/userResult',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/operatorMaintain/userResult',
                query: resp.body.authResultInfo
              });
            }
          } else {
            this.$router.push({
              path: '/_businessManagement/operatorMaintain/userResult',
              query: resp.body.authResultInfo
            });
          }
        }
      });
    },
    fClose(val) {
      this.resendPassFlag = val;
    },

    // 启用
    fEnAble(row) {
      this.revokeReason = '';
      this.userObj = { ...row };
      if (row.status === '0') {
        this.enaleTitle = this.$t('USER_MANAGEMENT.ENABLE_THIS_USER_TIPS');
        this.userObj.status = 1;
      } else {
        this.enaleTitle = this.$t('USER_MANAGEMENT.DEACTIVATE_THIS_USER_TIPS');
        this.userObj.status = 0;
      }
      console.log('userObj', this.userObj);
      this.enableFlag = true;
    },
    //启用——确定
    enableConfirm() {
      this.enableFlag = false;
      let operationType = '';
      let status = '';
      if (this.userObj.status === 0) {
        operationType = '5';
        status = '7';
      }
      if (this.userObj.status === 1) {
        operationType = '4';
        status = '6';
      }
      checkUpdateAuthStatus({
        operationType: operationType,
        userCode: this.userObj.userCode
      }).then(resp => {
        if (resp === '1') {
          let params = {
            status: this.userObj.status,
            userCode: this.userObj.userCode,
            revokeReason: this.revokeReason
          };
          console.log('打印params', params);
          let menuId = localStorage.getItem('sliderMenusAct');
          const tradeInfo = JSON.stringify({...this.userObj, operationType:operationType});
          const { adminEmpower } = JSON.parse(
            sessionStorage.getItem('userInfo')
          );
          console.log(adminEmpower, 'adminEmpower');
          updateStatus(params).then(resp => {
            console.log('resp', resp);
            const { returnCode } = resp.head;
            if (returnCode == 'OTP000107' && adminEmpower == '0') {
              choosesWay({
                checkWay: '',
                tradeInfo: tradeInfo,
                flag: status
              }).then(() => {
                this.enableConfirm();
              });
            } else if (returnCode == 'OTP000107') {
              softToken({
                softTokenCode: '',
                otpType: menuId,
                tradeInfo: tradeInfo,
                status: status
              }).then(() => {
                this.enableConfirm();
              });
            } else {
              if (resp.body.authResultInfo) {
                if (resp.body.authResultInfo.authResultState === '03') {
                  resp.body.authResultInfo.authorMessage = this.$t(
                    'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
                  );
                  this.$router.push({
                    path: '/_businessManagement/operatorMaintain/userResult',
                    query: resp.body.authResultInfo
                  });
                } else {
                  this.$router.push({
                    path: '/_businessManagement/operatorMaintain/userResult',
                    query: resp.body.authResultInfo
                  });
                }
              } else {
                this.$router.push({
                  path: '/_businessManagement/operatorMaintain/userResult',
                  query: resp.body.authResultInfo
                });
              }
            }
          });
        } else {
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_CHECK'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      });
    },
    //启用——取消
    enableClose() {
      this.enableFlag = false;
    },
    // 删除
    fDeleteClick(row) {
      console.log('打印。。。。', row);
      this.$confirm({
        message: this.$t('USER_MANAGEMENT.DELETE_USER'),
        type: 'warn',
        isIcon: true,
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.DETERMINE')
        },
        isCancle: true
      })
        .then(() => {
          this.deleteStatus(row);
        })
        .catch(() => {});
    },
    deleteStatus(row) {
      const tradeInfo = JSON.stringify({...row, operationType: '3'});
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      let params = {
        userCode: row.userCode,
        // cstmNo: row.ebankCstmNo
        empowerGroup: row.empowerGroup,
        userType: row.userType
      };
      checkUpdateAuthStatus({
        operationType: '3',
        userCode: row.userCode
      }).then(rep => {
        if (rep === '1') {
          console.log('parmas', params);
          delelteOperator(params).then(resp => {
            console.log('删除resp：', resp);
            const { returnCode } = resp.head;
            if (returnCode == 'OTP000107' && adminEmpower == '0') {
              choosesWay({
                checkWay: '',
                tradeInfo: tradeInfo,
                flag: '3'
              }).then(() => {
                this.deleteStatus(row);
              });
            } else if (returnCode == 'OTP000107') {
              softToken({
                softTokenCode: '',
                otpType: menuId,
                tradeInfo: tradeInfo,
                status: status
              }).then(() => {
                this.deleteStatus(row);
              });
            } else {
              if (resp.body.authResultInfo) {
                if (resp.body.authResultInfo.authResultState === '03') {
                  resp.body.authResultInfo.authorMessage = this.$t(
                    'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
                  );
                  this.$router.push({
                    path: '/_businessManagement/operatorMaintain/userResult',
                    query: resp.body.authResultInfo
                  });
                } else {
                  this.$router.push({
                    path: '/_businessManagement/operatorMaintain/userResult',
                    query: resp.body.authResultInfo
                  });
                }
              }
            }
          });
        } else {
          this.$confirm({
            title: this.$t('COMMON.TIPS'),
            message: this.$t('RIGHTS_TEMPLATE.AUTHORIZED_CHECK'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      });
    },
    fConfirmDelete() {},

    // 每页大小发生变化时
    fSizeChange(pageSize) {
      console.log('pageSize', pageSize);
      this.page.currentPage = '1';
      this.page.pageSize = pageSize;
      this.fQueryClick();
    },

    // 当前页数发生变化时
    fCurrentChange(currentPage) {
      console.log('currentPage', currentPage);
      this.page.currentPage = currentPage;
      this.fQueryClick();
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  // margin-left: 18px;
}
.el-table tr {
  background-color: #ffffff;
}
/deep/ .el-table td.el-table__cell div {
  // margin-left: 14px;
}
/deep/.el-input {
  // width: 320px !important;
}
/deep/.u-OTP {
  .el-input {
    width: 180px !important;
    margin-right: 16px;
  }
  .el-form-item__content {
    display: flex;
  }
  /deep/ .el-button {
    width: 128px;
    border-radius: 4px;
    border: 1px solid #f06b00;
    color: #f06b00 !important;
    font-size: 14px;
  }
}

.g_otpTitle {
  height: 46px;
  width: 980px;
  background-color: rgba(240, 107, 0, 0.1);
  .g_title {
    font-size: 14px;
     
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    font-weight: 500;
    position: relative;
    left: 32px;
    top: 12px;
  }
}
.g_otpTips1 {
  width: 916px;
  height: 26px;
  margin-top: 20px;
  .g_tips1 {
    font-size: 16px;
     
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    font-weight: 500;
  }
}

.g_otpTips2 {
  width: 916px;
  height: 22px;
  margin-top: 12px;
  .g_tips2 {
    font-size: 14px;
     
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    font-weight: 400;
  }
}

.g_otpTips3 {
  width: 916px;
  height: 44px;
  position: relative;
  margin-top: 8px;
  margin-bottom: 36px;
  .g_tips3 {
    font-size: 14px;
     
    text-align: justify;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    letter-spacing: 0;
    font-weight: 400;
  }
}
</style>