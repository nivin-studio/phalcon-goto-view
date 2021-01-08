'use strict';

import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    Position,
    ProviderResult,
    Hover,
    workspace,
    MarkdownString
} from "vscode";

import * as util from '../util';

export default class HoverProvider implements vsHoverProvider {
    provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {
        // 工作空间配置
        let workspaceConfig = workspace.getConfiguration('phalcon-goto-view');
        // 获取自定义正则表达式
        let reg = new RegExp(workspaceConfig.regex);
        // 获取正则匹配文字内容
        let linkRange = doc.getWordRangeAtPosition(pos, reg);
        if (!linkRange) {
            return;
        }
        // 获取视图路径组
        let viewPaths = util.getViewPaths(doc.getText(linkRange), doc);
        if (viewPaths.length > 0) {
            let text: string = "";
            // 组装显示内容
            for (let i in viewPaths) {
                text += ` [${viewPaths[i].folder}](${viewPaths[i].fileUri})  \r`;
            }

            return new Hover(new MarkdownString(text));
        }
    }
}
