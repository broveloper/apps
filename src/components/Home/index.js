import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { AppBarTop, AppContainer } from 'components/App';

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		margin: 12,
	},
	divider: {
		marginTop: 16,
		marginBottom: 16,
	},
	title: {
		fontSize: 14,
	},
	verse: {
		whiteSpace: 'pre-wrap',
	},
	author: {
		marginTop: 12,
	},
	message: {
		minWidth: 275,
		marginTop: 24,
		padding: '0 2em',
		whiteSpace: 'pre-wrap',
	},
	feedback: {
		fontSize: 14,
		marginTop: 24,
	},
});

export const Home = () => {
	const classes = useStyles();
	const theme = useTheme();
	return <>
		<AppBarTop>
			<Box
				alignItems="center"
				display="flex">
				<Typography variant="subtitle1">
					<span style={{ fontWeight: 500 }}>{'RECALL'}</span>
					<span style={{ color: theme.palette.primary.main, fontWeight: 700 }}>{'SCRIPTURE'}</span>
				</Typography>
			</Box>
		</AppBarTop>
		<AppContainer>
			
			<Card className={classes.root}>
				<CardContent>
					<Typography align="center" className={classes.title} color="textSecondary" gutterBottom>
						What does the bible say about memorizing scripture?
        	</Typography>
					<Divider className={classes.divider} />
					<Typography align="center" className={classes.verse} color="textSecondary">
						"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be complete, equipped for every good work."
        	</Typography>
					<Typography align="center" className={classes.author} color="textSecondary">
						2 Timothy 3:16-17
        	</Typography>
					<Divider className={classes.divider} />
					<Typography align="center" className={classes.message} variant="body1" component="p">
						{'\tThis application will hopefully be a useful tool for those who desire to equip themselves with the Word of God. It can be used on desktops or mobile devices.'}
						<br /><br />
						{'\tUpcoming features include creating user login, recent verses recalled, & saving verses to recall. Check back regularly for updates.'}
					</Typography>
					<Typography align="center" className={classes.feedback} color="textSecondary"  component="p">
						Please send feedback to <Link href="email:broveloper@gmail.com">broveloper@gmail.com</Link>
					</Typography>
				</CardContent>
				
			</Card>
		</AppContainer>
	</>;
};