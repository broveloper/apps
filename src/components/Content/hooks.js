import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLongPress } from 'react-use';

export const useVerses = props => {
	const { verses, version } = props;
	const cursors = useRef({});
	const editRef = useRef();
	const mapRef = useRef();
	const inputRef = useRef();
	const showRef = useRef(false)
	const [showMeta, _setShowMeta] = useState(false);
	const setShowMeta = bool => _setShowMeta(bool) || (showRef.current = bool);

	const { initialize, input, } = useMemo(() => {
		const nextSibling = () => {
			if (cursors.current.edit === null || cursors.current.map === null) { //console.log('\tnextSibling: end');
				return null;
			}
			if (cursors.current.map.nextSibling) { //console.log('\tnextSibling: found');
				cursors.current.map = cursors.current.map.nextSibling;
			} else { //console.log('\tnextSibling: parentNode backup');
				cursors.current.map = cursors.current.map.parentNode;
				cursors.current.edit = cursors.current.edit.parentNode;
				nextSibling();
			}
		};
		const nextChild = () => { //console.log('\tnextChild');
			cursors.current.map = cursors.current.map.firstChild;
			cursors.current.edit = cursors.current.edit === editRef.current
				? cursors.current.edit.childNodes[cursors.current.edit.childNodes.length - 2]
				: cursors.current.edit.lastChild;
		};
		const next = () => { //console.log('next>', cursors);
			while (cursors.current.edit != null && cursors.current.map != null && cursors.current.map?.nodeName !== '#text') {
				if (cursors.current.map.hasAttribute?.('data-sid')) { //console.log('next: node is verse number.')
					cursors.current.edit.appendChild(cursors.current.map.cloneNode(true));
					nextSibling();
				} else { //console.log('next: node is element.');
					if (cursors.current.map.parentNode === mapRef.current && cursors.current.map.classList.contains('p')) cursors.current.edit.insertBefore(cursors.current.map.cloneNode(false), cursors.current.edit.lastChild);
					else cursors.current.edit.appendChild(cursors.current.map.cloneNode(false));
					nextChild();
				}
			}
			if (cursors.current.map?.nodeName === '#text' && cursors.current.edit != null) { //console.log('next: appending new text node to edit.')
				cursors.current.edit.appendChild(document.createTextNode(''));
				cursors.current.text = cursors.current.edit.lastChild;
				inputSkip();
			}
		};
		const inputSkip = (regex = /^[^a-zA-Z0-9]$/) => {
			if (cursors.current.map?.nodeName !== '#text') return console.warn('input key on non #text node');
			while (true) {
				if (cursors.current.text.nodeValue === cursors.current.map.nodeValue) break;
				let nextKey = cursors.current.map.nodeValue.substring(cursors.current.text.length, cursors.current.map.length).charAt(0);
				if (!regex.test(nextKey)) break;
				cursors.current.text.nodeValue += nextKey;
			}
			if (cursors.current.text.nodeValue === cursors.current.map.nodeValue) {
				nextSibling();
				next();
			}
		};
		const input = text => { //console.log('input', text);
			if (cursors.current.map?.nodeName !== '#text') return console.warn('input text on non #text node');
			const remainingText = cursors.current.map.nodeValue.substring(cursors.current.text.length, cursors.current.map.length);
			const [,match] = remainingText.match(new RegExp(`^(${text})`, 'i')) || [null,null];
			if (match) { //console.log('match', match);
				cursors.current.text.nodeValue += match;
				inputSkip();
			}
		};
		const initialize = () => { //console.log('initiaizing ...');
			editRef.current.oncontextmenu = e => e.preventDefault();
			while (editRef.current.childNodes.length > 1) editRef.current.removeChild(editRef.current.firstChild);
			mapRef.current.innerHTML = _.reduce(verses, (html, { book_name, chapter, text, verse }) => {
				return html += `<p class="p"><span data-number="${verse}" data-sid="${book_name} ${chapter}:${verse}" class="v">${verse}</span>${text.trim()}</p>`;
			}, '');
			Object.assign(cursors.current, {
				edit: editRef.current,
				map: mapRef.current.firstChild,
				text: null,
			});
			if (version && verses) next();
		};
		return { initialize, input };
	}, [verses, version]);

	const longPress = useLongPress(e => setShowMeta(true));
	const contentHandlers = useMemo(() => ({
		onMouseDown: e => { //console.log('onMouseDown');
			inputRef.current.focus();
			longPress.onMouseDown(e);
		},
		onMouseLeave: e => { //console.log('onMouseLeave');
			longPress.onMouseLeave(e);
			if (showRef.current) setShowMeta(false);
		},
		onMouseUp: e => { //console.log('onMouseUp');
			longPress.onMouseUp(e);
			if (showRef.current) setShowMeta(false);
		},
		onTouchEnd: e => { //console.log('onTouchEnd');
			longPress.onTouchEnd(e);
			if (showRef.current) setShowMeta(false);
		},
		onTouchStart: e => { //console.log('onTouchStart');
			inputRef.current.focus();
			longPress.onTouchStart(e);
		},
	}), []);

	const inputHandlers = useMemo(() => ({
		onChange: e => input(e.target.value),
		onKeyDown: e => e.metaKey && !showRef.current && setShowMeta(true),
		onKeyUp: e => showRef.current && setShowMeta(false),
	}), []);

	useEffect(() => {
		initialize();
	}, [verses, version]);

	return {
		contentHandlers,
		editRef,
		inputHandlers,
		inputRef,
		mapRef,
		showMeta,
	};
};