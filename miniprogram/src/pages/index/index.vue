<template>
  <div class="image-process">
    <button @click="onThumbnail">选择图片</button>

    <img v-if="thumbnailSrc" :src="thumbnailSrc" @click="onPreview(thumbnailSrc)" />

    <button @click="onOverlaying">合并两张图片 (Overlaying)</button>

    <img
      v-if="overlayingSrc"
      :src="overlayingSrc"
      mode="widthFix"
      style="width: 100%"
      @click="onPreview(overlayingSrc)"
    />
  </div>
</template>

<script setup lang="ts">
import { default as init, Image } from '@/image-process/lib.js';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const fm = uni.getFileSystemManager();


/** 根据 MIME 类型获取文件扩展名 */
function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp'
  }
  return map[mimeType] ?? '.png'
}

/** 选择图片 */
function chooseMedia(count: number) {
  return new Promise<UniNamespace.ChooseMediaSuccessCallbackResult>((resolve, reject) => {
    uni.chooseMedia({
      count,
      sizeType: ['original', 'compressed'],
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject,
    });
  });
}

/** 从临时文件路径读取并创建 Image 对象 */
function readImage(filePath: string): Image {
  const buffer = fm.readFileSync(filePath) as ArrayBuffer;
  return new Image(new Uint8Array(buffer));
}

/** 将图片数据保存到用户数据目录，返回文件路径 */
function saveToUserData(name: string, mimeType: string, data: Uint8Array): string {
  // @ts-expect-error uni.env 类型定义不正确
  const filePath = `${uni.env.USER_DATA_PATH}/${name}${getExtension(mimeType)}`;
  fm.writeFileSync(filePath, data.buffer as ArrayBuffer);
  return filePath;
}

const thumbnailSrc = ref('');
const overlayingSrc = ref('');

const onPreview = (src: string) => {
  uni.previewImage({
    current: src,
    urls: [src],
  });
};
const onThumbnail = async () => {
  const { tempFiles } = await chooseMedia(1);

  const now = Date.now();
  const image = readImage(tempFiles[0].tempFilePath);
  console.log('format', image.mimeType);
  const thumbnail = image.thumbnail(100, 100);
  thumbnailSrc.value = saveToUserData('thumbnail', image.mimeType, thumbnail);
  image.free();

  console.log(`生成缩略图时间: ${Date.now() - now}ms`);
};
const onOverlaying = async () => {
  const { tempFiles } = await chooseMedia(2);

  if (tempFiles.length < 2) {
    uni.showToast({ title: '请选择两张图片', icon: 'none' });
    return;
  }

  const now = Date.now();
  const baseImage = readImage(tempFiles[0].tempFilePath);
  const topImage = readImage(tempFiles[1].tempFilePath);

  const result = baseImage.overlaying(topImage);

  overlayingSrc.value = saveToUserData('overlaying', baseImage.mimeType, result);
  baseImage.free();
  topImage.free();
  console.log(`overlaying 合并时间: ${Date.now() - now}ms`);
};

onLoad(async () => {
  uni.showLoading({ title: '加载中' });
  const now = Date.now();
  await init('/image-process/lib_bg.wasm.br');
  console.log(`初始化时间: ${Date.now() - now}ms`);
  uni.hideLoading();
});
</script>

<style lang="less"></style>
