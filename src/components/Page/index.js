import { useEffect, useState } from 'react';
import { Bible, getBible } from '@bible-api';
import { Form, useFormState } from 'react-final-form';
import { Book, ChapterVerse, Submit, Version } from 'fields';
import { Content } from 'components/Content';

const FormFields = props=> {
	const {
		bible,
		handleSubmit,
		setBible,
	} = props;
	const {
		version,
		book,
		chvs,
	} = useFormState()?.values;

	useEffect(() => {
		setBible(version);
	}, [version]);

	return <form onSubmit={handleSubmit}>
		<Version />
		<Book bible={bible} disabled={!bible}/>
		<ChapterVerse disabled={!book} />
		<Submit disabled={!book || !chvs} />
	</form>
};

export const Page = props => {
	const [bible, setBible] = useState();
	const [verses, setVerses] = useState(null);

	const loadBible = async version => {
		const bible = await getBible(version);
		setBible(version && bible ? new Bible(bible) : null);
	};

	const onSubmit = async values => {
		setVerses(null);
		if (!bible) return null;
		const verses = await bible.get(`${values.book} ${values.chvs}`);
		setVerses(verses);
	};
	return <>
		<Form
			bible={bible}
			onSubmit={onSubmit}
			render={formProps => <FormFields
				{...formProps}
				bible={bible}
				setBible={loadBible} />} />
		{verses && <Content verses={verses} />}
	</>;
}