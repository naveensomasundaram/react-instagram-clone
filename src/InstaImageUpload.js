import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

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
  
function InstaImageUpload(props) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [caption, setCaption ] = useState('');

    const handleOpen = () => { props.handleOpen(); };
    const handleClose = () => { props.handleClose(); };
    
    const handleFileUploadChange = (event) => {
        props.handleInstaUploadChange(event);
    }

    const handleInstaUpload = (event) => {
        props.handleInstaUpload(event, {caption});
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage"
                      alt="Instagram Logo"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"/>
    
            <form className="app__instaimageupload" noValidate autoComplete="off">
              <TextField placeholder="Caption" id="insta-caption" label="Image Caption" variant="outlined" value={caption} onChange={event => setCaption(event.target.value)}/>
              <input type="file" onChange={(event) => handleFileUploadChange(event)}/>
              <LinearProgress variant="determinate" value={props.progress} max/>
              <br/><br/>
              <Button variant="contained" color="primary" type="submit" onClick={(event) => handleInstaUpload(event)}> Upload </Button> &nbsp;&nbsp;&nbsp;
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

export default InstaImageUpload