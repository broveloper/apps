import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { AppBarTop } from 'components/App';

export const ModalBar = props => {
	const {
		defaults = 'default',
		setUI,
		title = 'References',
	} = props;
	return <AppBarTop>
		<Box
			alignItems="center"
			display="flex">
			<IconButton
				edge="start"
				onClick={() => setUI(defaults)}>
				<ArrowBackIcon />
			</IconButton>
			<Typography variant="h6">{title}</Typography>
		</Box>
	</AppBarTop>;
};