import { useMemo, useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import logger from '@utils/logger';
import { useWords } from '@utils/useApp';

const useMic = props => {
	const {
		inputWords,
	} = useWords();
	const activeRef = useRef(false)
	const [active, setActive] = useState(activeRef.current);
	const [hasError, setHasError] = useState(false);
	const reloadRef = useRef(0);
	const [reloadCount, setReloadCount] = useState(reloadRef.current);
	const reload = () => setReloadCount(reloadRef.current = reloadRef.current + 1);

	const [recognition, SpeechRecognition] = useMemo(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.lang = 'en-US';
		recognition.interimResults = true;
		recognition.maxAlternatives = 1;
		recognition.continuous = true;
		recognition.onresult = (event) => {
			const { transcript } = event?.results?.[event.results.length - 1]?.[0] || {};
			logger.log('onresult', event.results.length, transcript);
			inputWords(transcript);
		}
		recognition.onspeechstart = () => {
			logger.log('onspeechstart');
		}
		recognition.onspeechend = () => {
			logger.log('onspeechend', { active: activeRef.current });
			if (activeRef.current && reloadCount === reloadRef.current) reload();
		}
		recognition.onend = () => {
			logger.log('onend', { active: activeRef.current });
			if (activeRef.current && reloadCount === reloadRef.current) reload();
		}
		recognition.onerror = err => {logger.log('onend', { active: activeRef.current });
			logger.log('onerror', err)
			setHasError(true);
		};
		if (activeRef.current) recognition.start();
		if (reloadRef.current > 0) {
			logger.log('reloaded', [reloadCount, reloadRef.current], { active: activeRef.current });
		}
		return [recognition, SpeechRecognition];
	}, [reloadCount]);

	const start = () => !activeRef.current && setActive(activeRef.current = true);
	const stop = () => activeRef.current && setActive(activeRef.current = false);
	const toggle = () => setActive(activeRef.current = !activeRef.current);

	const enabled = !hasError && SpeechRecognition != null;

	useUpdateEffect(() => {
		if (enabled) {
			if (active) recognition.start();
			else recognition.stop();
		}
	}, [active])

	return {
		active,
		enabled,
		start,
		stop,
		toggle,
	};
}


export const MicButton = props => {
	const {
		className,
	} = props;
	const {
		active,
		toggle,
	} = useMic(props);

	return <IconButton
		className={className}
		onClick={toggle}>
		{active
			? <MicOffIcon color="secondary" fontSize="large" />
			: <MicIcon fontSize="large" />}
	</IconButton>;
}