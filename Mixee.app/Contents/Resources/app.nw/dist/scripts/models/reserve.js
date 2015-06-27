(function() {
    "use strict";
    var estimate = function(data) {
        var width = data.container.clw(),
            optimal_max = data.maxWidth,
            optimal_min = data.minWidth,
            column_number = 1,
            possible = [];

        while (true) {
            var wrap_test = width / column_number;
            if (wrap_test >= optimal_min && wrap_test <= optimal_max) {
                possible.push(wrap_test);
            } else if (wrap_test < optimal_min) {
                break;
            }
            column_number++;
        }
        var possible_len = possible.length;
        if (possible_len == 0) {
            var cls = 100;
        } else {
            var cls = (possible[possible_len - 1] / width) * 100;
        }

        return cls;
    }

    $.model('reserve',function(data){
    	data.items=[];
    	data.update=function(){
    		$id('reserve').tc(data.cls+"{width:"+estimate(data)+'%;}');
    	};
    	data.update();
    	data.add=function(item){
    		data.items.push(item);
    		data.container.ap(item);
    	};
    	return data;
    });

})();