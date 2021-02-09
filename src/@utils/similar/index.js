let errorRules = {
	0: 0,
	3: 1,
	5: 2,
	7: 3,
};
let ruleLens = [0];
const setRuleLens = () =>
(ruleLens = Object.keys(errorRules)
	.map((key) => parseInt(key, 10))
	.sort());
setRuleLens();

export const configure = Rules => {
	if (Rules.errorRules) {
		({ errorRules } = Rules);
		setRuleLens();
	}
};

export const normalize = word => {
	if (typeof word !== "string") return word;
	const w = word
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
	let result = "";
	for (let k = 0; k < w.length; k += 1) if (w[k - 1] !== w[k]) result += w[k];

	return result;
};

export const compare = (word1, word2, maxLen, compares) => {
	let errors = 0;
	for (let k = 0; k < maxLen; k += 1) if (word1[k] !== word2[k]) errors += 1;
	let maxErrors;
	for (let k = 0; k < ruleLens.length; k += 1)
		if (maxLen >= ruleLens[k]) maxErrors = errorRules[ruleLens[k]];
	if (errors > maxErrors) return false;
	for (let j in compares) {
		if (typeof compares[j] === 'function' && compares[j](word1, word2, maxLen, maxErrors) === false) {
			return false;
		}
	}
	return true;
};

const shiftLetters = (word, index) =>
	`${word.substring(0, index)}${word[index + 1]}${word[index]}${word.substring(
		index + 2,
		word.length
	)}`;

export const areSimilar = window.areSimilar = (...words) => {
	const compares = typeof words[words.length-1] === 'string' ? null : words.pop();
	for (let k = 0; k < words.length - 1; k += 1) {
		const word1 = normalize(words[k]);
		const word2 = normalize(words[k + 1]);
		if (typeof word1 !== "string" || typeof word2 !== "string") return false;
		const maxLen = Math.max(word1.length, word2.length);

		let similar = true;
		for (let m = -1; m < maxLen - 1; m += 1) {
			similar = false;
			const compare2 = m === -1 ? word2 : shiftLetters(word2, m);
			if (compare(word1, compare2, maxLen, compares)) {
				similar = true;
				break;
			}
		}
		if (!similar) return false;
	}
	return true;
};
