<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2021-12-10 10:48:57
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\index.vue
-->
<template>
  <div class="g-business">
    <el-form class="g-form" ref="formRef">
      <el-form-item label="收费项目">
        <el-select v-model="form.payItemName" placeholder="请选择">
          <el-option label="基金" value="1"></el-option>
          <el-option label="汇款(TT)" value="2"></el-option>
          <el-option label="汇款(CHATS)" value="3"></el-option>
          <el-option label="批量转账" value="4"></el-option>
          <el-option label="自动收款" value="5"></el-option>
          <el-option label="全部" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收费渠道" class="g-project">
        <el-select v-model="form.channel" placeholder="请选择">
          <el-option label="个人网银" value="1"></el-option>
          <el-option label="银企直连" value="2"></el-option>
        </el-select>
      </el-form-item>
      <Form-Button class="g-btn" v-on:add="add"></Form-Button>
    </el-form>
    <el-table
      class="g-table"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="payItemName" label="收费项目" align="center">
        <template slot-scope="project">
          <el-button type="text" class="f-btnColor" @click="handleCell">{{project.row.payItemName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="收费渠道" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center"></el-table-column>
      <el-table-column prop="submissionTime" label="提交时间" align="center"></el-table-column>
      <el-table-column prop="effectiveTime" label="生效时间" align="center"></el-table-column>
      <el-table-column prop="operation" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="del(scope.row,scope.$index)" type="text" class="f-delete">删除</el-button>
          <el-button @click="modify(scope.row,scope.$index)" type="text" class="f-add">修改</el-button>
        </template>
      </el-table-column>
      <el-empty slot="empty" :image="require('@/img/table-empty.png')" description="暂无收费项目设置,请新增"></el-empty>
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

    <!-- 删除dialog -->
    <PopUp ref="delete" class="m-popUp" width="513px">
      <img src="@/img/logOut.png" alt />
      <p>确定要删除{{projectName }}收费项目么?</p>
    </PopUp>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import PopUp from '@/components/common/dialog/PopUp.vue';
import TablePagination from '@/components/common/TablePagination.vue';
export default {
  components: {
    FormButton,
    PopUp,
    TablePagination
  },
  data() {
    return {
      currentPage: 10,
      pageSize: 10,
      total: 1,
      form: {
        // 查询区下拉框
        payItemName: '6', // 收费项目
        channel: '2' // 收费渠道
      },
      tableData: [
        // 表格
        {
          payItemName: '本地转账', // 收费项目
          channel: '个人网银', // 收费渠道
          status: '启用', // 状态
          submissionTime: '2020-12-30', // 提交时间
          effectiveTime: '2020-12-30' // 生效时间
        }
      ],
      projectName: '',
      visible: false
    };
  },

  created() {},

  mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    //收费项目详情
    handleCell(row, column, cell, event) {
      this.$router.push('/businessMangament/detail');
    },
    // 收费项目删除
    del(row, index) {
      this.projectName = row.payItemName;
      this.$refs.delete.showDialog();
    },
    // 收费项目修改
    modify(row, index) {
      this.$router.push('/businessMangament/modify');
    },
    // 收费项目添加
    add(add) {
      this.$router.push('/businessMangament/add');
      console.log(111);
    }
  }
};
</script>

<style lang='scss' scoped>
.g-business {
  background: #fff;
  min-height: 100%;
}
.g-form {
  // width: 100%;
  padding: 20px;
  display: inline-flex;
  justify-content: space-between;
  .g-project {
    margin-left: 40px;
  }
  .el-form-item {
    display: inline-flex;
    justify-content: space-between;
  }
  .el-input {
    width: 270px;
  }
  .g-btn {
    margin-left: 40px;
  }
}
/deep/ .el-table {
  width: auto;
}
.g-table {
  // padding: 0 20px;
  margin: 0 20px;
  // width: 1--
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 15%;
    left: 45%;
  }
}
.g-bolck {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 32px;
  .u-Pagination {
    margin-right: 20px;
    flex: 1;
    text-align: right;
  }
}
.el-button {
  border: 0;
  align-items: center;
}
.f-delete {
  color: #e34141;
}
.f-add {
  color: #f06b00;
}
.f-btnColor {
  color: #4181fa;
  cursor: pointer;
}

.m-popUp {
  p {
     
    font-size: 18px;
    color: #323c41;
    letter-spacing: 0;
    text-align: center;
    line-height: 26px;
    font-weight: 500;
  }
}
</style>