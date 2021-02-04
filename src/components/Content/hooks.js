import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLongPress } from 'react-use';
import converter from 'number-to-words';
import { areSimilar } from '@similar';

export const useVerses = props => {
	const { verses } = props;
	const cursors = useRef({});
	const editRef = useRef();
	const mapRef = useRef();
	const inputRef = useRef();
	const inputComp = useRef('');
	const logsRef = useRef([]);
	const showRef = useRef(false)
	const [showMeta, _setShowMeta] = useState(false);
	const setShowMeta = bool => _setShowMeta(bool) || (showRef.current = bool);
	logsRef.current.logging = /test/.test(document.location.search);
	logsRef.current.log = log => logsRef.current.logging && logsRef.current.push(log);

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
		const inputSkip = (regex = /^[^a-zA-Z0-9']$/) => {
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
		const inputText = (text, options) => { //console.log('inputText', text);
			if (cursors.current.map?.nodeName !== '#text') return console.warn('input text on non #text node');
			const remainingText = cursors.current.map.nodeValue.substring(cursors.current.text.length, cursors.current.map.length);
			if (options?.composition || text.length > 1) {
				const [nextText] = remainingText.match(new RegExp(`^[a-zA-Z0-9']+`, 'i')) || [];
				if (areSimilar(text, nextText)) {
					logsRef.current.log(`append: ${nextText}`);
					cursors.current.text.nodeValue += nextText;
					return inputSkip() || true;
				}
				if (/^[\d,]+$/.test(text)) {
					const numberText = converter.toWords(text.replace(',', ''));
					const nextText = remainingText.substring(0, numberText.length);
					if (areSimilar(numberText, nextText)) {
						logsRef.current.log(`append: ${nextText}`);
						cursors.current.text.nodeValue += nextText;
						return inputSkip() || true;
					}
				}
			} else {
				const [nextText] = remainingText.match(new RegExp(`^${text}`, 'i')) || [];
				if (nextText) {
					logsRef.current.log(`append: ${nextText}`);
					cursors.current.text.nodeValue += nextText;
					return inputSkip() || true;
				}
			}
		};
		const input = (text, options) => {
			if (!text) return console.warn('no input text value.');
			const texts = text.split(/[^a-zA-Z0-9']+/).filter(text => text);
			while (texts.length > 0) {
				const text = texts.shift();
				if (!inputText(text, options)) break;
			}
		};
		const initialize = () => { //console.log('initiaizing ...');
			inputComp.current = '';
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
			if (verses) next();
		};
		return { initialize, input };
	}, [verses]);

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
		onChange: e => {
			if (e.nativeEvent.inputType !== 'insertCompositionText') {
				logsRef.current.log(`change: ${e.target.value} by ${e.nativeEvent.inputType}`);
				input(e.target.value);
				e.target.value = '';
			}
		},
		onCompositionUpdate: e => {
			const text = e.data.replace(inputComp.current, '').trim();
			input(text, { composition: true });
			inputComp.current = e.data;
			logsRef.current.log(`compositionupdate: (${text}) by (${e.type})`);
		},
		onCompositionEnd: e => {
			if (/^[a-zA-Z0-9']$/i.test(e.data)) input(e.data, { composition: true });
			inputComp.current = '';
			e.target.value = '';
			logsRef.current.log(`compositionend: (${e.data}) by (${e.type})`);
		},
		onKeyDown: e => e.metaKey && !showRef.current && setShowMeta(true),
		onKeyUp: e => showRef.current && setShowMeta(false),
	}), []);

	useEffect(() => {
		initialize();
	}, [verses]);

	return {
		contentHandlers,
		editRef,
		inputHandlers,
		inputRef,
		logsRef,
		mapRef,
		showMeta,
	};
};