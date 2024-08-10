<template>
  <div>
    <div style="width: fit-content; margin: 25px auto">
      <h3>欢迎使用 老机de收藏</h3>
    </div>
    <!-- 消息提示控件 -->
    <input
      id="isSuccess"
      v-model="isSuccess"
      @blur="inputMessage()"
      style="width: 0px; height: 0px; opacity: 0; padding: 0px; border: 0px"
    />
    <!-- <div class="box-class1">
      <span>导入导出 全部设置及收藏</span>
      <div class="box-class2">
        <input type="file" id="input1" class="file-btn" accept=".json" />
        <el-button type="primary" for="btn_file"> 导入 </el-button>
        <div style="width: 70px; height: 10px"></div>
        <el-button type="danger">导出</el-button>
      </div>
    </div> -->

    <div class="box-class1">
      <span>仅导入导出 收藏</span>
      <div class="box-class2">
        <input
          type="file"
          id="colFilechangeInput"
          class="file-btn"
          accept=".json"
          @change="filechange"
        />
        <el-button type="primary" for="btn_file" @click="inputColList">
          导入
        </el-button>
        <div style="width: 70px; height: 10px"></div>
        <el-button type="danger" @click="outputColList">导出</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

//存在Chrome里的关键字
var keys = ["collects", "rowNum"];
function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(String(result[key]));
    });
  });
}

//读取缓存并整理
async function dataZip() {
  var output = "";
  for (var key of keys) {
    output = output.concat(await getStorage(key));
  }
  // console.log("output=" + output);

  return output;
}

export default {
  name: "app",
  data() {
    return {
      collectList: null,
      isSuccess: "true",
    };
  },
  methods: {
    outputColList() {
      //从浏览器获取"collects"列表
      chrome.storage.local.get(["collects"], (result) => {
        if (result["collects"] != null) {
          var FileSaver = require("file-saver");
          var blob = new Blob([result["collects"]], {
            type: "text/plain;charset=utf-8",
          });
          FileSaver.saveAs(blob, "collects.json");
        }
      });

      let output;
      (async function () {
        output = await dataZip();
        console.log(output);
      })();
      console.log(output);
    },
    //点击导入：触发input的点击事件，调用filechange()
    inputColList() {
      // console.log(this.isSuccess);
      // console.log("input");
      //触发<input type="file">，调用浏览器文件输入窗口
      document.getElementById("colFilechangeInput").click();
    },
    filechange() {
      var file = document.getElementById("colFilechangeInput").files[0];
      // console.log(file);
      // // 创建一个FileReader实例
      let reader = new FileReader();
      // // 读取文件
      reader.readAsText(file);
      // 监听文件读取完成事件
      reader.onload = function () {
        // 读取完成后，将文件内容存入data中
        var collectList = reader.result;

        //验证数据正确性
        try {
          //1.不符合json格式的跳出错误，并显示读取失败
          // console.log(JSON.parse(this.collectList));
          if (!(typeof JSON.parse(collectList) === "object")) {
            throw "error";
          }

          //读取成功
          chrome.storage.local.set({ collects: collectList }, () => {
            console.log("collectList 读取成功！");
            $("#isSuccess").val("true 收藏列表读取成功！").focus().blur();
          });
        } catch (e) {
          console.log("collectList 读取失败！");
          $("#isSuccess")
            .val("false 读取失败，请检查文件是否正确！")
            .focus()
            .blur();
        }
      };
      console.log("this.isSuccess=" + this.isSuccess);
    },
    // 消息提示控件函数，内容用空格分隔，第一个参数true or false，第二个参数为提示信息
    // 调用方法：$("#isSuccess").val("true info").focus().blur();
    inputMessage() {
      this.isSuccess = $("#isSuccess").val();
      this.isSuccess = this.isSuccess.split(" ");

      if (this.isSuccess[0] == "true") {
        this.$message({
          message: this.isSuccess[1],
          type: "success",
        });
      } else {
        this.$message.error(this.isSuccess[1]);
      }
    },
  },
};
</script>

<style>
.box-class1 {
  width: fit-content;
  background-color: #a7edfac2;
  padding: 30px;
  text-align: center;
  margin: 30px auto;
  border-radius: 8px;
  box-shadow: 0px 3px 10px #0e6eb8;
  font-size: 1.6em;
}
.box-class2 {
  margin: 20px 0px;
  display: flex;
  justify-content: center;
}
.file-btn {
  display: none;
  outline: none;
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
}
</style>
