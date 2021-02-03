import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLongPress } from 'react-use';


export const useVerses = props => {
	const { verses } = props;
	const editRef = useRef();
	const [state, setState] = useState({});
	const [showMeta, setShowMeta] = useState(false);
	const {
		cursors,
		mapHTML,
	} = state;

	const initialize = () => { //console.log('initiaizing ...');
		const versesEdit = editRef.current;
		versesEdit.innerHTML = '';
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

	const cursorEnd = () => {
		if (!verses) return null;
		const range = document.createRange();
		range.selectNodeContents(cursors.text);
		range.collapse(false);
		const sel = window.getSelection();//get the selection object (allows you to change selection)
		sel.removeAllRanges();//remove any selections already made
		sel.addRange(range);
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
		cursors.edit = cursors.edit.lastChild;
	};

	const next = () => {
		while (cursors.edit != null && cursors.map != null && cursors.map?.nodeName !== '#text') {
			if (cursors.map.hasAttribute?.('data-sid')) { //console.log('next: node is verse number.')
				cursors.edit.appendChild(cursors.map.cloneNode(true));
				nextSibling();
			} else { //console.log('next: node is element.');
				cursors.edit.appendChild(cursors.map.cloneNode(false));
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
		cursorEnd();
		_.defer(cursorEnd);
	};

	const longPress = useLongPress(e => {
		e.preventDefault();
		setShowMeta(true);
	});

	const onMouseDown = e => { //console.log('onMouseDown');
		longPress.onMouseDown(e);
		cursorEnd();
	};

	const onMouseUp = e => { //console.log('onMouseUp');
		longPress.onMouseUp(e);
		if (showMeta) setShowMeta(false);
		cursorEnd();
	};

	const onMouseLeave = e => { //console.log('onMouseLeave');
		longPress.onMouseLeave(e);
		if (showMeta) setShowMeta(false);
		// cursorEnd();
	};

	const onTouchStart = e => { //console.log('onTouchStart');
		longPress.onTouchStart(e);
		cursorEnd();
	};

	const onTouchEnd = e => { //console.log('onTouchEnd');
		longPress.onTouchEnd(e);
		if (showMeta) setShowMeta(false);
		cursorEnd();
	};

	const onKeyDownHandler = e => {
		if (e.metaKey) setShowMeta(true);
		else if (e.key === 'Backspace') {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const onInputHandler = e => { //console.log('onInputHandler', [e]);
		e.preventDefault();
		e.stopPropagation();
		input(e.data);
	}

	const onKeyUpHandler = e => {
		if (showMeta) setShowMeta(false);
	}

	useEffect(() => {
		initialize();
	}, [verses]);

	useEffect(() => {
		if (Object.keys(state).length > 0) next();
	}, [state]);

	return {
		editRef,
		mapHTML,
		onInputHandler,
		onKeyDownHandler,
		onKeyUpHandler,
		onMouseDown,
		onMouseUp,
		onMouseLeave,
		onTouchStart,
		onTouchEnd,
		showMeta,
	};
};