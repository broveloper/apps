import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLongPress } from 'react-use';


export const useVerses = props => {
	const { verses } = props;
	const editRef = useRef();
	const inputRef = useRef();
	const [state, setState] = useState({});
	const [showMeta, setShowMeta] = useState(false);
	const {
		cursors,
		mapHTML,
		versesEdit,
		versesMap,
	} = state;

	const initialize = () => { //console.log('initiaizing ...');
		const versesEdit = editRef.current;
		versesEdit.oncontextmenu = e => e.preventDefault();
		while (versesEdit.childNodes.length > 1) {
			versesEdit.removeChild(versesEdit.firstChild);
		}
		const versesMap = document.createElement('div');
		const mapHTML = _.reduce(verses, (html, { book_name, chapter, text, verse }) => {
			return html += `<p class="p"><span data-number="${verse}" data-sid="${book_name} ${chapter}:${verse}" class="v">${verse}</span>${text.trim()}</p>`;
		}, '');
		versesMap.innerHTML = mapHTML;
		const cursors = {
			edit: versesEdit,
			map: versesMap.firstChild,
			text: null,
		};
		setState({
			cursors,
			mapHTML,
			versesEdit,
			versesMap,
		});
	};

	const nextSibling = () => {
		if (cursors.edit === null || cursors.map === null) { //console.log('\tnextSibling: end');
			return null;
		}
		if (cursors.map.nextSibling) { //console.log('\tnextSibling: found');
			cursors.map = cursors.map.nextSibling;
		} else { //console.log('\tnextSibling: parentNode backup');
			cursors.map = cursors.map.parentNode;
			cursors.edit = cursors.edit.parentNode;
			nextSibling();
		}
	};
	const nextChild = () => { //console.log('\tnextChild');
		cursors.map = cursors.map.firstChild;
		cursors.edit = cursors.edit === versesEdit
			? cursors.edit.childNodes[cursors.edit.childNodes.length - 2]
			: cursors.edit.lastChild;
	};

	const next = () => {
		while (cursors.edit != null && cursors.map != null && cursors.map?.nodeName !== '#text') {
			if (cursors.map.hasAttribute?.('data-sid')) { //console.log('next: node is verse number.')
				cursors.edit.appendChild(cursors.map.cloneNode(true));
				nextSibling();
			} else { //console.log('next: node is element.');
				if (cursors.map.parentNode === versesMap && cursors.map.classList.contains('p')) cursors.edit.insertBefore(cursors.map.cloneNode(false), cursors.edit.lastChild);
				else cursors.edit.appendChild(cursors.map.cloneNode(false));
				nextChild();
			}
		}
		if (cursors.map?.nodeName === '#text' && cursors.edit != null) { //console.log('next: appending new text node to edit.')
			cursors.edit.appendChild(document.createTextNode(''));
			cursors.text = cursors.edit.lastChild;
			inputSkip();
		}
	};

	const inputSkip = (regex = /^[^a-zA-Z0-9]$/) => {
		if (cursors.map?.nodeName !== '#text') return console.warn('input key on non #text node');
		while (true) {
			if (cursors.text.nodeValue === cursors.map.nodeValue) break;
			let nextKey = cursors.map.nodeValue.substring(cursors.text.length, cursors.map.length).charAt(0);
			if (!regex.test(nextKey)) break;
			cursors.text.nodeValue += nextKey;
		}
		if (cursors.text.nodeValue === cursors.map.nodeValue) {
			nextSibling();
			next();
		}
	};

	const input = key => {
		if (cursors.map?.nodeName !== '#text') return console.warn('input key on non #text node');
		const nextKey = cursors.map.nodeValue.substring(cursors.text.length, cursors.map.length).charAt(0);
		if (new RegExp(`^${nextKey}$`, 'i').test(key)) {
			cursors.text.nodeValue += nextKey;
			inputSkip();
		}
	};

	const longPress = useLongPress(e => setShowMeta(true));
	const longPressHandlers = {
		onMouseDown: e => { //console.log('onMouseDown');
			inputRef.current.focus();
			longPress.onMouseDown(e);
		},
		onMouseLeave: e => { //console.log('onMouseLeave');
			longPress.onMouseLeave(e);
			if (showMeta) setShowMeta(false);
		},
		onMouseUp: e => { //console.log('onMouseUp');
			longPress.onMouseUp(e);
			if (showMeta) setShowMeta(false);
		},
		onTouchEnd: e => { //console.log('onTouchEnd');
			longPress.onTouchEnd(e);
			if (showMeta) setShowMeta(false);
		},
		onTouchStart: e => { //console.log('onTouchStart');
			inputRef.current.focus();
			longPress.onTouchStart(e);
		},
	};

	const onKeyDownHandler = e => e.metaKey && !showMeta && setShowMeta(true);
	const onKeyUpHandler = e => showMeta && setShowMeta(false);
	const onChangeHandler = e => input(e.target.value);

	useEffect(() => {
		initialize();
	}, [verses]);

	useEffect(() => {
		if (Object.keys(state).length > 0) next();
	}, [state]);

	return {
		editRef,
		inputRef,
		longPressHandlers,
		mapHTML,
		onChangeHandler,
		onKeyDownHandler,
		onKeyUpHandler,
		showMeta,
	};
};