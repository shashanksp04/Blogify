import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticleListPage from './pages/ArticleListPage';
import ArticlePage from './pages/ArticlePage';
import NavBar from './NavBar';
import NotFoundPage from './pages/NotFoundPage';
import CreateAccountPage from './pages/CreateAccountPage';
import LoginPage from './pages/LoginPage';

// to run the front-end using "npm run start"
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/about" element={<AboutPage></AboutPage>}></Route>
            <Route path="/articles" element={<ArticleListPage></ArticleListPage>}></Route>
            <Route path="/articles/:articleId" element={<ArticlePage></ArticlePage>}></Route>
            <Route path="login" element={<LoginPage></LoginPage>}></Route>
            <Route path="create-account" element={<CreateAccountPage></CreateAccountPage>}></Route>
            <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          </Routes>      
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;


