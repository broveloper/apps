import clsx from 'clsx';
import { forwardRef, memo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
// import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AppContainer, useApp } from 'components/App';
import 'scripture-styles/dist/css/scripture-styles.css';
import './styles.css';
import { ReadBar } from './ReadBar';
import { useVerses } from './hooks';

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
			'-webkit-touch-callout': 'none',
			'-webkit-user-select': 'none',
			'-moz-user-select': 'none',
			'-ms-user-select': 'none',
			'user-select': 'none',
		},
		map: {
			position: 'relative',
			'& [class^="p"]': {
				color: /test/.test(document.location.search)
					? theme.palette.text.hint
					: theme.palette.type === 'light'
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
				caretColor: theme.palette.text.secondary,
				color: 'transparent',
			}
		},
		assist: {
			color: theme.palette.success.main,
			transform: 'scale(1.2)'
		},
		iconholder: {
			position: 'fixed',
		},
		icon: {
			fontSize: 18,
			position: 'absolute',
			top: -18,
			right: -16,
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
	};
});

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
		<div className={clsx(classes.iconholder, classes.wrongholder)} ref={wrongRef}><ExposureNeg1Icon color="error" className={clsx(classes.icon)} /></div>
	</div>;
}));

export const Read = props => {
	const {
		setUI,
		transitionState,
	} = props;
	const classes = useStyles();
	const {
		bible,
		passage,
	} = useApp();
	const {
		assistHandlers,
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

	useEffect(() => {
		if (transitionState === 'entered' && passage) {
			inputRef.current.focus();
		}
	}, [transitionState, passage]);

	return <>
		<ReadBar setUI={setUI} />
		<Box
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'scroll' }}
				display="flex"
				flexDirection="column"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%">
				<AppContainer style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
					<Box
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
								<Input
									inputHandlers={inputHandlers}
									ref={inputRef}
									starRef={starRef}
									wrongRef={wrongRef} />
							</Box>
						</label>
					</Box>
					<Box px={3} py={6}>
						<Typography
							align="center"
							component="div"
							variant="caption">
							{bible?.copyright}
						</Typography>
					</Box>
					{logsRef.current.logging && <pre>{JSON.stringify(logsRef.current, null, 2)}</pre>}
				</AppContainer>
			</Box>
			<Box
				position="absolute"
				right="4em"
				bottom="3em">
				<IconButton
					{...assistHandlers}
					className={classes.assist}
					disabled={!passage}>
					<VisibilityIcon size="large" fontSize="large" />
				</IconButton>
			</Box>
		</Box>
	</>;
}