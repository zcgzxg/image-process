/* tslint:disable */
/* eslint-disable */

/**
 * 图片对象
 */
export class Image {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 创建图片对象
     */
    constructor(image_data: Uint8Array);
    overlaying(top_image: Image): Uint8Array;
    /**
     * 生成缩略图
     */
    thumbnail(width: number, height: number): Uint8Array;
    /**
     * 返回图片的 MIME 类型，如 "image/jpeg"、"image/png"
     */
    readonly mimeType: string;
}

export function start(): void;



export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_image_free: (a: number, b: number) => void;
    readonly image_mime_type: (a: number, b: number) => void;
    readonly image_new: (a: number, b: number, c: number) => void;
    readonly image_overlaying: (a: number, b: number, c: number) => void;
    readonly image_thumbnail: (a: number, b: number, c: number, d: number) => void;
    readonly start: () => void;
    readonly __wbindgen_export: (a: number, b: number, c: number) => void;
    readonly __wbindgen_export2: (a: number, b: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = WXWebAssembly.BufferSource | WXWebAssembly.Module

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(path: { path: string } | string): Promise<InitOutput>

