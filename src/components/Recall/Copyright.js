import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { usePassage } from '@utils/useApp';

export const Copyright = () => {
	const { bible } = usePassage();
	return <>
		<Box px={3} py={6}>
			<Typography
				align="center"
				component="div"
				variant="caption">
				{bible?.copyright}
			</Typography>
		</Box>
	</>;
};