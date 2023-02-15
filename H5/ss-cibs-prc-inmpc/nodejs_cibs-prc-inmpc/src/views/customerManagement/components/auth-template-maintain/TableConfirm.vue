<!--
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:50:10
 * @LastEditTime: 2022-07-06 17:49:28
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\auth-template-maintain\TableConfirm.vue
-->
<template>
  <div>
    <el-form>
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')" class="g-formitem">
        <el-input
          v-model="modelFrom.modelName"
          disabled
          class="f-w-300"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('CUSTOMER_MANAGEMENT.MODEL_TYPE')"
        class="g-formitem"
      >{{ modelFrom.modelType | modelType }}</el-form-item>
    </el-form>
    <el-table
      :data="modelFrom.amuntUserList"
      class="m-t-18"
      stripe
      :border="true"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column
        v-if="modelFrom.modelType === '1'"
        width="420"
        :label="$t('CUSTOMER_MANAGEMENT.MONEY_INTERVAL_HKD')"
      >
        <template slot-scope="scope">
          <div class="g-money">
            <el-input
              class="f-w-120"
              disabled
              :value="moneyFormat(scope.row.amountStart)"
              size="mini"
            />
            <div class="text">
              <span>&lt;</span>
              <span>{{$t('CUSTOMER_MANAGEMENT.MONEY')}}</span>
              <span>≤</span>
            </div>
            <el-input
              class="f-w-150"
              disabled
              :value="moneyFormat(scope.row.amountEnd)"
              size="mini"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
        <template slot-scope="scope">
          <el-input v-model="scope.row.levelANumber" disabled size="mini" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
        <template slot-scope="scope">
          <el-input v-model="scope.row.levelBNumber" disabled size="mini" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
        <template slot-scope="scope">
          <el-input v-model="scope.row.levelCNumber" disabled size="mini" />
        </template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div v-if="!isDetail" class="g-bottom">
      <el-button class="f-cancel" @click="backChange">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>
    <div v-if="isDetail" class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import { moneyFormat } from '@/utils/tools';
export default {
  name: 'authTemplateMaintainConfirm',
  props: {
    modelFrom: {
      type: Object,
      default: () => ({
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
      })
    },
    isDetail: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  filters,
  data() {
    return {};
  },
  methods: {
    moneyFormat,
    back() {
      this.$emit('back');
    },
    submit() {
      this.$emit('submitData');
    },
    backChange() {
      this.$emit('backChange');
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 50%;
  }
}
.f-w-120 {
  width: 120px;
}
.f-w-150 {
  width: 150px;
}
.f-w-300 {
  width: 300px;
}
.g-money {
  display: flex;
  align-items: center;
  .text {
    margin: 0 10px;
    display: flex;
    width: 76px;
    align-items: center;
    span:nth-of-type(2) {
      margin: 0 15px;
    }
  }
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
.m-t-18 {
  margin-top: 18px;
}
</style>