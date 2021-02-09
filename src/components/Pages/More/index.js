import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { AppContainer, AppBarTop } from 'components/App';

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		margin: 12,
	},
	soon: {
		whiteSpace: 'pre-wrap',
	},
});

export const More = () => {
	const classes = useStyles();
	return <>
		<AppBarTop>
			<Box
				alignItems="center"
				display="flex">
				<Typography variant="subtitle1">
					<span style={{ fontWeight: 500 }}>{'MORE'}</span>
				</Typography>
			</Box>
		</AppBarTop>
		<AppContainer>

			<Card className={classes.root}>
				<CardContent>
					<Typography align="center" className={classes.soon} color="textSecondary">
						Coming soon ...
        	</Typography>
				</CardContent>

			</Card>
		</AppContainer>
	</>;
};