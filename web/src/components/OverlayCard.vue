<script setup lang="ts">
import { ref } from "vue";
import { Image } from "../image-process";
import { useFilePicker } from "../composables/useFilePicker";
import { useObjectUrl } from "../composables/useObjectUrl";

const base = useFilePicker();
const top = useFilePicker();
const { url: resultUrl, updateFromData } = useObjectUrl();
const error = ref("");

/** 当两张图都已选择时执行合并 */
function tryOverlay(): void {
  if (!base.fileData.value || !top.fileData.value) return;
  error.value = "";
  resultUrl.value = null;

  try {
    let now = Date.now();
    const baseImg = new Image(base.fileData.value);
    const topImg = new Image(top.fileData.value);
    console.log(`创建两个 Image 对象时间: ${Date.now() - now}ms`);

    now = Date.now();
    const mergedData = baseImg.overlaying(topImg);
    console.log(`图片合并时间: ${Date.now() - now}ms`);

    const mime = baseImg.mimeType;
    topImg.free();
    baseImg.free();
    updateFromData(mergedData, mime);
  } catch (err) {
    error.value = "图片合并失败: " + err;
  }
}

async function onBaseChange(e: Event): Promise<void> {
  await base.onFileChange(e);
  tryOverlay();
}

async function onTopChange(e: Event): Promise<void> {
  await top.onFileChange(e);
  tryOverlay();
}
</script>

<template>
  <div class="card">
    <h1>图片合并 (Overlay)</h1>

    <p class="label">底图（背景图片）</p>
    <div class="upload-area" @click="base.onClickPick">
      <p>点击选择底图</p>
      <div v-if="base.fileName.value" class="file-name">
        {{ base.fileName.value }}
      </div>
      <input
        :ref="(el) => (base.inputRef.value = el as HTMLInputElement)"
        type="file"
        accept="image/*"
        hidden
        @change="onBaseChange"
      />
    </div>

    <p class="label">水印图（叠加到右下角）</p>
    <div class="upload-area" @click="top.onClickPick">
      <p>点击选择水印图</p>
      <div v-if="top.fileName.value" class="file-name">
        {{ top.fileName.value }}
      </div>
      <input
        :ref="(el) => (top.inputRef.value = el as HTMLInputElement)"
        type="file"
        accept="image/*"
        hidden
        @change="onTopChange"
      />
    </div>

    <div v-if="resultUrl" class="result">
      <p>合并结果</p>
      <img :src="resultUrl" alt="合并结果" />
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
