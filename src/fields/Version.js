import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useField } from 'react-final-form';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 80,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const FIELD_NAME = 'version';

export const Version = props => {
	const classes = useStyles();
	const field = useField(FIELD_NAME);
	const fieldProps = {
		...field.input,
		inputProps: {
			name: FIELD_NAME,
			id: FIELD_NAME,
		},
		native: true,
	};

	return <FormControl className={classes.formControl}>
		<InputLabel htmlFor={FIELD_NAME}>Version</InputLabel>
		<Select {...fieldProps}>
			<option aria-label="Select Version" value="" />
			<option value={'kjv'}>KJV</option>
			<option value={'asv'}>ASV</option>
		</Select>
		<FormHelperText></FormHelperText>
	</FormControl>;
}