<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-21 12:25:46
 * @LastEditTime: 2022-05-19 10:46:53
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\authorizationSelect\authors-selector.vue
-->
<template>
  <el-form-item
    class="author-selector"
    v-show="isRender"
    :label="levelLabel"
    :label-width="labelWidth"
  >
    <el-select
      class="select-list"
      v-model="checkedValue"
      :multiple="true"
      @change="onCheckedValueChange"
    >
      <el-option
        v-for="(item, index) of origin"
        :key="`${index} ${item.cardNo}`"
        :label="item.userEglsName"
        :value="item.userEglsName"
        :disabled="checkedValue.length >= limit"
      />
    </el-select>
    <span
      type="text"
      v-show="isShowClose"
      :class="['close-btn', isShowClose ? 'fade-enter' : '']"
      @click="clearShowData"
    >
      &times;
    </span>
  </el-form-item>
</template>

<script>
export default {
  name: 'AuthorSelector',
  model: {
    prop: 'levelList',
    event: 'setLevelList'
  },
  props: {
    /** 是否渲染当前组件 */
    isRender: Boolean,
    /** 选项是否能被清空 */
    clearable: Boolean,
    /** 限制选择的人数 */
    limit: {
      type: Number,
      default: 0
    },
    /** 当前级别 */
    levelList: {
      type: Array,
      default() {
        return [];
      }
    },
    /** 当前级别显示内容 */
    levelLabel: {
      type: String,
      default: 'X级: '
    },
    /** 当前级别显示长度 */
    labelWidth: {
      type: String,
      default: '160px'
    },
    /** 当前级别列表的遍历数组 */
    origin: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checkedValue: []
    };
  },
  computed: {
    isShowClose() {
      return this.clearable && this.checkedValue.length;
    }
  },
  // watch: {
  //   checkedValue(newVal, oldVal) {
  //     if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
  //       this.onCheckedValueChange(newVal);
  //     }
  //   }
  // },
  mounted() {
    this.$set(this, 'checkedValue', this.levelList);
    this.onCheckedValueChange(this.checkedValue);
  },
  methods: {
    onCheckedValueChange(userEglsNameList) {
      /** 2022-05-17 update: 不能直接上送收款人姓名, 需要将整个对象上送给后端判断邮箱和姓名 */
      const totalList = userEglsNameList.map(userEglsName =>
        this.origin.find(item => item.userEglsName === userEglsName)
      );
      this.$emit('setLevelList', totalList);
    },
    clearShowData() {
      this.checkedValue = [];
    }
  }
};
</script>

<style scoped lang="scss">
.author-selector {
  position: relative;

  .select-list {
    ::v-deep .el-input {
      width: 320px;
    }
  }

  .close-btn {
    color: #f06b00;
    margin: 0 5px;
    position: absolute;
    top: 0;
    right: 40%;
    transition: display 0.3s;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 18px;
    z-index: 10;
    border-radius: 25%;
    // border: 1px solid #3e3e3e;

    &.fade-enter {
      font-weight: 500;

      &:hover {
        font-weight: 600;
      }
    }
  }
}
</style>
