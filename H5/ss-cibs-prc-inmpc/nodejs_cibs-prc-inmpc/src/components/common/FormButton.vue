<!--
 * @Author: zhangcheng
 * @Date: 2021-11-04 20:45:07
 * @LastEditTime: 2022-03-21 10:22:54
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\common\FormButton.vue
-->

<template>
  <div class="form-button">
    <el-button
      v-if="showQuery"
      class="query"
      type="primary"
      @click="handleSubmit"
    >{{$t(`COMMON.SEARCH`)}}</el-button>
    <el-button v-if="showReset" class="reset" @click="handleReset">{{$t(`COMMON.RESET`)}}</el-button>
    <el-button
      v-if="showAdd"
      class="add"
      icon="el-icon-plus"
      @click="handleAdd"
    >{{$t(`COMMON.ADD`)}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'FormButton',
  props: {
    // 父级表单的ref对象
    formRef: {
      type: Object
    },
    showQuery: {
      type: Boolean,
      default: true
    },
    showReset: {
      type: Boolean,
      default: true
    },
    showAdd: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * 重置父级表单
     */
    handleReset() {
      this.$emit('handleReset');
    },

    //查询
    handleSubmit() {
      this.$emit('submit');
    },

    //新增
    handleAdd() {
      this.$emit('add');
    }
  }
};
</script>

<style lang="scss" scoped>
.form-button {
  width: 302px;
  .query,
  .reset,
  .add {
    width: 90px;
    height: 40px;
    font-size: 16px;
    font-weight: 400;
     
    border: 1px solid;
    border-radius: 4px;
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
}
</style>
