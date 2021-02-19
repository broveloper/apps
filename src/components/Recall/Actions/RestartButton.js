import IconButton from '@material-ui/core/IconButton';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { usePassage, useWords } from '@utils/useApp';


export const RestartButton = props => {
	const {
		className,
	} = props;
	const {
		verses,
	} = usePassage();
	const {
		completed,
		resetWords,
	} = useWords();

	if (completed || verses?.length < 1) return null;

	return <IconButton
		className={className}
		onClick={resetWords}>
		<SettingsBackupRestoreIcon fontSize="large" />
	</IconButton>
};