<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 10:36:21
 * @LastEditTime: 2022-07-07 10:17:52
 * @LastEditors: zhangcheng
 * @Description: 授权模板维护
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\authorization\authTemplateMaintain.vue
-->
<template>
  <div class="contain">
    <customer-query
      v-show="showQueryFlag"
      route-name="AuthTemplateMaintain"
      @showIndex="showIndex"
    />
    <table-change
      v-if="showOperateFlag"
      :modelFrom="operateData"
      :hasTemplate="hasTemplate"
      @back="backIndex"
      @submit="toDetailPage"
    />
    <table-confirm
      v-if="showDetailFlag"
      :modelFrom="operateData"
      :is-detail="isDetail"
      @back="backIndex"
      @submitData="submitRequest"
      @backChange="backChange"
    />
    <div v-if="showIndexFlag">
      <el-form
        ref="formRef"
        :model="searchInfo"
        class="transverse-form"
        label-width="auto"
        label-suffix=":"
      >
        <div class="g-form-item">
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')"
            class="g-project"
            prop="modelName"
          >
            <el-input
              v-model="searchInfo.modelName"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.MODEL_TYPE')"
            class="g-project"
            prop="modelType"
          >
            <el-select v-model="searchInfo.modelType" class="f-w-270" @change="changeModelType">
              <el-option :label="$t('CUSTOMER_MANAGEMENT.ALL')" value="2"></el-option>
              <el-option :label="$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL')" value="1"></el-option>
              <el-option :label="$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL')" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <div style="width:270px;">
              <Form-Button
                style="float: right"
                @add="add"
                @submit="query"
                @handleReset="handleReset"
              ></Form-Button>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        class="g-table"
        :data="modelInfo"
        stripe
        :border="true"
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
          <template slot-scope="scope">
            <span class="f-btnColor" @click="handleCell(scope.row)">{{scope.row.modelName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.MODEL_TYPE')">
          <template slot-scope="scope">{{modelTypeTrs(scope.row.modelType)}}</template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.OPERATION')">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span @click="del(scope.row)">{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
              <span @click="edit(scope.row)">{{$t('CUSTOMER_MANAGEMENT.UPDATE')}}</span>
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
        <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      </div>
      <article class="article">
        <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
        <br />
        <p>{{$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_MAINTAIN_TIP_1')}}</p>
        <p>{{$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_MAINTAIN_TIP_2')}}</p>
        <p>{{$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_MAINTAIN_TIP_3')}}</p>
      </article>
    </div>
  </div>
</template>

<script>
import {
  queryListTemplatePage,
  deleteTemplate,
  updateTemplate,
  saveTemplate
} from '@/api/customer-management/authorization';
import FormButton from '@/components/common/FormButton.vue';
import TableChange from '../components/auth-template-maintain/TableChange.vue';
import TableConfirm from '../components/auth-template-maintain/TableConfirm';
import _ from 'lodash';
import { moneyFormat } from '@/utils/tools';
export default {
  name: 'AuthTemplateMaintain',
  components: {
    FormButton,
    TableChange,
    TableConfirm
  },
  data() {
    return {
      reason: '',
      queryStatus: false,
      current: 1,
      size: 10,
      total: 0,
      projectName: '',
      searchInfo: {
        modelName: '',
        modelType: '2'
      },
      modelInfo: [],
      addModel: {
        modelName: '',
        modelType: '1',
        amuntUserList: [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ]
      },
      operateData: {}, // 修改，详情，新增数据
      showQueryFlag: true,
      showIndexFlag: false,
      showOperateFlag: false,
      showDetailFlag: false,
      hasTemplate: false, // 是否禁用模板类型选择
      isDetail: false //是否详情
    };
  },
  methods: {
    // query传值
    showIndex(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      this.queryListTemplatePage();
      this.showIndexFlag = true;
      this.showQueryFlag = false;
    },
    // 返回主页
    backIndex() {
      this.showDetailFlag = false;
      this.showOperateFlag = false;
      this.showIndexFlag = true;
    },
    // 确认页
    toDetailPage(data) {
      this.operateData = _.cloneDeep(data);
      this.isDetail = false;
      this.showOperateFlag = false;
      this.showDetailFlag = true;
    },
    // 返回修改页
    backChange() {
      this.showOperateFlag = true;
      this.showDetailFlag = false;
    },
    // 提交修改/新增
    submitRequest() {
      const subData = _.cloneDeep(this.operateData);
      if (subData.modelType === '1') {
        subData.amuntUserList = subData.amuntUserList.map(item => {
          return {
            ...item,
            amountStart: item.amountStart.split(',').join(''),
            amountEnd: item.amountEnd.split(',').join('')
          };
        });
      }
      const data = {
        ...subData,
        ebankCstmNo: this.ebankCstmNo
      };
      if (this.hasTemplate) {
        this.updateTemplate(data);
      } else {
        this.saveTemplate(data);
      }
    },
    // 新增接口
    async saveTemplate(data) {
      const result = await saveTemplate(data);
      if (result.body) {
        this.submitSuccess();
      }
    },
    // 修改接口
    async updateTemplate(data) {
      const result = await updateTemplate(data);
      if (result.body) {
        this.submitSuccess();
      }
    },
    // 成功弹窗
    submitSuccess() {
      this.$showMsg({
        message: this.hasTemplate
          ? this.$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_EDIT_SUCCESS')
          : this.$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_ADD_SUCCESS'),
        type: 'success'
      });
      this.showIndexFlag = true;
      this.showDetailFlag = false;
    },
    async queryListTemplatePage() {
      const result = await queryListTemplatePage({
        ebankCstmNo: this.ebankCstmNo,
        current: this.current,
        size: this.size,
        ...this.searchInfo,
        modelType:
          this.searchInfo.modelType === '2' ? '' : this.searchInfo.modelType
      });
      if (result.body) {
        this.total = result.body.total;
        this.modelInfo = result.body.records;
      }
    },
    changeStatus(val) {
      console.log(val);
      //发请求
    },
    handleSizeChange(val) {
      console.log(val);
      this.size = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryListTemplatePage();
    },
    changeModelType() {
      this.query();
    },
    //详情
    handleCell(row) {
      this.operateData = _.cloneDeep(row);
      this.isDetail = true;
      this.showDetailFlag = true;
      this.showIndexFlag = false;
    },
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    //重置密码
    resendPassword(row, index) {
      console.log('row:', row, index);
      this.$refs.resend.showDialog();
    },
    //删除
    del(row) {
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_DELETE_CONFIRM', {
          templateName: row.modelName
        }),
        confirm: async () => {
          const result = await deleteTemplate({
            ...row
          });
          if (result.body) {
            this.$showMsg({
              message: this.$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_DEL_SUCCESS'),
              type: 'success'
            });
          }
          this.query();
        }
      });
    },
    //编辑
    edit(row) {
      console.log(row);
      this.hasTemplate = true;
      this.showOperateFlag = true;
      this.showIndexFlag = false;
      this.operateData = _.cloneDeep(row);
    },
    //新增
    add() {
      this.operateData = _.cloneDeep(this.addModel);
      this.showIndexFlag = false;
      this.showOperateFlag = true;
      this.hasTemplate = false;
    },
    query() {
      // 发起查询请求
      this.current = 1;
      this.queryListTemplatePage();
    },
    // 返回
    back() {
      this.showIndexFlag = false;
      this.showQueryFlag = true;
    },
    modelTypeTrs(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL');
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
.g-bottom {
  margin: 40px 0 120px;
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
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
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
.f-btnColor {
  color: #4181fa;
  cursor: pointer;
}
.g-form-item {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-form-item__label {
    padding-right: 8px;
    margin-left: 20px;
  }
  ::v-deep .el-form-item {
    display: flex;
    margin-right: 20px;
  }
}
.f-w-270 {
  width: 270px;
}
.g-table {
  margin-top: 20px;
}
::v-deep .el-switch__label {
  color: #606266;
}
::v-deep .el-switch__label.is-active {
  color: #f06b00;
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