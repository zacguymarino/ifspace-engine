import { invokeTauriCommand } from './helpers/tauri.js';

// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * Native system dialogs for opening and saving files.
 *
 * This package is also accessible with `window.__TAURI__.dialog` when [`build.withGlobalTauri`](https://tauri.app/v1/api/config/#buildconfig.withglobaltauri) in `tauri.conf.json` is set to `true`.
 *
 * The APIs must be added to [`tauri.allowlist.dialog`](https://tauri.app/v1/api/config/#allowlistconfig.dialog) in `tauri.conf.json`:
 * ```json
 * {
 *   "tauri": {
 *     "allowlist": {
 *       "dialog": {
 *         "all": true, // enable all dialog APIs
 *         "ask": true, // enable dialog ask API
 *         "confirm": true, // enable dialog confirm API
 *         "message": true, // enable dialog message API
 *         "open": true, // enable file open API
 *         "save": true // enable file save API
 *       }
 *     }
 *   }
 * }
 * ```
 * It is recommended to allowlist only the APIs you use for optimal bundle size and security.
 * @module
 */
/**
 * Open a file/directory selection dialog.
 *
 * The selected paths are added to the filesystem and asset protocol allowlist scopes.
 * When security is more important than the easy of use of this API,
 * prefer writing a dedicated command instead.
 *
 * Note that the allowlist scope change is not persisted, so the values are cleared when the application is restarted.
 * You can save it to the filesystem using [tauri-plugin-persisted-scope](https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/persisted-scope).
 * @example
 * ```typescript
 * import { open } from '@tauri-apps/api/dialog';
 * // Open a selection dialog for image files
 * const selected = await open({
 *   multiple: true,
 *   filters: [{
 *     name: 'Image',
 *     extensions: ['png', 'jpeg']
 *   }]
 * });
 * if (Array.isArray(selected)) {
 *   // user selected multiple files
 * } else if (selected === null) {
 *   // user cancelled the selection
 * } else {
 *   // user selected a single file
 * }
 * ```
 *
 * @example
 * ```typescript
 * import { open } from '@tauri-apps/api/dialog';
 * import { appDir } from '@tauri-apps/api/path';
 * // Open a selection dialog for directories
 * const selected = await open({
 *   directory: true,
 *   multiple: true,
 *   defaultPath: await appDir(),
 * });
 * if (Array.isArray(selected)) {
 *   // user selected multiple directories
 * } else if (selected === null) {
 *   // user cancelled the selection
 * } else {
 *   // user selected a single directory
 * }
 * ```
 *
 * @returns A promise resolving to the selected path(s)
 *
 * @since 1.0.0
 */
async function open(options = {}) {
    if (typeof options === 'object') {
        Object.freeze(options);
    }
    return invokeTauriCommand({
        __tauriModule: 'Dialog',
        message: {
            cmd: 'openDialog',
            options
        }
    });
}
/**
 * Open a file/directory save dialog.
 *
 * The selected path is added to the filesystem and asset protocol allowlist scopes.
 * When security is more important than the easy of use of this API,
 * prefer writing a dedicated command instead.
 *
 * Note that the allowlist scope change is not persisted, so the values are cleared when the application is restarted.
 * You can save it to the filesystem using [tauri-plugin-persisted-scope](https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/persisted-scope).
 * @example
 * ```typescript
 * import { save } from '@tauri-apps/api/dialog';
 * const filePath = await save({
 *   filters: [{
 *     name: 'Image',
 *     extensions: ['png', 'jpeg']
 *   }]
 * });
 * ```
 *
 * @returns A promise resolving to the selected path.
 *
 * @since 1.0.0
 */
async function save(options = {}) {
    if (typeof options === 'object') {
        Object.freeze(options);
    }
    return invokeTauriCommand({
        __tauriModule: 'Dialog',
        message: {
            cmd: 'saveDialog',
            options
        }
    });
}
/**
 * Shows a message dialog with an `Ok` button.
 * @example
 * ```typescript
 * import { message } from '@tauri-apps/api/dialog';
 * await message('Tauri is awesome', 'Tauri');
 * await message('File not found', { title: 'Tauri', type: 'error' });
 * ```
 *
 * @param message The message to show.
 * @param options The dialog's options. If a string, it represents the dialog title.
 *
 * @returns A promise indicating the success or failure of the operation.
 *
 * @since 1.0.0
 *
 */
async function message(message, options) {
    var _a, _b;
    const opts = typeof options === 'string' ? { title: options } : options;
    return invokeTauriCommand({
        __tauriModule: 'Dialog',
        message: {
            cmd: 'messageDialog',
            message: message.toString(),
            title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
            type: opts === null || opts === void 0 ? void 0 : opts.type,
            buttonLabel: (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()
        }
    });
}
/**
 * Shows a question dialog with `Yes` and `No` buttons.
 * @example
 * ```typescript
 * import { ask } from '@tauri-apps/api/dialog';
 * const yes = await ask('Are you sure?', 'Tauri');
 * const yes2 = await ask('This action cannot be reverted. Are you sure?', { title: 'Tauri', type: 'warning' });
 * ```
 *
 * @param message The message to show.
 * @param options The dialog's options. If a string, it represents the dialog title.
 *
 * @returns A promise resolving to a boolean indicating whether `Yes` was clicked or not.
 *
 * @since 1.0.0
 */
async function ask(message, options) {
    var _a, _b, _c, _d, _e;
    const opts = typeof options === 'string' ? { title: options } : options;
    return invokeTauriCommand({
        __tauriModule: 'Dialog',
        message: {
            cmd: 'askDialog',
            message: message.toString(),
            title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
            type: opts === null || opts === void 0 ? void 0 : opts.type,
            buttonLabels: [
                (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : 'Yes',
                (_e = (_d = opts === null || opts === void 0 ? void 0 : opts.cancelLabel) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : 'No'
            ]
        }
    });
}
/**
 * Shows a question dialog with `Ok` and `Cancel` buttons.
 * @example
 * ```typescript
 * import { confirm } from '@tauri-apps/api/dialog';
 * const confirmed = await confirm('Are you sure?', 'Tauri');
 * const confirmed2 = await confirm('This action cannot be reverted. Are you sure?', { title: 'Tauri', type: 'warning' });
 * ```
 *
 * @param message The message to show.
 * @param options The dialog's options. If a string, it represents the dialog title.
 *
 * @returns A promise resolving to a boolean indicating whether `Ok` was clicked or not.
 *
 * @since 1.0.0
 */
async function confirm(message, options) {
    var _a, _b, _c, _d, _e;
    const opts = typeof options === 'string' ? { title: options } : options;
    return invokeTauriCommand({
        __tauriModule: 'Dialog',
        message: {
            cmd: 'confirmDialog',
            message: message.toString(),
            title: (_a = opts === null || opts === void 0 ? void 0 : opts.title) === null || _a === void 0 ? void 0 : _a.toString(),
            type: opts === null || opts === void 0 ? void 0 : opts.type,
            buttonLabels: [
                (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.okLabel) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : 'Ok',
                (_e = (_d = opts === null || opts === void 0 ? void 0 : opts.cancelLabel) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : 'Cancel'
            ]
        }
    });
}

export { ask, confirm, message, open, save };
