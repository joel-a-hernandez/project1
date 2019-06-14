// This function handles events where one button is clicked
$("#submit-btn").on("click", function(event) {
    event.preventDefault();

// Function for dumping the JSON content for each button into the div

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
        }
    });

    }
// displaying the event info
    displayApiData();
});