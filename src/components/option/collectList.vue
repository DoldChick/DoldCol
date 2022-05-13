<template>
  <div>
    <div style="width: fit-content; margin: 25px auto">
      <h3>收藏列表</h3>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabsClick" :stretch="true">
      <el-tab-pane label="网站管理" name="first">
        <ul id="urllist" num="0" class="drag-list">
          <li
            v-for="(item, index) in collectList"
            v-bind:key="index"
            class="drag-li"
          >
            <span class="drag-area"></span>
            <ul class="mainUl">
              <li class="idLi">{{ item.id }}</li>
              <li class="mainLi">
                <ul class="mainLiUl">
                  <li style="width: 100%">
                    <ul class="mainLiUPUl">
                      <li class="mainLiUPUlLi">
                        <el-input
                          v-model="item.name"
                          placeholder="请输入网站名称"
                          @blur="updatedCollectList()"
                        ></el-input>
                      </li>
                      <li>
                        <img
                          v-lazy="favIconUrlCom(item.favIconUrl)"
                          :key="favIconUrlCom(item.favIconUrl)"
                          class="urlIcon"
                        />
                      </li>
                    </ul>
                  </li>
                  <li class="mainLiDownLi">
                    <el-input
                      type="textarea"
                      autosize
                      resize="none"
                      placeholder="请输入内容"
                      v-model="item.url"
                      @blur="updatedCollectList()"
                    >
                    </el-input>
                  </li>
                </ul>
              </li>
              <li class="delLi">
                <el-popconfirm
                  :title="delButInfo(item.name)"
                  @confirm="delClick(item.id)"
                >
                  <el-button
                    slot="reference"
                    type="warning"
                    plain
                    class="delBnt"
                    >删除</el-button
                  >
                </el-popconfirm>
              </li>
            </ul>
          </li>
        </ul>
        <div style="height: 60px"></div>
      </el-tab-pane>

      <el-tab-pane label="排序" name="second">
        <div id="sortContainer" v-bind:style="{ width: widthNum + 'px' }">
          <div
            v-for="{ id, name, url, favIconUrl } in collectList"
            class="draggable-element"
            :key="id"
          >
            <div class="adiv" v-bind="{ url }">
              <div class="icondiv">
                <img :src="favIconUrlCom(favIconUrl)" class="icon" />
              </div>
              <div class="title">
                {{ name }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
//网址设置的拖拽结束更新函数
var updateafteredit = function () {
  var lilist = $("#urllist").children("li");
  var collectList = [];
  var name, url, favIconUrl;

  // console.log(JSON.stringify(lilist));
  for (var i = 0; i < lilist.length; i++) {
    $(lilist[i]).attr("name", i);
    $($(lilist[i]).find(".idLi")[0]).text(i);
    url = $($(lilist[i]).find("textarea")[0]).val();
    name = $($(lilist[i]).find("input")[0]).val();
    favIconUrl = $(lilist[i]).find(".urlIcon")[0].src;
    // console.log("\favIconUrl:" + favIconUrl)
    // console.log(JSON.stringify($(lilist[i]).find("input")))
    collectList.push({
      id: i,
      url: url,
      name: name,
      favIconUrl: favIconUrl,
    });
  }
  // console.log(collectList);
  //存储
  chrome.storage.local.set({ collects: JSON.stringify(collectList) }, () => {
    // console.log("collectList:" + JSON.stringify(this.collectList));
    console.log("collectList 保存成功！");
  });
  refleshShow();
};

//网址设置的拖拽结束更新函数
var updateaftersort = function () {
  var adivlist = $("#sortContainer").find(".adiv");
  var collectList = [];
  var name, url, favIconUrl;

  // console.log(JSON.stringify(lilist));
  for (var i = 0; i < adivlist.length; i++) {
    url = $(adivlist[i]).attr("url");
    name = $($(adivlist[i]).find(".title")[0]).text().trim();
    favIconUrl = $(adivlist[i]).find(".icon")[0].src;
    // console.log("\favIconUrl:" + favIconUrl)
    // console.log(JSON.stringify($(adivlist[i]).find("input")))
    collectList.push({
      id: i,
      url: url,
      name: name,
      favIconUrl: favIconUrl,
    });
  }
  // console.log(collectList);
  //存储
  chrome.storage.local.set({ collects: JSON.stringify(collectList) }, () => {
    // console.log("collectList:" + JSON.stringify(this.collectList));
    console.log("collectList 保存成功！");
  });
  refleshShow();
};

export default {
  name: "app",
  data() {
    return {
      collectList: null,
      activeName: "first",
      rowNum: 2,
      widthNum: 0,
      result: 1,
    };
  },
  created() {
    //初始化collectList
    this.getCol();
    setTimeout(() => {
      $(".drag-li").arrangeable({
        dragSelector: ".drag-area",
        dragEndEvent: [updateafteredit],
      });
      $(".draggable-element").arrangeable({
        dragEndEvent: [updateaftersort],
      });
    }, 20);
    // console.log(JSON.stringify($(".drag-li")));
  },
  updated() {
    //初始化widthNum
    chrome.storage.local.get(["rowNum"], (result) => {
      if (result.rowNum != null) {
        this.rowNum = JSON.parse(result.rowNum);
      } else {
        chrome.storage.local.set(
          { rowNum: JSON.stringify(this.rowNum) },
          () => {
            // console.log("rowNum 保存成功！");
          }
        );
      }
      // console.log(this.rowNum);
      var item = $(".draggable-element").width();
      // console.log(JSON.stringify(item));
      this.widthNum = item * this.rowNum;
    });
  },
  methods: {
    //初始化collectList
    getCol() {
      chrome.storage.local.get(["collects"], (result) => {
        if (result["collects"] != null) {
          this.collectList = JSON.parse(result["collects"]);
        }
      });
    },
    tabsClick(tab, e) {
      this.getCol();
      // console.log(tab, e);
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
    delButInfo(name) {
      return "是否删除”" + name + "“？";
    },
    delClick(id) {
      this.collectList.forEach((item, index, arr) => {
        if (item.id === id) {
          arr.splice(index, 1);
        }
      });
      this.collectList.forEach((item, index, arr) => {
        arr[index].id = index;
      });
      //存储
      this.updatedCollectList();
    },
    //把collectList存储到Chrome.storage中
    updatedCollectList() {
      chrome.storage.local.set(
        { collects: JSON.stringify(this.collectList) },
        () => {
          // console.log("collectList:" + JSON.stringify(this.collectList));
          console.log("collectList 保存成功！");
        }
      );
      this.refleshFatherShow();
    },
    refleshFatherShow() {
      this.$emit("refleshShow");
    },
  },
};
</script>

<style>
.drag-list .drag-area {
  display: inline-block;
  background: rgb(158, 211, 179);
  min-width: 40px;
  max-width: 40px;
  min-height: 40px;
  max-height: 40px;
  margin: auto 15px;
  cursor: move;
}

#urllist {
  max-width: 1100px;
  margin: auto;
  padding: 0px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#urllist ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
}

#urllist li {
  width: fit-content;
  margin: 0px;
  padding: 0px;
}

#urllist .drag-list {
  height: 80px;
}

#urllist .drag-li {
  width: 100%;
  height: auto;
  padding: 5px 0px;
  display: inline-flex;
}

#urllist .mainUl {
  display: inline-flex;
  width: 100%;
  box-shadow: 0 0 8px #9ed3b3;
  border-radius: 8px;
  margin-right: 8px;
}

#urllist .idLi {
  display: inline;
  width: 40px;
  height: auto;
  text-align: center;
  align-items: center;
  margin: auto;
}

#urllist .mainLi {
  display: flex;
  width: 100%;
}
#urllist .mainLi .mainLiUl {
  width: 100%;
}
#urllist .mainLi .mainLiUPUl {
  display: flex;
  width: 100%;
}
#urllist .mainLi .mainLiUPUl .mainLiUPUlLi {
  width: 100%;
}
#urllist .mainLi .mainLiDownLi {
  width: 100%;
}
#urllist .delLi {
  display: flex;
  height: 100%;
  align-items: center;
  margin: auto 8px;
}

#urllist .iconAside {
  width: 64px;
  height: 64px;
}
#urllist .urlIcon {
  width: 16px;
  height: 16px;
  margin: 0px;
}

#sortContainer {
  margin: 10px auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  box-shadow: 0 0 3px #000000;
  border-radius: 3px;
}
#sortContainer .draggable-element {
  display: inline-flex;
}
</style>
