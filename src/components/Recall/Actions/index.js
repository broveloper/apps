import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { DictateButton } from 'components/DictateButton';
import { BookmarkButton } from './BookmarkButton';
import { HintButton } from './HintButton';
// import { MicButton } from './MicButton';
import { RestartButton } from './RestartButton';


const useStyles = makeStyles((theme) => ({
	actions: {
		marginTop: theme.spacing(3),
		transform: 'scale(1.2)',
	},
}));

export const Actions = () => {
	const classes = useStyles();

	return <>
		<Box
			position="absolute"
			right="4em"
			display="flex"
			flexDirection="column"
			bottom="3em">
			<BookmarkButton className={classes.actions} />
			<RestartButton className={classes.actions} />
			<DictateButton className={classes.actions} />
			<HintButton className={classes.actions} />
		</Box>
	</>;
};