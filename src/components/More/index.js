import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useProfile } from '@utils/useApp';
import { AppBarTop } from 'components/App';
import { Menu } from './Menu';
import { Signin } from './Signin';


export const More = () => {
	const { profile } = useProfile();

	return <>
		<AppBarTop>
			<Box
				alignItems="center"
				display="flex">
				<Typography variant="subtitle1">
					<span style={{ fontWeight: 500 }}>{'MORE'}</span>
				</Typography>
			</Box>
		</AppBarTop>
		{profile ? <Menu /> : <Signin />}
	</>;
};