// Configures firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDlrxw6U4xrfWQI_ff-T9Sn3FWLk-9n3Sk",
    authDomain: "eatdrinktravel-25d2f.firebaseapp.com",
    databaseURL: "https://eatdrinktravel-25d2f.firebaseio.com",
    projectId: "eatdrinktravel-25d2f",
    storageBucket: "eatdrinktravel-25d2f.appspot.com",
    messagingSenderId: "855598110418",
    appId: "1:855598110418:web:8fe153607ff7c6ec"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Creates refference for firebase.
var dataRef = firebase.database();


// create a open function for calling Ajax
function openconnection(location) {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        initMap(response.results[0].geometry.location)
        console.log(response.location);
    });
}
var map;
var eventObj;
var markerArr = [];
function initMap(latLng) {
    map = new google.maps.Map(document.getElementById('mapArea'), {
        center: latLng,
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControl: true
    });
}
$(document).on("click", "#submit-btn", function (event) {
    event.preventDefault();
    $("#eventArea").empty();
    // Added by /jyoti to clear or empty the error-input message
    $("#error-input").empty();

    //Added by Jyoti
    var empty = document.forms["form1"]["text1"].value;

    if (empty === "") {
        var p = $("<p>");
        p.text("Please Enter the City");
        p.css("color", "red");
        $("#error-input").append(p);

    }
    else {
        getMap();
        displayApiData();
    }


});
var locArr = [];
//Created this event to locate on the map by click on the button
// code added by Jyoti
$(document).on("click", ".map-button", function (event) {

    event.preventDefault();
    var idClicked = $(this).attr("id");
    console.log(eventObj.events[idClicked].name);
    var name = eventObj.events[idClicked].name;
    var eventAddress = eventObj.events[idClicked]._embedded.venues[0].address.line1;
    console.log(eventAddress);
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + eventAddress + "&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var myLatLng = response.results[0].geometry.location;
        console.log(myLatLng);
        //Added for windowinfo of the event on the map by Jyoti
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h6 id="firstHeading" class="firstHeading">' + name + '<br>' + eventAddress + '</h6>' + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var marker = new google.maps.Marker({
            position: myLatLng,
            // animation:google.maps.Animation.BOUNCE,
            map: map,
            title: eventAddress,
            draggable: true,
            center: myLatLng,
        });
        map.setCenter(marker.getPosition())
        markerArr.push(infowindow);
        google.maps.event.addListener(marker, 'click', function (e) {
            for (let i = 0; i < markerArr.length; i++) {
                markerArr[i].close();
            }
            infowindow.open(map, marker);
            var pos = map.getZoom();
            map.setZoom(10);
            map.setCenter(marker.getPosition());
            window.setTimeout(function () { map.setZoom(pos); }, 3000);


        });


    });
});

// Function for dumping the JSON content for each button into the div

function getMap() {
    var location = $("#userInput").val();
    console.log("Location:::" + location);
    openconnection(location);
}

function displayApiData() {
    var location = $("#userInput").val().trim();
    var startDate = $("#startDate").val().trim();
    // Added a code to check  statdate and end date 
    var endDate = $("#endDate").val().trim();
    dataRef.ref().push({
        City: location,
        StartDate: startDate,
        EndDate: endDate
    });
    console.log(startDate);
    console.log(endDate);
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events?size=10&apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&city=" + location + "";
    // &localStartDateTime=" + startDate + ""
    // locale=*&city=" + location + "
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        eventObj = response._embedded;
        var response = response._embedded;
        console.log(response);
        // opening of for loop
        for (var i = 0; i < response.events.length; i++) {
            console.log(response.events[i])
            // display the event and images
            var eventDiv = $("<div>");
            eventDiv.addClass("event-div")
            var eventRow = $("<div>");
            eventRow.addClass("row");
            var tickets = response.events[i].url;
            var name = response.events[i].name;
            var loc = response.events[i]._embedded.venues[0].address;
            var latLng = response.events[i]._embedded.venues[0].location;
            console.log(name);

            //  Turns event names into links to ticketmaster.
            var linkName = $("<a>");
            linkName.attr("href", tickets);
            linkName.text(name);
            linkName.attr("target","_blank")
            console.log(tickets);
            
            console.log("address:" + JSON.stringify(loc));
            for (var j = 0; j < response.events[i].images.length; j++) {
                const element = response.events[i].images[j];
                if (element.ratio === "4_3") {
                    var imageDiv = $("<img>");
                    imageDiv.attr("src", element.url);
                    imageDiv.addClass("images col-6")
                    eventRow.append(imageDiv);
                    break;
                }
                console.log(element.url);

            }
            var p = $("<p>");
            var mapButton = $("<button>");
            // added a class to the button by Jyoti
            mapButton.addClass("map-button");
            mapButton.attr("id", i);
            var localdate = response.events[i].dates.start.localDate;
            date1 = moment(localdate, "YYYY-MM-DD").format("ddd, MMMM Do");
            // moment($("#train-start").val(),"HH:mm").format("HH:mm");
            console.log("DAte Format::" + date1);
            //Checking for the time is displayed in the api a making a condition according to that.by Jyoti
            var time1;
            var date1;
            var localtime = response.events[i].dates.start.localTime;

                               
                        var p = $("<p>");
                        var titleDiv = $("<div>")
                        var mapButton = $("<button>");
                        // added a class to the button by Jyoti
                        mapButton.addClass("map-button");
                        mapButton.attr("id", i);
                        var date=response.events[i].dates.start.localDate;
                        // moment($("#train-start").val(),"HH:mm").format("HH:mm");
                        var date1=moment(date,"YYYY-MM-DD").format("ddd, MMMM do");
                        console.log("DAte Format::"+date1);
                        var time=response.events[i].dates.start.localTime;
                        var time1=moment(time,"HH:mm:ss").format("hh:mm A");
                        console.log("Time value :::::"+time);
                        
                        var time1=moment(time,"HH:mm:ss").format("hh:mm:ss A");
                        console.log("Time::::"+time1);
                        // p.html("Name: " + response.events[i].name + "<br>" + "Date: " + response.events[i].dates.start.localDate + "<br>" + "Time: " + response.events[i].dates.start.localTime + "<br>" + "Venue: " + response.events[i]._embedded.venues[0].name + "<br>")
                       //Added the date and time by jyoti
                    //    p.html(response.events[i].name + "<br>"  + date1 +  time1 + "<br>"  + response.events[i]._embedded.venues[0].name + "<br>")
                        // mapButton.text("Locate on Map");
                        //Added the date and time by jyoti
                        // p.html("Date: " + date1 + "<br>" + "Time: " + time1 + "<br>" + "Venue: " + response.events[i]._embedded.venues[0].name + "<br>")
                        titleDiv.addClass("event-title")
                        titleDiv.html(response.events[i].name + "<br>");
                        infoDiv.addClass("info-text")
                        infoDiv.html(date1 + "," + " " + time1 + "<br>"  + response.events[i]._embedded.venues[0].name + "<br>")
                        mapButton.text("Locate on Map");
                        // p.prepend(titleDiv);
                        p.prepend(linkName);
                        p.append(infoDiv);
                        p.append(mapButton);
                        p.addClass("text col-6")
                        eventRow.append(p);
                        eventDiv.append(eventRow);
                        $("#eventArea").prepend(eventDiv);
                   
            console.log("localtime:::::::::::::" + localtime);
            if(localtime == 'undefined' || !localtime || localtime.length === 0 || localtime === "")
             {
                time1 = "TBA";
                console.log("Time::::" + time1);

            } else {

                time1 = moment(localtime, "HH:mm:ss").format("hh:mm A");
                console.log("Time::::" + time1);

            }
            // p.html("Name: " + response.events[i].name + "<br>" + "Date: " + response.events[i].dates.start.localDate + "<br>" + "Time: " + response.events[i].dates.start.localTime + "<br>" + "Venue: " + response.events[i]._embedded.venues[0].name + "<br>")
            //Added the date and time by jyoti
            // p.html("<br>"  + date1 +","+ "  " + time1 + "<br>"  + response.events[i]._embedded.venues[0].name + "<br>")
            // p.prepend(linkName);
            // mapButton.text("Locate on map");
            // p.append(mapButton);
            // p.addClass("text col-6")
            // eventRow.append(p);
            // eventDiv.append(eventRow);
            // $("#eventArea").prepend(eventDiv);


        }
// closing of main for loop
    });
}
//Added by Jyoti
function geocodePlaceId(geocoder, map, infowindow) {
    console.log("LocalArray in set MAp()" + JSON.stringify(locArr));
    for (var i = 0; i < locArr.length; i++) {
        var address = JSON.stringify(locArr[i].line1);
        console.log("Inside the marker " + JSON.stringify(address));
        //displaying the lat and lang according to the event display.
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response.results[0].place_id)
            // initMap();
            // initMap(response.results[0].geometry.location);
            var placeId = response.results[0].place_id;
            geocoder.geocode({ 'placeId': placeId }, function (response, status) {
                if (status === 'OK') {
                    if (response[0]) {
                        map.setZoom(11);
                        console.log("=================Center", response[0].geometry.location)
                        map.setCenter(response[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: response[0].geometry.location
                        });
                        infowindow.setContent(response[0].formatted_address);
                        infowindow.open(map, marker);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        });
    }
}




