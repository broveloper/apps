import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { usePassage } from '@utils/usePassage';
import { AppBarTheme, AppBarTop } from 'components/App';

export const ReadBar = props => {
	const { setUI } = props;
	const {
		passage,
		version,
	} = usePassage();

	return <AppBarTop>
		<Box
			alignItems="center"
			display="flex">
			<AppBarTheme>
				<Button onClick={() => setUI('search')}>
					<Box
						display="flex"
						alignItems="center">
						<span>{passage || 'Search Passage'}</span> <ArrowDropDownIcon fontSize="small" />
					</Box>
				</Button>
				<Button onClick={() => setUI('version')}>
					<Box
						display="flex"
						alignItems="center">
						{version} <ArrowDropDownIcon fontSize="small" />
					</Box>
				</Button>
			</AppBarTheme>
		</Box>
	</AppBarTop>;
};