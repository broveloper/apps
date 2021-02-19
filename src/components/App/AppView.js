import { memo } from 'react';
import { Home } from 'components/Home';
import { More } from 'components/More';
import { Recall } from 'components/Recall';
import { useApp } from '@utils/useApp';

const views = {
	Home,
	More,
	Recall,
};

export const AppView = memo(() => {
	const { view } = useApp();
	const View = views[view];
	return <View />;
});