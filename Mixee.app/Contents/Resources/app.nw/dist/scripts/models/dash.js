(function() {

    var listItems = {
            Title: {
                url: 'title',
            },
            Latest: {
                url: 'date_added',
            },
            Year: {
                url: 'year',
            },
            Rating: {
                url: 'rating',
            },
            Seeds: {
                url: 'seeds',
            },
            Peers: {
                url: 'peers',
            },
            Downloads: {
                url: 'download_count',
            },
            Likes: {
                url: 'like_count',
            }
        },
        body = $.toDOM('<div id="wrap_outter" class="page"><div class="menu-list clearfix trans-all" id="dash-menu"></div></div>', 0),
        compiled,
        faceplatePanel=$.view('panel');

    $.model.pages = listItems;

    $.model('dash', function(reserve) {

        $.model.stack.items=[];
        $.model.stack.len=0;
        
        if (compiled) {
            $id('app').clear().ap(compiled);
            $.model.resize.list.dashmenu();
            return false;
        }

        compiled = body;


        $id('app').ap(compiled);

        $.cache('stack', $.model('reserve')({
            minWidth: 240,
            maxWidth: 350,
            cls: '.scroll_box',
            container: $id('wrap_outter')
        }));

        $.model.resize.list.dashmenu = function() {
            if ($id('dash-menu')) {
                $.cache('stack').update();
            }
        };
        var frag = $.frag();

        listItems.each(function(item, text) {
            var sort = item.url,
	            extra = item.extra || '',
	            bg = $.local[text],
	            hasbg=bg && $.local[text + '_lastupdated'] == new Date().getUTCDate(),
	            node,
	            data={
	            	text:text
	            };

            if (hasbg) {
                data.bg=bg;
                node = null;
                bg = null;
            }

            node=faceplatePanel(data);

            if(!hasbg){
	            $.xhr({
	                url: 'https://yts.to/api/v2/list_movies.json?limit=1&sort_by=' + (sort),
	                type: 'POST',
	                callback: function(item) {
	                    var bg = item.data.movies[0].background_image;
	                    $.local[text] = bg;
	                    $.local[text + '_lastupdated'] = new Date().getUTCDate();
	                    node.qs('.bg').attr('style', 'background-image:url(' + bg + ')');
	                    node = null;
	                    bg = null;
	                }
	            });
            }

            frag.ap(node);
        });

        body.qs('#dash-menu').ap(frag);


    });

})();