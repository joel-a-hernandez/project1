
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
function initMap(latLng) {
    map = new google.maps.Map(document.getElementById('mapArea'), {
        center: latLng,
        zoom: 8,
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
    getMap();
    displayApiData();
});
var   locArr=[];
//Created this event to locate on the map by click on the button
// code added by Jyoti
$(document).on("click", ".map-button", function (event) {

    event.preventDefault();
    var idClicked = $(this).attr("id");
    console.log(eventObj.events[idClicked].name);
    var eventAddress=eventObj.events[idClicked]._embedded.venues[0].address.line1;
    console.log(eventAddress);
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + eventAddress + "&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log(response.location);
        var myLatLng=response.results[0].geometry.location;
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title:eventAddress,
            draggable:true,
            center:myLatLng,
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
    var startDate = $("#start").val().trim();
    console.log(startDate);
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events?size=5&apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&city=" + location + "";
    // &localStartDateTime=" + startDate + ""
    // locale=*&city=" + location + "



    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        eventObj = response._embedded;
        var response = response._embedded;
        console.log(response)
        for (var i = 0; i < response.events.length; i++) {
            console.log(response.events[i])

            var eventDiv = $("<div>");
            eventDiv.addClass("event-div")
            var eventRow = $("<div>");
            eventRow.addClass("row");
            var name=response.events[i].name;
            var loc=response.events[i]._embedded.venues[0].address;
            var latLng=response.events[i]._embedded.venues[0].location;
            console.log("address:"+JSON.stringify(loc));
            locArr.push(name,loc,latLng);
            console.log("LocARR::"+JSON.stringify(locArr));
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




            p.html("Name: " + response.events[i].name + "<br>" + "Date: " + response.events[i].dates.start.localDate + "<br>" + "Time: " + response.events[i].dates.start.localTime + "<br>" + "Venue: " + response.events[i]._embedded.venues[0].name + "<br>")
            mapButton.text("Locate on map");
            p.append(mapButton);
            p.addClass("text col-6")
            eventRow.append(p);
            eventDiv.append(eventRow);
            // eventDiv.append(response.events[i].dates.start.localDate)

            $("#eventArea").prepend(eventDiv);

        }

    });

}
function geocodePlaceId(geocoder, map, infowindow) {
    console.log("LocalArray in set MAp()"+JSON.stringify(locArr));
    for (var i = 0; i < locArr.length; i++) {
      var address = JSON.stringify(locArr[i].line1);
      console.log("Inside the marker "+JSON.stringify(address));
     //displaying the lat and lang according to the event display.
      var queryURL="https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
   console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
 }).then(function (response) {
console.log(response.results[0].place_id)
    // initMap();
       // initMap(response.results[0].geometry.location);
   var placeId=response.results[0].place_id;
    geocoder.geocode({'placeId': placeId}, function(response, status) {
      if (status === 'OK') {
        if (response[0]) {
          map.setZoom(11);
          console.log("=================Center",response[0].geometry.location)
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





