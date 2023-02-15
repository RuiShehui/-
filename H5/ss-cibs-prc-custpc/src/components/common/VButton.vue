<template>
  <div class="common-button">
    <el-button
      type="text"
      :class="[buttonClass, 'vbutton']"
      :disabled="disabled"
      v-bind="$attrs"
      @click="handleClick"
    >
      <slot></slot>
    </el-button>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'w160'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // heavyFlag: true, // 防重标识
    };
  },
  computed: {
    buttonClass() {
      let background = '';
      let sizeClass = '';
      switch (this.type) {
        case 'primary':
          background = 'orange';
          break;
        default:
          background = 'white';
          break;
      }
      switch (this.size) {
        case 'w70':
          //    多用于表单的  重置/查询
          sizeClass = 'w70';
          break;
        case 'w96':
          //    多用于表单的  重置/查询
          sizeClass = 'w96';
          break;
        case 'w75':
          //    多用于表单的  重置/查询
          sizeClass = 'w75';
          break;
        case 'w112':
          //    多用于表单的  重置/查询
          sizeClass = 'w112';
          break;
        case 'w120':
          //    多用于表单的  重置/查询
          sizeClass = 'w120';
          break;
        case 'w128':
          //    多用于表单的  重置/查询
          sizeClass = 'w128';
          break;
        case 'w140':
          sizeClass = 'w140';
          break;
        case 'w160':
          //    多用于页面 尾部的 双按钮
          sizeClass = 'w160';
          break;
        case 'w210':
          //    多用于结果页 单按钮
          sizeClass = 'w210';
          break;
        case 'w400':
          //    多用于结果页 单按钮
          sizeClass = 'w400';
          break;
        case 'w275':
          //    多用于结果页 单按钮
          sizeClass = 'w275';
          break;
        case 'w86':
          sizeClass = 'w86';
          break;
        case 'w290':
          sizeClass = 'w290';
          break;
        case 'w65':
          sizeClass = 'w65';
          break;
        case 'w300':
          sizeClass = 'w300';
          break;
        case 'wMin160':
          sizeClass = 'wMin160';
          break;
        case 'wMin70':
          sizeClass = 'wMin70';
          break;
        default:
          sizeClass = this.size;
          break;
      }
      return background + '-' + sizeClass;
    }
  },
  methods: {
    handleClick: _.throttle(function() {
      this.$emit('click');
    }, 300)
  }
};
</script>
<style lang="scss" scoped>
.common-button {
  .vbutton {
    box-sizing: border-box;
    font-size: 16px;
    // color: #f06b00;
    // width: 70px;
    height: 36px;
    background-image: #fff;
    border-radius: 4px;
    box-shadow: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f06b00;
    > span {
      display: inline-block;
      width: auto;
      height: 19px;
      line-height: 19px;
      letter-spacing: 1.5px;
    }
  }
  .orange-w70 {
    color: #fff;
    width: 70px;
    height: 36px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .white-w70 {
    color: #f06b00;
    width: 70px;
  }
  .orange-w96 {
    color: #fff;
    width: 96px;
    height: 36px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .orange-w75 {
    color: #fff;
    width: 75px;
    height: 36px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .orange-w128 {
    color: #fff;
    width: 128px;
    height: 36px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .orange-w290 {
    color: #fff;
    width: 290px;
    height: 44px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .white-w96 {
    color: #f06b00;
    width: 96px;
  }
  .white-w75 {
    color: #f06b00;
    width: 75px;
  }
  .orange-w160 {
    color: #fff;
    width: 160px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .orange-wMin160 {
    color: #fff;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
    min-width: 160px;
    width: auto;
    padding: 0 32px !important;
  }
  .orange-wMin70 {
    color: #fff;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
    min-width: 70px;
    width: auto;
    padding: 0 32px !important;
  }
  .white-w112 {
    color: #f06b00;
    width: 112px;
  }
  .orange-w112 {
    color: #fff;
    width: 112px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .white-w120 {
    color: #f06b00;
    width: 120px;
  }
  .orange-w120 {
    color: #fff;
    width: 120px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }

  .orange-w300 {
    color: #fff;
    width: 300px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .orange-w400 {
    color: #fff;
    width: 400;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }

  .white-w160 {
    width: 160px;
  }
  .white-wMin160 {
    min-width: 160px;
    width: auto;
    padding: 0 5px !important;
  }
  .white-w400 {
    width: 160px;
  }
  .white-w128 {
    font-size: 16px;
    letter-spacing: 0;
    width: 128px;
  }
  .white-w140 {
    width: 140px;
  }
  .white-w65 {
    width: 65px;
    height: 24px;
    border-radius: 12px;
    font-size: 12px;
    padding-right: 10px;
  }
  .white-w275 {
    width: 275px;
  }

  .orange-w210 {
    color: #fff;
    width: 210px;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .white-w210 {
    color: #f06b00;
    width: 210px;
    background-image: #fff;
  }
  .orange-wMin210 {
    color: #fff;
    min-width: 160px;
    width: auto;
    padding: 0 32px !important;
    background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
    border: none;
  }
  .white-wMin210 {
    color: #f06b00;
    min-width: 160px;
    width: auto;
    padding: 0 32px !important;
    background-image: #fff;
  }
  .el-button.vbutton:hover {
    background-image: linear-gradient(90deg, #ffc32b 0%, #fc8f28 100%);
    color: #fff;
    border: none;
  }

  .el-button.vbutton:active {
    background-image: linear-gradient(90deg, #d98d00 0%, #c95400 100%);
    color: #fff;
    border: none;
  }
  .el-button.is-disabled {
    background-color: #bfbfbf;
    border: none;
    color: rgba(255, 255, 255, 0.8);
  }
  .el-button.is-disabled:active,
  .el-button.is-disabled:hover {
    background-image: unset;
  }
}
</style>