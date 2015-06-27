(function() {

    //animation list
    var animaions = ['slideinft', 'spaceInDown', 'slideinfb', 'slideinfl', 'slideinfr', 'fadein', 'popin', 'spaceInUp'];

    function buildMovieTemplate(data, node) {
    	movies[data.title] = data;
        node.attr('data-magnet', data.torrents[0].url);
        node.attr('data-movie', data.title);
        node.attr('data-tooltip', data.title_long);
        node.cl('data-movie', animaions.sample());
        node.qs('.rating').tc(data.rating+' - '+data.mpa_rating);
        node.qs('.movie-mpa').html(data.genres.join(',')+'<br />'+data.runtime+'min - '+data.torrents[0].size);
        node.qs('.bg').attr('style', 'background-image:url(' + data.medium_cover_image + ')');
        return false;
    };

    //movie object
    var movieNode = $.toDOM('<div data-click="app.play" data-mouseover="tip.unpack" class="movie scroll_box trans-all">\
		<div class="play"><i class="fa fa-play-circle"></i></div>\
		<div class="rating slow"></div>\
        <div class="movie-mpa"></div>\
        <div class="gloss"></div>\
		<div class="bg"></div>\
		</div>', 0)

    //movie faceplate
    var movieTemplate = $.view('movie', movieNode, buildMovieTemplate);

    //movies 
    var movies = $.model.movies = {};

    //GUI panel template
    var catTemplate = $.toDOM('<div data-click="page.load" class="scroll_box menu-item"><div class="title-wrap"><span class="title"></span></div><div class="gloss"></div><div class="bg"></div></div>', 0);
    //GUI panel build function
    var catBuild = function(data, node) {
    	node.cl('data-movie', animaions.sample());
    	node.qs('.title').tc(data.text);
    	node.qs('.bg').attr('id',data.text);
    	if(data.bg){
    		node.qs('.bg').attr('style', 'background-image:url(' + data.bg + ')');
    	}
    };

    var catTemplate = $.view('panel', catTemplate, catBuild);

    //GUI panel template
    var loadMoreTemplate = $.toDOM('<div data-click="page.more" class="loadMore"><div class="glow"></div><span>Load More</span></div>', 0);
    //GUI panel build function
    var loadMoreBuild = function(data, node) {};

    var loadMore = $.view('loadMore', loadMoreTemplate, loadMoreBuild);

})();