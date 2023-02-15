<!--
 * @Author: your name
 * @Date: 2022-10-24 09:46:04
 * @LastEditTime: 2022-11-04 11:16:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\specialInstruction\app;ocationSpecial\index.vue
-->
<template>
  <div class="contain">
    <div v-if="showIndex">
      <el-form class="transverse-form" label-width="auto" ref="formRef" :model="formData">
        <el-form-item label="網銀客戶編號" prop="ebankCstmNo">
          <el-input v-model="formData.ebankCstmNo" maxlength="30" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
        </el-form-item>
        <el-form-item label="客戶經理登錄名稱" prop="rmUserno">
          <el-input v-model="formData.rmUserno" maxlength="50" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
        </el-form-item>
        <el-form-item label="客戶經理郵箱" prop="rmEmail">
          <el-input v-model="formData.rmEmail" maxlength="50" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
        </el-form-item>
        <!-- <el-form-item label="客戶經理所屬機構">
          <el-input v-model="formData.organization" maxlength="50" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
        </el-form-item> -->
        <el-form-item label=" ">
          <div style="width:270px;">
            <Form-Button style="float:right" @add="add" @submit="search" @handleReset="handleReset"></Form-Button>
          </div>
        </el-form-item>
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
      >
        <el-table-column width="80" type="index" label="序號"></el-table-column>
        <el-table-column min-width="200" prop="ebankCstmNo" label="網銀客戶編號">
          
        </el-table-column>
        <el-table-column min-width="200" prop="entEglsName" label="客戶名稱"></el-table-column>
        <el-table-column min-width="300" prop="rmUserno" label="客戶經理登錄名稱"></el-table-column>
        <el-table-column width="200" prop="rmRealName" label="客戶經理姓名"></el-table-column>
        <el-table-column min-width="150" prop="rmEmail" label="客戶經理郵箱"></el-table-column>
        <el-table-column min-width="150" prop="belongDepName" label="客戶經理所屬機構"></el-table-column>
        <el-table-column min-width="120" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="f-span-btns">
              <span @click="del(scope.row, scope.$index)">{{$t(`COMMON.DELETE`)}}</span>
              <span @click="modify(scope.row, scope.$index)">{{$t(`COMMON.UPDATE`)}}</span>
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
    <add v-if="addSpecial" :formData="formData" :adds="adds" @back="back()"></add>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import add from "./add.vue"
import {queryList,unBind} from "@/api/specialInstruction/index"
export default {
  components: {
    FormButton,
    add
  },
  data() {
    return {
      formData:{
        ebankCstmNo:'',
        rmUserno:'',
        rmEmail:'',
        organization:''
      },
      tableData: [],
      showIndex:true,
      addSpecial:false,
      currentPage:1,
      pageSize:10,
      total:0,
      adds:true
    };
  },
  created(){
    this.getList()
  },
  methods: {
   async getList(){
     let params ={
        current:this.currentPage,
        ebankCstmNo:this.formData.ebankCstmNo,
        // endDate:'',
        // pages:this.formData.pageSize,
        rmEmail:this.formData.rmEmail,
        rmUserno:this.formData.rmUserno,
        size:this.pageSize,
        // startDate:''
     }
     const result = await queryList({...params})
     if(result&&result.body){
        this.tableData = result.body.records
        this.total = result.body.total
     }
   },
    add() {
      this.formData={}
      this.showIndex = false
      this.addSpecial = true
      this.adds = true
    },
    back(){
      this.formData={}
      this.showIndex = true
      this.addSpecial = false
      this.adds = true
    
    },
    del(row){
 
     this.$showBox({
        content: '是否刪除此條指令',
        confirm: () => {
          unBind({
            ...row
          }).then(res=>{
         
          if(res.body){
            this.$showMsg({
              type: 'success',
              message: '刪除成功'
            });
            this.getList()
          }
          })
        }
      });
     
    },
    modify(row){
      console.log(row,'row')
      this.$set( this.formData,'belongDepName',row.belongDepName)
      this.$set( this.formData,'ebankCstmNo',row.ebankCstmNo)
      this.$set( this.formData,'entEglsName',row.entEglsName)
      this.$set( this.formData,'rmEmail',row.rmEmail)
      this.$set( this.formData,'rmRealName',row.rmRealName)
      this.$set( this.formData,'rmUserno',row.rmUserno)
      this.$set( this.formData,'id',row.id)
      //  this.formData.belongDepName = 
      //  this.formData.ebankCstmNo = row.ebankCstmNo
      //  this.formData.entEglsName = row.entEglsName
      //  this.formData.rmEmail = row.rmEmail
      //  this.formData.rmRealName = row.rmRealName
      //  this.formData.rmUserno = row.rmUserno
      this.showIndex = false
      this.addSpecial = true
      this.adds =false
    },
    submit() {},
    handleReset() {
      this.$refs.formRef.resetFields()
    },
    search(){
       this.current = 1
      this.getList()
    },
    handleSizeChange(val){
       this.pageSize = val;
       this.getList()
    },
    handleCurrentChange(val){
       this.currentPage = val;
       this.getList()
    }
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
</style>
