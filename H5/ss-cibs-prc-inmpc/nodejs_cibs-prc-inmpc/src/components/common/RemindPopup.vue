<template>
  <div class="aweb-container" ref="layout" name="layout">
    <el-dialog title="提醒" :visible.sync="deitailPopupFlag" width="980px" center class="mandate">
      <div class="g_remind_content">
        <div class="detail_conten" v-for="(item, index) in remindList" :key="index" :value="item">
          <div class="detail_conten_list">
            <img style="width: 50px; height: 50px" src="../../img/user.jpg" />

            <div class="detail_conten_content">
              <div class="detail_conten_title">{{ item.title }}</div>
              <div class="detail_conten_time">{{ item.item }}</div>
              <div class="detail_conten_remind">{{ item.content }}</div>
            </div>
          </div>
          <div class="line_div"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Remind',
  data() {
    return {
      deitailPopupFlag: false, //提醒弹框是否显示
      remindList: [
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        },
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        },
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        },
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        },
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        },
        {
          title: '角色菜单权限修改',
          item: '2019-10-13 12:00:00',
          content: '您的角色菜单权限被修改，如有问题，请联系管理员。'
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.g_remind_content {
  height: 440px;
  overflow-y: auto;
}
// .detail_conten{
//   height: 502px;
// }
.detail_conten_list {
  display: flex;
  padding: 20px;
}
.detail_conten_content {
  margin-left: 20px;
  .detail_conten_title {
     
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    font-weight: 500;
    padding-bottom: 10px;
  }
  .detail_conten_time,
  .detail_conten_remind {
    font-size: 13px;
     
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0;
    font-weight: 400;
  }
  .detail_conten_time {
    padding-bottom: 10px;
  }
}
.line_div {
  width: 87%;
  border-bottom: 1px solid #f0f0f0;
  margin-left: 10%;
}
</style>