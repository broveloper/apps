import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Bible } from '@bible-api';
import { Form, useFormState } from 'react-final-form';
import { Book, ChapterVerse, Submit, Version } from 'fields';
import { Content } from './Content';

const FormFields = props=> {
	const {
		bible,
		handleSubmit,
		html,
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
		<Content html={html} />
	</form>
};


export const Page = props => {
	const [bible, setBible] = useState();
	const [html, setHtml] = useState();
	const onSubmit = async values => {
		if (!bible) return null;
		const verses = await bible.get(`${values.book} ${values.chvs}`);
		const html = _.chain(verses).flatten().map('html').join('').value();
		setHtml(html);
	};
	return <>
		<Form
			bible={bible}
			onSubmit={onSubmit}
			render={formProps => <FormFields
				{...formProps}
				bible={bible}
				html={html}
				setBible={version => setBible(version ? new Bible(version) : null)} />} />
	</>;
}