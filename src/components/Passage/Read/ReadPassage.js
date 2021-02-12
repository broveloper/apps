import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { ReadInput } from './ReadInput';

const useStyles = makeStyles((theme) => {
	return {
		passage: {
			whiteSpace: 'pre-wrap',
			color: theme.palette.text.primary,
			'& [class^="newline"]': {
				display: 'block',
				height: '8px',
			},
			'& [class*="newline"] + [class^="p"], & [class^="p"]:first-child': {
				textIndent: '1.4em !important',
			},
			'& [class^="p"]': {
				display: 'inline',
				textIndent: 0,
			},
			'& [class^="v"]': {
				display: 'inline-block',
			},
			'& [class^="text"]': {
				display: 'inline',
			},
			'& [class^="text"]:first-child': {
				display: 'inline-block',
			},
		},
		map: {
			position: 'relative',
			'& [class^="p"]': {
				color: theme.palette.type === 'light'
					? 'rgba(0,0,0,0)'
					: 'rgba(255,255,255,0)',
				transition: 'color 300ms',
			},
			'& [class^="v"]': {
				color: theme.palette.text.secondary,
			},
		},
		mapMeta: {
			'& [class^="p"]': {
				color: theme.palette.text.hint,
			},
		},
		edit: {
			'& [class^="p"]:last-of-type': { display: 'inline' },
			'& [class^="v"]': { opacity: 0 },
			'& .error': {
				display: 'inline',
				color: theme.palette.error.main,
				position: 'fixed',
				animation: 'errorholder 800ms ease-out 1 forwards',
			}
		},
	};
});

export const ReadPassage = props => {
	const classes = useStyles();
	const {
		contentHandlers,
		editRef,
		inputHandlers,
		inputRef,
		mapRef,
		showMeta,
		starRef,
		wrongRef,
	} = props;

	return <Box
		{...contentHandlers}
		my={3}
		flex="1"
		position="relative"
		className={clsx('scripture-styles')}>
		<label htmlFor="input">
			<Box
				position="relative"
				className={clsx(classes.passage, classes.map, { [classes.mapMeta]: showMeta })}
				ref={mapRef} />
			<Box
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				className={clsx(classes.passage, classes.edit)}
				ref={editRef}>
				<ReadInput
					inputHandlers={inputHandlers}
					ref={inputRef}
					starRef={starRef}
					wrongRef={wrongRef} />
			</Box>
		</label>
	</Box>;
}