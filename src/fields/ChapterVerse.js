import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { useField } from 'react-final-form';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

const FIELD_NAME = 'chvs';

export const ChapterVerse = props => {
	const {
		disabled,
	} = props;
	const classes = useStyles();
	const field = useField(FIELD_NAME);
	const fieldProps = {
		...field.input,
		disabled,
		id: FIELD_NAME,
		label: 'Chapter Verse',
	};

	return <FormControl className={classes.formControl}>
		<TextField {...fieldProps} />
		<FormHelperText></FormHelperText>
	</FormControl>;
}