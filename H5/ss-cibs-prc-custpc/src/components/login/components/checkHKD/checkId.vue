<template>
  <div class="m-checkId" v-loading="loading">
    <p class="u-title">{{$t('FIRST_LOGIN.CRAD_CODE_SIX')}}</p>
    <div class="u-content">
      <div class="u-hkdId">
        <div v-for="(item,index) in maskedID" :key="index">
          <!-- <el-input  type="text" v-model="hkdOne[index]" :disabled="flag[index]"></el-input> -->
          {{maskedID[index]}}
        </div>
      </div>
      <div class="u-inputNum">
        <p class="u-tips">
          <img src="@/images/common/chuangxing.png" />{{$t('FIRST_LOGIN.NUMBER_KEY')}}
        </p>
        <div class="u-calaor">
          <el-button
            class="u-btn"
            v-for="(item,index) in buttons"
            :key="index"
            @click="traceNumber"
          >{{item}}</el-button>
          <!-- <el-button class="u-btn" :disabled="true"></el-button> -->
          <el-button class="u-btn" style="margin-left: 103px;" @click="traceNumber">0</el-button>
          <el-button class="u-callback" @click="reset">{{$t('FIRST_LOGIN.BACK_ONE_STEPS')}}</el-button>
          <!-- <div v-for="(item,index) in buttons" :key="index">{{item}}</div> -->
        </div>
      </div>
    </div>
    <div class="u-btns">
      <VButton size="w160" @click="clear">{{$t('FIRST_LOGIN.CLEAR')}}</VButton>
      <VButton size="w160" type="primary" style="margin-left:12px;" @click="confirm">{{$t('COMMON.CONFIRM')}}</VButton>
    </div>
  </div>
</template>

<script>
import { checkHKIDCode4Login } from '@/api/login.js';
export default {
  data() {
    return {
      buttons: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      hkdOne: [],
      maskedID: ['*', '*', '*', '*', '*', '*'],
      flag: [true, true, true, true, true, true],
      hkidcode: '',
      formData: {},
      loading:false
    };
  },
  computed: {},
  created() {
    let maskedID = sessionStorage.getItem('maskedID');
    this.hkidcode = maskedID; //下标数组
    let id = this.hkidcode.split(',');
    console.log(id, 'id');

    for (let i = 0; i < id.length; i++) {
      this.maskedID.splice(id[i], 1, '');
    }
  },
  methods: {
    traceNumber(val) {
      const btnText = val.target.textContent;

      let id = this.maskedID;

      let arr = [];
      for (let i = 0; i < id.length; i++) {
        if (id[i] == '') {
          arr.push(i);
        }
      }
      if (arr.length > 0) {
        this.$set(this.maskedID, arr[0], btnText);
      }
      console.log(this.maskedID, 'arrr');
    },
    confirm() {
      this.loading=true
      let arr = [];
      let id = this.maskedID;
      let hkidcode = this.maskedID.join('');
      let hkidFlow = sessionStorage.getItem('hkidflow');

      let params = {
        hkidFlow: hkidFlow,
        hkidcode: hkidcode
      };
      checkHKIDCode4Login(params).then(res => {
        // this.formData=res
        if (res.result) {
          let message = {
            status: 'success',
            title:this.$t('LOGON.VERIFICATION_SUCCESS'),
            desc: this.$t('LOGON.LOGIN_VERFICATION_S'),
          };
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('state', true)
          // sessionStorage.setItem('custNo', res.userInfo.custNo);
          //  this.$store.dispatch('getUserMenus');
          //  dispatch('getUserMenus');
          // this.$emit('next', message)
          this.$store.dispatch('app/getUserMenus');
          this.loading=false
        } else {
          let message = {
            status: 'fail',
            title:this.$t('LOGON.VERIFICATION_FAIL'),
            desc: this.$t('LOGON.LOGIN_VERFICATION_F'),
          };
           this.loading=false
          this.$emit('next', message);
        }
      }).catch(()=>{
        this.loading=false
      })
    },
    reset() {
      let id = this.maskedID;
      let arr = [];
      for (let i = 0; i < id.length; i++) {
        if (id[i] !== '*' && id[i] !== '') {
          arr.push(i);
        }
      }
      if (arr.length > 0) {
        this.$set(this.maskedID, arr[arr.length - 1], '');
      }
      // console.log(this.maskedID, 'ID');
    },
    clear() {
      let id = this.maskedID;
      let arr = [];
      for (let i = 0; i < id.length; i++) {
        if (id[i] !== '*') {
          arr.push(i);
        }
      }
      if (arr.length > 0) {
        this.$set(this.maskedID, arr[0], '');
        this.$set(this.maskedID, arr[1], '');
        this.$set(this.maskedID, arr[2], '');
      }
      console.log(this.maskedID, 'ID');
    }
  }
};
</script>

<style lang="scss" scoped>
.m-checkId {
  width: 336px;
  margin: 0 auto;
}
.u-title {
  margin-top: 54px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}
.u-hkdId {
  display: flex;
  margin-top: 24px;
  width: 295px;
  height: 40px;

  div {
    font-size: 20px;
    text-align: center;
    line-height: 48px;
    width: 50px;
    border: 1px solid #d9d9d9;
  }
  &:nth-child(0) {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
}
.u-inputNum {
  margin-top: 12px;
  width: 300px;
  height: 215px;
  background: #f8f8f8;
  .u-tips {
    display: flex;
    align-content: center;
    justify-content: center;
    padding-top: 8px;
    font-size: 12px;
    color: #8c8c8c;
    img {
      height: 16px;
      width: 16px;
    }
  }
  .u-calaor {
    display: flex;
    flex-wrap: wrap;
    padding: 4px;
    .u-btn {
      margin-left: 5px;
      margin-top: 6px;
      width: 92px;
      height: 39px;
      background: #ffffff;
      border-radius: 3px;
      text-align: center;
      font-size: 20px;
      line-height: 39px;
      border: none;
      // &:nth-child(10) {
      //   border: none;
      //   background: #f8f8f8;
      // }
      // &:nth-child(10):hover {
      //   background: none;
      // }
    }
    .u-callback {
      margin-top: 6px;
      width: 86px;
      height: 39px;
      border: none;
      font-size: 14px;
      background: #f8f8f8;
    }
    .u-btn:hover {
      background: #f06b00;
      color: #fff;
    }
  }
}
.u-btns {
  margin-top: 36px;
  display: flex;
  // margin-bottom:56px;
  // margin-left: 12px;
}
</style>