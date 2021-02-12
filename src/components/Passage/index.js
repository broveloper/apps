import { useState } from 'react';
import { Modal, Recover } from 'components/Transitions';
import { ModalBar } from 'components/ModalBar';
import { Read } from './Read';
import { Search } from './Search';
import { Versions } from './Versions';


export const Passage = () => {
	const [ui, setUI] = useState('default');
	return <>
		<Recover in={ui === 'default'}>
			<Read setUI={setUI} />
		</Recover>
		<Modal in={ui === 'search'}>
			<ModalBar setUI={setUI} />
			<Search setUI={setUI} />
		</Modal>
		<Modal in={ui === 'version'}>
			<ModalBar setUI={setUI}/>
			<Versions setUI={setUI} />
		</Modal>
	</>;
};