import React, { useState } from 'react';
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
    const url =  localStorage.getItem('previewURL');
    const [previewURL, setPreviewURL] = useState(url);
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.get(`http://localhost:3000/replyLetter`)
            .then((res) => {
                console.log('Response: ', res.data);
                setPreviewURL(res.data.previewURL);
                localStorage.setItem('previewURL', res.data.previewURL)
            })
            .catch((error) => { console.log('Error:', error) })

    }
    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={event => handleSubmit(event)}>
                <Button className={classes.button} size="small" variant="contained" color="primary" type="submit" >
                    Activate Email Sender
                </Button>
            </form>
            <h4>{previewURL === '' ? '' : <a href={previewURL} target="_blank">Preview Email</a>}</h4>
        </div>

    )
}
export default EmailSender;