<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:36:21
 * @LastEditTime: 2022-11-15 12:01:17
 * @LastEditors: Please set LastEditors
 * @Description: 用户维护
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\user\userMaintain.vue
-->
<template>
  <div class="contain">
    <customer-query v-show="showQueryFlag " @showIndex="showIndex" route-name="UserMaintain" />
    <el-steps v-if="this.entType!=='1' && isStep" :active="step" align-center class="g-margin">
      <el-step title="用戶維護-基本信息"></el-step>
      <el-step title="用戶維護-權限配置"></el-step>
      <el-step title="用戶維護-賬戶配置"></el-step>
      <el-step title="用戶維護-確認"></el-step>
    </el-steps>
    <div v-if="step===1 && showOperateFlag" >
      <user-maintain-operate
        :userInfoProp="userInfoPropData"
        :ebankCstmNo="ebankCstmNo"
        :entType="entType"
        :show-login-name="showLoginName"
        @backIndex="backIndex"
        @handleShowDetail="handleShowDetail"
        @handleConfirm="handleConfirm"
      />
    </div>
    <div v-if="step===2  && showOperateFlag">
      <menuList
        :is-detail="isDetail"
        :detail-data="userInfoPropData"
        :show-login-name="showLoginName"
        @backIndex="backIndex"
        @backOperate="backOperate"
        @handleShowDetail="handleShowDetail"

      ></menuList>
    </div>
    <div v-if="step===3 && showOperateFlag">
      <accountList
        :is-detail="isDetail"
        :detail-data="userInfoPropData"
        :show-login-name="showLoginName"
        @backIndex="backIndex"
        @backOperate="backOperate"
        @handleShowDetail="handleShowDetail"
      ></accountList>
    </div>
    <div v-if="step===4 && showOperateFlag">
      <confirm
    
      :is-detail="isAdd"
      :isAdd="isAdd"
      :isBack="isBack"
      :detail-data="userInfoPropData"
      :show-login-name="showLoginName"
      :entType="entType"
      @backIndex="backIndex"
      @backOperate="backOperate"
      @submitData="submitData"
    />
    </div>
    <!-- <user-maintain-operate
      v-if="showOperateFlag"
      :userInfoProp="userInfoPropData"
      :ebankCstmNo="ebankCstmNo"
      :entType="entType"
      :show-login-name="showLoginName"
      @backIndex="backIndex"
      @handleShowDetail="handleShowDetail"
    /> -->
    <confirm
      v-if="isDetail"
      :is-detail="isAdd"
      :isAdd="isAdd"
      :isBack="isBack"
      :detail-data="userInfoPropData"
      :show-login-name="showLoginName"
      :entType="entType"
      @backIndex="backIndex"
      @backOperate="backOperate"
      @submitData="submitData"
    />
    <div v-if="showIndexFlag">
      <el-form
        :model="userInfo"
        class="transverse-form"
        label-width="auto"
        ref="formRef"
        label-suffix=":"
        label-position="right"
      >
        <el-form-item :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')" prop="userType">
          <el-select v-model="userInfo.userType" class="f-w-270">
            <el-option :label="$t('CUSTOMER_MANAGEMENT.ALL')" value="0"></el-option>
            <el-option :label="$t('CUSTOMER_MANAGEMENT.ADMAIN')" value="1"></el-option>
            <el-option :label="$t('CUSTOMER_MANAGEMENT.AUTH_USER')" value="2"></el-option>
            <el-option :label="$t('CUSTOMER_MANAGEMENT.INPUT_USER')" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('CUSTOMER_MANAGEMENT.USER_CODE')"
          class="g-project"
          prop="loginName"
        >
          <el-input
            v-model="userInfo.userCode"
            :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            class="f-w-270"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('CUSTOMER_MANAGEMENT.STATUS')" class="g-project" prop="status">
          <el-select v-model="userInfo.status" class="f-w-270">
            <el-option :label="$t('CUSTOMER_MANAGEMENT.ALL')" value="2"></el-option>
            <el-option :label="$t('CUSTOMER_MANAGEMENT.ENABLE')" value="1"></el-option>
            <el-option :label="$t('CUSTOMER_MANAGEMENT.DISABLE')" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <div style="width:270px;">
            <Form-Button style="float:right" @add="add" @submit="query" @handleReset="handleReset"></Form-Button>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        class="g-table"
        :data="tableData"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')" width="80"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')">
          <template slot-scope="scope">{{scope.row.userType | userType }}</template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_CODE')">
          <template slot-scope="scope">
            <div class="f-btnColor" @click="handleCell(scope.row.userCode)">{{ scope.row.userCode }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          prop="userChsName"
          :label="$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')"
        ></el-table-column>
        <el-table-column
          width="120px"
          prop="userEglsName"
          :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')"
        ></el-table-column>
        <el-table-column prop="cardType" :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')"></el-table-column>
        <el-table-column prop="cardNo" :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')">
          <template slot-scope="scope">{{ scope.row.status | userStatus }}</template>
        </el-table-column>
        <el-table-column prop="empowerGroup" :label="$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')">
          <template slot-scope="scope">{{scope.row.empowerGroup | empowerGroup }}</template>
        </el-table-column>
        <el-table-column width="150" prop="tfaStatus" :label="$t('CUSTOMER_MANAGEMENT.TFA_STATUS')">
          <template slot-scope="scope">{{ scope.row.tfaStatus | tfaStatus }}</template>
        </el-table-column>
        <el-table-column width="150" prop="cuSoleAuthorizerInd" label="單一批核者特權">
          <template slot-scope="scope">{{ scope.row.cuSoleAuthorizerInd === '1' ? '開' : '關' }}</template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.OPERATION')" width="180" fixed="right">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span
                @click="resendPassword(scope.row)"
                class="f-delete"
              >{{$t('CUSTOMER_MANAGEMENT.RESEND_PASS')}}</span>
              <span @click="del(scope.row)" class="f-delete">{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
              <span
                @click="edit(scope.row.userCode)"
                class="f-add"
              >{{$t('CUSTOMER_MANAGEMENT.UPDATE')}}</span>
            </div>
          </template>
        </el-table-column>
        <el-empty
          slot="empty"
          :image="require('@/img/table-empty.png')"
          :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
        ></el-empty>
      </el-table>
      <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page="current"
          :page-size="size"
          :total="total"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="g-bottom">
        <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      </div>
      <article class="article">
        <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
        <br />
        <p>{{$t('CUSTOMER_MANAGEMENT.MAINTAIN_CUSTOMER_TIP_1')}}</p>
        <p>{{$t('CUSTOMER_MANAGEMENT.MAINTAIN_CUSTOMER_TIP_2')}}</p>
      </article>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="420px"
      top="calc(50vh - 115px)"
      :center="true"
      :show-close="false"
      class="my-dialog"
      @closed="closed"
    >
      <main class="center">
        <img src="@/img/logOut.png" />
        <section class="text">
          <label>{{$t('CUSTOMER_MANAGEMENT.RESEND_PASS_REASON')}}</label>
          <el-radio-group v-model="value">
            <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.FORGET_PASSWORD')}}</el-radio>
            <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.NOT_RECEIVE_PASS')}}</el-radio>
          </el-radio-group>
        </section>
        <p>{{$t('CUSTOMER_MANAGEMENT.CONFIRM_INIT_PASS')}}</p>
      </main>
      <footer slot="footer">
        <el-button @click="closed">{{$t('CUSTOMER_MANAGEMENT.CANCEL')}}</el-button>
        <el-button type="primary" @click="resendConfirm">{{$t('CUSTOMER_MANAGEMENT.ENSURE')}}</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import {
  formatTreeData,
  deepClone,
  treeToArray
} from '@/utils/tree-table.js';
import FormButton from '@/components/common/FormButton.vue';
import Confirm from '../components/user/confirm';
import UserMaintainOperate from '../components/user/UserMaintainOperate';
import tool from '@/utils/moneyTools.js';
import CONSTANTS from '@/utils/constant';
import filters from '@/filters/clientManage';
import {
  queryOperatorPage,
  operatorDel,
  resetPassword,
  queryOperatorDetail,
  operatorSave,
  operatorUpdate
} from '@/api/customer-management/user';
import menuList from '../components/user/menuList';
import accountList from "../components/user/accountList.vue"
export default {
  name: 'UserMaintain',
  components: {
    FormButton,
    UserMaintainOperate,
    Confirm,
    menuList,
    accountList
  },
  filters,
  data() {
    return {
      showLoginName: false, // 是否修改
      showQueryFlag: true, // 搜索
      showIndexFlag: false, // 主页
      showDetailFlag: false, // 详情
      showOperateFlag: false, // 操作
      isDetail: false, // 是否确认页
      isAdd:false,
      isBack:false,
      userCode: '',
      current: 1,
      size: 10,
      total: 1,
      userInfo: {
        userType: '0',
        loginName: '',
        status: '2',
        userCode: ''
      },
      tableData: [],
      dialogVisible: false,
      value: '',
      ebankCstmNo: '',
      userInfoPropData: {}, // 数据
      baseData: {
        userType: '1',
        loginName: '',
        userChsName: '',
        userEglsName: '',
        cardType: '',
        cardTypeLabel: '',
        cardArea: '',
        cardAreaLabel: '',
        cardNo: '',
        empowerGroup: '',
        mobilePhone: '',
        status: '1',
        birthday: '',
        userPhone: '',
        email: '',
        tfaStatus: '1',
        mailAddress: '',
        userPhoneCountry: '',
        userPhoneArea: '',
        userPhonePhone: '',
        mobilePhoneCountry: '',
        mobilePhonePhone: ''
      },
      step: 1,
      entType:'1',
      isStep:false
    };
  },
  methods: {
    showIndex(data = '') {
      console.log('打印data', data);
      this.showIndexFlag = true;
      this.showOperateFlag = false;
      this.showQueryFlag = false;
      this.isStep = false
      this.isDetail = false
      this.step=1
      // this.showDetailFlag = false;
      if (data) {
        this.ebankCstmNo = data.ebankCstmNo;
        this.entType = data.entType;
      }
      
      this.queryOperatorPage();
    },
    backOperate(data) {
      this.userInfoPropData = { ...data };
      this.showDetailFlag = false;
      this.showOperateFlag = true;
      this.isDetail = false
    },
    handleShowDetail(data) {
      console.log(data,'datasssssss')
      this.userInfoPropData = { ...data };
      this.isDetail = false;
      this.showOperateFlag = true;
      this.isAdd =true
      this.isBack =false
      this.step++;
      console.log(this.step,'step')
    
    },
    backIndex() {
      if(this.step===1){
        this.showIndexFlag = true;
        this.showOperateFlag = false;
        this.showDetailFlag = false;
        this.isStep = false
      }else{
         this.step--
      }
      this.isDetail =false
     
       console.log(this.step)
    },
    async queryOperatorDetail() {
      const result = await queryOperatorDetail({
        userCode: this.userCode
      });
      if (result.body) {
        if (result.body.cuSoleAuthorizerInd === '1') {
          result.body.userAccountLimits.forEach(item => {
            item.limitDaily = tool.currencyFormat(item.limitDaily, '', 2);
            let accTypeName = '';
            let currencyName = '';
            if (item.accountType) {
              accTypeName = CONSTANTS.accountTypes[item.accountType];
            }
            if (item.currencyType) {
              currencyName = item.currencyType;
            }
            item.accountNoCury =
              item.accountNo + ' ' + currencyName + ' ' + accTypeName;
          });
        }
        this.userInfoPropData = result.body;
        console.log('result.body', result.body);
      }
    },
    submitData(data) {
        console.log(data,'queding')
      const { confirmData = {} } = data;
      if (data.showLoginName) {
        
    
        this.operatorUpdate(confirmData);
      } else {
        //  const { confirmData = {} } = data;
    
        this.operatorSave(confirmData);
      }
    },
    async operatorUpdate(confirmData) {
      console.log(confirmData,'confirmData')
      let params;
      if(this.entType=='2'){
        params ={ ...confirmData,menuPermissions:treeToArray(confirmData.menuPermissions),  operatorAccounts:confirmData.operatorAccounts }
      }else{
        params =  {...confirmData}
      }

      const result = await operatorUpdate({...params});
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.USER_EDIT_SUCCESS'),
          type: 'success'
        });
        this.showIndex();
      }
    },
    async operatorSave(confirmData) {
       let params;
      if(this.entType=='2'){
         params ={ ...confirmData,menuPermissions:treeToArray(confirmData.menuPermissions),  operatorAccounts:confirmData.operatorAccounts }
      }else{
        params = {...confirmData}
      }
      
      const result = await operatorSave({
        ...params,
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.USER_ADD_SUCCESS'),
          type: 'success'
        });
        this.showIndex();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryOperatorPage();
    },
    //详情
    async handleCell(userCode) {
      this.userCode = userCode;
      await this.queryOperatorDetail();
      this.isDetail = true;
      this.isBack = true;
      this.isAdd = false
      this.showIndexFlag = false;
      this.showDetailFlag = true;
      this.showLoginName = true;
      // this.$router.push({
      //   name: 'UserMaintainAddConfirm',
      //   params: userCode
      // });
     
    // console.log(result,'result')
      // this.detailData = result.bodys
    },
    handleConfirm(data){
      console.log('新增',data)
      this.isAdd = true;
      this.isBack = false
      this.isDetail = true;
      this.userInfoPropData = data;
      this.showIndexFlag = false;
      this.showDetailFlag = true;
      this.showLoginName = false;
      this.showOperateFlag=false;
      // await this.queryOperatorDetail();
    },
    //重发密码请求
    resendPassword(row) {
      this.dialogVisible = true;
      this.userCode = row;
    },
    async resendConfirm() {
      // 重发密码请求
      if (!this.value) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_SELECT', {
            msg: this.$t('CUSTOMER_MANAGEMENT.RESEND_PASS_REASON')
          }),
          type: 'error'
        });
        this.dialogVisible = false;
      } else {
        this.dialogVisible = false;
        const result = await resetPassword({
          ...this.userCode,
          repeatPwdType: this.value
        });
        if (result.body) {
          this.$showMsg({
            message: this.$t('CUSTOMER_MANAGEMENT.RESENT_PASSWORD_SUCCESS'),
            type: 'success'
          });
        }
      }
    },
    closed() {
      this.dialogVisible = false;
      this.value = '';
    },
    //删除
    del(row) {
      this.$showBox({
        content:
          this.$route.params.entType === '1'
            ? this.$t('CUSTOMER_MANAGEMENT.USER_DELETE_SINGLE_CONFIRM')
            : this.$t('CUSTOMER_MANAGEMENT.USER_DELETE_CONFIRM'),
        confirm: async () => {
          const result = await operatorDel({
            ...row
          });
          if (result.body) {
            this.$showMsg({
              message: this.$t('CUSTOMER_MANAGEMENT.DELETE_USER_SUCCESS'),
              type: 'success'
            });
          }
          this.query();
        }
      });
    },
    //编辑
    async edit(userCode) {
     
      this.showLoginName = true;
      this.userCode = userCode;
      await this.queryOperatorDetail();
      this.showIndexFlag = false;
      this.showOperateFlag = true;
      this.c = true
      //  if(this.entType=='2'){
      //   this.isStep = true
      // }else{
      //   this.showLoginName = true;
      // }
      // this.$router.push({
      //   name: 'UserMaintainEdit',
      //   params: { userCode }
      // });
    },
    //新增
    add() {
       if(this.entType=='2'){
        this.isStep = true
      }
      if (this.$route.params.entType === '1' && this.tableData.length !== 0) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.CANNOT_ADD_USER'),
          type: 'error'
        });
      } else {
        this.userInfoPropData = this.baseData;
        this.showIndexFlag = false;
        this.showLoginName = false;
        this.showOperateFlag = true;
      }
    },
    query() {
      // 发起查询请求
      this.current = 1;
      this.queryOperatorPage();
    },
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    // 返回
    back() {
      this.showQueryFlag = true;
      this.showIndexFlag = false;
    },
    async queryOperatorPage() {
      let data = {
        ebankCstmNo: this.ebankCstmNo,
        size: this.size,
        current: this.current,
        userCode: this.userInfo.userCode
      };
      if (this.userInfo.userType !== '0') {
        data.userType = this.userInfo.userType;
      }
      if (this.userInfo.status !== '2') {
        data.status = this.userInfo.status;
      }
      let result = await queryOperatorPage({
        ...data
      });
      if (result.body) {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.f-span-btns {
  width: 100%;
  color: #f06b00;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    color: #e34141;
  }
  span:not(:nth-of-type(1)) {
    margin-left: 10px;
  }
}
.g-bottom {
  margin: 40px 0px 100px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
}
.f-w-270 {
  width: 270px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.my-dialog {
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: 0 20px 24px;
    font-size: 16px;
    color: #323c41;
    & > .text {
      margin: 4px 0;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px 0px 32px 0px;
  }
  ::v-deep .el-radio {
    margin-right: 0px;
    margin-left: 15px;
    font-size: 16px;
    font-weight: 600;
  }
  ::v-deep .el-radio__label {
    font-size: 15px;
    font-weight: 600;
  }
}
.article {
  position: absolute;
  bottom: 32px;
  left: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>