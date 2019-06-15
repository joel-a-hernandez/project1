$("#submit-btn").on("click", function(event) {
    event.preventDefault();
    $("#eventArea").empty();
function displayApiData() {
    var location = $("#userInput").val().trim();
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events?size=5&apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&locale=*&city=(" + location + ")";
        
 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var response = response._embedded;
        console.log(response)
        for (var i = 0; i < response.events.length; i++){
        console.log(response.events[i])

        var eventDiv = $("<div>");
        eventDiv.text(response.events[i].name)

        for (var j = 0; j < response.events[i].images.length; j++) {
            const element = response.events[i].images[j];
            if (element.ratio === "4_3"){
                var imageDiv = $("<img>");
                imageDiv.attr("src",element.url);
                eventDiv.append(imageDiv);
                break;
            }
            console.log(element.url);  
        }
        $("#eventArea").prepend(eventDiv);
        
        }  
         
    });

    }
    
    displayApiData();
});