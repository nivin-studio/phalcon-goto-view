import {
	languages,
	ExtensionContext
} from 'vscode';

import HoverProvider from './providers/hoverProvider';
import LinkProvider from './providers/linkProvider';

export function activate(context: ExtensionContext) {

	console.log('phalcon-goto-view activate');

	let hover = languages.registerHoverProvider(['php'], new HoverProvider());

	let link = languages.registerDocumentLinkProvider(['php'], new LinkProvider());

	context.subscriptions.push(hover, link);
}

export function deactivate() { }
