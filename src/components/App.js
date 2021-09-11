import '../styles/App.css'
import '../styles/background.sass'
import githubLogo from '../images/github-logo.png'
import backButton from '../images/back-button.png'
import { SpotifyAuth} from 'react-spotify-auth'
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Login from './login.js';
import Playlists from './playlists.js';
import Search from './search.js';


function App() {

  const [token, setToken] = useState(null);

  // delete token on logout
  function deleteCookie(){
    Cookies.remove('spotifyAuthToken');
    setToken(null);
  }

  // re render if token changes
  useEffect(() => {
      setToken(Cookies.get('spotifyAuthToken'));
      console.log("Spotify Auth Token: " + token);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }  , [token]);

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
                  <div id="topBar">
                    <a id="backButtonContainer" href="/">
                      <img src={backButton} width="42" height="42" alt="Back Button" />
                    </a>
                    <a id="githubLogoContainer" href="https://github.com/udbhav1/playlist-lyric-searcher">
                      <img src={githubLogo} width="42" height="42" alt="Github Logo"/>
                    </a>
                  </div>

                  <button onClick={deleteCookie}>
                    Logout
                  </button>

                  <Playlists token={token}/>
                </div>
              ) : (
                  <Redirect to="/"/>
              )}
            </Route>

            <Route path="/search">
              {token ? (
                <div>
                  <div id="topBar">
                    <a id="backButtonContainer" href="/playlists">
                      <img src={backButton} width="42" height="42" alt="Back Button" />
                    </a>
                    <a id="githubLogoContainer" href="https://github.com/udbhav1/playlist-lyric-searcher">
                      <img src={githubLogo} width="42" height="42" alt="Github Logo"/>
                    </a>
                  </div>

                  <button onClick={deleteCookie}>
                    Logout
                  </button>
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
                  <div>
                    <div id="topBar">
                      <a id="githubLogoContainer" href="https://github.com/udbhav1/playlist-lyric-searcher">
                        <img src={githubLogo} width="42" height="42" alt="Github Logo"/>
                      </a>
                    </div>

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
                  </div>
                )}
            </Route>

          </Switch>
        </div>

      </div>
    </Router>

  );
}

export default App;
