import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { AppContainer } from 'components/App';
import { ReadActions } from './ReadActions';
import { ReadBar } from './ReadBar';
import { ReadPassage } from './ReadPassage';
import { useVerses } from './hooks';

export const Read = props => {
	const {
		setUI,
		transitionState,
	} = props;
	const {
		bible,
		assistHandlers,
		completed,
		contentHandlers,
		editRef,
		initialize,
		inputHandlers,
		inputRef,
		logsRef,
		mapRef,
		passage,
		showMeta,
		starRef,
		wrongRef,
	} = useVerses(props);

	useEffect(() => {
		if (transitionState === 'entered' && passage) {
			inputRef.current.focus();
		}
	}, [transitionState, passage]);

	return <>
		<ReadBar initialize={initialize} setUI={setUI} />
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
				height="100%">
				<ReadPassage
					contentHandlers={contentHandlers}
					editRef={editRef}
					inputHandlers={inputHandlers}
					inputRef={inputRef}
					mapRef={mapRef}
					showMeta={showMeta}
					starRef={starRef}
					wrongRef={wrongRef} />
				<Box px={3} py={6}>
					<Typography
						align="center"
						component="div"
						variant="caption">
						{bible?.copyright}
					</Typography>
				</Box>
				{logsRef.current.logging && <pre>{JSON.stringify(logsRef.current, null, 2)}</pre>}
			</Box>
			<ReadActions
				assistHandlers={assistHandlers}
				completed={completed}
				initialize={initialize}
				showMeta={showMeta} />
		</Box>
	</>;
};