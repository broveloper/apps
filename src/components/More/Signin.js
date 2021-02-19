import _ from 'lodash';
import { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useAuth } from '@utils/useApp';
import { Alert } from 'components/Alert';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flex: '1',
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: '30%',
		'& .MuiTextField-root': {
			marginBottom: theme.spacing(2),
		},
	},
	form: {
		minWidth: 275,
		margin: '0 auto',
	},
	buttons: {
		marginLeft: theme.spacing(-1),
		marginRight: theme.spacing(-1),
		'& .MuiButton-root': {
			flex: 1,
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
		}
	}
}));

export const Signin = () => {
	const classes = useStyles();
	const {
		emailregex,
		passwordregex,
		signin,
		signup,
	} = useAuth();
	const errorRef = window.errorRef = useRef();
	const [view, setView] = useState('signin');
	const [isSubmitting, setSubmitting] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const isSignin = view === 'signin';
	const errors = {
		email: !emailregex.test(email),
		password: !passwordregex.test(password),
		password2: !isSignin && (!passwordregex.test(password2) || password !== password2),
	};
	const disableSubmit = _.chain(errors).some().value();
	const handleSubmit = async () => {
		try {
			setSubmitting(true);
			if (isSignin) await signin(email, password);
			else await signup(email, password);
		} catch (err) {
			errorRef.current.alert(err.response?.data?.message);
			setSubmitting(false);
		}
	};
	return <>
		<Alert
			alertRef={errorRef}
			severity="error">{'There was an error with the request.'}</Alert>
		<Container
			className={classes.container}
			maxWidth="xs">
			<Card className={classes.form}>
				<CardContent>
					<TextField
						disabled={isSubmitting}
						error={Boolean(email) && errors.email}
						fullWidth
						label="Email Address"
						onChange={e => setEmail(e.target.value)}
						size="small"
						type="email"
						value={email}
						variant="outlined" />
					<TextField
						disabled={isSubmitting}
						error={Boolean(password) && errors.password}
						fullWidth
						label="Password"
						onChange={e => setPassword(e.target.value)}
						helperText="Minimum 8 characters."
						size="small"
						type="password"
						value={password}
						variant="outlined" />
					{!isSignin && <TextField
						disabled={isSubmitting}
						error={Boolean(password2) && errors.password2}
						fullWidth
						id="confirm-password"
						label="Confirm Password"
						onChange={e => setPassword2(e.target.value)}
						helperText="Both passwords must match."
						size="small"
						type="password"
						value={password2}
						variant="outlined" />}
					<Box
						className={classes.buttons}
						display="flex"
						justifyContent="space-between">
						{isSubmitting
							? <Button disabled fullWidth variant="contained">
								Submitting
								</Button>
							: isSignin
								? <>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => setView('signup')}>
										Create Account
										</Button>
									<Button
										disabled={disableSubmit}
										variant="contained"
										color="primary"
										onClick={handleSubmit}>
										Sign in
										</Button>
								</>
								: <>
									<Button
										disabled={disableSubmit}
										variant="contained"
										color="primary"
										onClick={handleSubmit}>
										Create Account
										</Button>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => setView('signin')}>
										Sign in
										</Button>
								</>}
					</Box>
				</CardContent>
			</Card>
		</Container>
	</>;
};