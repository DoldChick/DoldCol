<template>
  <div class="main_app">
    <div id="top">
      <div class="topdiv">
        <img src="assets/logo.png" />
      </div>
      <div id="tool">
        <div id="adddiv" class="topdiv" v-on:click="addCol()">
          <svg-icon icon-class="add" class="icon"></svg-icon>
        </div>
        <div class="topdiv">
          <a href="options.html" target="_blank" style="width: 100%">
            <svg-icon icon-class="setting" class="icon"></svg-icon>
          </a>
        </div>
      </div>
    </div>
    <div class="tablediv">
      <el-row v-for="col in colNum" :key="col">
        <el-col v-for="row in rowNumInCol(col - 1)" v-bind:key="row">
          <div @click="aclick(collectList[colListindex(col, row)].url)">
            <div class="adiv">
              <div class="icondiv">
                <img
                  v-lazy="
                    favIconUrlCom(
                      collectList[colListindex(col, row)].favIconUrl
                    )
                  "
                  :key="
                    favIconUrlCom(
                      collectList[colListindex(col, row)].favIconUrl
                    )
                  "
                  class="icon"
                />
              </div>
              <div class="title">
                {{ collectList[colListindex(col, row)].name }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "popupDiv",
  data: () => {
    return {
      collectList: [],
      rowNum: 2,
      result: 1,
    };
  },
  computed: {
    //获取collectList在rowNum条件下的行数
    colNum() {
      if (this.collectList != null) {
        // console.log(
        //   JSON.stringify(parseInt(this.collectList.length / this.rowNum) + 1)
        // );
        return parseInt(this.collectList.length / this.rowNum) + 1;
      } else {
        return 1;
      }
    },
  },
  created() {
    //初始化collectList
    this.getCol();
    //初始化rowNum
    this.getrowNum();
  },
  methods: {
    //接收父级信号
    parentMsg(msg) {
      this.getCol();
      this.getrowNum();
    },
    //获取行数对应的列数（最后一行返回不足一行的长度值）
    rowNumInCol(col) {
      var num = col * this.rowNum;
      if (this.collectList == null) {
        return 0;
      }
      // console.log(this.collectList.length);
      // console.log(num);
      // console.log(this.rowNum);
      // console.log(
      //   "this.collectList.length - num:" + (this.collectList.length - num)
      // );
      if (num + this.rowNum > this.collectList.length) {
        return this.collectList.length - num;
      } else {
        return this.rowNum;
      }
    },
    //根据行数和列数获得对应collectList的下标
    colListindex(col, row) {
      // console.log(
      //   "(col - 1) * this.rowNum + row:" + ((col - 1) * this.rowNum + row)
      // );
      return (col - 1) * this.rowNum + row - 1;
    },
    //假如网站图标链接为空，则返回预设图标
    favIconUrlCom(favIconUrl) {
      // console.log("favIconUrl:" + JSON.stringify(favIconUrl));
      if (favIconUrl != "undefined" && favIconUrl != "" && favIconUrl != null) {
        return favIconUrl;
      } else {
        var iconurl = chrome.runtime.getURL(
          "../../assets/icons/svg/webIconDefault.svg"
        );
        return iconurl;
      }
    },
    //把当前界面收藏的按钮
    addCol() {
      chrome.tabs.getSelected(null, (tab) => {
        var url = tab.url;
        var name = tab.title;
        var favIconUrl = tab.favIconUrl;
        //是新标签页就不添加
        if (
          url == "chrome://newtab/" ||
          url.indexOf("ledcgngcacbolnhkhbkhhiomddkjclfn") != -1
        ) {
          return;
        }
        var len =
          this.collectList != null ? parseInt(this.collectList.length) : 0;
        // console.log('collectList:\n' + collectList);
        var maxnum = -1;
        //遍历查看是否已收藏，且计算出最大id
        for (var i = 0; i < len; i++) {
          var temp = this.collectList[i];
          if (temp.url == url) {
            console.log("当前页面已在收藏列表里!URL:" + url);
            return;
          }
          var id = parseInt(temp.id);
          if (maxnum < id) {
            maxnum = id;
          }
        }
        this.collectList.push({
          id: maxnum + 1,
          url: url,
          name: name,
          favIconUrl: favIconUrl,
        });
        console.log(this.collectList);
        //存储
        chrome.storage.local.set(
          { collects: JSON.stringify(this.collectList) },
          () => {
            console.log("collectList:" + JSON.stringify(this.collectList));
            console.log("collectList 保存成功！");
          }
        );
      });
    },
    //从存储中获取网址列表
    getCol() {
      chrome.storage.local.get(["collects"], (result) => {
        // console.log(JSON.stringify(result));
        if (result["collects"] != null) {
          this.collectList = JSON.parse(result["collects"]);
        }
        // this.result = this.collectList;
        // console.log("get successed!");
        // console.log(this.collectList);
      });
    },
    //从存储中获取rowNum
    getrowNum() {
      chrome.storage.local.get(["rowNum"], (result) => {
        if (result.rowNum != null) {
          this.rowNum = JSON.parse(result.rowNum);
        }
        // console.log("读取rowNum");
      });
    },
    aclick(url) {
      // console.log(url);
      chrome.tabs.getSelected(null, (tab) => {
        // console.log("tab:" + JSON.stringify(tab));
        chrome.tabs.create({ url });
        if (tab.url == null || tab.url == "chrome://newtab/") {
          chrome.tabs.remove(tab.id);
        }
      });
    },
  },
};
</script>

<style>
.main_app {
  width: fit-content;
  height: fit-content;
  min-width: 100px;
  min-height: 100px;
  max-height: 600px;
  background-color: rgb(242, 243, 245);
  margin: 0%;
}
#top {
  height: 30px;
  width: 100%;
  background-color: #ffffff;
}

.topdiv {
  width: 30px;
  height: 30px;
  float: left;
  display: flex;
}
.topdiv :hover {
  cursor: pointer;
}

#tool {
  width: fit-content;
  float: right;
  display: flex;
  height: 100%;
}

#asetting:hover {
  background-color: rgb(255, 255, 255);
}

.icon {
  width: 75%;
  height: 75%;
  margin: 12.5%;
  fill: rgb(172, 172, 172);
}

.icon:hover {
  width: 75%;
  height: 75%;
  margin: 12.5%;
  fill: rgb(88, 88, 88);
}

img {
  width: 75%;
  height: 75%;
  margin: 12.5%;
}

.tablediv .el-row {
  width: fit-content;
  display: flex;
}
.tablediv .el-col {
  width: fit-content;
  padding: 1px;
}

a {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  /* -webkit-user-select: none; */
  -moz-user-focus: none;
  /* -moz-user-select: none; */
}

a:hover,
.adiv:hover {
  background-color: rgb(229, 229, 229);
}

.adiv {
  width: 100px;
  word-wrap: break-word;
  color: black;
  border-radius: 100px;
  border-style: dotted;
  border-color: darkgrey;
  text-align: center;
  background-color: white;
  position: relative;
}

.adiv:hover {
  cursor: pointer;
}

.adiv .title {
  z-index: 1;
  padding: 15px 10px;
  font-family: JetBrains Mono, youyuan, system-ui;
  font-weight: lighter;
  font-size: 0.9em;
}

.adiv .icondiv {
  width: 16px;
  height: 16px;
  position: absolute;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 100px;
  box-shadow: 0 0 3px black;
}

.adiv .icon {
  width: 12px;
  height: 12px;
  display: block;
  margin: 0 auto;
}
</style>
