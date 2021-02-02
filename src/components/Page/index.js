import axios from 'axios';
import { useState } from 'react';
import { Form, useFormState } from 'react-final-form';
import { Search, Submit, Version } from 'fields';
import { Content } from 'components/Content';

const FormFields = props=> {
	const { handleSubmit } = props;
	const { q, version } = useFormState().values;

	return <form onSubmit={handleSubmit}>
		<Version />
		<Search disabled={!version} />
		<Submit disabled={!version || !q} />
	</form>
};

export const Page = props => {
	const [verses, setVerses] = useState(null);

	const onSubmit = async ({ q, version }) => {
		const res = await axios.get(`/v1/${version}/text`, { params: { q } });
		setVerses(res.data);
	};
	
	return <>
		<Form
			onSubmit={onSubmit}
			component={FormFields} />
		<Content verses={verses} />
	</>;
}