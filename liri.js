require("dotenv").config();
// require modules
let keys = require("./keys.js"); //npm keys
let axios = require("axios"); //npm axios
let stringify = require('json-stringify-safe'); //npm json-stingify-safe to avoid circular references
//Log data into log.text
let LOGIt = (data) => {
    fs.appendFile("log.txt", data, (err) => {
        if (err) console.error(`Error is : ${ err }`);
    });
    console.log(data);
}

// variables
let [, , parameter, ...arg] = process.argv;
let fs = require("fs");
let userInput = () => {
    if (arg.length === 0)
        return 'The Sign By Ace Of Base';
    else {
        var entireString = arg.join(" ");

        return entireString.charAt(0).toUpperCase() + entireString.slice(1);;
    }


}

//Printing search result to console and adding it to log file
let searchedText = `\n-------------------\nSearched for : "${ userInput() }" in "${ parameter }" \n-------------------\n`;
let resultTitle = `*******************\n Result(s) \n*******************\n`;
//logging searched terms and result sections
LOGIt(searchedText);
LOGIt(resultTitle);

//Spotify output 
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let spotifyTrackSearch = () => {
    //spotify song search
    spotify.search({
            type: "track",
            query: userInput(),
            limit: 1
        },
        function (err, data) {
            if (err) {
                console.log(`Error occurred: ${err}`);
            }
            var spotifyResult = `Artist Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].artists[ 0 ].name : "N/A" }\nThe Song Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].name : "N/A" }\nPreview Link: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].preview_url : "N/A" }\nAlbum Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].album.name : "N/A" }\n`;

            LOGIt(spotifyResult);

        })
}
let bandsInTownURL = "https://rest.bandsintown.com/artists/" + userInput() + "/events?app_id=codingbootcamp";
let bandsInTownArtistEvent = () => {
    axios.get(bandsInTownURL).then(function (response) {
        let eventInfo = response.data;
        eventInfo.forEach(item => {
            let eventRegion = item.venue.region;
            if (eventRegion === "KS" || eventRegion === "MO") {
                var bandsSearchResult = `Venue: ${ item.venue.name }\nLocation: ${ item.venue.city },${ item.venue.region }\nEvent Date: ${ item.datetime }\n`
                LOGIt(bandsSearchResult);
            }
        });
    });
};
let movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + userInput()+"&plot=full";
let movieInfo = () => {
    axios.get(movieURL).then(function (response) {
        let movieInfo = response.data;
        // console.log(stringify(movieInfo, null, 2));
        let movieResult = `\nMovie Title: ${ movieInfo.Title }`;
        LOGIt(movieResult);
    })
};
let getrandomText = () => {
    let randomText = "spotify-this-song";
    if (randomText.includes("spotify-this-song")) {
        spotifyTrackSearch();
    } else {
        console.log("Random text was......");
    }

};
// check condition for parameters
switch (parameter) {
    case "concert-this":
        bandsInTownArtistEvent();
        break;
    case "spotify-this-song":
        spotifyTrackSearch();
        break;
    case "movie-this":
        movieInfo();
        break;
    case "do-what-it-says":
        getrandomText();
        break;
    default:
        console.log("Enter correct parameter.\nEx: concert-this {concert-name} or \n spotify-this-song {song-name}");
}