<!--
 * @Author: ZhangZhen
 * @Date: 2022-01-04 15:22:54
 * @LastEditTime: 2022-08-17 09:47:05
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\op-logs\index.vue
-->
<template>
  <div class="contain">
    <div v-show="!showDetail">
      <el-form
        ref="searchForm"
        class="g-form transverse-form"
        :model="formData"
        :rules="formRules"
        label-width="auto"
      >
        <!-- 操作员角色 -->
        <el-form-item prop="roleName" :label="$t(`OP_LOGS.OP_ROLE`)">
          <el-select
            class="g-w-270"
            v-model="formData.roleName"
            :placeholder="
            $t(`COMMON.PLEASE_SELECT`)
          "
          >
            <el-option
              v-for="item in roleNameList"
              :key="item.roleCode"
              :value="item.roleName"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 操作员用户名-->
        <el-form-item prop="userName" :label="$t(`OP_LOGS.OP_NAME`)">
          <el-input
            class="g-w-270"
            v-model="formData.userName"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
            maxlength="200"
          />
        </el-form-item>
        <!-- 客户号 -->
        <!-- <el-form-item prop="cstmNo" :label="$t(`OP_LOGS.CSTNO`)">
        <el-input
          class="g-w-270"
          v-model="formData.cstmNo"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          maxlength="200"
        />
        </el-form-item>-->
        <!-- 客户名称 -->
        <!-- <el-form-item prop="cstmName" :label="$t(`OP_LOGS.CSTNAME`)">
        <el-input
          class="g-w-270"
          v-model="formData.cstmName"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          maxlength="200"
        />
        </el-form-item>-->
        <!-- 系统模块 -->
        <el-form-item prop="moduleId" :label="$t(`OP_LOGS.SYSTEM_MOUDULE`)">
          <el-select
            class="g-w-270"
            v-model="formData.moduleId"
            clearable
            :placeholder="
            $t(`COMMON.PLEASE_SELECT`)
          "
          >
            <el-option
              v-for="item in modulesList"
              :key="`${item.value}-${item.label}`"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- 功能 -->
        <el-form-item prop="abilityId" :label="$t(`OP_LOGS.FUNCTION_UNIT_DATA`)">
          <el-select
            class="g-w-270"
            v-model="formData.abilityId"
            clearable
            filterable
            :placeholder="
            $t(`COMMON.PLEASE_SELECT`)
          "
          >
            <el-option
              v-for="item in bizCodeList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 操作类型 -->
        <!-- <el-form-item prop="type" :label="$t(`OP_LOGS.OPERATION_TYPE`)">
        <el-select
          class="g-w-270"
          v-model="formData.type"
          clearable
          :placeholder="
            $t(`COMMON.PLEASE_SELECT`)
          "
        >
          <el-option
            v-for="item in operationTypeList"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        </el-form-item>-->
        <!-- 操作状态 -->
        <!-- <el-form-item prop="status" :label="$t(`OP_LOGS.OPERATION_STATUS`)">
        <el-select
          class="g-w-270"
          v-model="formData.status"
          clearable
          :placeholder="
            $t(`COMMON.PLEASE_SELECT`)
          "
        >
          <el-option
            v-for="item in operationStatusList"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        </el-form-item>-->
        <!-- 错误代码 -->
        <!-- <el-form-item prop="errorCode" :label="$t(`OP_LOGS.ERROR_CODE`)">
        <el-input
          class="g-w-270"
          v-model="formData.errorCode"
          :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          maxlength="200"
        />
        </el-form-item>-->
        <!-- </el-form> -->
        <!-- <el-form class="g-form-operation" ref="formRef"> -->
        <!-- 操作时间 -->
        <el-form-item prop="timeSpan" :label="$t(`OP_LOGS.OPERATION_DATE_SYMBOL`)">
          <el-date-picker
            class="g-w-270"
            v-model="formData.timeSpan"
            type="daterange"
            align="right"
            :unlink-panels="true"
            :clearable="false"
            :range-separator="$t(`OP_LOGS.TO`)"
            :start-placeholder="
            $t(`COMMON.START_DATE`)
          "
            :end-placeholder="
            $t(`COMMON.END_DATE`)
          "
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item label=" ">
          <div style="width:270px;">
            <div style="display:flex;float:right;">
              <el-button class="reset" @click="handleReset">{{ $t(`COMMON.RESET`) }}</el-button>
              <el-button
                class="query"
                type="primary"
                @click="handleClickSearch"
              >{{ $t(`COMMON.SEARCH`) }}</el-button>
              <!-- <el-button class="add" @click.stop="handleDownLoad">{{ $t('COMMON.DOWNLOAD_TEMPLATE') }}</el-button> -->
            </div>
          </div>
        </el-form-item>
      </el-form>

      <el-table
        height="550px"
        class="g-table"
        :data="tableData"
        stripe
        :header-cell-style="{background: '#f3f3f3',color: '#000',fontSize: '14px'}"
      >
        <!-- 参考编号 -->
        <el-table-column type="index" :label="$t(`OP_LOGS.REFER_NUMBER`)" width="80"></el-table-column>
        <!-- 操作员角色 -->
        <el-table-column prop="roleName" :label="$t(`OP_LOGS.OP_ROLE_DATA`)" width="220"></el-table-column>
        <!-- 操作员用户名 -->
        <el-table-column prop="userName" :label="$t(`OP_LOGS.OP_NAME_DATA`)" width="200"></el-table-column>
        <!-- 客户号 -->
        <!-- <el-table-column prop="cstmNo" :label="$t(`OP_LOGS.CSTNO_DATA`)" width="210"></el-table-column> -->
        <!-- 客户名称 -->
        <!-- <el-table-column prop="cstmName" :label="$t(`OP_LOGS.CSTNAME_DATA`)" width="210"></el-table-column> -->
        <!-- 系统模块 -->
        <el-table-column prop="module" :label="$t(`OP_LOGS.SYSTEM_MOUDULE_DATA`)" width="200"></el-table-column>
        <!-- 交易类型 -->
        <el-table-column prop="ability" :label="$t(`OP_LOGS.FUNCTION_UNIT_DATA`)"></el-table-column>
        <!-- 操作类型 -->
        <el-table-column prop="type" :label="$t(`OP_LOGS.OPERATION_TYPE_DATA`)" width="140">
          <template v-slot="{row}">{{ operationTypeListFilter(row.type) }}</template>
        </el-table-column>
        <!-- 操作内容 -->
        <!-- <el-table-column prop="rspData" :label="$t(`OP_LOGS.OPERATE_CONTENT`)" width="140"></el-table-column> -->
        <!-- ip地址 -->
        <el-table-column prop="ip" width="140" :label="$t(`OP_LOGS.OPERATE_ADRESS`)"></el-table-column>
        <!-- 操作状态 -->
        <!-- <el-table-column prop="status" :label="$t(`OP_LOGS.OPERATION_STATUS_DATA`)" width="140">
        <template v-slot="{row}">{{ operationStatusListFilter(row.status) }}</template>
        </el-table-column>-->
        <!-- 错误代码 -->
        <!-- <el-table-column prop="errorCode" :label="$t(`OP_LOGS.ERROR_CODE_DATA`)" width="140"></el-table-column> -->
        <!-- 错误原因 -->
        <!-- <el-table-column prop="errorStack" :label="$t(`OP_LOGS.ERROR_REASON`)" width="140">
        <template v-slot="{ row }">
          <span class="m-error-tag">{{ row.errorStack }}</span>
        </template>
        </el-table-column>-->
        <!-- 操作时间 -->
        <el-table-column prop="createTime" :label="$t(`OP_LOGS.OPERATE_TIME`)" width="240"></el-table-column>
        <el-table-column fixed="right" label="詳情" width="140">
          <template v-slot="{row}">
            <div
              v-if="row.moduleId !== 'LOGIN' && row.moduleId !== 'LOGOUT'"
              @click="toDetail(row)"
              style="color: #4181fa;cursor: pointer;"
            >詳情</div>
          </template>
        </el-table-column>
        <!-- 备注 1-->
        <!-- <el-table-column prop :label="$t(`OP_LOGS.TIPS`)" width="140"></el-table-column> -->
        <div slot="empty" class="g-empty">
          <img src="../../img/table-empty.png" alt />
        </div>
      </el-table>
      <div class="g-bolck">
        <el-pagination
          :background="true"
          :current-page.sync="requestPageInfo.current"
          :page-size="requestPageInfo.size"
          :total="requestPageInfo.total"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="sizes,total,prev,pager,next,jumper"
          @size-change="handleChangePageInfo($event, 'size')"
          @current-change="handleChangePageInfo($event, 'current')"
        />
      </div>
    </div>
    <Detail v-if="showDetail" :tableData="detailData" @back="back" />
  </div>
</template>

<script>
import _ from 'lodash';
import CONSTANTS from '@/utils/constant';
import { getLogsList, queryRoleList } from '@/api/statiscal-query';
// import {
//   getAuthorizationList,
//   getAuthorizationDetail,
//   empower
// } from '@/api/authorization-center';
// import { findUserInfoFromDropDownBox } from '@/api/user-management';
// import { getRoleDetail, removeToken, removeRoleDetail } from '@/utils/user';
import {
  // downloadFile,
  getPrueObject
} from '@/utils/tools';
// import { downloadTemplate } from '@/api/addition';
import { get90TimeSpan, isOverday } from './tools';
import Detail from './components/detail';

const {
  BIZ_CODE_TYPE_LIST,
  OPERATE_ROLE_LIST,
  SYSTEM_MODULES_LIST,
  OPERATION_TYPE_LIST,
  OPERATTION_STATUS_LIST
} = CONSTANTS;

export default {
  name: 'OpLogs',
  components: {
    Detail
  },
  data() {
    return {
      /** 请求参数 (从左到右排列) */
      formData: {
        roleName: '', // 操作员角色
        userName: '', // 操作员用户名
        cstmNo: '', // 客户号
        cstmName: '', // 客户名称
        moduleId: '', //系统模块
        abilityId: '', // 功能类型
        // type: '', // 操作类型
        // status: '', // 操作状态
        // errorCode: '', // 错误码
        // beginTime & createTime
        timeSpan: get90TimeSpan()
      },
      /** request-page-info */
      requestPageInfo: {
        current: 1,
        size: 10,
        total: 0
      },
      bizCodeList: BIZ_CODE_TYPE_LIST, // 功能类型数组
      roleNameList: OPERATE_ROLE_LIST, // 操作员角色数组
      modulesList: SYSTEM_MODULES_LIST, // 系统模块美剧
      operationTypeList: OPERATION_TYPE_LIST, // 操作类型数组
      operationStatusList: OPERATTION_STATUS_LIST, // 成功/失败列表
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 3 * 365 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      tableData: [],
      showDetail: false,
      detailData: {}
    };
  },
  computed: {
    /** 限制查询的规则 */
    formRules() {
      return {
        timeSpan: {
          validator: (r, val, cb) => {
            if (isOverday(val, 90)) {
              cb(new Error(this.$t('COMMON.QUERY_INTERVAL')));
            }
            cb();
          }
        }
      };
    },
    /** 查询的form实例 */
    searchForm() {
      const { searchForm } = this.$refs;
      return searchForm || null;
    },
    /** 请求参数 */
    requestParams() {
      const _formData = _.cloneDeep(this.formData),
        _requestPageInfo = _.cloneDeep(this.requestPageInfo);
      const [beginTime, endTime] = this.formData.timeSpan;

      _formData.beginTime = beginTime;
      _formData.endTime = endTime;
      delete _formData.timeSpan;

      delete _requestPageInfo.total;

      const requestParams = {
        ..._formData,
        ..._requestPageInfo
      };

      return getPrueObject(requestParams);
    }
  },
  async mounted() {
    await this.queryRoleList();
    this.handleSearch(this.requestParams);
  },
  methods: {
    back() {
      this.showDetail = false;
    },
    // 获取操作员列表
    async queryRoleList() {
      const result = await queryRoleList();
      console.log(result, 'result');
      if (result.body) {
        this.roleNameList = result.body;
      }
    },
    operationTypeListFilter(val) {
      if (val) {
        return this.operationTypeList[Number(val) + 1].label;
      }
    },
    operationStatusListFilter(val) {
      if (val) {
        return this.operationStatusList[Number(val) + 1].label;
      }
    },
    // init-time-span
    // 查询
    handleClickSearch() {
      this.searchForm.validate(valid => {
        if (valid) {
          this.resetPageInfo();
          this.handleSearch();
        } else {
          this.$showMsg({
            type: 'error',
            message: this.$t('COMMON.CHECK_FAIL')
          });
        }
      });
    },
    async handleSearch(params = this.requestParams) {
      try {
        const { body } = await getLogsList(params);
        if (Object.getOwnPropertyNames(body).length > 0) {
          this.setPageInfo(body);
          this.setTableData(body);
        }
      } catch (err) {
        this.$showMsg({
          type: 'error',
          message: err
        });
      }
    },
    resetPageInfo() {
      this.setPageInfo({
        current: 1,
        size: 10,
        total: 0
      });
    },
    setPageInfo({ current = 1, size = 10, total = 0 }) {
      this.$set(this.requestPageInfo, 'current', current);
      this.$set(this.requestPageInfo, 'size', size);
      this.$set(this.requestPageInfo, 'total', total);
    },
    setTableData({ records = [] }) {
      this.$set(this, 'tableData', records);
    },
    /**
     * 页码信息变化
     * @param {number} value update's value
     * @param {'current'|'size'} prop update's prop
     */
    handleChangePageInfo(value, prop) {
      this.requestPageInfo[prop] = value;
      this.handleSearch();
    },
    // 重置父级表单
    handleReset() {
      console.log(this.searchForm, this.formData);
      this.searchForm.resetFields();
    },
    //导出表格 (需求上暂无)
    handleDownLoad() {},
    toDetail(row) {
      this.detailData = row;
      console.log(this.detailData, 'this.detailData');
      this.showDetail = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  min-height: 100%;
  box-sizing: border-box;
  background: #fff;
}
.g-w-270 {
  width: 270px;
}
.g-form-operation {
  // padding: 20px;
  display: inline-flex;
  justify-content: space-between;
  .g-project {
    margin-left: 20px;
  }
  .el-form-item {
    display: inline-flex;
    justify-content: space-between;
  }
  .g-btn {
    margin-left: 100px;
  }
}
.g-table {
  width: auto;
  margin-top: 20px;
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 25%;
    left: 48%;
  }
}
.g-bolck {
  margin-top: 10px;
  text-align: right;
}
.el-button {
  border: 0;
  align-items: center;
}
.f-refuse {
  color: #e34141;
  text-align: left;
}
.f-adopt {
  color: #f06b00;
  text-align: left;
}
.u-btnColor {
  color: blue;
  text-align: left;
  width: 290px;
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 20px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.query,
.reset,
.add {
  width: 90px;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
   
  border: 1px solid;
  border-radius: 4px;
  box-sizing: border-box;
}

.query {
  background: #f06b00;
  border-color: #f06b00;
  color: #ffffff;
}
.reset {
  margin-left: 16px;
  border-color: #000000 45%;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
}
.add {
  margin-left: 16px;
  border-color: #f06b00;
  color: #f06b00;
}

.m-error-tag {
  // color: red;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
