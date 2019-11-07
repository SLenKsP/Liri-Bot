require("dotenv").config();
var [, , parameter, ...arg] = process.argv;
var userInput = () => {
    if (arg.length === 0)
        return 'chalte chalte';
    else
        return arg;
}

var keys = require("./keys.js");
// var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var spotifyTrackSearch = () => {
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
            console.log(JSON.stringify(data, null, 2));
        })
}
var bandsInTownArtistEvent = () => {
    console.log("Searching Bands in town......");
};
var movieInfo = () => {
    console.log("Searching Movie Name.....");
};
var getrandomText = () => {
    var randomText = "spotify-this-song";
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