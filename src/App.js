import react, { useState, useEffect } from 'react';
import Post from './Post';
import { auth, db, storage, provider } from './firebase';
import InstaSignUpModal from './InstaSignUpModal';
import InstaSignInModal from './InstaSignInModal';
import Button from '@material-ui/core/Button';
import InstaImageUpload from './InstaImageUpload';
import firebase from 'firebase';
import InstagramEmbed from 'react-instagram-embed';

function App() {

    const [posts, setPosts ] = useState([]);
    const [showSignUpModal, toggleSignUpModal] = useState(false);
    const [showSignInModal, toggleSignInModal] = useState(false);
    const [showInstaImgUploadModal, toggleInstaImgUploadModal] = useState(false);
    const [user, setUser] = useState(null);
    const [username, setUsername ] = useState('');

    //NPS: for image upload
    const [image, setImage ] = useState(null);
    const [progress, setProgress ] = useState(0);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                // console.log(authUser);
                setUser(authUser);

                if(authUser.displayName) {}
                else {
                    return authUser.updateProfile({
                        displayName: username,
                    })
                }
            }
            else
                setUser(null); 
        })

        return () => {
            // performing clean up action..???
            unsubscribe();
        }
    }, [user, username]);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => 
                ({id: doc.id, post: doc.data()})
            ))
        })
    }, []) 

    const handleSignUpModalOpen = () => { toggleSignUpModal(true); };

    const handleSignUpModalClose = () => { toggleSignUpModal(false); };

    const handleSignInModalOpen = () => { toggleSignInModal(true); }

    const handleSignInModalClose = () => { toggleSignInModal(false); }

    const handleInstaImgUploadModalOpen = () => { toggleInstaImgUploadModal(true); }

    const handleInstaImgUploadModalClose = () => { toggleInstaImgUploadModal(false); }

    const handleInstaSignUp = (event, signUpDetails) => {
        event.preventDefault();        
        setUsername(signUpDetails.username);

        auth.createUserWithEmailAndPassword(signUpDetails.emailAddress, signUpDetails.password)
        .then((authUser) => {            
            return authUser.user.updateProfile({ displayName: username})
        })
        .catch((error) => alert(error.message));        
        handleSignUpModalClose();
    }

    const handleGoogleSignUp = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).then(function(authUser) {
            var token = authUser.credential.accessToken;
            var user = authUser.user;
        })
        .catch(function(error) {
            alert(error.message);
        });
        handleSignUpModalClose();
    }

    const handleInstaSignIn = (event, signInDetails) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(signInDetails.emailAddress, signInDetails.password)
        .catch((error) => { alert(error.message)});
        handleSignInModalClose();
    }

    const handleGoogleSignIn = (event) => {
        event.preventDefault();
        auth.signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
        })
        .catch(function(error) {
            alert(error.message);
        });
        handleSignInModalClose();
    }

    const handleInstaUploadChange = (event) => {
        event.preventDefault();

        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleInstaUpload = (event, uploadDetails) =>{
        event.preventDefault();
        // console.log("upload details: ", uploadDetails);
        const uploadTask = storage.ref(`image/${image.name}`).put(image);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 10);
            setProgress(progress);
        }, (error) => {
            alert(error.message);
        }, () => {
            // on fileupload complete....
            storage.ref("image").child(image.name).getDownloadURL().then(url => {
                // post the image to the url..
                db.collection('posts').add({
                    caption: uploadDetails.caption,
                    imageUrl:url,
                    username:user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            setProgress(0);
            handleInstaImgUploadModalClose();
        })
    }

    const handlePostingComment = (event, commentDetails) => {
        event.preventDefault();
        db.collection('posts').doc(commentDetails.postId).collection('comments').add({
            text:commentDetails.comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    return (
        <>

        <InstaSignUpModal 
            open={showSignUpModal} 
            handleOpen={handleSignUpModalOpen} 
            handleClose={handleSignUpModalClose}
            handleInstaSignUp={handleInstaSignUp}
            handleGoogleSignUp={handleGoogleSignUp}/>
        
        <InstaSignInModal 
            open={showSignInModal}
            handleOpen={handleSignInModalOpen}
            handleClose={handleSignInModalClose}
            handleInstaSignIn={handleInstaSignIn}
            handleGoogleSignIn={handleGoogleSignIn}
            />

        <InstaImageUpload 
            open={showInstaImgUploadModal}
            progress={progress}
            handleOpen={handleInstaImgUploadModalOpen}
            handleClose={handleInstaImgUploadModalClose}
            handleInstaUploadChange={handleInstaUploadChange}
            handleInstaUpload={handleInstaUpload}
            />
        

        <div className="app">
            <div className="app__header">
                <img className="app__headerImage"
                alt="Instagram Logo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"/>

                {user ?
                (
                    <div className="app__signUpLoginButtonContainer">
                        <Button variant="contained" color="secondary" onClick={() => handleInstaImgUploadModalOpen()}> Upload </Button>
                        <Button variant="contained" color="secondary" onClick={() => auth.signOut()}> Log me out </Button>
                    </div>
                )
                :
                (
                    <div className="app__signUpLoginButtonContainer">
                        <Button variant="contained" color="primary" onClick={handleSignUpModalOpen}> New User? Sign Up </Button>
                        <Button variant="contained" color="secondary" onClick={handleSignInModalOpen}> Login </Button>
                    </div>
                )}
            </div>
        </div>
        <h1> Your posts..</h1>
        
        <div className="app__posts">
            <div className="app__post_left">
                {posts.map(({id, post}) => <Post key={id} {...post} postId={id} user={user} handlePostingComment={handlePostingComment}/>)}
            </div>
            <div className="app__post_right">
                <InstagramEmbed
                    url='https://www.instagram.com/p/B_uf9dmAGpw/'
                    clientAccessToken='123|456'
                    maxWidth={320}
                    hideCaption={false}
                    containerTagName='div'
                    protocol=''
                    injectScript
                    onLoading={() => {}}
                    onSuccess={() => {}}
                    onAfterRender={() => {}}
                    onFailure={() => {}}
                />
            </div>
        </div>    
        </>
    )
}

export default App;