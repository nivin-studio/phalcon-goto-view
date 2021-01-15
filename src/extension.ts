import {
	languages,
	ExtensionContext
} from 'vscode';

import HoverProvider from './providers/hoverProvider';
import LinkProvider from './providers/linkProvider';

export function activate(context: ExtensionContext) {

	console.log('phalcon-goto-view activate');

	let hover = languages.registerHoverProvider(['php', 'volt', 'html', 'phtml'], new HoverProvider());

	let link = languages.registerDocumentLinkProvider(['php', 'volt', 'html', 'phtml'], new LinkProvider());

	context.subscriptions.push(hover, link);
}

export function deactivate() { }
