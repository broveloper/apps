import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { useDictate } from './useDictate';


export const DictateButton = props => {
	const {
		active,
		enabled,
		toggle,
	} = useDictate(props);
	const {
		className,
	} = props;

	if (!enabled) return null;
	
	return <IconButton
		className={className}
		onClick={toggle}>
		{active
			? <MicOffIcon color="secondary" fontSize="large" />
			: <MicIcon fontSize="large" />}
	</IconButton>;
};