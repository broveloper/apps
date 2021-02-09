import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { AppBarTop } from 'components/App';

export const ModalBar = props => {
	const { setUI } = props;
	return <AppBarTop>
		<Box
			alignItems="center"
			display="flex">
			<IconButton
				edge="start"
				onClick={() => setUI('default')}>
				<ArrowBackIcon />
			</IconButton>
			<Typography variant="h6">{'References'}</Typography>
		</Box>
	</AppBarTop>;
};