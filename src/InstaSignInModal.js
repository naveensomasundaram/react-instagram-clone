import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function InstaSignInModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
//   const [open, setOpen] = React.useState(false);

  const [password, setPassword ] = useState('');
  const [emailAddress, setEmailAddress ] = useState('');

  // useEffect(() => {
  //   setPassword('');
  //   setEmailAddress('');
  // }, []) 

  const handleOpen = () => { props.handleOpen(); };
  const handleClose = () => { props.handleClose(); };
  const handleSignIn = (event) => { props.handleInstaSignIn(event, {password, emailAddress}); }
  const handleGoogleSignIn = (event) => { props.handleGoogleSignIn(event); }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <center>
        <img className="app__headerImage"
                  alt="Instagram Logo"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"/>

        <form className="app__signin" noValidate autoComplete="off">
          <TextField placeholder="email" id="insta-signin-email" label="Email Address" variant="outlined" value={emailAddress} onChange={event => setEmailAddress(event.target.value)}/>
          <br/><br/>
          <TextField id="insta-password" label="Password" type="password" variant="outlined" Complete="current-password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)}/>
          <br/><br/>

          <Button variant="contained" color="secondary" onClick={event => handleGoogleSignIn(event)}> Sign in with Gooogle </Button>
          <br/><br/>

          <Button variant="contained" onClick={event => handleSignIn(event)} color="primary" type="submit"> Sign In </Button> &nbsp;&nbsp;&nbsp;         

          <Button variant="contained" onClick={handleClose}>Cancel</Button>
        </form>

      </center>
    </div>
  );

  return (
    <div>      
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}