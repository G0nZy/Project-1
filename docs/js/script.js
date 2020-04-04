$("#submitBTN").on("click", function (event) {
    console.log("you submitted something!");
    var myArtist = $("#first_name3").val();
    var mySong = $("#first_name2").val();
    $.ajax({
        url: "https://musicbrainz.org/ws/2/recording?query=" + mySong + "%20AND%20artist:" + myArtist + "&fmt=json",
        method: "GET"
    }).then(function (response2) {
        // console.log(response2);
        var earliestRelYear = 3000;
        var recordings = response2.recordings;
        var earliestRelDate;
        var earliestRelId;
        var earliestRelAlbum;
        recordings.forEach(element => {
            var releases = element.releases;
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

        });
        console.log(earliestRelId, earliestRelDate, earliestRelAlbum);
    })
})