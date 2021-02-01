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

const demoVerses = [
  [
    {
      "html": "<p class=\"p\"><span data-number=\"1\" data-sid=\"GEN 1:1\" class=\"v\">1</span>In the beginning God created the heaven and the earth. </p>",
      "ref": "Genesis 1:1"
    },
    {
      "html": "<p class=\"p\"><span data-number=\"2\" data-sid=\"GEN 1:2\" class=\"v\">2</span>And the earth was without form, and void; and darkness <span class=\"add\">was</span> upon the face of the deep. And the Spirit of God moved upon the face of the waters.</p>",
      "ref": "Genesis 1:2"
    },
    {
      "html": "<p class=\"p\"><span data-number=\"3\" data-sid=\"GEN 1:3\" class=\"v\">3</span>And God said, Let there be light: and there was light. </p>",
      "ref": "Genesis 1:3"
    }
  ]
];

export const Page = props => {
	const [bible, setBible] = useState();
	const [verses, setVerses] = useState(demoVerses);
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
				setBible={version => setBible(version ? new Bible(version) : null)} />} />
		{verses && <Content verses={verses} />}
	</>;
}