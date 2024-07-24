import articles from './article-content.js';
import ArticlesList from '../components/ArticlesList.js';
// import {Link} from 'react-router-dom';

const ArticleListPage = () => {
    return <>
    <h1>Articles</h1>
    <ArticlesList articles={articles}></ArticlesList>
    </>
}

export default ArticleListPage;