import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import 'scripture-styles/dist/css/scripture-styles.css';
import { useVerses } from './hooks';

const useStyles = makeStyles((theme) => ({
	content: {
		margin: theme.spacing(1),
		position: 'relative',
	},
	map: {
		whiteSpace: 'pre-wrap',
		position: 'relative',
		'& p': {
			color: 'rgba(17,17,17,0)',
			transition: 'color 300ms',
			'& [data-sid]': {
				color: 'rgba(17,17,17,1)',
			},
		},
	},
	mapMeta: {
		'& p': {
			color: 'rgba(17,17,17,.3)',
		},
	},
	edit: {
		whiteSpace: 'pre-wrap',
		position: 'absolute', top: '0', left: '0',
		width: '100%',
		height: '100%',
		outline: 'none',
		'& p [data-sid]': {
			opacity: 0,
		},
	},
	copyright: {
		textAlign: 'end',
	}
}));

export const Content = props => {
	const { version } = props;
	const classes = useStyles();
	const {
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
	} = useVerses(props);

	return <div className={clsx('scripture-styles', classes.content)}>
		<div
			className={clsx(classes.map, { [classes.mapMeta]: showMeta })}
			dangerouslySetInnerHTML={{ __html: mapHTML }}
			spellCheck={false} />
		<div
			className={clsx(classes.edit)}
			contentEditable="true"
			onPaste={e => e.preventDefault()}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseLeave}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onBeforeInput={onInputHandler}
			onInput={e => e.preventDefault()}
			onKeyDown={onKeyDownHandler}
			onKeyUp={onKeyUpHandler}
			ref={editRef}
			spellCheck={false} />
	</div>
}