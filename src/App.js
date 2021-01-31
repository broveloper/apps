import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import Link from '@material-ui/core/Link';
import { Page } from 'components/Page';
// import { ProTip } from 'components/ProTip';

// const Copyright = () => {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Brosite
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const App = () => {

  return <Container maxWidth="sm">
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bible Verses
        </Typography>
      <Page />
    </Box>
  </Container>;
}

export default App;
