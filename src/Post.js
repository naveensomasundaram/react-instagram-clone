import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { auth, db, storage } from './firebase';

function Post({username,caption,imageUrl, postId, user, handlePostingComment}) {

    const [comments, setComments ] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId)  {
            unsubscribe = db.collection('posts').doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }

        return () => {
            unsubscribe();
        };
    }, [postId]) 

    const postComment = (event) => {
        handlePostingComment(event, {postId, comment});
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">                
                <Avatar className="post__avatar" alt="Naveen" src="/static/images/avatar/1.jpg" />
                <h3> {username} </h3>
            </div>
            
            <img alt="Post Image" className="post__image" src={imageUrl}></img>
            <h4 className="post__text"> <strong> {username}: </strong> {caption} </h4>

            {
                <div className="post__comments">
                    {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}:</strong> {comment.text}
                        </p>
                    ))}
                </div>
            }            

            {user &&
                <form className="post_commentbox" noValidate autoComplete="off">
                    <input type="text" placeholder="add a comment.." value={comment} className="post_comment_input" onChange={event => setComment(event.target.value)}/>
                    <button disabled={!comment} type="submit" onClick={(event) => postComment(event)} className="post_comment_submit"> Post </button>
                </form>
            }
        </div>
    )
}


export default Post