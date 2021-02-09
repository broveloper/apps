import { useMemo } from 'react';
import { useApp } from 'components/App';
import * as Pages from 'components/Pages';

export const AppPage = () => {
	const {
		page,
	} = useApp();
	const Page = useMemo(() => Pages[page], [page])
	return <Page />;
}
