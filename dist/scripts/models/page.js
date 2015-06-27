(function(){

	var moviesBuild = $.view('movie');
	var loadMore=$.view('loadMore');
	var app=$.model('app');
	var html=$.toDOM('<div id="wrap_outter_movies" class="page"></div>',0);
	var locationNode=$.toDOM('<div class="location"></div>',0);
	var moviesNode=$.toDOM('<div id="movieList" class="movies clearfix trans-all"></div>',0);

	html.ap(locationNode);
	html.ap(moviesNode);

	$.cache('page',$.model('reserve')({
		minWidth:200,
		maxWidth:350,
		cls:'.scroll_box',
		container:moviesNode
	}));

	$.model.resize.list.page=function(){
		if($id('movieList')){
			$.cache('page').update();
		}
	};

	$.model('page',{
		more:function(obj){
			obj.remove();
			app.page = app.page+1;
			$.xhr({
				url:app.buildURL(),
				type:'POST',
				callback:function(item){
					var data=item.data;
					var movies=data.movies;
					var frag=$.frag();
					movies.each(function(item,i){
						frag.ap(moviesBuild(item));
					});

					if((data.limit*data.page_number) < data.movie_count){
						var loadMoreNode=loadMore({});
						frag.ap(loadMoreNode);
					}

					$('#movieList').ap(frag);
				}
			});
		},
		load:function(node){
			var location=node.qs('.title').tc();
			var data=$.model('pages')[node.tc()];

			locationNode.tc(location);

			moviesNode.clear();

			app.url= 'https://yts.to/api/v2/list_movies.json?sort_by='+data.url;
			app.page= 1;
			$.xhr({
				url:'https://yts.to/api/v2/list_movies.json?sort_by='+data.url,
				type:'POST',
				callback:function(item){
					var data=item.data;
					var movies=data.movies;
					var frag=$.frag();
					movies.each(function(item,i){
						frag.ap(moviesBuild(item));
					});

					if((data.limit*data.page_number) < data.movie_count){
						var loadMoreNode=loadMore({});
						frag.ap(loadMoreNode);
					}

					$('#movieList').ap(frag);

					$.model.stack.items=$cls('scroll_box');
				}
			});

			$('#app').clear().ap(html);

			$.cache('page').update();

		}
	});

})();