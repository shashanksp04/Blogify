import {Link, useNavigate} from 'react-router-dom';
import {getAuth, signOut} from 'firebase/auth';
import useUser from './hook/useUser.js'

const NavBar = () => {
    const {user} = useUser();
    const navigate = useNavigate();
    console.log(user);
    return <nav>
        <ul>
            <li><Link to="/">HomePage</Link></li>
            <li><Link to="/about">AboutPage</Link></li>
            <li><Link to="/articles">Articles</Link></li>
        </ul>
        <div className="nav-right">
            {user ? <button onClick={() =>signOut(getAuth())}>Log Out</button> : <button onClick={ () => { navigate('/login');}}>Log In</button>}
        </div>
    </nav>
}

export default NavBar;