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
    var myArtist = $("#first_name3").val(); //I may want to turn artist and song into objects in order to more efficiently house their properties
    var mySong = $("#first_name2").val();
    var songDisplayTitle = mySong;
    mySong = mySong.trim();
    var mySongAddress = replaceEscapeChars(mySong);
    var myArtistAddress = replaceEscapeChars(myArtist);
    var myUrl = "https://musicbrainz.org/ws/2/recording?query=" + mySongAddress + "%20AND%20artist:" + myArtistAddress + "&fmt=json";
    $.ajax({
        url: myUrl,
        method: "GET"
    }).then(function (response) {
        var earliestRelYear = 3000;
        var recordings = response.recordings;
        var earliestRelDate;
        var earliestRelId;
        var earliestRelAlbum;
        recordings.forEach(element => {
            mySong = removePunc(mySong);
            var relTitle = removePunc(element.title);
            if (relTitle.includes(mySong)) {
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
            }
        });
        console.log(earliestRelId, earliestRelDate, earliestRelAlbum);
        $("#infoDiv").empty();
        var newDiv = $("<div>");
        var h5 = $("<h5>");
        $(h5).text("Song: " + songDisplayTitle);
        $(newDiv).append(h5);

        var h5b = $("<h5>");
        $(h5b).text("Album: " + earliestRelAlbum);
        $(newDiv).append(h5b);

        var h6 = $("<h6>");
        $(h6).text(earliestRelDate);
        $(newDiv).append(h6);
        $("#infoDiv").append(newDiv);




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

$("#submitBTN").on("click", function (event) {
    event.preventDefault();
    var input = $("#first_name3").val();
    console.log(input);


    var queryURL = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=" + input + "&k=362011-songinth-1KFPJ7MX&info=1";

    // Perfoming an AJAX GET request to our queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // After the data from the AJAX request comes back
        .then(function (response) {
            console.log(response);
            console.log(response.Similar.Results);
            var userResults = response.Similar.Results;
            var output = $("#taste-dive");
            console.log(response.Similar.Results[0].wUrl);
            console.log(response.Similar.Results[0].yUrl);

            for (let i = 0; i < userResults.length - 16; i++) {
                const element = userResults[i];
                console.log(element.wUrl);
                var wiki = element.wUrl;
                console.log(element.yUrl);
                var youT = element.yUrl;
                console.log(wiki);
                console.log(youT);

                
                var li = $("<li>");
                var link1 = $("<a>");
                link1.attr("href", wiki);
                console.log(wiki);
                link1.attr("title", "Wikipedia");
                link1.text("Wikipedia link: " + wiki);
                link1.addClass("link");
                //console.log(link1[0].relList.href);
                var wikiInfo = $(li).text(link1);
                $(output).append(wikiInfo);
                console.log(wikiInfo);
    

                
                var li = $("<li>");
                var link2 = $("<a>");
                link2.attr("href", youT);
                console.log(youT);
                link2.attr("title", "YouTube");
                link2.text("YouTube link: " + youT);
                link2.addClass("link");
                console.log(link2);
                var youInfo = $(li).text(link2);
                $(output).append(youInfo);
                console.log(youInfo);


            }
        });
});