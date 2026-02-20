<script setup lang="ts">
import { ref } from "vue";
import { Image } from "../image-process";
import { useFilePicker } from "../composables/useFilePicker";
import { useObjectUrl } from "../composables/useObjectUrl";

const {
  inputRef,
  fileName,
  fileData,
  onClickPick,
  onFileChange: pickFile,
} = useFilePicker();

const { url: resultUrl, updateFromData } = useObjectUrl();
const error = ref("");

async function onFileChange(e: Event): Promise<void> {
  await pickFile(e);
  error.value = "";
  resultUrl.value = null;

  try {
    let now = Date.now();
    const img = new Image(fileData.value!);
    console.log(`创建 Image 对象时间: ${Date.now() - now}ms`);

    now = Date.now();
    const thumbData = img.thumbnail(100, 100);
    console.log(`生成缩略图时间: ${Date.now() - now}ms`);

    const mime = img.mimeType;
    img.free();
    updateFromData(thumbData, mime);
  } catch (err) {
    error.value = "生成缩略图失败: " + err;
  }
}
</script>

<template>
  <div class="card">
    <h1>缩略图生成</h1>

    <div class="upload-area" @click="onClickPick">
      <p>点击此处选择图片文件</p>
      <div v-if="fileName" class="file-name">{{ fileName }}</div>
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />
    </div>

    <div v-if="resultUrl" class="result">
      <p>缩略图 (100 × 100)</p>
      <img :src="resultUrl" width="100" height="100" alt="缩略图" />
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
