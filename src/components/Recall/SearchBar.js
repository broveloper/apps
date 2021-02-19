import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { usePassage, useScreen } from '@utils/useApp';
import { AppBarTheme, AppBarTop } from 'components/App';

export const SearchBar = () => {
	const {
		searchPassage,
		searchVersion,
	} = useScreen();
	const {
		passage,
		version,
	} = usePassage();

	return <AppBarTop>
		<Box
			alignItems="center"
			display="flex">
			<AppBarTheme>
				<Button onClick={() => searchPassage.show()}>
					<Box
						display="flex"
						alignItems="center">
						<span>{passage || 'Search Passage'}</span> <ArrowDropDownIcon fontSize="small" />
					</Box>
				</Button>
				<Button onClick={() => searchVersion.show()}>
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