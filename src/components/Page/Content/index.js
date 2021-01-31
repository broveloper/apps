import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles.module.scss';

const useStyles = makeStyles((theme) => ({
	content: {
		margin: theme.spacing(1),
	},
}));

export const Content = props => {
	const {
		html,
	} = props;
	const classes = useStyles();

	return <div className={clsx(classes.content, styles.content)}>
		<div
			contentEditable="true"
			dangerouslySetInnerHTML={{ __html: html }} />
	</div>
}