import {Link} from 'react-router-dom';

const ArticlesList = ({articles}) => {
    return <>
    {/* <h1>Articles</h1> */}
    {articles.map(article => (
        <Link key= {article.name} className="article-list-item" to={`/articles/${article.name}`}>
            <div>
                <h3>{article.title}</h3>
                <p>{article.content[0].substring(150)}...</p>
            </div>
        </Link>
    ))}
    </>
}

export default ArticlesList;