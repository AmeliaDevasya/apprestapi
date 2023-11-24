'use strict';

exports.ok = function(values, res){
    var data = {
        'status':'success',
        'data':values
    };

     res.json(data);
     res.end();
};