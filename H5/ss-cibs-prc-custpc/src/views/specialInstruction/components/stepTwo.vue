<!--
 * @Author: your name
 * @Date: 2022-10-26 15:09:17
 * @LastEditTime: 2022-11-10 14:08:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\specialInstruction\components\stepTwo.vue
-->
<template>
  <div class="u-stepTwo">
    <p>{{$t("SPECIAL_INSTRUACTION.CONFIRM_OTP")}}</p>
    <Divider class="d-title" :title="$t('SPECIAL_INSTRUACTION.APPLICATION_INFORMATION')"></Divider>
    <div class="u-content">
      <div class="u-contents" style="width:50%">
        <div>{{$t("SPECIAL_INSTRUACTION.ENGLISH_NAME")}}</div>
        <div>{{$t("SPECIAL_INSTRUACTION.MOBILE_PHONE_NUMBER")}}</div>
        <div>{{$t("SPECIAL_INSTRUACTION.EMAIL")}}</div>
      </div>
      <div class="u-contents" style="width:50%">
        <div>{{confirm.englshName}}</div>
        <div>{{confirm.areaCode}}-{{confirm.mobileNumber}}</div>
        <div>{{confirm.email}}</div>
      </div>
    </div>
    <div>
      <p><span>{{$t("SPECIAL_INSTRUACTION.NOTE")}}</span>{{$t("SPECIAL_INSTRUACTION.AFTER_SUBMITTING")}}</p>
    </div>
    <Divider class="d-title" :title="$t('SPECIAL_INSTRUACTION.DOCUMENT_UPLOAD')"></Divider>
    <div class="u-upload">
      <el-table :data="tableData">
        <el-table-column :label="$t('SPECIAL_INSTRUACTION.REQUIRED_SERVICE')" prop="fileType">
          <template slot-scope="scope">{{scope.row.fileType | service}}</template>
        </el-table-column>
        <el-table-column :label="$t('SPECIAL_INSTRUACTION.SELECT_FILE')" prop="originalFilename"></el-table-column>
      </el-table>
    </div>
    <div class="u-btns">
      <VButton @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton style="margin-left:16px;" @click="sumbit">{{$t('COMMON.SUBMIT')}}</VButton>
    </div>
  </div>
</template>

<script>
import { sendOtp, validOtp } from '@/api/sendOTP';
import { submitApply } from '@/api/specialInstruction.js';
import filter from '@/filters/public.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
export default {
  props: {
    confirm: {
      type: Object,
      default: () => {
        return {
          refNumber: '',
          otp: ''
        };
      }
    }
  },
  filters: {
    ...filter
  },
  data() {
    return {
      tableData: [],
      btnValue: this.$t('COMMON.GET_VR_CODE'),
      isdisabled: false,
  
    };
  },
  created() {
    this.tableData = this.confirm.uploadFile;
    console.log(this.confirm, 'body');
  },
  methods: {
    getEmailCode() {
      let custNo = sessionStorage.getItem('custNo');
      let params = {
        otpType: '16',
        custNo: custNo,
        otpMode: 'otp'
      };
      sendOtp(params).then(res => {
        if (res.body) {
          this.time();
          this.confirm.refNumber = res.body.refNum;
          this.$message({
            type: 'success',
            message: this.$t('USER_MANAGERMENT.SEND_SCUSS'),
            delay: 3000
          });
        } else {
          this.$message({
            type: 'fail',
            message: this.$t('USER_MANAGERMENT.SEND_FAIL'),
            delay: 3000
          });
        }
      });
    },
    time(o) {
      let wait = 100;
      this.isdisabled = true;
      this.sendEmail = true;
      let interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait < 0) {
          this.btnValue = this.$t('USER_MANAGERMENT.SEND');
          wait = 100;
          this.isdisabled = false;
          this.sendEmail = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    sumbit() {
      const tradeInfo = JSON.stringify({
        fileList: this.confirm.uploadFile,
        flowNo: '',
        linkEmail: this.confirm.email,
        linkUserName: this.confirm.englshName,
        mobilePhone:this.confirm.areaCode + '-'+this.confirm.mobileNumber
      });
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      const entType = localStorage.getItem('entType');
      submitApply({
        fileList: this.confirm.uploadFile,
        flowNo: '',
        linkEmail: this.confirm.email,
        linkUserName: this.confirm.englshName,
        mobilePhone:this.confirm.mobileNumber
      }).then(res => {
        console.log(res, 'rererererer');
        // const { authResultInfo } = res.authResultInfo;
        const { head } = res;
        const { returnCode } = res.head;
        if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.sumbit();
          });
        } else if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
          }).then(() => {
            this.sumbit();
          });
        } else {
          console.log(res.body,'dedeedede')
          if (['03', '90'].includes(res.body.authResultInfo.authResultState)) {
            if (res.body.authResultInfo.authResultState == '03') {
              // 需要授权
              let message = {
                status: 'success',
                title: this.$t('COMMON.SUBMIT_SUCCESS'),
                desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + res.body.authResultInfo.flowNo,
                confirm: this.$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')
              };
              this.submits = false;
              this.$emit('next', message);
            } else {
              // 不需要授权
              let message = {
                status: 'success',
                title: this.$t('COMMON.SUBMIT_SUCCESS'),
                desc: this.$t('OPERATORLOG.REFERENCE_NUMBER') + res.body.authResultInfo.flowNo,
                confirm: ''
              };
              this.submits = false;
              this.$emit('next', message);
            }
          } else {
            let message = {
              status: 'fail',
              title: this.$t('COMMON.SUBMIT_FAIL'),
              desc:this.$t('RIGHTS_TEMPLATE.FAIL_RESON') + head.returnMessage,
              confirm:this.$t('RIGHTS_TEMPLATE.NEED_HELP')
            };
            this.submits = false;
            this.$emit('next', message);
          }
        }
      });
      // validOtp(params).then(res => {
      //   if (res) {
      //     sessionStorage.setItem('otpToken', res.body);
      //     submitApply({
      //       fileList: this.confirm.uploadFile,
      //       flowNo: '',
      //       linkEmail: this.confirm.email,
      //       linkUserName: this.confirm.englshName,
      //       mobilePhone: this.confirm.mobileNumber
      //     }).then(res => {
      //       console.log(res,'rererererer')
      //     // const { authResultInfo } = res.authResultInfo;
      //     const { head } = res;
     
      //     });
      //   }
      // });
    },
    back() {
      this.$emit('back', this.confirm);
    }
    // filterFileType(val){
    //   console.log(1)
    //   return filters.service(val)
    // }
  }
};
</script>

<style lang="scss" scoped>
.u-stepTwo {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
}
.d-title {
  margin-top: 16px;
}
.u-content {
  width: 95%;
  display: flex;
  justify-content: space-between;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 25px 0;
  padding: 20px;
  // width: 100%;
  .u-contents {
    div {
      padding: 10px;
    }
  }
}
.u-upload {
  margin: 25px 0;
  width: 100%;
}
.u-otp {
  p {
    line-height: 28px;
  }
  .u-form {
    margin-top: 28px;
  }
}
.u-btns {
  justify-content: center;
  display: flex;
  align-items: center;
  margin-left: 33%;
  margin-top: 28px;
}
/deep/.u-OTP {
  .el-input {
    // width: 180px !important;
    margin-right: 16px;
  }
  .el-form-item__content {
    display: flex;
  }
  /deep/ .el-button {
    width: 128px;
    border-radius: 4px;
    border: 1px solid #f06b00;
    color: #f06b00;
  }
}
</style>