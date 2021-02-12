import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import converter from 'number-to-words';
import { usePassage } from '@utils/usePassage';
import { areSimilar } from '@utils/similar';

const regex = {
	char: /^[a-zA-Z0-9']$/i,
	chars: /^[a-zA-Z0-9']+$/i,
	gap: /^[^a-zA-Z0-9']$/,
	gaps: /[^a-zA-Z0-9']+/,
};

const wordLookback = window.wordLookback = (back, whole) => {
	let word = whole.charAt(back.length);
	let bi, fi;
	for (bi = back.length - 1; bi >= 0; bi--) {
		const char = whole.charAt(bi);
		if (regex.char.test(char)) word = `${char}${word}`;
		else break;
	}
	for (fi = back.length + 1; fi < whole.length; fi++) {
		const char = whole.charAt(fi);
		if (regex.char.test(char)) word = `${word}${char}`;
		else break;
	}
	return [word, whole.substring(0, bi + 1)];
};

export const useVerses = () => {
	const {
		bible,
		passage,
		verses,
	} = usePassage();
	const cursors = useRef({});
	const editRef = useRef();
	const mapRef = useRef();
	const inputRef = useRef();
	const logsRef = useRef([]);
	const showRef = useRef(false)
	const starRef = useRef();
	const wrongRef = useRef();
	const errorRef = useRef();
	const completedRef = useRef();
	const [completed, setCompleted] = useState(false);
	const [showMeta, _setShowMeta] = useState(false);
	const setShowMeta = bool => _setShowMeta(bool) || (showRef.current = bool);
	logsRef.current.logging = /test/.test(document.location.search);
	logsRef.current.log = log => logsRef.current.logging && logsRef.current.push(log);

	const { initialize, input } = useMemo(() => {
		const addIcon = _.throttle((node, time) => {
			const icon = node.cloneNode(true);
			inputRef.current?.parentNode?.appendChild?.(icon);
			icon.style.animationPlayState = 'running';
			setTimeout(() => inputRef.current?.parentNode?.removeChild?.(icon), time);
		}, 300);
		const addStar = () => addIcon(starRef.current, 2000);
		const addError = text => {
			if (errorRef.current?.parentNode === editRef.current) {
				clearTimeout(errorRef.current.clearId);
				editRef.current.removeChild(errorRef.current);
			}
			errorRef.current = document.createElement('div');
			errorRef.current.innerHTML = text;
			errorRef.current.classList.add('error');
			editRef.current.insertBefore(errorRef.current, editRef.current.lastChild);
			errorRef.current.clearId = setTimeout(() => editRef.current.removeChild(errorRef.current), 800);
		};
		const addWrong = text => {
			// console.log('addWrong', text)
			// addIcon(wrongRef.current, 800);
			addError(text);
		};
		const updateText = text => {
			cursors.current.text.nodeValue = text;
			if (regex.gap.test(cursors.current.map.nodeValue.charAt(text.length))) addStar();
		};

		const nextSibling = () => {
			if (cursors.current.edit === null || cursors.current.map === null) { //console.log('\tnextSibling: end');
				return null;
			}
			if (cursors.current.map.nextSibling) { //console.log('\tnextSibling: found');
				cursors.current.map = cursors.current.map.nextSibling;
			} else { //console.log('\tnextSibling: parentNode backup');
				cursors.current.map = cursors.current.map.parentNode;
				cursors.current.edit = cursors.current.edit.parentNode;
				if (cursors.current.edit === editRef.current && editRef.current.children.length === mapRef.current.children.length + 1) {
					completedRef.current = true;
				}
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
				if (cursors.current.map.classList.contains?.('v')) { //console.log('next: node is verse number.')
					cursors.current.edit.appendChild(cursors.current.map.cloneNode(true));
					nextSibling();
				} else if (cursors.current.map.classList.contains('newline')) { //console.log('next: node is new line.')
					cursors.current.edit.insertBefore(cursors.current.map.cloneNode(true), cursors.current.edit.lastChild);
					nextSibling();
				} else { //console.log('next: node is element.');
					if (cursors.current.map.parentNode === mapRef.current && cursors.current.map.classList.contains('p'))
						cursors.current.edit.insertBefore(cursors.current.map.cloneNode(false), cursors.current.edit.lastChild);
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
		const inputSkip = () => {
			if (cursors.current.map?.nodeName !== '#text') return console.warn('input key on non #text node');
			while (true) {
				if (cursors.current.text.nodeValue === cursors.current.map.nodeValue) break;
				let nextKey = cursors.current.map.nodeValue.substring(cursors.current.text.length, cursors.current.map.length).charAt(0);
				if (!regex.gap.test(nextKey)) break;
				cursors.current.text.nodeValue += nextKey;
			}
			if (cursors.current.text.nodeValue === cursors.current.map.nodeValue) {
				nextSibling();
				next();
			}
		};

		const inputChar = char => { //console.log('inputChar', char);
			const nextChar = cursors.current.map.nodeValue.charAt(cursors.current.text.length);
			if (new RegExp(nextChar, 'i').test(char)) return `${cursors.current.text.nodeValue}${nextChar}`;
			return false;
		};

		const inputComposition = text => { //console.log('inputComposition', text);
			const [nextComp, appendTo] = wordLookback(cursors.current.text.nodeValue, cursors.current.map.nodeValue);
			if (areSimilar(nextComp, text))
				return `${appendTo}${nextComp}`;
			if (/^[\d,]+$/.test(text) && areSimilar(nextComp, converter.toWords(text.replace(',', ''))))
				return `${appendTo}${nextComp}`;
			if (text.length === 1)
				return inputChar(text);
			return false;
		};

		const inputText = (text, options) => { //console.log('inputText', text);
			if (cursors.current.map?.nodeName !== '#text') return console.warn('input text on non #text node');

			const next = options?.composition || text.length > 1
				? inputComposition(text)
				: inputChar(text);

			if (next) {
				logsRef.current.log(`appended: ${next}`);
				updateText(next);
				inputSkip();
			} else {
				addWrong(text);
			}
		};
		const input = (text, options) => { //console.log('input', text)
			if (!text) return console.warn('no input text value.');
			const texts = text.split(regex.gaps).filter(text => text);
			while (texts.length > 0) {
				const text = texts.shift();
				inputText(text, options);
			}
			if (completedRef.current) {
				setCompleted(true);
			}
		};
		const initialize = () => { //console.log('initiaizing ...');
			completedRef.current = false;
			editRef.current.oncontextmenu = e => e.preventDefault();
			mapRef.current.oncontextmenu = e => e.preventDefault();
			while (editRef.current.childNodes.length > 1) editRef.current.removeChild(editRef.current.firstChild);
			mapRef.current.innerHTML = _.reduce(verses, (html, content) => {
				const { book_name, chapter, text, type, verse } = content;
				if (/heading/.test(type)) return html;
				const sid = `${book_name} ${chapter}:${verse}`;
				if (/newline/.test(type)) html += '<div class="newline"></div>';
				const versenum = html.indexOf(sid) === -1 ? `<div class="v" data-sid="${sid}">${verse}</div>` : '';
				return html += `<div class="p">${versenum}<div class="text">${text} </div></div>`;
			}, '');
			Object.assign(cursors.current, {
				edit: editRef.current,
				map: mapRef.current.firstChild,
				text: null,
			});
			if (verses) next();
			setCompleted(false);
		};
		return { initialize, input };
	}, [verses]);

	const contentHandlers = useMemo(() => ({
		onClick: e => { //console.log('contentHandlers.onClick');
			inputRef.current.focus();
		},
	}), []);

	const assistHandlers = useMemo(() => ({
		onClick: e => { //console.log('assistHandlers.onClick');
			setShowMeta(!showRef.current);
		},
		onMouseDown: e => { //console.log('assistHandlers.onMouseDown');
			// prevent potential input blur
			e.preventDefault();
			e.stopPropagation();
		},
	}), []);

	const inputHandlers = useMemo(() => ({
		onChange: e => {
			const value = e.target.value.trim();
			if (value && e.nativeEvent.inputType === 'insertText') {
				logsRef.current.log(`${e.nativeEvent.inputType}: ${value} [${e.target.value},${value}]`);
				input(value);
				e.target.value = '';
			} else if (value && e.nativeEvent.inputType === 'insertFromPaste') {
				logsRef.current.log(`${e.nativeEvent.inputType}: ${value} [${e.target.value},${value}]`);
				input(value, { composition: true });
				e.target.value = '';
			}
		},
		onCompositionUpdate: e => {
			const value = e.data.substring(e.target.value.length, e.data.length).trim();
			if (value) {
				logsRef.current.log(`${e.type}: ${value} [${e.target.value},${e.data}]`);
				input(value, { composition: true });
			}
		},
		onCompositionEnd: e => {
			e.target.value = '';
		},
		onKeyDown: e => e.metaKey && setShowMeta(!showRef.current),
	}), []);

	useEffect(() => {
		initialize();
	}, [verses]);

	return {
		assistHandlers,
		bible,
		completed,
		contentHandlers,
		editRef,
		initialize,
		inputHandlers,
		inputRef,
		logsRef,
		mapRef,
		passage,
		showMeta,
		starRef,
		verses,
		wrongRef,
	};
};