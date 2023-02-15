<template>
  <div class="announcement">
    <el-image class="announcementImg" :src="announcementImg" />

    <ul class="announcement-item">
      <!-- TODO -->
      <li
        @click="handleClick(index)"
        v-for="(item, index) in renderList"
        :key="index"
      >
        {{ item.title }}
      </li>
    </ul>

    <el-button
      @click="handleMore"
      class="more"
      v-if="announcementList.length > 4"
    >
      {{$t('TRANSCTIONS.MORE')}}
      <i class="el-icon-arrow-right el-icon--right"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Announcement",
  computed: {
    renderList({ announcementList }) {
      return announcementList.slice(0, 4);
    },
  },
  data() {
    return {
      announcementImg: require("../../images/home/announcement.png"),
      announcementList: [
       
      ],
    };
  },
  methods: {
    handleClick(id) {
      // TODO
      this.$router.push(`/home/announcementList/detail/${id}`);
    },
    handleMore() {
      this.$router.push(`/home/announcementList`);
    },
  },
};
</script>

<style lang="scss" scoped>
.announcement {
  // @include flex-start;
  width: 100%;
  justify-content: space-between;
  margin-top: 20px;

  .announcement-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 100%;
    height: 100%;
    margin-left: 18px;
    align-items: center;

    li {
      padding-right: 49px;
      font-size: 14px;
      color: #4f4f4f;
      font-weight: 400;

      &:hover {
        color: #fa6c25;
        cursor: pointer;
      }
    }

    li::before {
      display: inline-block;
      content: "";
      width: 10px;
      border: 2px solid #fa6c25;
      height: 10px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }

  .more {
    border: 1px solid #e8e8ea;
    // color: #e8e8ea;
    border-radius: 6px;
    width: 74px;
    padding-top: 22px;
    padding-bottom: 22px;

    .el-icon--right {
      margin-left: -2px;
    }
  }
}
</style>