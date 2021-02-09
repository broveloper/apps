import { useState } from 'react';
import { useApp } from 'components/App';
import { Modal, Recover } from 'components/Transitions';
import { ModalBar } from './ModalBar';
import { Read } from './Read';
import { Search } from './Search';
import { Versions } from './Versions';


export const Passage = () => {
	const {
		setVersion,
		version,
		versions,
	} = useApp();
	const [ui, setUI] = useState('default');
	return <>
		<Recover in={ui === 'default'}>
			<Read setUI={setUI} />
		</Recover>
		<Modal in={ui === 'search'}>
			<ModalBar setUI={setUI} />
			<Search
				setUI={setUI}
				setVersion={setVersion}
				version={version}
				versions={versions} />
		</Modal>
		<Modal in={ui === 'version'}>
			<ModalBar setUI={setUI}/>
			<Versions
				setUI={setUI}
				setVersion={setVersion}
				version={version}
				versions={versions}/>
		</Modal>
	</>;
};