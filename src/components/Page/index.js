import axios from 'axios';
import { useState, useEffect } from 'react';
import { Form, useFormState } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { Search, Submit, Version } from 'fields';
import { Content } from 'components/Content';

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
	},
}));

const FormFields = props=> {
	const { handleSubmit, setVerses } = props;
	const { q, version } = useFormState().values;
	const classes = useStyles();

	useEffect(() => {
		setVerses(null);
	}, [q, version]);

	return <form className={classes.form} onSubmit={handleSubmit}>
		<Version />
		<Search disabled={!version} />
		<Submit disabled={!version || !q} />
	</form>;
};

export const Page = props => {
	const [verses, setVerses] = useState(null);

	const onSubmit = async ({ q, version }) => {
		setVerses(await axios.get(`/v1/${version}/text`, { params: { q, headings: true } }).then(res => res.data));
	};
	
	return <>
		<Form
			onSubmit={onSubmit}
			component={FormFields}
			setVerses={setVerses} />
		<Content verses={verses} />
	</>;
}