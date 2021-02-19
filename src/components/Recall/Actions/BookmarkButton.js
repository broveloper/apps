import _ from 'lodash';
import { useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { usePassage, useProfile } from '@utils/useApp';
import { Alert } from 'components/Alert';


export const BookmarkButton = props => {
	const {
		className,
	} = props;
	const {
		passage,
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

	if (!profile) return null;

	return <>
		<IconButton
			className={className}
			onClick={addToPlaylist}>
			<BookmarkIcon color="secondary" fontSize="large" />
		</IconButton>
		<Alert alertRef={alertAddRef} severity="info">Successfully Bookmarked</Alert>
	</>;
};