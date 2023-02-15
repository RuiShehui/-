<!--
 * @Autor: 赵霖
 * @Date: 2021-10-28 15:26:13
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-24 17:20:03
 * @Description: 个人账单列表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\billMainrenace\index.vue
-->
<template>
  <div class="contain">
    <customer-query v-show="showQueryFlag" @showIndex="showIndex" />
    <bill-change
      v-if="showOperateFlag"
      :billData="opetateData"
      :isUpdate="isUpdate"
      @backTo="backIndex"
      @confirm="toDetail"
    ></bill-change>
    <bill-confirm
      v-if="showDetailFlag"
      :tableData="opetateData"
      @lastStep="backOperate"
      @confirm="submitData"
    ></bill-confirm>
    <div v-if="showIndexFlag">
      <div class="g-btn">
        <el-button class="add" icon="el-icon-plus" @click="add">{{$t('CUSTOMER_MANAGEMENT.ADD')}}</el-button>
      </div>
      <el-table
        class="u-table"
        :data="billData"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.INDEX')" type="index"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_TYPE')" prop="merchantTypeInfo"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_NAME')" prop="merchantName"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE')" prop="billTypeInfo"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.BILL_NO')" prop="billNo"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.MERCHANT_ALIAS')" prop="merchantAlias"></el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.OPERATION')">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span @click="del(scope.row)">{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
              <span @click="modify(scope.row)">{{$t('CUSTOMER_MANAGEMENT.UPDATE')}}</span>
            </div>
          </template>
        </el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
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
        <el-button type="primary" @click="backQuery">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getBillList,
  deleteBill,
  saveBill,
  updateBill
} from '@/api/customer-management/bill';
import BillChange from '../components/bill-mainrenace/BillChange';
import BillConfirm from '../components/bill-mainrenace/BillConfirm';
import _ from 'lodash';
export default {
  name: 'BillMainrenace',
  components: {
    BillChange,
    BillConfirm
  },
  data() {
    return {
      params: '',
      ebankCstmNo: '',
      billData: [],
      current: 1,
      size: 10,
      total: 0,
      showQueryFlag: true,
      showIndexFlag: false,
      showOperateFlag: false,
      showDetailFlag: false,
      opetateData: {},
      addData: {
        merchantType: '',
        merchantName: '',
        billType: '',
        billNo: '',
        merchantAlias: '',
        merchartTypeCode: '',
        merchartCode: ''
      },
      isUpdate: false
    };
  },
  created() {},
  methods: {
    // 获取查询数据
    showIndex(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      this.showQueryFlag = false;
      this.showIndexFlag = true;
      this.queryBillList();
    },
    // 数据操作返回主页
    backIndex() {
      this.showOperateFlag = false;
      this.showIndexFlag = true;
    },
    // 进入确认页
    toDetail(data) {
      console.log('data',data)
      this.opetateData = _.cloneDeep(data);
      this.showDetailFlag = true;
      this.showOperateFlag = false;
    },
    // 返回修改数据页
    backOperate() {
      this.isUpdate = true;
      this.showDetailFlag = false;
      this.showOperateFlag = true;
    },
    // 提交数据
    submitData() {
      if (this.isUpdate) {
        this.updateBill();
      } else {
        this.saveBill();
      }
    },
    // 修改接口
    async updateBill() {
      const result = await updateBill({
        ebankCstmNo: this.ebankCstmNo,
        ...this.opetateData
      });
      if (result.body) {
        this.dataSubmitSuccess();
      }
    },
    // 新增接口
    async saveBill() {
      const result = await saveBill({
        ebankCstmNo: this.ebankCstmNo,
        ...this.opetateData
      });
      if (result.body) {
        this.dataSubmitSuccess();
      }
    },
    // 交易成功
    dataSubmitSuccess() {
      this.$showMsg({
        message: this.isUpdate
          ? this.$t('CUSTOMER_MANAGEMENT.BILL_EDIT_SUCCESS')
          : this.$t('CUSTOMER_MANAGEMENT.BILL_ADD_SUCCESS'),
        type: 'success'
      });
      this.showDetailFlag = false;
      this.showIndexFlag = true;
    },
    async queryBillList() {
      const result = await getBillList({
        ebankCstmNo: this.ebankCstmNo,
        current: this.current,
        size: this.size
      });
      if (result.body) {
        this.billData = result.body.records;
        this.total = result.body.total;
      }
    },
    async deleteBill(row) {
      const result = await deleteBill({
        ebankCstmNo: this.ebankCstmNo,
        merchantType: row.merchantType,
        merchantName: row.merchantName,
        billType: row.billType,
        billNo: row.billNo,
        merchantAlias: row.merchantAlias ? row.merchantAlias : '',
        billCode: row.billCode
      });
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.BILL_DELETE_SUCCESS'),
          type: 'success'
        });
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryBillList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.queryBillList();
    },
    add() {
      this.isUpdate = false;
      this.showOperateFlag = true;
      this.showIndexFlag = false;
      this.opetateData = _.cloneDeep(this.addData);
    },
    del(row) {
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.BILL_CONFIRM_DELETE'),
        confirm: async () => {
          await this.deleteBill(row);
          this.queryBillList();
        }
      });
    },
    // 返回
    backQuery() {
      this.showQueryFlag = true;
      this.showIndexFlag = false;
    },
    modify(row) {
      this.isUpdate = true;
      this.opetateData = _.cloneDeep(row);
      this.showIndexFlag = false;
      this.showOperateFlag = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}
.g-btn {
  text-align: right;
  margin: 20px;
}
.add {
  width: 90px;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: #f06b00;
  border: 1px solid #f06b00;
  border-radius: 4px;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    color: #f06b00;
    margin-left: 10px;
  }
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
}
</style>