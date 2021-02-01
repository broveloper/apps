import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Page } from 'components/Page';
import theme from './theme';

export const App = () => {
  return <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Container maxWidth="sm">
			<Box my={4}>
				<Typography variant="h4" component="h1" gutterBottom>
					Bible Verses
					</Typography>
				<Page />
			</Box>
		</Container>
  </ThemeProvider>;
};
