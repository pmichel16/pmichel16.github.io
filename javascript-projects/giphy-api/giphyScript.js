function giphySearch() {
  const searchInput=$("#search-box").val();
  var results=$("#num-results").val();
  var searchString=searchInput.replace(/ /g, "+");
  var request = $.get('https://api.giphy.com/v1/gifs/search?q='+searchString+'&api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit='+results.toString()+'"',true);
  request.done(function(dataReceived) { 
    console.log(dataReceived);
    //Delete any images that already exist
    $(".gif-result").remove();

    //Populate results-container with images
    for(var i = 0; i < results; i++) {
	$("#results-container").append($("<img>").prop({"src":dataReceived.data[i].images.fixed_height.url,"id":"gif-"+i}));
        $("#gif-"+i).addClass("img-responsive gif-result");
    }

    //Show the load more button
    $("#load-button").css("visibility: visible");
  });
};
