import React, { useEffect, useState } from 'react';
import { SpotifyApiContext } from 'react-spotify-api'
import { PlaylistTracks } from 'react-spotify-api'
import {
  Redirect,
  useLocation
} from "react-router-dom";


const Search = (props) => {
    const location = useLocation();
    const [songs, setSongs] = useState([]);
    const [lyrics, setLyrics] = useState([]);
    const [songLoading, setSongLoading] = useState(false);

    // Necessary to access the "next" attribute in the paginated json and get more than 100 tracks
    async function getNext100(link){
        return await fetch(link, {
          method: 'GET',
          headers: new Headers({
            'Authorization': 'Bearer '+ props.token,
          }),
        })
        .then(response => response.json())
        .then(json => {
          return json;
        });
    }

    // TODO clear songs data first to prevent duplicates?
    async function getTracks(playlistId){
        let initialFetch = await getNext100("https://api.spotify.com/v1/playlists/" + playlistId);
        let curData = initialFetch.tracks;
        let songsProcessed = 0;
        let totSongs = curData.total;
        console.log("Total songs: " + totSongs);

        for(let track of curData.items){
          // console.log(makeSongObject(track.track.name, track.track.artists[0].name, track.track.name));
          setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
          songsProcessed += 1;
        }

        while(songsProcessed < totSongs){
          let nextLink = curData.next;
          curData = await getNext100(nextLink);
          console.log(curData);

          for(let track of curData.items){
            setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
            songsProcessed += 1;
          }
        }
        setSongLoading(false);
    }

    function makeSongObject(songName, songArtist, songId){
      return {name: songName, artist: songArtist, id: songId};
    }

    useEffect(() => {
      setSongLoading(true);
      getTracks(location.state.playlistId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }  , []);
    // either programmatically generate the playlisttracks tags for all offsets or do all fetching myself
    return (
        <SpotifyApiContext.Provider value={props.token}>
          {location.state ? (
            <div>
              <p>Songs length: {songs.length}</p>
              {/* <div> */}
              {/*   {songs.map(entry => */}
              {/*     <p>{entry.name}</p> */}
              {/*   )} */}
              {/* </div> */}

              {songLoading ? (
                <div className="loader"></div>
              ) : (
                <p>done</p>
              )}
            </div>
          ) : (
              <Redirect to="/playlists"/>
          )}
        </SpotifyApiContext.Provider>

    );
}

export default Search;
