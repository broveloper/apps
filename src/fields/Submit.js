import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	submit: {
		margin: theme.spacing(1),
		marginTop: 22,
		flex: '0 0 80px',
	},
}));

export const Submit = props => {
	const {
		disabled,
	} = props;
	const classes = useStyles();

	return <Button
			className={classes.submit}
			color="primary"
			disabled={disabled}
			disableElevation={true}
			type="submit"
			variant="contained">Start</Button>;
};