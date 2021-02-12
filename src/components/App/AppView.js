import { memo } from 'react';
import { Home } from 'components/Home';
import { More } from 'components/More';
import { Passage } from 'components/Passage';
import { useApp } from '@utils/useApp';

const views = {
	Home,
	More,
	Passage,
};

export const AppView = memo(() => {
	const { view } = useApp();
	const View = views[view];
	return <View />;
});