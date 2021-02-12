import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useProfile } from '@utils/useProfile';
import { AppBarTop } from 'components/App';
import { Modal, Recover } from 'components/Transitions';
import { ModalBar } from 'components/ModalBar';

import { Menu } from './Menu';
import { Bookmarks } from './Bookmarks';
import { Signin } from './Signin';


const Defaults = props => {
	const { setUI } = props;
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
		{profile ? <Menu setUI={setUI} /> : <Signin />}
	</>;
};

export const More = () => {
	const { profile } = useProfile();
	const [ui, setUI] = useState('default');

	return <>
		<Recover in={ui === 'default'}>
			<Defaults setUI={setUI}/>
		</Recover>
		{profile && <>
			<Modal in={ui === 'bookmarks'}>
				<ModalBar setUI={setUI} />
				<Bookmarks setUI={setUI} type="passages" />
			</Modal>
			<Modal in={ui === 'recents'}>
				<ModalBar setUI={setUI} />
				<Bookmarks setUI={setUI} type="recents" />
			</Modal>
		</>}
	</>;
};