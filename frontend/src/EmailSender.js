import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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

function EmailSender() {
    const classes = useStyles();
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:3000/replyLetter`)
            .then((res) => console.log('Response: ', res))
            .catch((error) => { console.log('Error:', error) })

    }
    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={event => handleSubmit(event)}>
                <Button className={classes.button} size="small" variant="contained" color="primary" type="submit" >
                    Activate Email Sender
                </Button>
            </form>
        </div>

    )
}
export default EmailSender;