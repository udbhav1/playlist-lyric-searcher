import '../styles/App.css'
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
    // const [songLoading, setSongLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalSongs, setTotalSongs] = useState(0);
    const filteredSongs = constructJSX(filterSongs(songLyrics, searchQuery), searchQuery);

    const spotifyApiLink = "https://api.spotify.com/v1/playlists/";

    function makeSongObject(songName, songArtist, songId){
        return {name: songName, artist: songArtist, id: songId};
    }

    function makeLyricsObject(songName, songArtist, songLyrics, songId){
        let sLyrics = [];
        if(songLyrics != null){
          sLyrics = songLyrics.split("\n");
        }
        return {name: songName, artist: songArtist, lyrics: sLyrics, id: songId};
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
            return curLyrics != null && curLyrics.join(" ").toLowerCase().includes(query.toLowerCase());

        });
    }

    // returns jsx of a line with the search query highlighted
    function highlightTerm(line, lineIndex, query){
        if(line == null){
          return <p key={lineIndex}></p>;
        }
        // check if just whitespace
        if(!(/\S/.test(query))) {
          return <p key={lineIndex}>{line}</p>;
        }
        // best way to preserve case while searching case insensitive
        let reg = new RegExp(query, 'gi');
        // arbitrary delimiter string that wont occur in song lyrics
        let delim = "、";
        let searchedStr = line.replace(reg, function(s) { return delim + s + delim } );
        let splitStr = searchedStr.split(/(、)/g);

        let finalJSX = []
        for(let i = 0; i < splitStr.length; i++){
          if(splitStr[i] === delim){
            finalJSX.push(<mark key={i.toString() + lineIndex.toString()}>{splitStr[i+1]}</mark>);
            i+=2;
          }
          else{
            finalJSX.push(<span key={lineIndex.toString() + i.toString()}>{splitStr[i]}</span>);
          }
        }
        return <p key={lineIndex}>{finalJSX}</p>;
    }

    // returns the final jsx for search results
    function constructJSX(entries, query){
        return (entries.map((entry, songIndex) =>
              <div id="searchResult" key={entry.id}>
                  <details>
                      <summary id="songTitle"><b>{entry.name}</b> - {entry.artist}</summary>

                      <hr/> 

                      {entry.lyrics.map((line, lineIndex) =>
                          highlightTerm(line, lineIndex, query)
                      )}
                  </details>
              </div>
            )
        )
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
          return;
        }
        let initialFetch = await getNext100(spotifyApiLink + playlistId);
        let curData = initialFetch.tracks;
        let songsProcessed = 0;
        let totSongs = curData.total;
        // reset the songs array just in case
        setSongs([]);

        console.log("Total songs: " + totSongs);
        setTotalSongs(totSongs);

        for(let track of curData.items){
          // console.log(makeSongObject(track.track.name, track.track.artists[0].name, track.track.name));
          setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
          await getTrackLyrics(track.track.name, track.track.artists[0].name, track.track.id);
          songsProcessed += 1;
        }

        while(songsProcessed < totSongs){
          let nextLink = curData.next;
          curData = await getNext100(nextLink);
          // console.log(curData);

          for(let track of curData.items){
            setSongs(oldArray => [...oldArray, makeSongObject(track.track.name, track.track.artists[0].name, track.track.id)]);
            await getTrackLyrics(track.track.name, track.track.artists[0].name, track.track.id);
            songsProcessed += 1;
          }
        }
        // setSongLoading(false);
    }

    async function getTrackLyrics(trackName, trackArtist, trackId){
        let geniusOptions = {
          apiKey: process.env.REACT_APP_GENIUS_TOKEN,
          title: cleanSongName(trackName),
          artist: trackArtist,
          optimizeQuery: true,
        };
        // console.log(geniusOptions);

        getLyrics(geniusOptions).then((lyrics) => setSongLyrics(oldArray => [...oldArray, makeLyricsObject(trackName, trackArtist, lyrics, trackId)]));
    }

    useEffect(() => {
        // setSongLoading(true);
        getTracks(location.state.playlistId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }  , []);

    return (
      <div>
          {location.state ? (
            <div>

              <div id="searchBarContainer">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>

              {songLyrics.length < totalSongs &&
                <div id="infoContainer">
                  {/* <div className="loader"></div> */}
                  <p id="progressInfo">Songs Processed: {songs.length}/{totalSongs}</p>
                  <p id="progressInfo">Lyrics Processed: {songLyrics.length}/{totalSongs}</p>
                </div>
              }

              {filteredSongs}


            </div>
          ) : (
              <Redirect to="/playlists"/>
          )}
      </div>
        
    );
}

export default Search;
