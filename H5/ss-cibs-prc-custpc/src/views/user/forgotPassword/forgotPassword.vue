<template>
  <div class="g-changePassword">
    <steps :stepsList="stepsList" :activeIndex="activeIndex" class="u-steps"></steps>
    <div v-if="activeIndex === 0">
      <change-Password @next="next" :message="messages"></change-Password>
    </div>
    <div v-if="activeIndex === 1">
      <result :message="message"></result>
    </div>
  </div>
</template>

<script>
import changePassword from './changePassword';
import result from './resuslt';
export default {
  components: {
    changePassword,
    result
  },
  data() {
    return {
      stepsList: [
        {
          // '修改密码'
          title: this.$t('USER_COMMON.UPDATE_PASSWORD')
        },
        {
          // '修改成功'
          title:this.$t('USER_COMMON.UDATE_SUCCESS') 
        }
      ],
      activeIndex: 0,
      message: {},
      messages: {}
    };
  },
  computed:{
    
  },
  methods: {
    back() {
      if (this.activeIndex === 1) {
        return this.$router.go(-1);
      }
      this.activeIndex--;
    },
    // 下一步
    next() {
      if (this.activeIndex === 1) {
        return (this.activeIndex = 0);
      } else if (this.activeIndex === 1) {
        this.message=this.messages
        return this.activeIndex++;
      } else {
        return this.activeIndex++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>

.g-changePassword {
 
  // display: flex;
  // justify-content: center;
  .u-steps {
    // margin-left: 37%;
  }
}
 /deep/ .el-steps {
   display: inline-block;
    /* display: -webkit-box; */
    // display: -ms-flexbox;
    /* display: flex; */
}
</style>