<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 09:18:24
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-12 15:44:28
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\mechanism\index.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <el-form class="transverse-form" label-width="auto" ref="formRef">
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_CODE_SYMBOL`)">
        <el-input v-model="depCode" maxlength="9" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_NAME_SYMBOL`)">
        <el-input v-model="depName" maxlength="100" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button style="float:right" @add="add" @submit="search" @handleReset="handleReset"></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      class="g-table"
      :data="tableData"
      row-key="depCode"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column width="90" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column min-width="270" prop="depName" :label="$t(`GROUP_MANAGEMENT.GROUP_NAME`)"></el-table-column>
      <el-table-column min-width="230" prop="depCode" :label="$t(`GROUP_MANAGEMENT.GROUP_CODE`)">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.depCode }}</div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="190"
        prop="depClazzName"
        :label="$t(`GROUP_MANAGEMENT.GROUP_LEVEL`)"
      ></el-table-column>
      <!-- <el-table-column
        :label="$t(`GROUP_MANAGEMENT.GROUP_STATUS`)"
        
      >
        <template slot-scope="scope">{{
          scope.row.depStatus == 1 ? '启用' : '停用'
        }}</template>
      </el-table-column>-->
      <el-table-column :label="$t(`COMMON.OPERATION`)" min-width="120" fixed="right">
        <template slot-scope="scope">
          <div class="f-span-btns">
            <span @click="del(scope.row)">{{ $t(`COMMON.DELETE`) }}</span>
            <span @click="modify(scope.row)">{{ $t(`COMMON.UPDATE`) }}</span>
          </div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="../../img/table-empty.png" alt />
        <span>{{ $t(`GROUP_MANAGEMENT.DATA_NULL_PROMPT`) }}</span>
      </div>
    </el-table>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
// import TablePagination from '@/components/common/TablePagination.vue';
import {
  findOrganizationListInfo,
  findOrganizationInfo,
  removeOrganizationInfo
} from '@/api/mechanism/index.js';
import CONSTANTS from '@/utils/constant';
import { formatTreeData } from '@/utils/tools.js';

export default {
  components: {
    FormButton,
    // TablePagination,
    CONSTANTS
  },

  data() {
    return {
      depCode: '', //机构编号
      depName: '', //机构名称
      tableData: [], //保存列表数组
      // currentPage: 1,
      // pageSize: 10,
      // total: 1,
      form: {
        payItemName: '6',
        channel: '2'
      },
      visible: false,
      groupObject: {} //保存点击的机构对象
    };
  },

  created() {},

  mounted() {
    let self = this;
    self.search();
  },

  methods: {
    //查询
    search() {
      let self = this;
      self.tableData = [];
      let params = {
        depCode: self.depCode,
        depName: self.depName
      };
      findOrganizationListInfo(params).then(resp => {
        if (resp.body) {
          resp.body.forEach(item => {
            item.depClazzName = CONSTANTS.GROUPCLAZZ[item.depClazz];
          });
          self.tableData = formatTreeData(resp.body, 'depCode', 'pDepCode');
        }
      });
    },

    //重置
    handleReset() {
      let self = this;
      self.depCode = '';
      self.depName = '';
      // self.search();
    },

    //详情
    handleCell(row) {
      findOrganizationInfo({ depCode: row.depCode }).then(resp => {
        if (resp.body) {
          this.$router.push({
            path: '/mechanism/ditail',
            query: resp.body[0]
          });
        }
      });
    },
    //删除
    del(row) {
      // console.log("打印row", row)
      if (row.children && row.children.length > 0) {
        // return this.$showMsg.error('该机构下有子机构，无法删除！');
        return this.$showMsg({
          message: this.$t('GROUP_MANAGEMENT.GROUP_SUBSIDIARY_BODIES'),
          type: 'error'
        });
      }
      this.groupObject = row;
      this.$showBox({
        content: this.$t('GROUP_MANAGEMENT.DELETE_TIPS'),
        confirm: () => {
          this.deleteGroup();
        }
      });
      this.$refs.delete.showDialog();
    },
    //确定删除
    deleteGroup() {
      removeOrganizationInfo({ depCode: this.groupObject.depCode }).then(
        resp => {
          if (resp.body) {
            this.$showMsg({
              type: 'success',
              message: this.$t('GROUP_MANAGEMENT.DELETE_GROUP_SUCCESS')
            });
            this.search();
          }
        }
      );
    },

    //编辑
    modify(row) {
      findOrganizationInfo({ depCode: row.depCode }).then(resp => {
        if (resp.body) {
          if (resp.body[0].linkPhone) {
            let phoneList = resp.body[0].linkPhone.split('-');
            resp.body[0].coreNumber = phoneList[0];
            resp.body[0].liasPhone = phoneList[1];
          }
          this.$router.push({
            path: '/mechanism/edit',
            query: resp.body[0]
          });
        }
      });
    },
    //新增
    add() {
      this.$router.push('/mechanism/add');
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
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
  float: right;
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
    margin-left: 10px;
    color: #f06b00;
  }
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
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
// /deep/ .el-table__body-wrapper {
//   height: 650px;
//   overflow-y: auto;
// }
</style>
