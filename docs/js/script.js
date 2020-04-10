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
                    var h6c = $("<h6> You might be interested in: </h6>");
                    $("#infoDiv").append(h6c);

                    for (let i = 0; i < userResults.length - 16; i++) {
                        const element = userResults[i];
                        console.log(element, "userResults[]");
                        //console.log(element.wUrl);
                        var wiki = element.wUrl;
                        console.log(element.yUrl);
                        var youT = element.yUrl;
                        var name = element.Name;
                        console.log(name);
                        console.log(wiki);
                        console.log(youT);

                        //var ul = $("<ul>");
                        //var li = $("<li>");
                        var link1 = $("<a>");
                        $(link1).attr("href", wiki);
                        console.log(wiki);
                        $(link1).attr("title", "Wikipedia");
                        $(link1).text("Wikipedia link: " + wiki);
                        $(link1).addClass("link");
                        $("#infoDiv");
                        $("#infoDiv").append("<p>" + name + "</p>");
                        $("#infoDiv").append(link1);


                        var link2 = $("<a>");
                        $(link2).attr("href", youT);
                        console.log(youT);
                        $(link2).attr("title", "YouTube");
                        $(link2).text("YouTube link: " + youT);
                        $(link2).addClass("link");
                        $("#infoDiv");
                        $("#infoDiv").append(link2);



                    }
                    //////////////////////////////////////////////////Getting Wikipedia data for the date the album was release///////////////////////////
                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var month = '';
                    //If the earliest release date contains month information...
                    if (earliestRelDate.length > 4) {
                        console.log(earliestRelDate);
                        month = earliestRelDate.substring(5, 7)
                        month = Number(month) - 1;
                    }
                    //otherwise, pick a random month...
                    else month = Math.floor(Math.random() * 12);

                    //the text to find the index of in the page.
                    var startDateText = "=== " + months[month]
                    var endDateText = "=== " + months[month + 1]

                    //make an ajax call to wikipedia api based on the release year
                    $.ajax({
                        url: "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=" + earliestRelYear + "&format=json",
                        method: 'GET'
                    }).then(function (response) {
                        var facts = [];
                        var pages = Object.entries(response.query.pages);
                        var page = pages[0];
                        var text = page[1].extract;
                        var startDate = text.indexOf(startDateText);
                        var endDate = text.indexOf(endDateText);
                        text = text.slice(startDate, endDate);

                        for (let i = 1; i <= 31; i++) {
                            var startDay = months[month] + " " + i;
                            var startDayStrL = startDay.length;
                            startDayIndex = text.indexOf(startDay);
                            if (startDayIndex > -1) {
                                var fact = text.substring(startDayIndex);
                                fact = fact.substring(startDayStrL);
                                var endIndex = fact.indexOf(months[month]);
                                fact = fact.substring(0, endIndex);
                                fact = startDay + " - " + fact;
                                facts.push(fact);
                            }
                        }
                        var randFact = facts[Math.floor(Math.random() * facts.length)];

                        var ptag = $("<p>");
                        $(ptag).text(randFact);
                        $("#infoDiv").append(ptag);
                    });
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                });

        })
    })
})