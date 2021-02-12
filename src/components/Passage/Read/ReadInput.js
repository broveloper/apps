import clsx from 'clsx';
import { forwardRef, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';

const useStyles = makeStyles(theme => ({
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
		},
	},
	iconholder: {
		position: 'absolute',
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
}));

export const ReadInput = memo(forwardRef((props, ref) => {
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