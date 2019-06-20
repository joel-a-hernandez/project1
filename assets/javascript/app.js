// Creates firebase refference.
const firebaseConfig = {
    apiKey: "AIzaSyDlrxw6U4xrfWQI_ff-T9Sn3FWLk-9n3Sk",
    authDomain: "eatdrinktravel-25d2f.firebaseapp.com",
    databaseURL: "https://eatdrinktravel-25d2f.firebaseio.com",
    projectId: "eatdrinktravel-25d2f",
    storageBucket: "eatdrinktravel-25d2f.appspot.com",
    messagingSenderId: "855598110418",
    appId: "1:855598110418:web:8fe153607ff7c6ec"
  };
// Initializes Firebase.
firebase.initializeApp(firebaseConfig);

// firebase variable
var dataRef = firebase.database();

//Global variables
$(".hide-row").hide();
var map;
var eventObj;
var markerArr = [];
var cityTMApi = null;
var startDate = null;
var endDate = null;
var pageNum = 0;
var locArr = [];
var marker;

        //Here are all the functions
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
        // firebase most visited logic.
        function favoriteCity(){
            var city = $("#userInput").val().trim()
            favCity = 0;
            dataRef.ref().on("value", function(snapshot) {
                snapshot.forEach(function(child){
                    if(child.val().City === city){
                        favCity++
                    }
                })
                console.log(city + " Has been searched " +favCity + " times.");
                $("#favorite-city").text(city + " has been searched " +favCity + " times!")
            })
        };
        // Function for dumping the JSON content for each button into the div
        function getMap() {
            var location = $("#userInput").val();
            console.log("Location:::" + location);
            openconnection(location);
        }
        // This function gets the data from the ticketmaster api. It also dynamically creates all of the ticketmaster api content. 
        function displayApiData() {
            $(".hide-row").show();
            cityTMApi = $("#userInput").val().trim();
            startDate = $("#startDate").val().trim();
            // Added a code to check  statdate and end date 
            endDate = $("#endDate").val().trim();
            console.log("Gettomg start-date value::" + startDate);
            console.log("Getting end-date value::" + endDate);
            var queryURL = "https://app.ticketmaster.com/discovery/v2/events?size=10&apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&city=" + cityTMApi + "&startDateTime=" + startDate + "T12:59:06-05:00&endDateTime=" + endDate + "T12:00:00Z&page=" + pageNum + "&sort=date,asc";
            // &localStartDateTime=" + startDate + ""
            // locale=*&city=" + location + "
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                // console.log(xhr.status)
                eventObj = response._embedded;
                var response = response._embedded;
                //  Added to a code to check for if any events are present in a particular starrtdate and end date 
                //  opening of for loop
                for (var i = 0; i < response.events.length; i++) {
                    console.log(response.events[i]);
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
                    linkName.addClass("link-name");
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
                    console.log("Date before conversion::::"+localdate);
                    date1 = moment(localdate, "YYYY-MM-DD").format("ddd, MMMM Do");
                    // moment($("#train-start").val(),"HH:mm").format("HH:mm");
                    console.log("DAte Format::" + date1);
                    //Checking for the time is displayed in the api a making a condition according to that.by Jyoti
                    var time1;
                    var date1;
                    var localtime = response.events[i].dates.start.localTime;
        
                                       
                                var p = $("<p>");
                                var titleDiv = $("<div>")
                                var infoDiv = $("<div>")
                                var mapButton = $("<button>");
                                // added a class to the button by Jyoti
                                mapButton.addClass("map-button");
                                mapButton.attr("id", i);
                                var date=response.events[i].dates.start.localDate;
                                // moment($("#train-start").val(),"HH:mm").format("HH:mm");
                                console.log(date);
                                var time=response.events[i].dates.start.localTime;
                                var time1=moment(time,"HH:mm:ss").format("hh:mm A");
                                console.log("Time value :::::"+time);
                                
                                var time1=moment(time,"HH:mm:ss").format("hh:mm A");
                                console.log("Time::::"+time1);
                                
                                titleDiv.addClass("event-title")
                                linkName.html(response.events[i].name + "<br>");
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
                                $("#eventArea").append(eventDiv);
                           
                    console.log("localtime:::::::::::::" + localtime);
                    if(localtime == 'undefined' || !localtime || localtime.length === 0 || localtime === "")
                     {
                        time1 = "TBA";
                        console.log("Time::::" + time1);
        
                    } else {
        
                        time1 = moment(localtime, "HH:mm:ss").format("hh:mm A");
                        console.log("Time::::" + time1);
        
                    }
                } // closing of main for loop
                    var viewMoreEventsDiv = $("<div>");
                    viewMoreEventsDiv.addClass("view-more-div")
                    var viewMoreButton = $("<button>");
        
                    viewMoreButton.addClass("view-more");
                    viewMoreButton.attr("id", "view-more-button");
                    viewMoreButton.text("Display More Events");
                    viewMoreEventsDiv.append(viewMoreButton);
                    $("#eventArea").append(viewMoreEventsDiv);
            });
        }
        //Added by Jyoti
        function geocodePlaceId(geocoder, map, infowindow) {
            console.log("LocalArray in set MAp()" + JSON.stringify(locArr));
            var marker;
            for (var i = 0; i < locArr.length; i++) {
                var address = JSON.stringify(locArr[i].line1);
                console.log("Inside the marker " + JSON.stringify(address));
                //displaying the lat and lang according to the event display.
                var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";
                console.log(queryURL);
                debugger;
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
                                marker = new google.maps.Marker({
                                    map: map,
                                    position: response[0].geometry.location
                                });
                                infowindow.setContent(response[0].formatted_address);
                                infowindow.open(map, marker);
                            } else {
                                html.write('No results found');
                            }
                        } else {
                            html.write('Geocoder failed due to: ' + status);
                        }
                    });
                });
            }
        }

            $(document).on("click", "#submit-btn", function (event) {
                event.preventDefault();
                $("#eventArea").empty();
                // Added by /jyoti to clear or empty the error-input message
                $("#error-input").empty();

                //Added by Jyoti
                // var locempty = document.forms["form1"]["text1"].value;
                var locempty=$("#userInput").val();
                console.log(locempty);
                var startempty = $("#startDate").val().trim();
                console.log(startempty);
                var endempty=$("#endDate").val().trim();
                console.log(endempty);

                // firebase code to set data.
                dataRef.ref().push({
                    City: locempty,
                    startdate: startempty,
                    enddate: endempty
                });

                var p = $("<p>");
                p.text("*Please Enter the City");
                p.css("color", "red");
                
                var pstart=$("<p>");
                pstart.text("*Please select the Start date");
                pstart.css("color", "red");
            
                var pend=$("<p>");
                pend.text("*Please select the End Date");
                pend.css("color", "red");
                    if (locempty === "" && startempty === "" && endempty === "" ) {
                        $("#error-input").empty();
                        $("#start-error").empty();
                        $("#end-error").empty();
                    $("#error-input").append(p);
                    $("#start-error").append(pstart);
                    $("#end-error").append(pend);
                

                }
                else if(locempty === "" &&  startempty ===""){
                $("#error-input").empty();
                    $("#start-error").empty();
                    $("#end-error").empty();
                    $("#error-input").append(p);
                    $("#start-error").append(pstart);
                    
                }
                else if(startempty === "" && endempty === ""){
                    $("#error-input").empty();
                    $("#start-error").empty();
                    $("#end-error").empty();
                    $("#start-error").append(pstart);
                    $("#end-error").append(pend);
                
                    
                    
                }
                else if(endempty === "" &&  locempty === ""){
                    $("#error-input").empty();
                    $("#end-error").empty();
                    $("#start-error").empty();
                    $("#end-error").append(pend);
                    $("#error-input").append(p);
                
                }
                    else if(locempty=== "")
                    {
                        $("#error-input").empty();
                        $("#start-error").empty();
                        $("#end-error").empty();
                        $("#error-input").append(p);
                    
                    }
                    else if(startempty === "")
                    {
                        $("#start-error").empty();
                        $("#error-input").empty();
                        $("#end-error").empty();
                        $("#start-error").append(pstart);

                    

                    }
                    else if(endempty === ""){
                        $("#start-error").empty();
                        $("#error-input").empty();
                        $("#end-error").empty();
                        $("#end-error").append(pend);
                    
                    }
                    else if(startempty<endempty){
                        $("#start-error").empty();
                        $("#error-input").empty();
                        $("#end-error").empty();
                        $("#displaydateerror").empty();
                        getMap();
                        displayApiData();
                        favoriteCity();
                    }
                    else{
                        $("#displaydateerror").css("color", "red");
                        $("#displaydateerror").text("Start date should be less then End date");
                    }
            });

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
                    if(marker){
                        marker.setMap(null)
                    }
                    marker = new google.maps.Marker({
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


            $(document).on("click", "#view-more-button", function (event) {
                $(this).hide();
                pageNum++;
                console.log(pageNum);
                displayApiData();
            });


