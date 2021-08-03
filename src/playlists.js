import { SpotifyApiContext } from 'react-spotify-api'
import { UserPlaylists } from 'react-spotify-api'
import { useHistory } from "react-router-dom";


const Playlists = (props) => {
  let history = useHistory();

  function playlistClick(id) {
    history.push("/search", {playlistId: id});
  }

  return (
    <SpotifyApiContext.Provider value={props.token}>

      <div className="playlistContainer">
        <h1 className="bigText"><strong>Select Playlist</strong></h1>

        <UserPlaylists>
          {(playlists, loading, error) =>
            !playlists.loading && playlists.data ? (
              playlists.data.items.map(playlist => (

                <div key={playlist.uri} className="playlist" onClick={() => playlistClick(playlist.id)}>
                  <img key={playlist.href} src={playlist.images[0].url} alt={"Image for '" + playlist.name + "'"}/>
                  <p key={playlist.id} className="playlistName"><strong>{playlist.name}</strong></p>
                </div>

              ))
            ) : (
                <div className="loader"></div>
            )}
        </UserPlaylists>

        {props.children}
      </div>

    </SpotifyApiContext.Provider>
  );
}

export default Playlists;
