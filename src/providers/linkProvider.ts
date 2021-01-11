'use strict';

import {
    DocumentLinkProvider,
    TextDocument,
    ProviderResult,
    DocumentLink,
    Position,
    Range,
    Uri,
    workspace
} from "vscode";

import * as util from '../util';


export default class LinkProvider implements DocumentLinkProvider {
    public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
        // 工作空间配置
        let workspaceConfig = workspace.getConfiguration('phalcon-goto-view');
        // 是否开启快速跳转
        if (!workspaceConfig.quickJump) {
            return;
        }

        let documentLinks = [];
        // 获取自定义正则表达式
        let regexArray = workspaceConfig.regex;
        // 获取最大递归处理行
        let linesCount = doc.lineCount <= workspaceConfig.maxLinesCount ? doc.lineCount : workspaceConfig.maxLinesCount;
        // 递归处理
        let index = 0;
        while (index < linesCount) {
            // 获取行对象
            let line = doc.lineAt(index);
            // 循环处理正则匹配规则
            for (let regex of regexArray) {
                // 正则匹配行内容
                let matchArray = line.text.match(regex.value);
                if (matchArray === null) {
                    continue;
                }

                let match = matchArray[0].replace(/\"|\'/g, '').replace(/\./g, '/');
                // 获取视图路径
                let viewPath = util.getViewPath(regex.name, match, doc);
                if (viewPath === null) {
                    continue;
                }
                // 组装快速跳转链接
                let start = new Position(line.lineNumber, line.text.indexOf(match));
                let end = start.translate(0, match.length);
                let documentlink = new DocumentLink(new Range(start, end), viewPath.fileUri);
                documentLinks.push(documentlink);

            }

            index++;
        }

        return documentLinks;
    }
}
