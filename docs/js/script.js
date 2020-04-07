function replaceEscapeChars(str) { //helps with searches. certains songs with characters such as # signs do not search correctly without this
    var escapeChars = ["%", " ", "!", "\"", "#", "$", "&", "\'", "(", ")", "*", "+", ",", "-", ".", "/"];
    var escapeCharReplacements = ["%25", "%20", "%21", "%22", "%23", "%24", "%26", "%27", "%28", "%29", "%2A", "%2B", "%2C", "%2D", "%2E", "%2F"];
    str = str.split('');
    var newStr = '';
    for (let j = 0; j < str.length; j++) {
        var replaced = false;
        for (let i = 0; i < escapeChars.length; i++) {
            if (str[j] === escapeChars[i]) {
                newStr += escapeCharReplacements[i]
                replaced = true; //the character was replaced
            }
        }
        if (!replaced) { //if the character wasn't replaced, just add the old character to the string.
            newStr += str[j];
        }
    }
    console.log(newStr);
    return newStr;
}

function removePunc(str) { //removes problematic characters when searching the returned releases array for matching titles. One example where this is needed is God's Plan
    var lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz0123456789";
    lowerCaseLetters = lowerCaseLetters.split("");
    str = str.toLowerCase();
    str = str.split('');
    returnStr = '';
    for (let j = 0; j < str.length; j++) {
        for (let i = 0; i < lowerCaseLetters.length; i++) {
            if (str[j] === lowerCaseLetters[i]) {

                returnStr += str[j];
            }
        }
    }
    return returnStr;
}

$("#submitBTN").on("click", function (event) {
    console.log("you submitted something!");
    var myArtist = $("#first_name3").val(); //I may want to turn artist and song into objects in order to more efficiently house their properties
    var mySong = $("#first_name2").val();
    mySong = mySong.trim();
    var mySongAddress = replaceEscapeChars(mySong);
    var myArtistAddress = replaceEscapeChars(myArtist);
    var myUrl = "https://musicbrainz.org/ws/2/recording?query=" + mySongAddress + "%20AND%20artist:" + myArtistAddress + "&fmt=json";
    console.log(myUrl);
    $.ajax({
        url: myUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var earliestRelYear = 3000;
        var recordings = response.recordings;
        var earliestRelDate;
        var earliestRelId;
        var earliestRelAlbum;
        recordings.forEach(element => {
            mySong = removePunc(mySong);
            var relTitle = removePunc(element.title);
            if (relTitle.includes(mySong)) {
                // console.log(mySong, relTitle);
                var releases = element.releases;
                // console.log(releases);
                releases.forEach(element => {
                    var releaseDate = element.date;
                    if (releaseDate) {
                        var releaseYear = releaseDate.split("");
                        if (releaseYear.length > 4) {
                            releaseYear.splice(4, releaseYear.length - 4);
                        }
                        releaseYear = releaseYear.join("");
                        releaseYear = Number(releaseYear);
                        if (releaseYear < earliestRelYear) {
                            earliestRelYear = releaseYear;
                            earliestRelDate = releaseDate;
                            earliestRelId = element.id;
                            earliestRelAlbum = element["release-group"].title;
                        }
                    }
                })
            }
        });
        console.log(earliestRelId, earliestRelDate, earliestRelAlbum);
        var imageUrl = "https://coverartarchive.org/release/" + earliestRelId
        $.ajax({
            url: imageUrl,
            method: "GET"
        }).then(function (response) {
            var imgUrl = response.images[0].image;
            $(".responsive-img").attr("src", imgUrl);
        })
    })
})