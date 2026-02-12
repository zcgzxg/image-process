import { ref, shallowRef } from "vue";

/**
 * 文件选择器逻辑
 * - 提供模板 ref、文件名、文件数据
 * - fileData 使用 shallowRef，避免对大块 Uint8Array 进行不必要的深度响应式追踪
 */
export function useFilePicker() {
  const inputRef = ref<HTMLInputElement | null>(null);
  const fileName = ref("");
  const fileData = shallowRef<Uint8Array | null>(null);

  function onClickPick(): void {
    inputRef.value?.click();
  }

  async function onFileChange(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    fileName.value = file.name;
    fileData.value = new Uint8Array(await file.arrayBuffer());
  }

  return { inputRef, fileName, fileData, onClickPick, onFileChange };
}
