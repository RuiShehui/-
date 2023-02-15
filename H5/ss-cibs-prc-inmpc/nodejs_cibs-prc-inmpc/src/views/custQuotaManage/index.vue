<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-01 14:50:24
 * @LastEditTime: 2022-07-11 11:32:26
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\custQuotaManage\index.vue
-->
<template>
  <div class="contain">
    <!-- 新增页面 -->
    <add
      :addData="addData"
      :customerClazzList="customerClazzList"
      v-show="showAdd"
      @toConfirm="toConfirm"
      @backIndex="backIndex"
    />
    <!-- 修改页面 -->
    <edit
      :editData="editData"
      :customerClazzList="customerClazzList"
      v-if="showEdit"
      @toConfirm="toConfirm"
      @backIndex="backIndex"
    />
    <!-- 确认页面 -->
    <confirm
      :confirmData="confirmData"
      :operate="operate"
      v-if="showConfirm"
      @backOperate="backOperate"
      @submitData="submitData"
    />
    <!-- 主页面 -->
    <div v-show="showIndex">
      <!-- 搜索条件 -->
      <el-form
        :model="formData"
        class="transverse-form"
        label-width="auto"
        ref="formData"
        label-suffix=":"
        label-position="right"
      >
        <!-- CIF客户号 -->
        <el-form-item :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')" prop="custNo">
          <el-input
            v-model="formData.custNo"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
            class="f-w-270"
          />
        </el-form-item>
        <!-- 限额级别 -->
        <el-form-item :label="$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')" prop="customerClazz">
          <el-select
            v-model="formData.customerClazz"
            :placeholder="$t('COMMON.TOTAL')"
            class="f-w-270"
          >
            <el-option
              v-for="item in customerClazzList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 客户名称 -->
        <el-form-item :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')" prop="custName">
          <el-input
            v-model="formData.custName"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
            class="f-w-270"
          />
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item label=" ">
          <div style="width:270px;">
            <form-button style="float:right" @add="add" @submit="query" @handleReset="handleReset" />
          </div>
        </el-form-item>
      </el-form>
      <el-table
        class="mg-17"
        :data="tcBankLimitRelationReqList"
        stripe
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <!-- 序号 -->
        <el-table-column type="index" width="80" :label="$t('COMMON.SERIAL_NUMBER')" />
        <!-- CIF客户号 -->
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.CIF_CUSNO')" prop="custNo" />
        <!-- 客户名称 -->
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.ENT_NAME')" prop="custName" />
        <!-- 限额级别 -->
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.CUS_CLAZZ')">
          <template v-slot="{ row }">{{ customerClazzFilter(row.customerClazz) }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('BUSINESS_MANAGEMENT.OP')">
          <template v-slot="{ row,$index }">
            <span @click="edit(row,$index)" class="btn f-add">{{ $t("COMMON.UPDATE") }}</span>
            <span @click="del(row,$index)" class="btn f-delete">{{ $t("COMMON.DELETE") }}</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="total,sizes,prev,pager,next,jumper"
          :current-page="current"
          :page-size="size"
          :total="total"
        ></el-pagination>
      </div>
      <!-- <el-dialog
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
          <p>确定要删除所选择的特殊限额客户吗？</p>
        </main>
        <footer slot="footer">
          <el-button @click="closed">取消</el-button>
          <el-button type="primary" @click="deleteRequest">确定</el-button>
        </footer>
      </el-dialog>-->
    </div>
  </div>
</template>

<script>
import {
  getLimitLevels,
  queryBankLimitRelationList,
  saveBankLimitRelationList,
  updateBankLimitRelation,
  delBankLimitRelation
} from '@/api/business-management/limit-assets';
import FormButton from '@/components/common/FormButton.vue';
import Add from './components/CustQuotaManageAdd.vue';
import Edit from './components/CustQuotaManageEdit.vue';
import Confirm from './components/CustQuotaManageConfirm.vue';
export default {
  name: 'CustQuotaManage',
  data() {
    return {
      formData: {
        custNo: '',
        customerClazz: '',
        custName: ''
      }, // 筛选条件
      tcBankLimitRelationReqList: [
        {
          custNo: '1111',
          custName: '1111',
          customerClazz: '0'
        }
      ], // 表格数据
      customerClazzList: [], // 限额级别列表
      addData: {
        saveMethod: '0',
        tcBankLimitRelationReqList: [
          {
            custNo: '',
            custName: '',
            customerClazz: ''
          }
        ]
      },
      editData: [], // 修改数据
      confirmData: [], // 确认数据
      current: 1, // 页码
      size: 10, // 每页条数
      total: 0, //总条数
      showIndex: true, // 展示主页
      showAdd: false, // 展示新增
      showConfirm: false, // 展示确认
      showEdit: false, // 展示修改
      // dialogVisible: false, // 删除提示
      operate: 'edit'
    };
  },
  components: {
    FormButton,
    Add,
    Edit,
    Confirm
  },
  created() {
    this.queryData();
    // this.generataArray();
    this.getLimitLevels();
  },
  methods: {
    // 查询已有级别
    async getLimitLevels() {
      const { body = '' } = await getLimitLevels();
      if (body) {
        let array = [];
        let letter = '';
        for (let i = 0; i < body.length - 1; i++) {
          letter = String.fromCharCode(66 + i);
          array.push({
            label: letter + this.$t('BUSINESS_MANAGEMENT.CLAZZ'),
            value: `${i + 1}`
          });
        }
        this.customerClazzList = array;
      }
    },
    // 等级过滤
    customerClazzFilter(val) {
      const number = Number(val);
      if (number === 0 || (number && number < 26)) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        );
      } else {
        return val;
      }
    },
    // 查询数据
    async queryData() {
      const params = {
        current: this.current,
        size: this.size,
        ...this.formData
      };
      const { body = '' } = await queryBankLimitRelationList(params);
      if (body) {
        this.tcBankLimitRelationReqList = body.records;
        this.total = body.total;
      }
    },
    // 生成A-Z数组
    // generataArray() {
    //   let array = [];
    //   let letter = '';
    //   for (let i = 0; i < 26; i++) {
    //     letter = String.fromCharCode(65 + i);
    //     array.push({
    //       label: letter + '级',
    //       value: letter
    //     });
    //   }
    //   this.customerClazzList = array;
    // },
    // 新增
    add() {
      this.addData = {
        saveMethod: '0',
        tcBankLimitRelationReqList: [
          {
            custNo: '',
            custName: '',
            customerClazz: ''
          }
        ]
      };
      this.operate = 'add';
      this.showIndex = false;
      this.showAdd = true;
    },
    // 查询
    query() {
      this.current = 1;
      this.queryData();
    },
    // 重置
    handleReset() {
      this.$refs['formData'].resetFields();
      this.current = 1;
      this.queryData();
    },
    // 修改
    edit(row) {
      this.editData = { ...row };
      this.operate = 'edit';
      this.showIndex = false;
      this.showEdit = true;
    },
    // 删除
    del(row) {
      // this.dialogVisible = true;
      this.$showBox({
        content: this.$t('BUSINESS_MANAGEMENT.DEL_CONFIRM'),
        confirm: () => {
          this.deleteRequest(row);
        }
      });
    },
    // 跳转确认页
    toConfirm({ data, type }) {
      this.operate = type;
      console.log(data, 'data');
      if (type === 'edit') {
        this.confirmData = data;
        this.editData = { updateCustomerClazz: '', ...data[0] };
      } else {
        this.addData = data;
        this.confirmData = data.tcBankLimitRelationReqList;
      }
      this.showConfirm = true;
      this.showAdd = false;
      this.showEdit = false;
    },
    // 返回首页
    backIndex() {
      this.showIndex = true;
      this.showConfirm = false;
      this.showAdd = false;
      this.showEdit = false;
    },
    backOperate(data) {
      this.showConfirm = false;
      if (this.operate === 'add') {
        this.showAdd = true;
      } else {
        this.showEdit = true;
      }
    },
    // 改变查询数量
    handleSizeChange(value) {
      this.current = 1;
      this.size = value;
      this.queryData();
    },
    // 改变查询页码
    handleCurrentChange(value) {
      this.current = value;
      this.queryData();
    },
    // 关闭弹出框
    // closed() {
    //   this.dialogVisible = false;
    // },
    // 删除接口
    async deleteRequest(row) {
      // this.dialogVisible = false;
      const { body = '' } = await delBankLimitRelation(row);
      if (body) {
        this.$showMsg({
          message: this.$t('COMMON.DELETE_SUCCESS'),
          type: 'success'
        });
        this.query();
      }
    },
    // 数据提交
    async submitData(data) {
      let result = {};
      if (this.operate === 'add') {
        result = await saveBankLimitRelationList(this.addData);
      } else {
        result = await updateBankLimitRelation(this.editData);
      }
      if (result.body) {
        if (this.operate === 'add') {
          this.$showMsg({
            message: this.$t('COMMON.ADD_SUCCESS'),
            type: 'success'
          });
        } else {
          this.$showMsg({
            message: this.$t('COMMON.EDIT_SUCCESS'),
            type: 'success'
          });
        }

        this.backIndex();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import './style/style.scss';
</style>