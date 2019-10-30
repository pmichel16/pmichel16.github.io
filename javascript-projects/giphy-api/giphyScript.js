function giphySearch() {
	const searchInput=$("#searchBox").val();
	var searchString=searchInput.replace(/ /g, "+");
	var request = $.get('https://api.giphy.com/v1/gifs/search?q='+searchString+'&api_key=OM5EygOcdpf80lr9XF7OObeEUsUOVUJ7&limit=5"',true);
	request.done(function(data) { 
		console.log("success got data", data); 
	});
};