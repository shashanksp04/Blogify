// localhost:3000/articles/learn-node
import {useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import articles from './article-content.js';
import NotFoundPage from "./NotFoundPage.js";
import CommentsList from '../components/CommentList'
import AddCommentForm from '../components/AddCommentForm.js';
import useUser from '../hook/useUser.js';
//import {Link} from 'react-router-dom';

const ArticlePage = () => {
    const [articleInfo,setArticleInfo] = useState({upvotes:0, comment: [], canUpvote: false});
    const {canUpvote} = articleInfo
    const { articleId } = useParams();
    const article = articles.find(article => article.name === articleId);

    const {user, isLoading} = useUser();


    useEffect(() => {
        const loadArticleInfo = async () => {
            try{
                const token = user && await user.getIdToken();
                const headers = token ? {authoToken: token} : {};
                const response = await axios.get(`/api/articles/${articleId}`,{
                    headers,
                }); // we don't need the http://localhost:8000 as it has been set as a proxy in package.json. 
                // this makes both the server think that they're running on the same address
                const newArticleInfo = response.data;
                console.log(newArticleInfo.comment);
                setArticleInfo(newArticleInfo);
            } catch(error){
                console.log(error);
            }
        }
        if(isLoading){
            loadArticleInfo();
        }
        
    },[articleId,isLoading,user]); // whenever any value in the the second parameter, which is null right now, changes the useEffect function will be run
    //const isCommentsInitialized = Array.isArray(articleInfo.comment);
    
    const addUpvote = async () =>{
        try{
            const token = user && await user.getIdToken();
            const headers = token ? {authoToken: token} : {};
            const response = await axios.put(`/api/articles/${articleId}/upvote`,
                null,{headers,},
            );
            setArticleInfo(response.data);
        } catch(error){
            console.log(error);
        }
    }
    if (!article){
        return <NotFoundPage/>;
    }
    console.log(articleInfo.comment);
    return <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user ? <button onClick={addUpvote}>{canUpvote? 'Upvote' : 'Already upvoted'}</button> : <button>Log in to upvote</button>}
            <br></br>
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph,i) => (
            <p key={i}>{paragraph}</p>
        ))}
        {user ? <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}></AddCommentForm> : <button>Log in to add a comment</button>}
        <CommentsList comments={articleInfo.comment}></CommentsList>
        {/* <p>This is the comment for the article {article.title} : {articleInfo.comments}</p> */}
        {/* <CommentsList comments={articleInfo.comments}/> */}
        {/* {isCommentsInitialized && <CommentsList comments={articleInfo.comment} />} */}
    </>
}

export default ArticlePage;


// below is the code which was used to run only the front-end 

// const { articleId } = useParams();
// const article = articles.find(article => article.name === articleId);
// if (!article){
//     return <NotFoundPage/>;
// }
// return <>
//     <h1>{article.title}</h1>
//     {article.content.map(paragraph => (
//         <p>{paragraph}</p>
//     ))}
// </>