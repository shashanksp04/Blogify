import {useState} from 'react';
import axios from 'axios'
import useUser from '../hook/useUser';

const AddCommentForm = ({articleName, onArticleUpdated}) => {
    const [name,setName] = useState('');
    const [commentText,setCommentText] = useState('');
    const {user} = useUser();

    const addComment = async() => { 
        try{
            const token = user && await user.getIdToken();
            const headers = token ? {authoToken: token} : {};
            const response = await axios.post(`/api/articles/${articleName}/comments`, {
                postedBy: name,
                text: commentText,
            }, {
                headers,
            });
            const updatedArticle = response.data;
            onArticleUpdated(updatedArticle);
            setCommentText('');
            setName('');
        } catch(error){
            console.log(error);
        }
        
    }
    return (
        <>
            <div id="add-comment-form">
                <h3>Add a comment</h3>
                {user && <p> You are posting as {user.email}</p>}<br></br>
                <label>
                    Comment:
                    <textarea 
                            rows="4" cols="50"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)} />
                </label>
                <button onClick={addComment}>Add Comment</button>
            </div>
        </>
    )

}

export default AddCommentForm;