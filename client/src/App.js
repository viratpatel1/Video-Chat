import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "./Componends/Notification";
import Options from "./Componends/Options";
import VideoPlayer from "./Componends/VideoPlayer";
// import './App.css';


const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

function App()
{
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color='inherit'>
        <Typography variant="h3" align="center">Video Chats</Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notification />
      </Options>

    </div>
  );
}

export default App;
