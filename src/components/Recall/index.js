import Box from '@material-ui/core/Box';
import logger from '@utils/logger';
import { AppContainer } from 'components/App';
import { Copyright } from './Copyright';
import { Actions } from './Actions';
import { SearchBar } from './SearchBar';
import { Words } from './Words';

export const Recall = props => {

	return <>
		<SearchBar/>
		<Box
			component={AppContainer}
			display="flex"
			flexDirection="column"
			flex="1"
			position="relative">
			<Box
				style={{ overflow: 'hidden scroll' }}
				component={AppContainer}
				display="flex"
				flexDirection="column"
				position="absolute"
				top="0"
				left="0"
				width="100%"
				height="100%"
				mt={2}>
				<Box position="relative">
					<Words hint />
					<Words />
				</Box>
				<Copyright />
				{logger.enabled && <pre>{logger.logs}</pre>}
			</Box>
			<Actions />
		</Box>
	</>;
};