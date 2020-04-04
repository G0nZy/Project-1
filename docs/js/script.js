function removePunc(str) {
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
    // console.log("you submitted something!");
    var myArtist = $("#first_name3").val();
    var mySong = $("#first_name2").val();
    mySong = mySong.trim();
    $.ajax({
        url: "https://musicbrainz.org/ws/2/recording?query=" + mySong + "%20AND%20artist:" + myArtist + "&fmt=json",
        method: "GET"
    }).then(function (response) {
        // console.log(response);
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
    })
})