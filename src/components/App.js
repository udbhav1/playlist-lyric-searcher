import '../styles/App.css'
import '../styles/background.sass'
import { SpotifyAuth} from 'react-spotify-auth'
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Login from './login.js';
import Playlists from './playlists.js';
import Search from './search.js';


function App() {
  const token = Cookies.get('spotifyAuthToken');
  console.log("Spotify Auth Token: " + token);
  return (

    <Router>
      <div className="container">
        <div className="stars"></div>
        <div className="stars1"></div>
        <div className="stars2"></div>
        <div className="shooting-stars"></div>

        <div className="App">
          <Switch>

            <Route path="/playlists">
              {token ? (
                <div>
                  {/* <nav> */}
                  {/*   <ul> */}
                  {/*       <li> */}
                  {/*         <Link to="/search">Search</Link> */}
                  {/*       </li> */}
                  {/*       <li> */}
                  {/*         <Link to="/">Home</Link> */}
                  {/*       </li> */}
                  {/*   </ul> */}
                  {/* </nav> */}
                  <Playlists token={token}/>
                </div>
              ) : (
                  <Redirect to="/"/>
              )}
            </Route>

            <Route path="/search">
              {token ? (
                <div>
                  <nav>
                    <ul>
                      <li>
                        <Link to="/playlists">Playlists</Link>
                      </li>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                    </ul>
                  </nav>

                  <Search token={token}/>
                </div>
              ) : (
                  <Redirect to="/"/>
              )}
            </Route>

            {/* Displays login page or redirects if access token already exists in cookies */}
            <Route path="/">
                {token ? (
                  <Redirect to="/playlists"/>
                ) : (
                    <Login>
                      <div className="spotifyLoginContainer">
                        <SpotifyAuth
                          className="spotifyLoginButton"
                          redirectUri={'http://localhost:5000'}
                          clientID={process.env.REACT_APP_SPOTIFY_CLIENT_ID}
                          scopes={['playlist-read-collaborative', 'playlist-read-private', 'user-library-read']}
                        />
                      </div>
                    </Login>
                )}
            </Route>

          </Switch>
        </div>

      </div>
    </Router>

  );
}

export default App;
