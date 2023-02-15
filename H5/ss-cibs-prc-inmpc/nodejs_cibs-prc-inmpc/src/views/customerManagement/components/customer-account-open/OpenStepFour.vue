<template>
  <div class="side-box">
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')" name="option"></el-tab-pane>
    </el-tabs>
    <el-table
      class="mt25"
      :data="dataList"
      stripe
      :border="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 账户列表 -->
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_CARD')" prop="acctNo">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.acctNo"
            class="f-w-270"
            @change="changeCard($event,scope.$index,scope)"
          >
            <el-option
              v-for="(item,index) in cardList"
              :key="index"
              :label="acctInfoJoint(item)"
              :value="item.accountNo"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 交易类型列表 -->
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')" prop="tradeTypeName">
        <template slot-scope="scope">
          <el-select
            :disabled="scope.row.transFlag"
            v-model="scope.row.tradeType"
            class="f-w-270"
            @change="changeTypeName($event, scope.$index)"
          >
            <el-option
              v-for="(item,index) in hasTrandeMo"
              :key="index"
              :label="item.tradeType | tradeTypeNameFilter"
              :value="item.menuCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 交易模板列表 -->
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.modelName"
            class="f-w-270"
            @change="changeModName($event,scope.$index)"
          >
            <el-option
              v-for="(item,index) in hasMoney"
              :key="index"
              :label="item.modelName"
              :value="item.modelCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 无交易金额 -->
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_OPERATION')">
        <!-- <template v-slot="{ row }"> -->
        <template slot-scope="scope">
          <div class="f-span-btns">
            <span
              v-if="dataList.length>1"
              @click="handleDelete(scope.row, scope.$index)"
            >{{$t('COMMON.DELETE')}}</span>
            <span
              v-if="scope.$index === dataList.length-1"
              style="margin-left:10px"
              @click="handleAdd()"
            >{{$t('COMMON.ADD')}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="f-h-30"></div>
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')" name="option"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="withoutTrandeMo"
      class="mt25"
      stripe
      :border="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')" prop="tradeType">
        <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.modelName"
            class="f-w-270"
            @change="change($event,scope.row)"
          >
            <el-option
              v-for="(item,index) in withoutMoney"
              :key="index"
              :label="item.modelName"
              :value="{modelName:item.modelName,modelCode:item.modelCode,modelType: item.modelType}"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-form label-suffix=":" class="m-t-40">
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.SETTING_TEMPLATE')" required>
        <el-radio-group v-model="sequence">
          <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.ORDERED')}}</el-radio>
          <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.DISORDER')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="lastStep">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button type="primary" @click="toConfirm">{{$t('CUSTOMER_MANAGEMENT.SAVE')}}</el-button>
    </div>
    <article class="article">
      <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
      <br />
      <p>{{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_3_TIP_1')}}</p>
      <p>{{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_3_TIP_2')}}</p>
    </article>
  </div>
</template>

<script>
import {
  queryOpenStemp,
  queryUserAccounts
} from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant.js';
import { queryMenuBy } from '@/api/customer-management/authorization';
import _ from 'lodash';
import filters from '@/filters/business.js';
export default {
  name: 'OpenStepFour',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    },
    authSettingList: {
      type: Array,
      default() {
        return [];
      }
    },
    cstmNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option: 'option',
      hasMoney: [], //有金额交易--模板设置
      withoutMoney: [], //无金额交易---模板设置
      ownTemplateList: [],
      hasTrandeMo: [], //有金额交易--交易名称
      withoutTrandeMo: [], //无金额交易--交易名称
      cardList: [], //存卡
      sequence: '0',
      dataList: [{ transFlag: false }] //用来存数据
    };
  },
  filters,
  created() {
    this.init();
  },
  methods: {
    async getTransTypeHas() {
      const result = await queryMenuBy({ transType: '3' });
      const result2 = await queryMenuBy({ transType: '2' });
      // const menuList = [...result.body.menuList, ...result2.body.menuList];
      // console.log(menuList, 'menuList');
      this.hasTrandeMo = result.body.menuList.map(item => {
        return {
          tradeType: item.menuCode,
          tradeTypeName: item.menuName,
          approvalType: '1',
          modelName: '',
          menuCode: item.menuCode,
          ebankCstmNo: this.ebankCstmNo
        };
      });
      this.hasTrandeMo.unshift({
        approvalType: '1',
        ebankCstmNo: this.ebankCstmNo,
        menuCode: 'ALL',
        modelName: '',
        tradeType: 'ALL',
        tradeTypeName: '全部交易类型'
      });
    },
    async getTransTypeNo() {
      // const result = await queryMenuBy({ transType: '3' });
      const result2 = await queryMenuBy({ transType: '2' });
      // const menuList = [...result.body.menuList, ...result2.body.menuList];
      // console.log(menuList, 'menuList');
      this.withoutTrandeMo = result2.body.menuList.map(item => {
        return {
          tradeType: item.menuCode,
          tradeTypeName: item.menuName,
          approvalType: '0',
          modelName: '',
          menuCode: item.menuCode,
          ebankCstmNo: this.ebankCstmNo
        };
      });
    },
    async init() {
      console.log(this.authSettingList, 'authSettingList');
      await this.getTransTypeHas();
      // 是否管理员（授权有序无序操作）
      this.sequence = this.authSettingList[0]
        ? this.authSettingList[0].sequence
        : '0';
      // 自身显示数据
      if (this.authSettingList.length === 0) {
        this.getTransTypeNo();
      } else {
        this.ownTemplateList = this.authSettingList.map(item => ({
          ...item,
          ebankCstmNo: this.ebankCstmNo
        }));
        // 每次清空授权列表重新添加
        this.dataList = [];
        this.withoutTrandeMo = [];
        this.ownTemplateList.forEach(item => {
          if (item.approvalType === '1') {
            if (item.acctNo.slice(3, 5) === '67') {
              this.dataList.push({ ...item, transFlag: true });
            }
            this.dataList.push({ ...item, transFlag: false });
          } else {
            this.withoutTrandeMo.push(item);
          }
        });
      }
      // 获取模板列表
      const result = await queryOpenStemp({
        stemp: '3',
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        const authSettingList = result.body;
        this.getChooseList(authSettingList);
      }

      // 获取银行卡列表
      console.log('this', this);
      const resultcard = await queryUserAccounts({
        ebankCstmNo: this.ebankCstmNo
      });
      if (resultcard.body) {
        // this.cardList = resultcard.body;
        let obj = {};
        this.cardList = resultcard.body.reduce((pre, next) => {
          if (!obj[next.accountNo]) {
            obj[next.accountNo] = true;
            console.log(pre, obj, next);
            pre.push(next);
          }
          return pre;
        }, []);
        this.cardList.unshift({ accountNo: 'ALL', currencyType: 'ALL' });
      }
    },
    lastStep() {
      this.$emit('lastStep');
    },
    // 添加有序无序授权状态（默认有）
    toConfirm() {
      this.dataList = this.dataList.map(item => ({
        ...item,
        sequence: this.sequence
      }));
      this.withoutTrandeMo = this.withoutTrandeMo.map(item => ({
        ...item,
        sequence: this.sequence,
        acctNo: '0'
      }));

      for (let i = 0; i < this.dataList.length; i++) {
        if (
          this.dataList[i].acctNo === '' &&
          this.dataList[i].tradeType === ''
        ) {
          return this.$showMsg({
            type: 'error',
            message: `有金額交易第${i + 1}行數據為空，請添加數據或刪除該行`
          });
        }
      }
      for (let i = 0; i < this.dataList.length; i++) {
        for (let j = i + 1; j < this.dataList.length; j++) {
          if (
            this.dataList[i].acctNo === this.dataList[j].acctNo &&
            this.dataList[i].tradeType === this.dataList[j].tradeType
          ) {
            return this.$showMsg({
              type: 'error',
              message: `有金額交易第${i + 1}行數據和第${j + 1}行一致，請修改`
            });
          }
        }
      }
      console.log('this.dataList---add', this.dataList);
      console.log('this.withoutTrandeMo---add', this.withoutTrandeMo);
      console.log('add', [...this.dataList, ...this.withoutTrandeMo]);
      this.$emit('toConfirm', [...this.dataList, ...this.withoutTrandeMo]);
    },
    // 处理授权模板数据
    getChooseList(authSettingList) {
      this.hasMoney = [];
      this.withoutMoney = [];
      authSettingList.forEach(item => {
        if (item.modelType === '1') {
          this.hasMoney.push({
            modelName: item.modelName,
            modelCode: item.modelCode,
            modelType: item.modelType
          });
        } else {
          this.withoutMoney.push({
            modelName: item.modelName,
            modelCode: item.modelCode,
            modelType: item.modelType
          });
        }
      });
    },
    // 修改交易传值---银行卡
    changeCard(e, index, scope) {
      this.dataList[index].accountNo = e;
      if (e.slice(3, 5) === '67') {
        scope.row.transFlag = true;
        this.changeTypeName('0403', index);
      } else {
        scope.row.transFlag = false;
      }
    },
    acctInfoJoint(item) {
      if (item.accountNo !== 'ALL') {
        return `${item.accountNo}${
          item.accountType === 'MULTICURRENCY' || item.accountType === 'FIXED'
            ? ' '
            : ' ' + item.currencyType
        } ${CONSTANTS.accountTypes[item.accountType]}`;
      }
      return item.accountNo;
    },
    // 修改交易传值---交易类型
    changeTypeName(e, row) {
      let arrTypeName = {};
      arrTypeName = this.hasTrandeMo.find(item => {
        return item.menuCode === e;
      });
      this.dataList[row].approvalType = arrTypeName.approvalType;
      this.dataList[row].ebankCstmNo = arrTypeName.ebankCstmNo;
      this.dataList[row].empowerTradeCode = arrTypeName.empowerTradeCode;
      this.dataList[row].menuCode = arrTypeName.menuCode;
      this.dataList[row].tradeType = arrTypeName.tradeType;
      this.dataList[row].tradeTypeName = arrTypeName.tradeTypeName;
    },
    // 修改交易传值---授权模板
    changeModName(e, row) {
      let arrModName = {};
      arrModName = this.hasMoney.find(item => {
        return item.modelCode == e;
      });
      this.dataList[row].modelCode = arrModName.modelCode;
      this.dataList[row].modelName = arrModName.modelName;
      this.dataList[row].modelType = arrModName.modelType;
    },
    // 修改交易传值---授权模板//无金额s
    change(e, row) {
      console.log(e, row);
      row.modelCode = e.modelCode;
      row.modelName = e.modelName;
      row.modelType = e.modelType;
    },
    handleDelete(row, index) {
      this.dataList.splice(index, 1);
      console.log(row, index);
    },
    handleAdd() {
      let obj = {
        modelCode: '',
        modelName: '',
        modelType: ''
      };
      this.dataList.push(obj);
    }
  }
};
</script>

<style lang="scss" scoped>
.f-h-30 {
  height: 30px;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.f-w-270 {
  width: 270px;
}
.m-t-40 {
  margin-top: 40px;
}
.article {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  position: absolute;
  left: 0;
  bottom: 0;
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
.side-box {
  position: relative;
  padding-bottom: 100px;
}
.mt25 {
  margin-top: 25px;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  span {
    display: inline-block;
    cursor: pointer;
  }
}
</style>