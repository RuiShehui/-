<template>
  <div class="contain">
    <customer-query v-show="showQueryFlag" route-name="TrsAuSettings" @showIndex="showIndex" />
    <template-detail
      v-if="showTemplateDetailFlag"
      :empowerTradeCode="empowerTradeCode"
      @back="backIndex"
    />
    <div v-if="showIndexFlag">
      <el-tabs v-model="option">
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')" name="option"></el-tab-pane>
      </el-tabs>
      <!-- 有金额交易 -->
      <el-table
        :data="hasTrandeMo"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <!-- 交易账户 -->
        <el-table-column min-width="300" :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_CARD')">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.acctNo"
              class="f-w-270"
              @change="changeAcc($event,scope.$index,scope)"
            >
              <el-option
                v-for="(item,index) in cardList"
                :key="index"
                :value="item.accountNo"
                :label="acctInfoJoint(item)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 交易类型 -->
        <el-table-column min-width="300" :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_TRS_TYPE')">
          <template slot-scope="scope">
            <el-select
              :disabled="scope.row.tradeTypeFlag"
              v-model="scope.row.tradeType"
              class="f-w-270"
              @change="changeMenu($event, scope.$index)"
            >
              <el-option
                v-for="(item,index) in hasMoneyAll"
                :key="index"
                :label="item.menuCode | tradeTypeNameFilter"
                :value="item.menuCode"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 交易模板 -->
        <el-table-column min-width="400" :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.modelCode"
              class="f-w-270"
              @change="changeModel($event, scope.$index)"
            >
              <el-option
                v-for="(item,index) in hasMoneyType"
                :key="index"
                :label="item.modelName"
                :value="item.modelCode"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              class="g-button"
              @click="detailClick(scope.row)"
            >{{$t('CUSTOMER_MANAGEMENT.DETAIL')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="200" :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_OPERATION')">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span
                v-if="hasTrandeMo.length>1"
                @click="handleDelete($event, scope.$index)"
              >{{$t('COMMON.DELETE')}}</span>
              <span
                v-if="scope.$index === hasTrandeMo.length-1"
                style="margin-left:10px"
                @click="handleAdd()"
              >{{$t('COMMON.ADD')}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="f-h-30"></div>
      <!-- 无金额交易 -->
      <el-tabs v-model="option">
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')" name="option"></el-tab-pane>
      </el-tabs>
      <el-table
        :data="withoutTrandeMo"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column
          :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_TRS_TYPE')"
          min-width="400"
          prop="tradeType"
        >
          <template v-slot="{row}">{{ row.tradeType | tradeTypeNameFilter }}</template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')" min-width="400">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.modelCode"
              class="f-w-270"
              @change="changeWithout($event,scope.row)"
            >
              <el-option
                v-for="(item,index) in withoutMoneyType"
                :key="index"
                :label="item.modelName"
                :value="item.modelCode"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              class="g-button"
              @click="detailClick(scope.row)"
            >{{$t('CUSTOMER_MANAGEMENT.DETAIL')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form class="m-t-40" label-suffix=":">
        <el-form-item :label="$t('CUSTOMER_MANAGEMENT.SETTING_TEMPLATE')">
          <el-radio-group v-model="sequence">
            <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.DISORDER')}}</el-radio>
            <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.ORDERED')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="g-bottom">
        <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
        <el-button type="primary" @click="updata">{{$t('CUSTOMER_MANAGEMENT.UPDATE')}}</el-button>
      </div>
      <article class="article">
        <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
        <br />
        <p>{{$t('CUSTOMER_MANAGEMENT.TRADE_AUTH_SETTING_TIP_1')}}</p>
        <p>{{$t('CUSTOMER_MANAGEMENT.TRADE_AUTH_SETTING_TIP_2')}}</p>
      </article>
    </div>
  </div>
</template>

<script>
import {
  queryListSetting,
  queryListTemplate,
  updateSetting
} from '@/api/customer-management/authorization';
import {
  queryOpenStemp,
  queryUserEbankAccNo
} from '@/api/customer-management/customer';
import { queryMenuBy } from '@/api/customer-management/authorization';
import TemplateDetail from '../components/transfer-authorization-setting/TemplateDetail';
import filters from '@/filters/business.js';
import CONSTANTS from '@/utils/constant.js';
export default {
  name: 'TrsAuSettings',
  components: {
    TemplateDetail
  },
  data() {
    return {
      ebankCstmNo: '',
      option: 'option',
      cardList: [], //获取账户列表

      hasMoneyType: [], //有金额交易模板
      withoutMoneyType: [], //无金额交易模板

      hasMoneyAll: [], //全部有金额交易类型
      withoutMoneyAll: [], //全部无金额交易类型

      hasTrandeMo: [], //有金额交易整体返回
      withoutTrandeMo: [], //无金额交易整体返回
      dataList: [],
      sequence: '',
      showQueryFlag: true,
      showIndexFlag: false,
      showTemplateDetailFlag: false,
      showDetailFlag: false,
      empowerTradeCode: '' // 查询详情所需值
    };
  },
  filters,
  async created() {
    // this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
    // await this.queryListSetting();
    console.log('---------------------1');
  },
  methods: {
    async showIndex(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      this.showQueryFlag = false;
      this.showIndexFlag = true;
      await this.queryListSetting();
      await this.queryUserEbankAccNo();
      await this.queryMenuBy();
    },
    backIndex() {
      this.showDetailFlag = false;
      this.showTemplateDetailFlag = false;
      this.showIndexFlag = true;
    },
    back() {
      this.showIndexFlag = false;
      this.showQueryFlag = true;
    },
    // 获取银行卡列表
    async updata() {
      this.dataList = [...this.hasTrandeMo, ...this.withoutTrandeMo];
      console.log('this.dataList', this.dataList);
      this.dataList = this.dataList.map(item => {
        return {
          ...item,
          sequence: this.sequence
        };
      });
      for (let i = 0; i < this.hasTrandeMo.length; i++) {
        if (
          this.hasTrandeMo[i].acctNo === '' &&
          this.hasTrandeMo[i].tradeType === ''
        ) {
          return this.$showMsg({
            type: 'error',
            message: `有金額交易第${i + 1}行數據為空，請添加數據或刪除該行`
          });
        }
      }
      for (let i = 0; i < this.hasTrandeMo.length; i++) {
        for (let j = i + 1; j < this.hasTrandeMo.length; j++) {
          if (
            this.hasTrandeMo[i].acctNo === this.hasTrandeMo[j].acctNo &&
            this.hasTrandeMo[i].tradeType === this.hasTrandeMo[j].tradeType
          ) {
            return this.$showMsg({
              type: 'error',
              message: `有金額交易第${i + 1}行數據和第${j + 1}行一致，請修改`
            });
          }
        }
      }
      const result = await this.updateSetting({ list: this.dataList });
      console.log(result);
      if (result.body) {
        this.$showMsg({
          message: this.$t(
            'CUSTOMER_MANAGEMENT.TRANS_TEMPLATE_SETTING_SUCCESS'
          ),
          type: 'success'
        });
      }
    },
    detailClick(row) {
      console.log('row', row);
      this.empowerTradeCode = row.empowerTradeCode;
      this.showIndexFlag = false;
      this.showTemplateDetailFlag = true;
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
    updateSetting(data) {
      const result = updateSetting(data);
      return result;
    },
    changeAcc(val, index, scope) {
      console.log('changeAcc', val, index);
      this.hasTrandeMo[index].acctNo = val;
      if (val.slice(3, 5) === '67') {
        this.hasTrandeMo[index].tradeTypeFlag = true;
        // this.hasTrandeMo[index].tradeType = '0403';
        this.changeMenu('0403', index);
      } else {
        this.hasTrandeMo[index].tradeTypeFlag = false;
      }
    },
    changeMenu(val, row) {
      let arrTypeName = {};
      arrTypeName = this.hasMoneyAll.find(item => {
        return item.menuCode === val;
      });
      if (arrTypeName.menuCode === 'ALL') {
        arrTypeName.menuName = 'ALL';
      }
      this.hasTrandeMo[row].tradeType = arrTypeName.menuCode;
      this.hasTrandeMo[row].tradeTypeName = arrTypeName.menuName;
      this.hasTrandeMo[row].menuCode = arrTypeName.menuCode;
    },
    changeModel(val, row) {
      let arrTypeName = {};
      arrTypeName = this.hasMoneyType.find(item => {
        return item.modelCode === val;
      });
      this.hasTrandeMo[row].modelName = arrTypeName.modelName;
      this.hasTrandeMo[row].modelCode = arrTypeName.modelCode;
      this.hasTrandeMo[row].modelType = arrTypeName.modelType;
    },
    changeWithout(e, row) {
      const val = this.withoutMoneyType.find(item => item.modelCode === e);
      console.log(val,'val')
      row.modelName = val.modelName;
      row.modelCode = val.modelCode;
      row.modelType = val.modelType;
      row.sequence = this.sequence;
    },
    // 获取银行卡列表
    async queryUserEbankAccNo() {
      let result = await queryUserEbankAccNo({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        console.log(result.body, 'cardList');
        let obj = {};
        this.cardList = result.body.reduce((pre, next) => {
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
    // 授权列表查询
    async queryListSetting() {
      let result = await queryListSetting({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.sequence = result.body[0].sequence;
        this.hasTrandeMo = [];
        this.withoutTrandeMo = [];
        this.dataList = result.body;
        console.log('==========', this.dataList);
        this.dataList.forEach(item => {
          if (item.approvalType === '1') {
            item.acctNo || (item.acctNo = 'ALL');
            if (item.acctNo.slice(3, 5) === '67') {
              item.tradeTypeFlag = true;
            } else {
              item.tradeTypeFlag = false;
            }
            this.hasTrandeMo.push(item);
          } else {
            item.acctNo = '0';
            this.withoutTrandeMo.push(item);
          }
        });
        console.log(this.withoutTrandeMo, 'withoutTrandeMo');
        console.log('this.hasTrandeMo------------>', this.hasTrandeMo);
      }
      if (this.dataList.length !== 0) {
        await this.queryListTemplate();
      }
      console.log(result);
    },
    // 获取交易类型列表
    async queryMenuBy() {
      let result = await queryMenuBy({
        transType: '3'
      });
      if (result.body) {
        this.hasMoneyAll = result.body.menuList;
        this.hasMoneyAll.unshift({
          approvalType: '1',
          ebankCstmNo: this.ebankCstmNo,
          empowerTradeCode: '1',
          menuCode: 'ALL',
          modelName: '',
          tradeType: 'ALL',
          tradeTypeName: '全部交易类型'
        });
      }
    },
    // 授权模板查询
    async queryListTemplate() {
      let result = await queryListTemplate({
        ebankCstmNo: this.ebankCstmNo
        // ebankCstmNo: 'T24160567001'
      });
      if (result.body) {
        this.hasMoneyType = [];
        this.withoutMoneyType = [];
        result.body.forEach(item => {
          if (item.modelType === '1') {
            this.hasMoneyType.push(item);
          } else {
            this.withoutMoneyType.push(item);
          }
        });
        console.log('this.hasMoneyType', this.hasMoneyType);
      }
    },
    handleDelete(row, index) {
      this.hasTrandeMo.splice(index, 1);
      console.log(row, index);
    },
    handleAdd() {
      let obj = {
        modelCode: '',
        modelName: '',
        modelType: '',
        acctNo: '',
        tradeType: '',
        tradeTypeName: '',
        sequence: '0',
        approvalType: '1',
        ebankCstmNo: this.ebankCstmNo,
        empowerTradeCode: '', //模板详情字段
        menuCode: ''
      };
      this.hasTrandeMo.push(obj);
    },
    toConfirm() {
      this.showDetailFlag = true;
      // this.$router.push({
      //   name: 'TrsAuSettingsConfirm',
      //   params: { dataList: this.dataList }
      // });
      // this.$emit('toConfirm', [...this.hasTrandeMo, ...this.withoutTrandeMo]);
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  min-height: 100%;
  box-sizing: border-box;
  background: #ffffff;
  position: relative;
}
.f-h-30 {
  height: 30px;
}
.g-bottom {
  margin: 40px 0 100px;
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

.g-button {
  background: none;
  color: '#e34141';
}
.f-w-270 {
  width: 270px;
}
.m-t-40 {
  margin-top: 40px;
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
::v-deep .el-tabs__header {
  margin-bottom: 40px;
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