import { useLocalStorage } from 'react-use';

const ACCESS_TOKEN_KEY = 'memo.token';

export const useAccessToken = () => {
	const [token, setToken, removeToken] = useLocalStorage(ACCESS_TOKEN_KEY, null);
	return { token, setToken, removeToken };
};