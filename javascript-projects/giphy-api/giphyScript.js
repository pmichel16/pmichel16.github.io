var reqURL = "";
var resPerPage = 0;
var hasSearched = false;
var searchString = "";

function giphySearch() {
  const searchInput=$("#search-box").val();
  resPerPage = Number($("#num-results").val());
  searchString=searchInput.replace(/ /g, "+");
  reqURL = 'https://api.giphy.com/v1/gifs/search?q=' + searchString + '&api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit=' + resPerPage.toString() + '"';
  $.get(reqURL, function(dataReceived) {
    console.log(dataReceived);
    //Delete any images that already exist
    $(".gif-result").remove();

    //Populate results-container with images
    for(var i = 0; i < resPerPage; i++) {
	$("#results-container").append($("<img>").prop({"src":dataReceived.data[i].images.fixed_height.url,"id":"gif-"+i}));
        $("#gif-"+i).addClass("gif-result");
    }

    //Show the load more button
    $("#load-button").css("visibility", "visible");

    //Allow changing the results per page to re-run the function
    hasSearched = true;
  });
};

function loadMore() {
  resPerPage += Number($("#num-results").val());
  reqURL = 'https://api.giphy.com/v1/gifs/search?q=' + searchString + '&api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit=' + resPerPage.toString() + '"';
  $.get(reqURL, function (dataReceived){
    //Populate only the new images into the results-container
    for (var i = resPerPage - Number($("#num-results").val()); i < resPerPage; i++) {
      $("#results-container").append($("<img>").prop({ "src": dataReceived.data[i].images.fixed_height.url, "id": "gif-" + i }));
      $("#gif-" + i).addClass("img-responsive gif-result");
    }
  })
}