import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import { usePassage, useWords } from '@utils/useApp';

const useStyles = makeStyles((theme) => ({
	assist: {
		color: theme.palette.success.main,
	},
	star: {
		animation: 'starspin 600ms linear infinite, starcolor 500ms linear infinite',
	},
}));

export const HintButton = props => {
	const {
		className,
	} = props;
	const classes = useStyles();
	const {
		passage,
	} = usePassage();
	const {
		completed,
		showHint,
		toggleHint,
	} = useWords();

	return completed
		? <IconButton
			className={clsx(className, classes.assist)}
			onClick={toggleHint}>
			<GradeRoundedIcon className={clsx(classes.star)} fontSize="large" />
		</IconButton>
		: <IconButton
			className={clsx(className, classes.assist)}
			disabled={!passage}
			onClick={toggleHint}>
			{showHint
				? <ExploreOffIcon color="primary" fontSize="large" />
				: <ExploreIcon fontSize="large" />}
		</IconButton>
};