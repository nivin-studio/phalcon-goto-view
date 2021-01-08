'use strict';

import {
    workspace,
    TextDocument,
    WorkspaceConfiguration,
    Uri
} from 'vscode';

import * as fs from "fs";
import * as path from "path";

/**
 * 获取试图路径
 * 
 * @param text 
 * @param doc 
 */
export function getViewPath(text: string, doc: TextDocument) {
    let viewPaths = getViewPaths(text, doc);
    return viewPaths.length > 0 ? viewPaths[0] : null;
}

/**
 * 获取试图路径
 * 
 * @param text 
 * @param doc 
 */
export function getViewPaths(text: string, doc: TextDocument) {
    // 工作空间目录
    let workspaceFolder = workspace.getWorkspaceFolder(doc.uri)?.uri.fsPath;
    // 工作空间配置
    let workspaceConfig = workspace.getConfiguration('phalcon-goto-view');
    // 试图文件目录组
    let viewFolders = scanViewFolders(workspaceFolder, workspaceConfig);
    // 试图文件路径组
    let viewPaths = [];

    for (let item in viewFolders) {
        // 获取控制器名称
        let controllerName = getControllerName(doc);
        // 获取方法名称
        let functionName = getFunctionName(text);
        // 试图文件目录
        let viewFolder = viewFolders[item] + `/${controllerName}` + `/${functionName}`;
        // 工作空间配置扩展名组
        for (let extension of workspaceConfig.extensions) {
            // 试图文件路径
            let viewPath = workspaceFolder + viewFolder + extension;
            // 判断文件路径是否存在
            if (fs.existsSync(viewPath)) {
                viewPaths.push({
                    "folder": viewFolder,
                    "fileUri": Uri.file(viewPath)
                });
            }
        }
    }

    return viewPaths;
}

/**
 * 扫描试图文件目录
 * 
 * @param workspaceFolder 
 * @param workspaceConfig 
 */
function scanViewFolders(workspaceFolder: any, workspaceConfig: WorkspaceConfiguration) {
    let folders = Object.assign({}, workspaceConfig.folders);
    // 默认视图文件目录
    let defaultFolders = path.join(workspaceFolder, workspaceConfig.folders.default);
    // 判断默认视图文件目录是否存着
    if (fs.existsSync(defaultFolders)) {
        // 递归获取视图文件目录下的文件和目录
        fs.readdirSync(defaultFolders).forEach(element => {
            let file = path.join(defaultFolders, element);
            // 判断是否为子目录
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = workspaceConfig.folders.default + '/' + element;
            }
        });
    }

    return folders;
}

/**
 * 获取控制器名称
 * 
 * @param doc 
 */
function getControllerName(doc: TextDocument): string {
    let controllerPath = doc.uri.path;
    let controllerName = controllerPath.split('/').pop();
    if (controllerName) {
        return toLine(initiaLowercase(controllerName.replace('Controller.php', '')));
    }

    return '';
}

/**
 * 获取方法名称
 * 
 * @param text 
 */
function getFunctionName(text: string): string {
    return text.replace('Action', '');
}

/**
 * 下划线命名转驼峰命名
 * 
 * @param name 
 */
function toHump(name: string) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

/**
 * 驼峰命名转下划线命名
 * 
 * @param name 
 */
function toLine(name: string) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 首字母d大写
 * 
 * @param name 
 */
function initiaUpperCase(name: string) {
    return name.charAt(0).toUpperCase + name.slice(1);
}

/**
 * 首字母小写
 * 
 * @param name 
 */
function initiaLowercase(name: string) {
    return name.charAt(0).toLowerCase() + name.slice(1);
}

