log = require('npmlog');
log.heading = 'figaro';

function addToObject(fromObj, toObj) {
    for (var attrname in fromObj) {
        toObj[attrname] = fromObj[attrname];
    }
}

join = function(obj1, obj2) {
    var ret = new Object();

    addToObject(obj1, ret);
    addToObject(obj2, ret);

    return ret;
};

isEmpty = function(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};