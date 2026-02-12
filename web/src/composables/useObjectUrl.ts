import { ref, onUnmounted } from "vue";

/**
 * 管理 Object URL 的创建与释放
 * - 传入图片字节数据和 MIME 类型，创建 Blob 和 Object URL
 * - 组件卸载时自动释放
 */
export function useObjectUrl() {
  const url = ref<string | null>(null);

  function updateFromData(data: Uint8Array, mime: string): void {
    if (url.value) {
      URL.revokeObjectURL(url.value);
    }
    const blob = new Blob([data], { type: mime });
    url.value = URL.createObjectURL(blob);
  }

  onUnmounted(() => {
    if (url.value) URL.revokeObjectURL(url.value);
  });

  return { url, updateFromData };
}
