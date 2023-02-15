<template>
  <div class="u-addTemplateWapper">
    <div class="u-addTemSet">
      <divider :title="$t('RIGHTS_TEMPLATE.APPROVAL_TEMPLATE')" />
      <el-form
        :model="addTemForm"
        ref="addTemForm"
        label-width="auto"
        class="u-formClass"
        :rules="rules"
      >
        <el-form-item :label="$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')" prop="modelName">
          <el-input
            maxlength="120"
            v-model="addTemForm.modelName"
            :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:this.$t('RIGHTS_TEMPLATE.TEMPALTE_NAME')
            })"
          ></el-input>
        </el-form-item>
        <div class="TypeFlagstyle">
        <el-form-item :label="$t('RIGHTS_TEMPLATE.MODULE_TYPE')" required>
          <el-radio
            :disabled="modeTypeFlag"
            @change="changeModeType(1)"
            v-model="addTemForm.modelType"
            label="1"
            style="margin: 11px 0 0 13px"
          >{{$t('RIGHTS_TEMPLATE.CASH_MODULE')}}</el-radio>
          <el-radio
            :disabled="modeTypeFlag"
            @change="changeModeType(0)"
            v-model="addTemForm.modelType"
            label="0"
            style="margin-left: 18px"
          >{{$t('RIGHTS_TEMPLATE.NO_CASH_MODULE')}}</el-radio>
        </el-form-item>
        </div>
      </el-form>
    </div>

    <divider :title="$t('RIGHTS_TEMPLATE.AMMOUNT_RANGE')" class="divider" />

    <el-table v-if="addTemForm.modelType==='1'" :data="addTemData" stripe>
      <el-table-column :label="$t('RIGHTS_TEMPLATE.TO_AMMOUNT')" min-width="560">
        <template slot-scope="scope">
          <el-input v-model="scope.row.amountStart" :disabled="startDisabled"></el-input>
          &nbsp;&nbsp;&lt;&nbsp;{{$t('RIGHTS_TEMPLATE.AOMMOUT')}}&nbsp;&lt;=&nbsp;&nbsp;
          <money-input
            :isSaveDot="true"
            :maxlength="17"
            v-model="scope.row.amountEnd"
            :disabled="endDisabled"
            @blur="blurChange(scope.row, scope.$index+1)"
          ></money-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.A_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelANumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.B_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelBNumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.C_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelCNumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        prop="handle"
        :label="$t('COMMON.OPERATION')"
        width="121px"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="add(scope.row)"
            v-if="addTemData.length===1"
          >{{$t('COMMON.ADD')}}</el-button>
          <el-button
            type="text"
            @click="add(scope.row)"
            v-if="scope.$index>0 && scope.$index===addTemData.length-1"
          >{{$t('USER_MANAGERMENT.ADDBTN')}}</el-button>
          <el-button
            type="text"
            @click="remove(scope.$index, addTemData)"
            v-if="scope.$index>0 &&scope.$index===addTemData.length-1"
          >{{$t('AUTHORIZE.DELETE')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="addTemForm.modelType !=='1'" :data="addTemData" stripe>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.A_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelANumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.B_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelBNumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('RIGHTS_TEMPLATE.C_LEVEL')"
        :width="addTemForm.modelType==='1' ?'220px' : 'auto'"
      >
        <template slot-scope="scope">
          <el-input oninput="value=value.replace(/[^\d]/g, '')" v-model="scope.row.levelCNumber"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="flexc u-mt32">
      <v-button @click="returnBtn" class="mr16">{{$t('COMMON.BACK')}}</v-button>
      <v-button :disabled="butFlag" @click="confirmBtn" type="primary">{{$t('COMMON.DETERMINE')}}</v-button>
    </div>
  </div>
</template>
<script>
import Divider from '../../operatorMaintain/components/divider';
import {
  saveTemplate,
  updateAuthTemplateCommit
} from '@/api/authModeManagement.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
import _ from 'lodash';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';

const { adminEmpower, cuSoleAuthorizerInd, entType } = JSON.parse(
  sessionStorage.getItem('userInfo')
);
export default {
  components: {
    Divider
  },
  data() {
    var checkmodelName = (rule, value, callback) => {
      if (!this.ismodelName) {
        callback();
      } else {
        callback(new Error(this.$t('RIGHTS_TEMPLATE.ALREADY_EXISTS')));
      }
    };
    return {
      butFlag: false, //按钮防重点击控制
      addTemForm: {
        modelName: '',
        modelType: '1'
      },
      addTemData: [
        {
          id: 1,
          amountStart: '0.00',
          amountEnd: '',
          levelANumber: '0',
          levelBNumber: '0',
          levelCNumber: '0'
        }
      ],
      rules: {
        modelName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('AUTHORIZE.AUTH_TEMPLATE')
            }),
            trigger: 'blur'
          },
          {
            validator: checkmodelName
          }
        ]
      },
      modeTypeFlag: false, //判断是否为编辑，禁用类型切换
      ismodelName: false, // 模板名称已存在
      checked: 1,
      startDisabled: true,
      endDisabled: true,
      oldObject: {},
      oldList: []
    };
  },

  watch: {
    addTemForm: {
      deep: true,
      immediate: true,
      handler(val) {
        this.endDisabled = false;
        // 无金额模式
        if (val.modelType === '0') {
          // 禁止显示操作
          return (this.checked = 0);
        } else if (val.modelType === '1') {
          return (this.checked = 1);
        }
      }
    },
    addTemData: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        console.log('naewValue', newValue, oldValue);
      }
    }
  },

  mounted() {
    if (this.$route.query.resp) {
      this.modeTypeFlag = true;
      this.oldObject = _.cloneDeep(this.$route.query.resp);
      this.addTemForm = this.$route.query.resp;
      this.addTemData = this.addTemForm.amuntUserList;
      // this.addTemData.forEach(item => {
      //   // item.amountEnd = tool.currencyFormat(item.amountEnd, '', 2);
      //   // item.amountStart = tool.currencyFormat(item.amountStart, '', 2);
      // });
    } else {
      this.modeTypeFlag = false;
    }
  },

  methods: {
    //切换有无金额时清除金额设置数组
    changeModeType(e) {
      // console.log('e', e);
      this.addTemData = [
        {
          amountStart: '0.00',
          amountEnd: '',
          levelANumber: '0',
          levelBNumber: '0',
          levelCNumber: '0'
        }
      ];
    },

    //金额失焦事件
    blurChange(row, index) {
      console.log('row', row, index);
      if (row.amountEnd < 1) {
        return this.$message({
          type: 'fail',
          message: this.$t('USER_MANAGERMENT.MONEY_LESSTHAN_ONE'),
          delay: 3000
        });
      }
      row.amountEnd = mathTools.delDecollator(row.amountEnd);
      row.amountEnd = tool.currencyFormat(row.amountEnd, '', 2);
      if (index !== this.addTemData.length) {
        this.addTemData[index].amountStart = row.amountEnd;
      }
    },
    //新增
    add(rows) {
      console.log('this.addTemData', this.addTemData);
      let addTemLength = this.addTemData.length - 1;
      if (!this.addTemData[addTemLength].amountEnd) {
        return this.$message({
          type: 'fail',
          message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
            input: this.$t('COMMON.MONEY')
          }),
          delay: 3000
        });
      }

      console.log(
        'flag',
        typeof parseFloat(this.addTemData[addTemLength].amountEnd),
        parseFloat(this.addTemData[addTemLength].amountEnd)
        // typeof parseFloat(this.addTemData[addTemLength].amountStart).toFixed(2)
      );
      let amountEndMoney = mathTools.delDecollator(
        this.addTemData[addTemLength].amountEnd
      );
      let amountStartMoney = mathTools.delDecollator(
        this.addTemData[addTemLength].amountStart
      );
      console.log('amountEndMoney', amountEndMoney, amountStartMoney);
      if (parseFloat(amountEndMoney) <= parseFloat(amountStartMoney)) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.INITIAL_AMOUNT'),
          delay: 3000
        });
      }
      if (
        !this.addTemData[addTemLength].levelANumber ||
        !this.addTemData[addTemLength].levelBNumber ||
        !this.addTemData[addTemLength].levelCNumber
      ) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.AUTHORIZATION_KONG'),
          delay: 3000
        });
      }
      let num =
        parseInt(this.addTemData[addTemLength].levelANumber) +
        parseInt(this.addTemData[addTemLength].levelBNumber) +
        parseInt(this.addTemData[addTemLength].levelCNumber);
      if (num < 1) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.AUTHORIZATION_NUMBER'),
          delay: 3000
        });
      }
      if (
        parseInt(this.addTemData[addTemLength].levelANumber) > 9 ||
        parseInt(this.addTemData[addTemLength].levelBNumber) > 9 ||
        parseInt(this.addTemData[addTemLength].levelCNumber) > 9
      ) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.AUTHORIZATION_NINE'),
          delay: 3000
        });
      }

      if (this.addTemData.length > 21) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.TWITY_AUTHORIZATION'),
          delay: 3000
        });
      }
      let data = {
        amountStart: rows.amountEnd,
        amountEnd: '',
        levelANumber: '0',
        levelBNumber: '0',
        levelCNumber: '0'
      };
      this.addTemData.push(data);
      if (this.addTemData.length >= 1) {
        this.endDisabled = false;
      }
    },
    //删除
    remove(index, rows) {
      if (index !== 0) {
        rows.splice(index, 1);
      }
    },
    returnBtn() {
      this.$router.go(-1);
    },
    judgmentArray(arr1, arr2) {
      let judFlag = true;
      if (arr1.length != arr2.length) {
        let judFlag = false;
        return judFlag;
      }
      for (var i = 0; i < arr1.length; i++) {
        if (
          arr1[i].amountStart !== arr2[i].amountStart ||
          arr1[i].amountEnd !== arr2[i].amountEnd ||
          arr1[i].levelANumber !== arr2[i].levelANumber ||
          arr1[i].levelBNumber !== arr2[i].levelBNumber ||
          arr1[i].levelCNumber !== arr2[i].levelCNumber
        ) {
          let judFlag = false;
          return judFlag;
        }
      }
      return judFlag;
    },
    //确定
    confirmBtn() {
      if (this.modeTypeFlag) {
        let flag = this.judgmentArray(
          this.oldObject.amuntUserList,
          this.addTemData
        );
        if (this.oldObject.modelName !== this.addTemForm.modelName) {
          flag = false;
        }
        console.log('flag:', flag);
        if (flag) {
          return this.$confirm({
            message: this.$t('RIGHTS_TEMPLATE.NO_UPDATE'),
            btnText: {
              confirmText: this.$t('COMMON.DETERMINE')
            },
            isCancle: false
          });
        }
      }
      // this.$router.go(-1);
      if (this.addTemForm.modelType === '1') {
        console.log('this.addTemData', this.addTemData);
        let amountFlag = false; //false:表示设置的金额没问题 true:表示设置的金额有问题
        let noamountFlag = false; //false:表示金额都有设置， true：表示有金额未设置
        this.addTemData.forEach((item, index) => {
          item.amountStartMoney = 0;
          item.amountEndMoney = 0;
          if (item.amountStart) {
            item.amountStartMoney = mathTools.delDecollator(item.amountStart);
          }
          if (item.amountEnd) {
            item.amountEndMoney = mathTools.delDecollator(item.amountEnd);
          }

          if (!item.amountEnd) {
            noamountFlag = true;
          }
          if (
            parseFloat(item.amountStartMoney) >= parseFloat(item.amountEndMoney)
          ) {
            amountFlag = true;
          }
        });
        if (noamountFlag) {
          return this.$message({
            type: 'fail',
            message: this.$t('RIGHTS_TEMPLATE.RIGHT_AMMOUTN'),
            delay: 3000
          });
        }
        if (amountFlag) {
          return this.$message({
            type: 'fail',
            message: this.$t('RIGHTS_TEMPLATE.RIHGT_LESS'),
            delay: 3000
          });
        }
      }
      let authorNumbber = false; //false: 授权人数都为0到9，true：授权人数有一列有问题
      let authorAllNumber = false; //false:收取总人数正确，true：授权总人数有问题
      this.addTemData.forEach(item => {
        if (
          parseInt(item.levelANumber) > 9 ||
          parseInt(item.levelBNumber) > 9 ||
          parseInt(item.levelCNumber) > 9
        ) {
          authorNumbber = true;
        }
        let num = item.levelANumber + item.levelBNumber + item.levelCNumber;
        if (num < 1) {
          authorAllNumber = true;
        }
      });
      if (authorNumbber) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.AUTHORIZATION_NINE'),
          delay: 3000
        });
      }
      if (authorAllNumber) {
        return this.$message({
          type: 'fail',
          message: this.$t('RIGHTS_TEMPLATE.AUTHORIZATION_NUMBER'),
          delay: 3000
        });
      }
      this.$refs['addTemForm'].validate(valid => {
        if (valid) {
          console.log('this.$route.query', this.$route.query.resp);
          if (this.$route.query.resp) {
            this.editMode();
          } else {
            this.addMode();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //新增
    addMode() {
      this.addTemData.forEach(item => {
        if (item.amountStart) {
          item.amountStart = mathTools.delDecollator(item.amountStart);
        }
        if (item.amountEnd) {
          item.amountEnd = mathTools.delDecollator(item.amountEnd);
        }
        if (item.levelANumber == '') {
          item.levelANumber = '0';
        }
        if (item.levelBNumber == '') {
          item.levelBNumber = '0';
        }
        if (item.levelCNumber == '') {
          item.levelCNumber = '0';
        }
      });
      let modeObj = {
        modelName: this.addTemForm.modelName,
        modelType: this.addTemForm.modelType,
        amuntUserList: this.addTemData
      };
      console.log('addTemForm', modeObj);
      this.butFlag = true;
      saveTemplate(modeObj).then(resp => {
        this.butFlag = false;
        const { returnCode } = resp.head;
        const tradeInfo = JSON.stringify({...this.addTemForm, operationType: '1'});
        let menuId = localStorage.getItem('sliderMenusAct');
        if (returnCode == 'OTP000107') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
            // status: status
          }).then(() => {
            this.addMode();
          });
        } else if (entType == '1' && returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.addMode();
          });
        } else {
          if (resp && resp.body.authResultInfo.flowNo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            }
          } else {
            this.addTemData.forEach(item => {
              if (item.amountStart) {
                item.amountStart = tool.currencyFormat(item.amountStart, '', 2);
              }
              if (item.amountEnd) {
                item.amountEnd = tool.currencyFormat(item.amountEnd, '', 2);
              }
            });
          }
        }
      });
    },
    //编辑
    editMode() {
      this.addTemData.forEach(item => {
        if (item.amountStart) {
          item.amountStart = mathTools.delDecollator(item.amountStart);
        }
        if (item.amountEnd) {
          item.amountEnd = mathTools.delDecollator(item.amountEnd);
        }
        if (item.levelANumber == '') {
          item.levelANumber = '0';
        }
        if (item.levelBNumber == '') {
          item.levelBNumber = '0';
        }
        if (item.levelCNumber == '') {
          item.levelCNumber = '0';
        }
      });
      let modeObj = {
        modelCode: this.$route.query.resp.modelCode,
        modelName: this.addTemForm.modelName,
        modelType: this.addTemForm.modelType,
        amuntUserList: this.addTemData
      };
      console.log('addTemForm', modeObj);
      this.butFlag = true;
      const tradeInfo = JSON.stringify({...this.addTemForm, operationType: '2'});
      let menuId = localStorage.getItem('sliderMenusAct');
      updateAuthTemplateCommit(modeObj).then(resp => {
        this.butFlag = false;
        const { returnCode } = resp.head;
        if (returnCode == 'OTP000107' && adminEmpower == '0') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '2'
            // status: status
          }).then(() => {
            this.editMode();
          });
        } else if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.editMode();
          });
        } else {
          if (resp && resp.body.authResultInfo.flowNo) {
            if (resp.body.authResultInfo.authResultState === '03') {
              resp.body.authResultInfo.authorMessage = this.$t(
                'ACCOUNT_MAINTENACE.TO_AUTHORIZED'
              );
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            } else {
              this.$router.push({
                path: '/_businessManagement/authManagement/resultTemplate',
                query: resp.body.authResultInfo
              });
            }
          } else {
            this.addTemData.forEach(item => {
              if (item.amountStart) {
                item.amountStart = tool.currencyFormat(item.amountStart, '', 2);
              }
              if (item.amountEnd) {
                item.amountEnd = tool.currencyFormat(item.amountEnd, '', 2);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.TypeFlagstyle{
/deep/ .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    width: 329px !important;
}
}
</style>
