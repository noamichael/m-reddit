(function () {
    function queryString() {
        var qsa = queryStringArray();
        var map = {};
        qsa.forEach(function (param) {
            var splitArray = param.split("=");
            var key = splitArray[0];
            var value = splitArray[1];
            var currentValue = map[key];
            if (currentValue) {
                if (Array.isArray(currentValue)) {
                    currentValue.push(value);
                } else {
                    map[key] = [currentValue];
                    map[key].push(value);
                }
            } else {
                map[key] = value;
            }
        });
        return map;
    }
    function queryStringArray() {
        return location.search.substring(1, location.search.length).split("&");
    }
    function contextPath() {
        return window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
    }
    function hostAndContextPath() {
        return location.host + contextPath();
    }
    function buildQueryString(params) {
        var qs = "?";
        var totalPropCount = Object.keys(params).length;
        var currentPropCount = 0;
        for (var key in params) {
            currentPropCount++;
            var value = params[key];
            if (Array.isArray(value)) {
                value.forEach(function (val, i, arr) {
                    qs += key + "=" + val;
                    if (i < arr.length - 1) {
                        qs += "&";
                    }
                });
            } else {
                qs += key + "=" + params[key];
                if (currentPropCount < totalPropCount) {
                    qs += "&";
                }
            }
        }
        return qs;
    }
    window.commonUtils = {
        queryString: queryString,
        contextPath: contextPath,
        hostAndContextPath: hostAndContextPath,
        buildQueryString: buildQueryString
    };
})();