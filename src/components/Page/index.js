// import axios from 'axios';
import { useState } from 'react';
import { Form, useFormState } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { Search, Submit, Version } from 'fields';
import { Content } from 'components/Content';
import { versesapi } from './utils';

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
	},
}));

const FormFields = props=> {
	const { handleSubmit, verses } = props;
	const { q, version } = useFormState().values;
	const classes = useStyles();

	return <>
		<form className={classes.form} onSubmit={handleSubmit}>
			<Version />
			<Search disabled={!version} />
			<Submit disabled={!version || !q} />
		</form>
		<Content verses={verses} version={version} />
	</>;
};

export const Page = props => {
	const [verses, setVerses] = useState(null);

	const onSubmit = async ({ q, version }) => {
		setVerses(await versesapi[version]?.(q));
		// setVerses(await axios.get(`/v1/${version}/text`, { params: { q } }).then(res => res.data));
	};
	
	return <>
		<Form
			onSubmit={onSubmit}
			component={FormFields}
			verses={verses} />
	</>;
}