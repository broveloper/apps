import { useMemo, useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { isMobile } from 'react-device-detect';
import logger from '@utils/logger';
import { useWords } from '@utils/useApp';

export const useDictate = props => {
	const {
		inputWords,
	} = useWords();
	const activeRef = useRef(false)
	const [active, setActive] = useState(activeRef.current);
	const [networkError, setNetworkError] = useState(false);
	const [error, setError] = useState(false);
	const reloadRef = useRef(0);
	const [reloadCount, setReloadCount] = useState(reloadRef.current);
	const reload = () => setReloadCount(reloadRef.current = reloadRef.current + 1);

	const memoized = useMemo(() => {
		const memoized = {};
		memoized.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
		if (error || networkError || !memoized.SpeechRecognition) return memoized;
		memoized.recognition = new memoized.SpeechRecognition();
		memoized.recognition.lang = 'en-US';
		memoized.recognition.interimResults = true;
		memoized.recognition.maxAlternatives = 1;
		memoized.recognition.continuous = true;
		memoized.recognition.onresult = (event) => {
			const { transcript } = event?.results?.[event.results.length - 1]?.[0] || {};
			logger.log('onresult', event.results.length, transcript);
			inputWords(transcript);
		}
		memoized.recognition.onspeechstart = () => {
			logger.log('onspeechstart');
		}
		memoized.recognition.onspeechend = () => {
			logger.log('onspeechend', { active: activeRef.current });
			if (activeRef.current && reloadCount === reloadRef.current) reload();
		}
		memoized.recognition.onend = () => {
			logger.log('onend', { active: activeRef.current });
			if (activeRef.current && reloadCount === reloadRef.current) reload();
		}
		memoized.recognition.onerror = err => {
			logger.log('onerror', err);
			if (err.type === 'network') setNetworkError(true);
			else setError(err);
		};
		if (activeRef.current) {
			memoized.recognition.start();
		}
		if (reloadRef.current > 0) {
			logger.log('reloaded', [reloadCount, reloadRef.current], { active: activeRef.current });
		}

		memoized.start = () => !activeRef.current && setActive(activeRef.current = true);
		memoized.stop = () => activeRef.current && setActive(activeRef.current = false);
		memoized.toggle = () => setActive(activeRef.current = !activeRef.current);
		
		return memoized;
	}, [networkError, reloadCount]);

	const enabled = !isMobile && memoized.recognition;

	useUpdateEffect(() => {
		if (enabled) {
			if (active) memoized.recognition.start();
			else memoized.recognition.stop();
		}
	}, [active]);

	return {
		...memoized,
		active,
		enabled,
	};
}