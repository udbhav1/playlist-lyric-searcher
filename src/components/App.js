import '../styles/App.css'
import '../styles/background.sass'
import { SpotifyAuth} from 'react-spotify-auth'
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Playlists from './playlists.js';
import Search from './search.js';
import TopBar from './topBar.js';


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
                  <TopBar backButton={false} logout={true} deleteFunc={deleteCookie}/>

                  <Playlists token={token}/>
                </div>
              ) : (
                  <Redirect to="/"/>
              )}
            </Route>

            <Route path="/search">
              {token ? (
                <div>
                  <TopBar backButton={true} logout={true} deleteFunc={deleteCookie}/>

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
                    <TopBar backButton={false} logout={false} deleteFunc={deleteCookie}/>

                    <div className="siteName">
                        <h1 className="bigText"><strong>Playlist Lyric Searcher</strong></h1>

                        <div className="spotifyLoginContainer">
                          <SpotifyAuth
                            className="spotifyLoginButton"
                            redirectUri={'http://localhost:5000'}
                            clientID={process.env.REACT_APP_SPOTIFY_CLIENT_ID}
                            scopes={['playlist-read-collaborative', 'playlist-read-private', 'user-library-read']}
                          />
                        </div>
                    </div>
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
