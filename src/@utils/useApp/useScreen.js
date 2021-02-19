import { createContext, createRef, useContext, useRef } from 'react';
import {
	Bookmarks,
	SearchPassage,
	SearchVersion,
} from 'components/Screen';

const Context = createContext(null);

export const useScreen = () => useContext(Context);

export const ScreenProvider = props => {
	const screenRefs = useRef({
		bookmarks: createRef(),
		recents: createRef(),
		searchPassage: createRef(),
		searchVersion: createRef(),
	});
	const state = {
		get bookmarks() { return screenRefs.current.bookmarks.current },
		get recents() { return screenRefs.current.recents.current },
		get searchPassage () { return screenRefs.current.searchPassage.current },
		get searchVersion() { return screenRefs.current.searchVersion.current },
	};
	return <Context.Provider value={state}>
		{props.children}
		<Bookmarks ref={screenRefs.current.bookmarks} type={'passages'} />
		<Bookmarks ref={screenRefs.current.recents} type={'recents'} />
		<SearchVersion ref={screenRefs.current.searchVersion} />
		<SearchPassage ref={screenRefs.current.searchPassage} />
	</Context.Provider>;
};