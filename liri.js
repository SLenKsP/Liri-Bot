require("dotenv").config();
// require modules
let keys = require("./keys.js"); //npm keys
let axios = require("axios"); //npm axios
let stringify = require('json-stringify-safe'); //npm json-stingify-safe to avoid circular references
let moment = require("moment");
//Log data into log.text
let line = `---------------------------------------`;
let LOGIt = (data) => {
    fs.appendFile("log.txt", data, (err) => {
        if (err) console.error(`Error is : ${ err }`);
    });
    console.log(data);
}

// variables
let [node, statement, parameter, ...arg] = process.argv;
let searchedCommand = [node.substr(node.lastIndexOf("/") + 1), statement.substr(statement.lastIndexOf("/") + 1), parameter, ...arg].join(" ");
let fs = require("fs");
LOGIt(`Entered Command: "${searchedCommand}"\n${line}\n`);
let userInput = (defaultSearchTerm) => {
    if (arg.length === 0)
        return defaultSearchTerm;
    else {
        var entireString = arg.join(" ");

        return entireString.charAt(0).toUpperCase() + entireString.slice(1);;
    }
};

//Printing search result to console and adding it to log file
let searchedText = (input, param) => {
    return `${line}\nSearched for : "${ input }" in "${ param}" \n${line}\n`;
}
let resultTitle = `*******************\n Result(s) \n*******************\n`;
//logging searched terms and result sections

//Spotify output 
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let spotifyTrackSearch = (input, paraMeter) => {

    LOGIt(searchedText(input, paraMeter));
    LOGIt(resultTitle);
    //spotify song search

    spotify.search({
            type: "track",
            query: input,
            limit: 1
        },
        function (err, data) {
            if (err) {
                console.log(`Error occurred: ${err}`);
            }
            var spotifyResult = `Song Info---------\nArtist Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].artists[ 0 ].name : "N/A" }\nThe Song Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].name : "N/A" }\nPreview Link: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].preview_url : "N/A" }\nAlbum Name: ${ data.tracks.items[ 0 ] ? data.tracks.items[ 0 ].album.name : "N/A" }\n${line}\n`;

            LOGIt(spotifyResult);

        })
}

let bandsInTownArtistEvent = () => {
    defaultSearchTerm = `Celine Dion`;
    let bandsInTownURL = "https://rest.bandsintown.com/artists/" + userInput(defaultSearchTerm) + "/events?app_id=codingbootcamp";

    LOGIt(searchedText(userInput(defaultSearchTerm), parameter));
    LOGIt(resultTitle);
    axios.get(bandsInTownURL).then(function (response) {
        let eventInfo = response.data;
        // console.log(eventInfo);
        eventInfo.forEach(item => {
            let eventRegion = item.venue.region;
            // if (eventRegion === "KS" || eventRegion === "MO")
            // {

            var bandsSearchResult = `Band info-------\nVenue: ${ item.venue.name }\nLocation: ${ item.venue.city },${ item.venue.region }\nEvent Date: ${ moment(item.datetime).format('L') }\n${ line }\n`
            LOGIt(bandsSearchResult);
            // }
        });
    });
};

let movieInfo = () => {
    defaultSearchTerm = `mr.nobody`;
    let movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + userInput(defaultSearchTerm) + "&plot=full";
    LOGIt(searchedText(userInput(defaultSearchTerm), parameter));
    LOGIt(resultTitle);
    axios.get(movieURL).then(function (response) {
        let movieInfo = response.data;
        // console.log(stringify(movieInfo, null, 2));
        let movieRatings = movieInfo.Ratings;
        let findRotten = movieRatings.find(data => data.Source = "Rotten Tomatoes");
        let movieResult = `\nMovie Info------\nMovie Title: ${ movieInfo.Title }\nReleased Year: ${movieInfo.Year}\nIMDB Rating: ${movieInfo.imdbRating}\nRotten Tomatoes Ratings: ${findRotten.Value}\nCountry: ${movieInfo.Country}\nLanguage: ${movieInfo.Language}\nPlot: ${movieInfo.Plot}\nActors: ${movieInfo.Actors}\n${line}\n`;

        LOGIt(movieResult);
    })
};
let getrandomText = () => {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err)
            console.error(`Error occurred: ${ err }`);
        // console.log(data);
        let splitData = data.split(",");
        // console.log(splitData);
        let parameter = splitData[0];
        let song = splitData[1];
        let searchStatement = `**Because you searched Do-what-it-Says, it will read data from random.txt and get you some results!\nRandom.text has "Parameter: ${ parameter }" and "searched term is: ${ song }"\n${line}\n`;
        LOGIt(searchStatement);
        spotifyTrackSearch(song, parameter);
    })

};
// check condition for parameters

switch (parameter) {
    case "concert-this":
        bandsInTownArtistEvent();
        break;
    case "spotify-this-song":
        defaultSearchTerm = `"The Sign" by Ace of Base`;
        spotifyTrackSearch(userInput(defaultSearchTerm), parameter);
        break;
    case "movie-this":
        movieInfo();
        break;
    case "do-what-it-says":
        getrandomText();
        break;
    default:
        LOGIt("Enter correct parameter.\nEx: concert-this {concert-name} or \n spotify-this-song {song-name}");
}