<!--
 * @Author: your name
 * @Date: 2022-10-24 09:46:04
 * @LastEditTime: 2022-11-09 09:05:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\specialInstruction\app;ocationSpecial\index.vue
-->
<template>
  <div class="contain">
    <div v-if="showIndex">
      <el-form class="transverse-form" label-width="auto" ref="formData" :model="formData">
        <el-form-item label="網銀客戶編號" prop="ebankCstmNo">
          <el-input
            v-model="formData.ebankCstmNo"
            maxlength="30"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item label="提交日期" prop="submitDate">
          <el-date-picker v-model="formData.submitDate" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="聯絡人英文姓名" prop="linkUserName">
          <el-input
            v-model="formData.linkUserName"
            maxlength="50"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item label="聯絡電話" prop="mobilePhone">
          <el-input
            v-model="formData.mobilePhone"
            maxlength="50"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item label="聯絡郵箱" prop="linkEmail">
          <el-input
            v-model="formData.linkEmail"
            maxlength="50"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item label="審批狀態" prop="status">
          <el-select v-model="formData.status">
            <el-option
              v-for="item in status"
              :label="item.lable"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="btn-form">
          <el-button class="query" type="primary" @click="search">查詢</el-button>
          <el-button class="reset" @click="handleReset">重置</el-button>
          <el-button class="expot" @click="allDownLoad">全部導出</el-button>
          <el-button class="allExport" @click="partialExport">部分導出</el-button>
        </div>
      </el-form>
      <el-table
        class="g-table"
        :data="tableData"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
        @selection-change="handleSelectionChage"
      >
        <el-table-column type="selection" width="90"></el-table-column>
        <el-table-column width="80" type="index" label="序號"></el-table-column>
        <el-table-column min-width="200" prop="flowNo" label="參考編號">
          <!-- <template slot-scope="scope">
            <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.userName }}</div>
          </template>-->
        </el-table-column>
        <el-table-column min-width="200" prop="ebankCstmNo" label="網銀客戶編號">
          <!-- <template slot-scope="scope">
            <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.userName }}</div>
          </template>-->
        </el-table-column>
        <el-table-column min-width="200" prop="createTime" label="提交日期"></el-table-column>
        <el-table-column min-width="300" prop="linkUserName" label="聯絡人英文姓名"></el-table-column>
        <el-table-column width="200" prop="mobilePhone" label="聯絡電話"></el-table-column>
        <el-table-column min-width="150" prop="linkEmail" label="聯絡郵箱"></el-table-column>
        <el-table-column min-width="150" prop="status" label="審批狀態">
          <template slot-scope="scope">
            {{fitlterStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <!-- <el-table-column min-width="150" prop="userStatusName" label="審批狀態"></el-table-column>
        <el-table-column min-width="150" prop="userStatusName" label="渠道"></el-table-column>-->
        <el-table-column min-width="120" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span @click="details(scope.row, scope.$index)">詳情</span>
              <!-- <span @click="modify(scope.row, scope.$index)">{{$t(`COMMON.UPDATE`)}}</span> -->
            </div>
          </template>
        </el-table-column>
        <div slot="empty" class="g-empty">
          <img src="@/img/table-empty.png" alt />
          <span>{{ $t('USER_MANAGEMENT.DATA_NULL_USER') }}</span>
        </div>
      </el-table>
      <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)"
        />
      </div>
    </div>
    <detail v-if="addSpecial" :row="row" @back="back()"></detail>
  </div>
</template>

<script>
import { queryApplyList, exportExcel } from '@/api/specialInstruction/index';
import { downUrl } from '@/utils/downLoadTools';
import filter from "@/filters/public.js"
import detail from "./datail.vue"
export default {
  components: {
    detail
  },
  data() {
    return {
      formData: {
        ebankCstmNo: '',
        submitDate: '',
        linkUserName: '',
        mobilePhone: '',
        linkEmail: '',
        status: '',
        organization: ''
      },
      tableData: [],
      showIndex: true,
      addSpecial: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectTableData: [],
      status: [
        {
          value: '',
          lable: '全部'
        },
        {
          value: 10,
          lable: '已接收'
        },
        {
          value: 20,
          lable: '處理中'
        },
        {
          value: 21,
          lable: '通過'
        },
        {
          value: 29,
          lable: '拒絕'
        }
      ],
      row:{}
    };
  },
  filter,
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const result = await queryApplyList({
        ebankCstmNo: this.formData.ebankCstmNo,
        linkEmail: this.formData.linkEmail,
        linkUserName: this.formData.linkUserName,
        mobilePhone: this.formData.mobilePhone,
        // linkEmail: this.formData.linkEmail,
        rmUserName: this.formData.rmUserName,
        size: this.size,
        status: this.formData.status,
        submitDate: this.formData.submitDate,
        userCode: this.formData.userCode,
        current: this.current
      });
      if (result && result.body) {
        this.tableData = result.body.records;
        this.total = result.body.total;
      } else {
        this.tableData = [];
        this.total = 0;
      }
      console.log(result, 'result');
    },
    details(row) {
      this.row = row
      this.showIndex = false;
      this.addSpecial = true;
    },
    back() {
      this.getList()
      this.showIndex = true;
      this.addSpecial = false;
    },
    handleSelectionChage(val) {
      this.selectTableData = val;
    },
    submit() {},
    handleReset() {
      this.$refs.formData.resetFields()
    },
    search() {
      this.current = 1
      this.getList()
    },
    async allDownLoad() {
      const result = await exportExcel({
        exportType: 'ALL',
        ebankCstmNo: ''
      });
      console.log(result, 'result');
      if (result && result.body) {
          downUrl(result.body);
        }
    },
   async partialExport(){
     let ids =[]
     this.selectTableData.forEach(item=>{
       ids.push(item.id)
     })
      const result = await exportExcel({
        exportType: 'CHECKED',
        ids: ids
      });
       if (result && result.body) {
          downUrl(result.body);
        }
    },
    fitlterStatus(val) {
      return filter.status(val)
    },
     handleSizeChange(val){
       this.size = val;
       this.getList()
    },
    handleCurrentChange(val){
       this.current = val;
       this.getList()
    }
  },
  destroyed(){
    sessionStorage.removeItem('specialInstruction')
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
}
/deep/ .el-table {
  width: auto;
}
.g-table {
  // padding: 0 20px;
  margin: 20px 0px;
  // width: 1--
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
    // position: absolute;
    // bottom: 15%;
    // left: 45%;
  }
}
.g-bolck {
  // float: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  // margin-top: 32px;
  padding: 32px 20px 20px;
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
  .el-input {
    width: 270px;
  }
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
  span:not(:nth-of-type(1)) {
    margin-left: 10px;
    color: #f06b00;
  }
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.btn-form {
  display: flex;
}
.query,
.reset,
.expot,
.allExport {
  width: 90px;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  font-family: PingFangSC-Regular;
  border: 1px solid;
  border-radius: 4px;
}
.query {
  background: #f06b00;
  border-color: #f06b00;
  color: #ffffff;
}
.reset,
.expot,
.allExport {
  margin-left: 16px;
  border-color: #000000 45%;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
}
</style>
