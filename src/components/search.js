import React, { useEffect, useState } from 'react';
import { getLyrics } from 'genius-lyrics-api';
import {
  Redirect,
  useLocation
} from "react-router-dom";

import SearchBar from './searchBar.js'


const Search = (props) => {
    const location = useLocation();
    const [songs, setSongs] = useState([]);
    const [songLyrics, setSongLyrics] = useState([]);
    const [songLoading, setSongLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredSongs = filterSongs(songLyrics, searchQuery);

    const spotifyApiLink = "https://api.spotify.com/v1/playlists/";

    function makeSongObject(songName, songArtist, songId){
        return {name: songName, artist: songArtist, id: songId};
    }

    function makeLyricsObject(songName, songLyrics, songId){
        return {name: songName, lyrics: songLyrics, id: songId};
    }

    function cleanSongName(oldName){
        if(oldName.includes(" (") && oldName.includes(")")){
          oldName = oldName.split(" (")[0];
        }
        if(oldName.includes(" - ")){
          oldName = oldName.split(" - ")[0];
        }
        return oldName;
    }

    function filterSongs(entries, query){
        if(query === ""){
            return entries;
        }
        return entries.filter((entry) => {
            const curLyrics = entry.lyrics;
            return curLyrics != null && curLyrics.toLowerCase().includes(query.toLowerCase());

        });
    }

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

    async function getTracks(playlistId){
        // if we've already loaded the songs 
        if(songs.length > 0){
          setSongLoading(false);
          return;
        }
        let initialFetch = await getNext100(spotifyApiLink + playlistId);
        let curData = initialFetch.tracks;
        let songsProcessed = 0;
        let totSongs = curData.total;
        // reset the songs array just in case
        setSongs([]);

        console.log("Total songs: " + totSongs);

        for(let track of curData.items){
          // console.log(makeSongObject(track.track.name, track.track.artists[0].name, track.track.name));
          setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
          await getTrackLyrics(track.track.name, track.track.artists[0].name, track.track.id);
          songsProcessed += 1;
        }

        while(songsProcessed < totSongs){
          let nextLink = curData.next;
          curData = await getNext100(nextLink);
          console.log(curData);

          for(let track of curData.items){
            setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
            await getTrackLyrics(track.track.name, track.track.artists[0].name, track.track.id);
            songsProcessed += 1;
          }
        }
        setSongLoading(false);
    }

    async function getTrackLyrics(trackName, trackArtist, trackId){
        let geniusOptions = {
          apiKey: process.env.REACT_APP_GENIUS_TOKEN,
          title: cleanSongName(trackName),
          artist: trackArtist,
          optimizeQuery: true,
        };
        console.log(geniusOptions);

        getLyrics(geniusOptions).then((lyrics) => setSongLyrics(oldArray => [...oldArray, makeLyricsObject(trackName, lyrics, trackId)]));
    }

    useEffect(() => {
        setSongLoading(true);
        getTracks(location.state.playlistId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }  , []);

    return (
      <div>
          {location.state ? (
            <div>
              <p>Songs length: {songs.length}</p>
              <p>Lyrics length: {songLyrics.length}</p>
              <div id="searchBarContainer">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
              <p>Songs filtered by "{searchQuery}":</p>

              <div>
                {filteredSongs.map(entry =>
                  <details key={entry.id}>
                      <summary>{entry.name}</summary>

                      <p>{entry.lyrics}</p>
                  </details>
                )}
              </div>

              {songLoading ? (
                <div className="loader"></div>
              ) : (
                <p>done</p>
              )}
            </div>
          ) : (
              <Redirect to="/playlists"/>
          )}
      </div>
        
    );
}

export default Search;
