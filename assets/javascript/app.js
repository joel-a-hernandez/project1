// create a open function for calling Ajax
function openconnection(location){
var queryURL="https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyAaVsTVa6zgCnSikWoTfAh-MN4efnZ0ivs";        
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
$(document).on("click","#submit-btn", function(event) {
    event.preventDefault();
    var location=$("#userInput").val();
    console.log("Location:::"+location);
    openconnection(location);

   
});