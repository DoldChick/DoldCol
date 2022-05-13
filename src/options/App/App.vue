<template>
  <el-container>
    <el-header>
      <div id="headdiv">
        <div
          style="
            color: white;
            width: fit-content;
            position: relative;
            font-size: 26px;
          "
        >
          <span>老 机 de 收 藏</span>
          <span style="font-size: 14px">version: 1.1.0</span>
        </div>
      </div>
    </el-header>
    <el-container style="padding-top: 60px">
      <el-aside
        width="200px"
        class="leftAside"
        v-bind:style="{ width: leftAsidewidth }"
      >
        <el-col :span="12">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <router-link to="/mainpage">
              <el-menu-item index="1">
                <i class="el-icon-s-home"></i>
                <span slot="title">首选项</span>
              </el-menu-item>
            </router-link>
            <router-link to="/stylesetting">
              <el-menu-item index="2">
                <i class="el-icon-s-operation"></i>
                <span slot="title">样式设置</span>
              </el-menu-item>
            </router-link>
            <router-link to="/collectlist">
              <el-menu-item index="3">
                <i class="el-icon-star-on"></i>
                <span slot="title">收藏列表</span>
              </el-menu-item>
            </router-link>
            <router-link to="/recyblebinlist">
              <el-menu-item index="4">
                <i class="el-icon-delete-solid"></i>
                <span slot="title">回收站</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-col>
        <div class="show" @click="foldLeftAside()">
          <i class="view el-icon-more" style=""></i>
        </div>
      </el-aside>
      <el-main>
        <router-view @refleshShow="refleshShow()" />
      </el-main>
      <el-aside
        style="width: auto"
        class="rightAside"
        v-bind:style="{ display: rightAsideDisplay }"
      >
        <i class="el-icon-minus minus" @click="minusRightAside()"></i>
        <div style="width: 100%; height: 100%; position: relative">
          <div
            id="hoverdiv"
            style="position: absolute; width: 100%; height: 100%; z-index: 99"
          ></div>
          <div id="preshow" style="width: 100%">
            <h3>预览</h3>
            <div id="show">
              <popupdiv ref="popup"></popupdiv>
            </div>
          </div>
        </div>
      </el-aside>
      <div
        class="previewBtn"
        @click="showRightAside()"
        v-bind:style="{ display: previewBtnDisplay }"
      >
        <i class="view el-icon-view" style=""></i>
      </div>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      a: "test",
      get popupHtml() {
        setTimeout(() => {
          var iframe = document.getElementById("showiframe");
          try {
            var bHeight = iframe.contentWindow.document.body.scrollHeight;
            var dHeight =
              iframe.contentWindow.document.documentElement.scrollHeight;
            // console.log("bHeight=" + bHeight + "\tdHeight=" + dHeight);
            var height = Math.min(bHeight, dHeight);
            iframe.height = height;
            var bWidth = iframe.contentWindow.document.body.scrollWidth;
            var dWidth =
              iframe.contentWindow.document.documentElement.scrollWidth;
            var width = Math.min(bWidth, dWidth);
            iframe.width = width;
            // eslint-disable-next-line no-console
            // console.log(bWidth + "\t" + dWidth);
            // eslint-disable-next-line no-empty
          } catch (ex) {}
        }, 200);
        return "../popup.html";
      },
      leftAsidewidth: "65px",
      rightAsideDisplay: "none",
      previewBtnDisplay: "",
    };
  },
  mounted() {
    window.refleshShow = this.refleshShow;
  },
  methods: {
    //加载iframe页面
    handleOpen(key, keyPath) {
      // eslint-disable-next-line no-console
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // eslint-disable-next-line no-console
      console.log(key, keyPath);
    },
    refleshShow() {
      this.$refs.popup.parentMsg(1);
      // console.log("刷新展示页！");
    },
    foldLeftAside() {
      if (this.leftAsidewidth == "200px") {
        this.leftAsidewidth = "65px";
      } else {
        this.leftAsidewidth = "200px";
      }
    },
    minusRightAside() {
      this.rightAsideDisplay = "none";
      this.previewBtnDisplay = "";
    },
    showRightAside() {
      this.rightAsideDisplay = "";
      this.previewBtnDisplay = "none";
    },
  },
  components: {
    popupdiv: () => import("../../popup/App/app.vue"),
  },
};
</script>

<style>
a {
  text-decoration: none;
}
h3 {
  font-size: 30px;
  margin: 5px;
  color: rgb(38, 146, 199);
  text-align: center;
}
.el-header {
  background-color: rgb(6, 154, 85);
  color: #333;
  line-height: 60px;
  position: absolute;
  padding: 0px;
  width: 100%;
  z-index: 99;
}

.el-container {
  width: 100%;
  height: 100%;
}

#headdiv {
  padding-left: 30px;
  margin: auto;
}
#headdiv span {
  margin: 0px;
  line-height: 35px;
  padding: 0px 6px;
}

.el-aside {
  color: #333;
  height: 100%;
}

.leftAside,
.el-menu-item,
.rightAside {
  background-color: rgb(255, 255, 255);
  position: relative;
}

.leftAside {
  border-style: solid;
  border: 0px;
  border-right: 1px solid rgb(230, 230, 230);
  overflow: hidden;
}
.el-col {
  width: 100%;
}
.el-menu {
  border: 0px;
}
.el-menu-item {
  width: 100%;
}
.leftAside span {
  margin-left: 20px;
}
.leftAside .show {
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0px;
  text-align: center;
  line-height: 60px;
}
.leftAside .show:hover {
  cursor: pointer;
  background-color: rgb(236, 245, 255);
}
.leftAside .show:hover .view {
  color: #000000;
}
.leftAside .show .view {
  margin-top: 17px;
  color: #00000055;
  font-size: 30px;
}

.el-main {
  padding: 0px;
  background-color: rgb(247, 247, 247);
}

.rightAside {
  min-width: 110px;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: auto 5px;
}
#show {
  margin: auto 10px;
  width: fit-content;
  box-shadow: 0 0 3px #000000;
  border-radius: 3px;
  overflow: hidden;
  padding: 3px;
}
.rightAside .minus {
  color: #00000055;
  position: absolute;
  right: 0px;
  font-size: 18px;
  padding: 8px;
  z-index: 100;
}
.rightAside .minus:hover {
  cursor: pointer;
  color: #000;
}

.previewBtn {
  width: 60px;
  height: 60px;
  position: absolute;
  right: 0px;
  background-color: white;
  border-radius: 30px 0 0 30px;
  margin-top: 20px;
  box-shadow: 1px 1px 6px 0px #00000055;
  z-index: 200;
  text-align: center;
}
.previewBtn .view {
  font-size: 25px;
  color: #00000055;
  margin-top: 16px;
}
.previewBtn:hover {
  cursor: pointer;
}
.previewBtn:hover .view {
  color: #000;
}
</style>
