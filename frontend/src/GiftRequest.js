import React, {useState} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    },
  },
  button: {
    margin: theme.spacing(1),
  }
}));


function GiftRequest() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [wish, setWish] = useState('');
  const [res, setResponse] = useState({ username: '', userid: '', birthdate: '', age: '', wish: '', message: '' });
  const isFieldEmpty = (username === '' || wish === '');


  const handleClickOpen = () => {

    if (isFieldEmpty) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFieldEmpty) {
      axios.post(`http://localhost:3000/sendlettertoSanta`, { username, wish })
        .then((res) => { setResponse(res.data.data) })
        .catch((error) => { console.log('Error:', error) })
    }

  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
            <h1>A letter to Santa</h1>
            <h2>Ho ho ho, what you want for Christmas?</h2>
          <div>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={event => handleSubmit(event)}>
              <div>
                <div>
                  <TextField
                    id="outlined-required"
                    label="Username"
                    placeholder="charlie.brown"
                    variant="outlined"
                    helperText='Required*'
                    onChange={event => setUsername(event.target.value)}
                  //onChange={event => setClient({ username: event.target.value })}
                  />
                </div>
                <div>
                  <TextField
                    id="standard-multiline-static"
                    placeholder="Gift!"
                    label="What do you want for christmas?"
                    variant="outlined"
                    rows={4}
                    multiline
                    helperText='Required*'
                    onChange={event => setWish(event.target.value)}
                  //onChange={event => setClient({ wish: event.target.value })}
                  />
                </div>
                <div>
                  <Button className={classes.button} size="small" variant="contained" color="primary" type="submit" onClick={handleClickOpen}>
                    Send Letter
            </Button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Hi {res.username},
                <p>{res.message}</p>
                  <p>Other Info:</p>
                  <p>Age:{res.age}</p>
                  <p>Birthdate: {res.birthdate}</p>
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button className={classes.button} size="small" variant="contained" onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Container>
      </React.Fragment>
    </div>


  );
}

export default GiftRequest;