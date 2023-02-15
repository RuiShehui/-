<template>
  <div class="authorization-select">
    <divider :title="$t('RIGHTS_TEMPLATE.AUTHORIZATION_REMINDER')" class="mb20 pt8">
      <span class="f12 gray3">{{$t('RIGHTS_TEMPLATE.AUTHORIZATION_EMAIL')}}</span>
    </divider>
    <el-form-item :label="$t('RIGHTS_TEMPLATE.AUTHORIZATION_PERSONS')+':'" :label-width="labelWidth">
      <el-checkbox-group v-model="remindNameList">
        <el-checkbox label="A">
          {{$t('RIGHTS_TEMPLATE.A_LEVEL')}}
          <span v-if="AlevelList.length>0">({{AlevelList.length}}{{$t('RIGHTS_TEMPLATE.APPROVED_PERSON')}})</span>
        </el-checkbox>
        <el-checkbox label="B">
          {{$t('RIGHTS_TEMPLATE.B_LEVEL')}}
          <span v-if="BlevelList.length>0">({{BlevelList.length}}{{$t('RIGHTS_TEMPLATE.APPROVED_PERSON')}})</span>
        </el-checkbox>
        <el-checkbox label="C">
          {{$t('RIGHTS_TEMPLATE.C_LEVEL')}}
          <span v-if="ClevelList.length>0">({{ClevelList.length}}{{$t('RIGHTS_TEMPLATE.APPROVED_PERSON')}})</span>
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('RIGHTS_TEMPLATE.A_LEVEL')+':'" :label-width="labelWidth" v-if="checkIsSelectA">
      <el-select v-model="AlevelList" multiple :placeholder="$t('COMMON.PLEASE_SELECT')" @change="selectLevel">
        <el-option v-for="item in optionAlevel" :key="item.value" :label="item.name" :value="item">
          <!-- <el-checkbox v-model="item.isCheck" @click="handleCheckBox(val,item)">
            <span>{{item.name}}</span>
          </el-checkbox>-->
        </el-option> 
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('RIGHTS_TEMPLATE.B_LEVEL')+':'" :label-width="labelWidth" v-if="checkIsSelectB">
      <el-select v-model="BlevelList" multiple :placeholder="$t('COMMON.PLEASE_SELECT')" @change="selectLevel">
        <el-option v-for="item in optionBlevel" :key="item.value" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('RIGHTS_TEMPLATE.C_LEVEL')+':'" :label-width="labelWidth" v-if="checkIsSelectC">
      <el-select v-model="ClevelList" :placeholder="$t('COMMON.PLEASE_SELECT')" @change="selectLevel">
        <el-option v-for="item in optionClevel" :key="item.value" :label="item.name" :value="item"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: '160px'
    },
    authInfo: {
      type: Object
      // default: {}
    }
  },
  data() {
    return {
      remindNameList: [],
      optionAlevel: [
        { value: '000', name: 'Ghost', isCheck: false },
        { value: '002', name: 'Chovy', isCheck: false }
      ],
      optionBlevel: [
        { value: '000', name: 'Faker' },
        { value: '002', name: 'Khan' }
      ],
      optionClevel: [
        { value: '000', name: 'Faker' },
        { value: '002', name: 'Khan' }
      ],
      AlevelList: [],
      BlevelList: [],
      ClevelList: [],
      formCheck:[],
    };
  },
  created() {
    console.log(this.authInfo);
    if (this.authInfo && JSON.stringify(this.authInfo) != '{}') {
      this.AlevelList = this.authInfo.AlevelList;
      this.BlevelList = this.authInfo.BlevelList;
      this.ClevelList = this.authInfo.ClevelList;
       if (this.AlevelList.length > 0) {
        this.remindNameList.push('A');
      }
      if (this.BlevelList.length > 0) {
        this.remindNameList.push('B');
      }
      if (this.ClevelList.length > 0) {
        this.remindNameList.push('C');
      }
      
    }
  },
  computed: {
    checkIsSelectA() {
      if (this.remindNameList.indexOf('A') > -1) {
        return true;
      } else {
        return false;
      }
    },
    checkIsSelectB() {
      if (this.remindNameList.indexOf('B') > -1) {
        return true;
      } else {
        return false;
      }
    },
    checkIsSelectC() {
      if (this.remindNameList.indexOf('C') > -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    selectLevel(val) {
      // this.optionAlevel.forEach(v => {
      //   v.isCheck = false;
      // });
      // val.forEach(el => {
      //   this.optionAlevel.forEach(v => {
      //     console.log(el,'el')
      //     console.log(v,'v')
      //     if (el.value == v.value) {
      //       v.isCheck = true;
      //     }
      //   });
      // });
      let levelInfo = {
        AlevelList: this.AlevelList,
        BlevelList: this.BlevelList,
        ClevelList: this.ClevelList
      };
      console.log(this.AlevelList, this.BlevelList, this.ClevelList);
      this.$emit('checkClick', levelInfo);
    }
  },
  handleCheckBox(val, item) {
    // console.log(val, 'val');
    // if (val) {
    //   this.formCheck.push(item.value)
    // }else{
    //   let index =this.formCheck.findIndex((el)=>  el.value ===item.value)
    //   this.formCheck.splice(index)
    // }
    // console.log(item, 'item');
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 650px;
  margin-left: 25%;
  margin-right: auto;
  margin-bottom: 16px;
  .el-checkbox-group {
    /deep/ .el-checkbox {
      color: rgba(0, 0, 0, 0.85);
      white-space: inherit;
      padding-top: 10px;
      padding-left: 12px;
      margin-right: 20px;
      .el-checkbox__label {
        max-width: 266px;
        word-break: break-all;
        // padding: 9px 0 8px 8px;
        // vertical-align: top;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
/deep/ .el-checkbox {
  padding: 0;
}
/deep/ .el-select > .el-input {
  width: 320px;
}
/deep/.el-select .el-tag__close.el-icon-close {
  color: #8c8c8c;
  background-color: transparent;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.el-select-dropdown__item:hover {
  background-color: rgba(240, 107, 0, 0.06);
}
.pt8 {
  padding-top: 8px;
}
</style>