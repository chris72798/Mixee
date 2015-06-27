(function() {

    //core onload
    $.model.core = function() {
        window.resizeTo(screen.width, screen.height);
        console.log('Mixee Started');
        return;
    };

    var veilModel;
    var stack ={
        items:[],
    	data:[],
    	empty:[],
    	out:[],
    	height:{}
    };

    $.model.stack=stack;

    function scrollRAF(){
        var sheight = $('#app').scrollHeight;
        var height = $('#app').offsetHeight;
        var loadmore;

        if (sheight == height || sheight + 200 > height) {
            loadmore = $('.loadMore')[0];
            if (loadmore) {
                loadmore.click();
            }
        }
        if($('#movieList')){
            stack.scroll_container=$('#app');
            stack.container=$('#movieList');
            (function(){
                veilModel(stack,sheight,height,345);
                sheight=null;
                sheight=null;
                return false;
            }).raf();
        }
    }

    //main app functions
    var app = $.model('app', {
        url: '',
        page: 1,
        scroll: function() {
            scrollRAF.raf();
        }.debounce(300),
        header: function() {
            $('#app').scrollTop = 0;
        },
        buildURL: function() {
            return this.url + '&page=' + this.page;
        },
        dash: function() {
            $.model('dash')();
            return false;
        },
        play: function(node) {
            $('#iframe').contentWindow.magnet = node.attr('data-magnet');
            $('#iframe').contentWindow.downloadStart();
            window.currentMagnet = node.attr('data-movie');
            return false;
        },
        close: function() {
            $('#iframeVideo').src = '';
            $('#iframeVideoWrap').classList.add('gpu_hide_bottom');
            $('#iframeWrap').classList.add('gpu_hide_bottom');
            return false;
        },
        show: function(href) {
            if (href) {
                $('#iframeVideo').src = href;
            }
            $('#iframeVideoWrap').classList.remove('gpu_hide_bottom');
            return false;
        },
        toggle: function(href) {
            $('#iframeVideoWrap').classList.toggle('gpu_hide_bottom');
            return false;
        },
        magnets: function(href) {
            $('#iframeWrap').classList.toggle('gpu_hide_bottom');
            return false;
        },
        magRefresh: function() {
            $('#iframe').contentWindow.location.reload();
            return false;
        },
        refresh: function() {
            $('#iframeVideo').contentWindow.location.reload();
            return false;
        },
        checkVideo: function(href, link) {
            if (href.indexOf('.mp4') != -1 || href.indexOf('.avi') != -1 || href.indexOf('.mkv') != -1 || href.indexOf('.mov') != -1) {
                if (href.indexOf('sample') == -1) {
                    app.show(link);
                }
            }
            return false;
        }
    });

    //iframe video Ready Trigger
    $('#iframe').contentWindow.playVideo = function(hash) {
        if (!$('#iframe').contentWindow.magnet) {
            return false;
        }
        $.xhr({
            url: 'http://localhost:9000/torrents',
            type: 'GET',
            callback: function(data) {
                $.json(data).each(function(item, index) {
                    if (item.infoHash == hash) {
                        if (!item.files) {
                            return false;
                        }
                        item.files.each(function(file, fileIndex) {
                            var href = file.name;
                            $.model('app').checkVideo(href, file.link);
                        });
                    }
                });
            }
        });
        return false;
    };

    //load templates and dash
    $.ensure('templates', function(templates) {
        $.ensure(['reserve', 'dash'], function(reserve, dash) {
            dash(reserve);
            return;
        });
        return;
    });

    //resize event
    $.model('resize', {
        list: {},
        update: function() {
            this.list.each(function(item, name) {
                if (item) {
                    item();
                }
            });
            return;
        }.debounce(300)
    });

    (function() {
        "use strict";

        function viewable(d, e) {
            var viewtop = d.top,
                viewbottom = d.bottom,
                eltop = e.top,
                elbottom = e.bottom,
                elmid = Math.round(((elbottom - eltop) / 2)),
                option = eltop >= viewtop;

            return (elbottom <= viewbottom && (option || elbottom >= viewtop)) || (eltop <= viewbottom && (option || elmid >= viewtop));
        }

        function getviewborders(e,oh) {
            var ot = e.offsetTop,
                oh = oh || e.offsetHeight,
                padding = 0,
                docViewTop = e.scrollTop - ot,
                docViewBottom = docViewTop + oh + ot;
            if (docViewTop < 0) {
                var docViewTop = 0;
            }

            return {
                top: docViewTop,
                bottom: docViewBottom
            };
        }

        function getelborder(e,height) {
            var t = e.offsetTop,
                h = height || e.offsetHeight,
                b = h + t;

            return {
                top: t,
                bottom: b,
                height: h
            };
        }

        veilModel=$.model('veil', function(stack,sheight,height,boxHeight) {

        	var e=stack.items;
            var len = stack.len;
            var viewthis;
            
            var d = getviewborders(stack.scroll_container,height),
                containertop = stack.container.offsetTop;

            if (d.top < containertop) {
                d.top = 0;
            } else {
                d.top = d.top - containertop;
            }
            d.bottom = d.bottom + containertop;

            for (var i = 0; i < len; i++) {
                var item = e[i];
                viewthis=getelborder(item,boxHeight);

                if (viewable(d, viewthis)) {
                    item.style.visibility='visible';
                } else {
                    item.style.visibility='hidden';
                }
            }
            return false;
        });

        $.model('veil').getviewborders = getviewborders;

    })();

})();