<template>
  <div>
    <div style="width: fit-content; margin: 25px auto">
      <h3>样式设置</h3>
    </div>
    <div>
      <span>列数：</span>
      <el-input-number
        v-model="rowNum"
        @change="rowNumChange"
        :min="1"
        :max="5"
        label="描述文字"
      ></el-input-number>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      rowNum: 2,
      a: "test",
    };
  },
  created() {
    chrome.storage.local.get(["rowNum"], (result) => {
      if (result.rowNum != null) {
        this.rowNum = JSON.parse(result.rowNum);
      }
      // console.log("读取rowNum");
    });
  },
  methods: {
    rowNumChange(value) {
      chrome.storage.local.set({ rowNum: JSON.stringify(this.rowNum) }, () => {
        // console.log("rowNum 保存成功！");
      });
      this.$emit("refleshShow");
    },
  },
};
</script>

<style>
</style>
