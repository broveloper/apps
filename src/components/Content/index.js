import { forwardRef, memo } from 'react';
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
		'& [class^="p"]': {
			color: 'rgba(17,17,17,0)',
			textIndent: 0,
			transition: 'color 300ms',
		},
		'& [data-sid]': {
			color: 'rgba(17,17,17,1)',
			display: 'inline-block',
			textIndent: '1.4em',
		},
	},
	mapMeta: {
		'& [class^="p"]': {
			color: 'rgba(17,17,17,.3)',
		},
	},
	edit: {
		whiteSpace: 'pre-wrap',
		position: 'absolute', top: '0', left: '0',
		width: '100%',
		height: '100%',
		outline: 'none',
		'& [class^="p"]:last-of-type': {
			display: 'inline',
		},
		'& [class^="p"]': {
			textIndent: 0,
		},
		'& [data-sid]': {
			opacity: 0,
			display: 'inline-block',
			textIndent: '1.4em',
		},
		'-webkit-touch-callout': 'none',
		'-webkit-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'user-select': 'none',
	},
	input: {
		margin: 0,
		padding: 0,
		border: 0,
		outline: 0,
		background: 'transparent',
		width: '1px',
		caretColor: 'rgba(17,17,17,1)',
		color: 'transparent',
	},
	copyright: {
		textAlign: 'end',
	}
}));

const Input = memo(forwardRef((props, ref) => {
	const {
		className,
		inputHandlers,
	} = props;
	return <input
		{...inputHandlers}
		autoCapitalize="none"
		className={className}
		defaultValue=""
		id="input"
		name="input"
		ref={ref}
		type="text" />;
}));

export const Content = props => {
	const classes = useStyles();
	const {
		contentHandlers,
		editRef,
		inputHandlers,
		inputRef,
		logsRef,
		mapRef,
		showMeta,
	} = useVerses(props);

	return <>
		<div
			{...contentHandlers}
			className={clsx('scripture-styles', classes.content)}>
			<label htmlFor="input">
				<div
					className={clsx(classes.map, { [classes.mapMeta]: showMeta })}
					ref={mapRef}
					spellCheck={false} />
				<div
					className={clsx(classes.edit)}
					ref={editRef}
					spellCheck={false}>
					<Input
						className={classes.input}
						inputHandlers={inputHandlers}
						ref={inputRef} />
				</div>
			</label>
		</div>
		{/test/.test(document.location.search) && <pre>{JSON.stringify(logsRef.current, null, 2)}</pre>}
	</>;
}