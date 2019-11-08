var offset=0;
function makeURL(offset) {
  const searchInput=$("#search-box").val();
  const resPerPage = Number($("#num-results").val());
  var reqURL = "";
  if(searchInput!="") {
    const searchString = $("#search-box").val().replace(/ /g, "+");
    reqURL = 'https://api.giphy.com/v1/gifs/search?q=' + searchString + '&api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit=' + resPerPage.toString() + '&offset=' + offset.toString() + '"';
  } else {
    reqURL = 'https://api.giphy.com/v1/gifs/trending?api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit=' + resPerPage.toString() + '&offset=' + offset.toString() + '"'
  }
  return reqURL;
}

function getGifs(offset) {
  const resPerPage = Number($("#num-results").val());
  const url=makeURL(offset);
  $.get(url, function(data) {
    //If offset is 0, then the search is starting new and we want to delete any extra loaded images
    if(offset===0) $(".gif-result").remove();

    //Populate results-container with images
    for(var i = 0; i < resPerPage; i++) {
$("#results-container").append($("<img>").prop("src",data.data[i].images.fixed_height.url).addClass("gif-result"));
    }
  })
}

function loadMore() {
  offset+=Number($("#num-results").val());
  getGifs(offset);
}
