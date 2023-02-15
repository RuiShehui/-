<template>
  <div class="u-rightsTemplate" v-loading="requestLoading">
    <el-form :model="temFormData" label-width="auto" ref="temFormDataRef">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')" prop="modelName">
            <el-input
              v-model="temFormData.modelName"
              :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:this.$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')
            })"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="2">
          <el-form-item :label="$t('RIGHTS_TEMPLATE.MODULE_TYPE')" prop="modelType">
            <el-select v-model="temFormData.modelType">
              <el-option :label="$t('RIGHTS_TEMPLATE.ALL')" value></el-option>
              <el-option :label="$t('RIGHTS_TEMPLATE.CASH_MODULE')" value="1"></el-option>
              <el-option :label="$t('RIGHTS_TEMPLATE.NO_CASH_MODULE')" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="flexc" :span="8" :push="2" style="margin-left: 25px">
          <v-button
            :disabled="butFlag"
            size="w70"
            class="mr16"
            @click="fResetClick"
          >{{$t('COMMON.RESET')}}</v-button>
          <v-button
            :disabled="butFlag"
            size="w96"
            type="primary"
            @click="search"
          >{{$t('COMMON.SEARCH')}}</v-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="templateData" stripe>
      <el-table-column prop="modelName" :label="$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')" align="center">
        <template slot-scope="scope">
          <el-button class="u-btn" type="text" @click="fDetail(scope.row)">{{scope.row.modelName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="modelType" :label="$t('RIGHTS_TEMPLATE.MODULE_TYPE')" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.modelType === '0' ? $t('RIGHTS_TEMPLATE.NO_CASH_MODULE') :$t('RIGHTS_TEMPLATE.CASH_MODULE') }}</template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="fModifyClick(scope.row)"
            style="margin-right: 5px"
          >{{$t('COMMON.UPDATE')}}</el-button>
          <el-button type="text" @click="fDeleteClick(scope.row)">{{$t('COMMON.DELETE')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flexc mt36">
      <v-button @click="fAddTemplate" class="mr16">{{$t('COMMON.ADD')}}</v-button>
    </div>
  </div>
</template>
<script>
import {
  queryListTemplate,
  delAuthTemplateCommit,
  queryDetailIn
} from '@/api/authModeManagement.js';
import CONSTANTS from '@/utils/contants.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { mapState } from 'vuex';
import tool from '@/dataTools/tools/moneyTools.js';
const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
export default {
  components: {},
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      butFlag: false, //控制按钮防重点击
      temFormData: {
        modelName: '',
        modelType: ''
      }, // 查询条件
      // 0 有金额模式  1 无金额模式
      templateData: []
    };
  },
  mounted() {
    this.fQueryClick();
  },
  methods: {
    //重置
    fResetClick() {
      this.$refs['temFormDataRef'].resetFields();
      this.fQueryClick();
    },
    //查询
    search() {
      this.fQueryClick();
    },
    //查询
    fQueryClick() {
      let self = this;
      console.log('this.temFormData', this.temFormData);
      self.templateData = [];
      let params = {
        // size: 5,
        // current: 1,
        modelType: this.temFormData.modelType,
        modelName: this.temFormData.modelName,
        modelCode: this.temFormData.modelCode
        // ebankCstmNo: 'T24160578001'
      };
      self.butFlag = true;
      queryListTemplate(params).then(resp => {
        self.butFlag = false;
        if (resp && resp.length > 0) {
          self.templateData = resp;
        }
      });
    },

    //修改
    fModifyClick(row) {
      queryDetailIn({ modelCode: row.modelCode }).then(resp => {
        resp.amuntUserList.forEach(item => {
          item.amountEnd = tool.currencyFormat(item.amountEnd, '', 2);
          item.amountStart = tool.currencyFormat(item.amountStart, '', 2);
        });
        this.$router.push({
          path: '/_businessManagement/authManagement/addTemplate',
          query: { resp }
        });
      });
    },

    //删除
    fDeleteClick(row) {
      this.$confirm({
        message: this.$t('RIGHTS_TEMPLATE.TO_DELETE'),
        type: 'warn',
        isIcon: true,
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.DELETE')
        },
        isCancle: true
      })
        .then(() => {
          this.deleteDelAuth(row);
        })
        .catch(() => {
          return false;
        });
    },
    deleteDelAuth(row) {
      const tradeInfo = JSON.stringify({ ...row, operationType: '3' });
      let menuId = localStorage.getItem('sliderMenusAct');

      delAuthTemplateCommit({ modelCode: row.modelCode }).then(resp => {
        console.log(resp, 'rep');
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '3'
            // status: status
          }).then(() => {
            this.deleteDelAuth(row);
          });
        } else if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.deleteDelAuth(row);
          });
        } else {
          if (resp.body.authResultInfo.flowNo) {
            console.log(resp.body.authResultInfo, 'resp.body.authResultInfo');
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );

              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            } else if (resp.body.authResultInfo.authResultState === '90') {
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate'
              });
            }
          }
        }
      });
    },
    //新增
    fAddTemplate() {
      this.$router.push('/_businessManagement/authManagement/addTemplate');
    },
    fJump() {
      this.$router.push('/_businessManagement/authManagement/dealMandate');
    },
    //详情
    fDetail(row) {
      console.log('row:', row);
      queryDetailIn({ modelCode: row.modelCode }).then(resp => {
        console.log('打印resp:', resp);
        this.$router.push({
          path: '/_businessManagement/authManagement/detail',
          query: resp
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>