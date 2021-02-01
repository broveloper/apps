import _ from 'lodash';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'scripture-styles/dist/css/scripture-styles.css';

const useStyles = makeStyles((theme) => ({
	content: {
		margin: theme.spacing(1),
		position: 'relative',
	},
	map: {
		position: 'absolute', top: '0', left: '0',
		'& p': {
			color: 'rgba(0,0,0,.2)',
			'& [data-sid]': {
				color: 'rgba(0,0,0,1)',
			},
		},
	},
	edit: {
		position: 'relative',
		outline: 'none',
		zIndex: 10,
	}
}));

const useVerses = props => {
	const { verses } = props;

	const [editHTML, setEditHTML] = useState('');
	
	const memoized = useMemo(() => { //console.log('calculating nodes');
		const versesEdit = document.createElement('div');
		const versesMap = document.createElement('div');
		versesMap.innerHTML = _.flatten(verses).reduce((html, verse) => html += verse?.html?.trim?.(), '');
		const cursorMap = versesMap.firstChild;
		const cursorEdit = null;
		return { versesEdit, versesMap, cursorEdit, cursorMap };
	}, [verses]);

	const onFocusHandler = e => {
		const el = document.getElementById('edit');
		el.focus()
		const range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(el);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		const sel = window.getSelection();//get the selection object (allows you to change selection)
		sel.removeAllRanges();//remove any selections already made
		sel.addRange(range);
	}

	const onInputHandler = e => {
		if (!e.metaKey && /^[a-zA-Z0-9]$/.test(e.key)) {
			e.preventDefault();
			// console.log({ key: e.key, e });
		}
	}

	return {
		...memoized,
		editHTML,
		onFocusHandler,
		onInputHandler,
		setEditHTML,
	};
};


export const Content = props => {
	const classes = useStyles();
	const {
		cursorEdit,
		cursorMap,
		editHTML,
		onFocusHandler,
		onInputHandler,
		setEditHTML,
		versesEdit,
		versesMap,
	} = useVerses(props);

	// const nextNode = () => {
	// 	if (cursors.current.node.nextSibling == null) {
	// 		cursors.current.verse = cursors.current.verse.nextSibling;
	// 		if (cursors.current.verse) cursors.current.node = cursors.current.verse.firstChild;
	// 	} else cursors.current.node = cursors.current.node.nextSibling;
	// }
	// const nextVerse = () => {
	// 	cursors.current.verse = cursors.current.verse.nextSibling;
	// }
	// const update = key => {
	// 	while(cursors.current.verse && cursors.current.node) {
	// 		if (cursors.current.verse.className === 'b') {
	// 			console.log('here');
	// 			htmlTemplate.appendChild(cursors.current.verse.cloneNode());
	// 			nextVerse();
	// 			continue;
	// 		}
	// 		const isFirst = cursors.current.node.previousSibling == null;
	// 		if (isFirst) {
	// 			cursors.current.appendee = cursors.current.verse.cloneNode();
	// 			cursors.current.appendee.innerHTML = '';
	// 			htmlTemplate.appendChild(cursors.current.appendee);
	// 		}
	// 		if (cursors.current.node.dataset?.sid) {
	// 			cursors.current.appendee.appendChild(cursors.current.node.cloneNode());
	// 			nextNode();
	// 			continue;
	// 		}
	// 		console.log([cursors.current.node]);
	// 		break;
	// 	}
	// 	console.log('end update', [htmlTemplate], htmlTemplate.innerHTML);
	// 	setHTML(htmlTemplate.innerHTML);
	// };
	
	// useEffect(() => {
	// 	console.log('useEffect');
	// 	update()
	// }, [verses])

	return <div className={clsx('scripture-styles', classes.content)}>
		<div
			className={classes.map}
			dangerouslySetInnerHTML={{ __html: versesMap.innerHTML }} />
		<div
			id="edit"
			className={classes.edit}
			contentEditable="true"
			onClick={onFocusHandler}
			onTouchStart={onFocusHandler}
			onKeyDown={onInputHandler}
			dangerouslySetInnerHTML={{ __html: editHTML }} />
	</div>
}