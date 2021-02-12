import _ from 'lodash';
import clsx from 'clsx';
import { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { usePassage } from '@utils/usePassage';
import { useProfile } from '@utils/useProfile';
import { Alert } from 'components/Alert';

const useStyles = makeStyles((theme) => ({
	actions: {
		marginTop: theme.spacing(3),
		transform: 'scale(1.2)',
	},
	assist: {
		color: theme.palette.success.main,
	},
	star: {
		animation: 'starspin 600ms linear infinite, starcolor 500ms linear infinite',
	},
}));

export const ReadActions = props => {
	const {
		assistHandlers,
		completed,
		initialize,
		showMeta,
	} = props;
	const classes = useStyles();
	const {
		passage,
		verses,
		version,
	} = usePassage();
	const {
		bookmarkPassage,
		profile,
	} = useProfile();

	const alertAddRef = useRef();

	const addToPlaylist = async () => {
		if (_.find(profile.passages, { passage })) {
			alertAddRef.current.alert('Already bookmarked.');
		} else {
			await bookmarkPassage(passage, version);
			alertAddRef.current.setOpen(true);
		}
	};

	return <>
		<Box
			position="absolute"
			right="4em"
			display="flex"
			flexDirection="column"
			bottom="3em">
			{profile && <IconButton
				className={clsx(classes.actions)}
				onClick={addToPlaylist}>
				<BookmarkIcon color="secondary" fontSize="large" />
			</IconButton>}
			{!completed && verses?.length > 0 && <IconButton
				className={clsx(classes.actions)}
				onClick={initialize}>
				<SettingsBackupRestoreIcon fontSize="large" />
			</IconButton>}
			{completed
				? <IconButton
					className={clsx(classes.actions, classes.assist)}
					onClick={initialize}>
					<GradeRoundedIcon className={clsx(classes.star)} fontSize="large" />
				</IconButton>
				: <IconButton
					{...assistHandlers}
					className={clsx(classes.actions, classes.assist)}
					disabled={!passage}>
					{showMeta
						? <ExploreOffIcon color="primary" fontSize="large" />
						: <ExploreIcon fontSize="large" />}
				</IconButton>}
		</Box>

		<Alert alertRef={alertAddRef} severity="info">Successfully Bookmarked</Alert>
	</>;
};