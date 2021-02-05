import { forwardRef, memo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import HealingRoundedIcon from '@material-ui/icons/HealingRounded';
import 'scripture-styles/dist/css/scripture-styles.css';
import './styles.css';
import { useVerses } from './hooks';

const useStyles = makeStyles((theme) => ({
	content: {
		margin: theme.spacing(1),
		position: 'relative',
	},
	passage: {
		whiteSpace: 'pre-wrap',
		color: 'rgba(17,17,17,1)',
		'& [class^="newline"]': {
			display: 'block',
			height: '8px',
		},
		'& [class*="newline"] + [class^="p"], & [class^="p"]:first-child': {
			'& [data-sid]:first-child': {
				textIndent: '1.4em',
			},
		},
		'& [class^="p"]': {
			display: 'inline',
			textIndent: 0,
		},
		'& [data-sid]': {
			display: 'inline-block',
			textIndent: '.5em',
		},
		'-webkit-touch-callout': 'none',
		'-webkit-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'user-select': 'none',
	},
	map: {
		position: 'relative',
		'& [class^="p"]': {
			color: 'rgba(17,17,17,0)',
			transition: 'color 300ms',
		},
		'& [data-sid]': { color: 'rgba(17,17,17,.7)' },
	},
	mapMeta: {
		'& [class^="p"]': { color: 'rgba(17,17,17,.3)' },
	},
	edit: {
		position: 'absolute', top: '0', left: '0',
		width: '100%', height: '100%', outline: 'none',
		'& [class^="p"]:last-of-type': { display: 'inline' },
		'& [data-sid]': { opacity: 0 },
	},
	input: {
		display: 'inline-block',
		position: 'relative',
		'& input': {
			margin: 0,
			padding: 0,
			border: 0,
			outline: 0,
			background: 'transparent',
			width: '1px',
			caretColor: 'rgba(17,17,17,1)',
			color: 'transparent',
		}
	},
	iconholder: {
		position: 'fixed',
	},
	icon: {
		fontSize: '16px',
		position: 'absolute',
		top: '-18px',
		right: '-16px',
	},
	starholder: {
		animation: 'starholder 2s ease-out 1 forwards',
		animationPlayState: 'paused',
	},
	star: {
		animation: 'starspin 600ms linear infinite, starcolor 500ms linear infinite',
	},
	wrongholder: {
		animation: 'wrongholder 800ms ease-out 1 forwards',
		animationPlayState: 'paused',
	},
	wrong: {
		animation: 'wrongspin 1500ms linear infinite, wrongcolor 1s linear 1 forwards',
	},
}));

const Input = memo(forwardRef((props, ref) => {
	const {
		inputHandlers,
		starRef,
		wrongRef,
	} = props;
	const classes = useStyles();
	return <div className={classes.input}>
		<input
			{...inputHandlers}
			autoCapitalize="none"
			defaultValue=""
			id="input"
			name="input"
			ref={ref}
			type="text" />
		<div className={clsx(classes.iconholder, classes.starholder)} ref={starRef}><GradeRoundedIcon className={clsx(classes.icon, classes.star)} /></div>
		<div className={clsx(classes.iconholder, classes.wrongholder)} ref={wrongRef}><HealingRoundedIcon className={clsx(classes.icon, classes.wrong)} /></div>
	</div>;
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
		starRef,
		wrongRef,
	} = useVerses(props);

	return <>
		<div
			{...contentHandlers}
			className={clsx('scripture-styles', classes.content)}>
			<label htmlFor="input">
				<div
					className={clsx(classes.passage, classes.map, { [classes.mapMeta]: showMeta })}
					ref={mapRef}
					spellCheck={false} />
				<div
					className={clsx(classes.passage, classes.edit)}
					ref={editRef}
					spellCheck={false}>
					<Input
						inputHandlers={inputHandlers}
						ref={inputRef}
						starRef={starRef}
						wrongRef={wrongRef} />
				</div>
			</label>
		</div>
		{logsRef.current.logging && <pre>{JSON.stringify(logsRef.current, null, 2)}</pre>}
	</>;
}