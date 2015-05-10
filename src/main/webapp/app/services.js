(function (angular) {
    var app = angular.module("m-reddit");
    app.service("SubredditService", SubredditService);
    app.service("AuthService", AuthService);

    function SubredditService($http) {
        var self = this;
        this.api = {
            base: "http://www.reddit.com",
            subreddits: "http://www.reddit.com/reddits/.json",
            hot: "http://www.reddit.com/r/subreddit/hot.json",
            frontPage: "http://www.reddit.com/.json"
        };
        this.getHotPosts = function (config) {
            return $http.get(self.api.hot);
        };
        this.getFrontPage = function (config) {
            return $http.get(self.api.frontPage);
        };
        this.getSubreddits = function (config) {
            return $http.get(self.api.subreddits);
        };
        this.getSubredditPosts = function (subreddit, config) {
            var url = self.api.base + "/r/" + subreddit + "/.json";
            if (!config) {
                config = {};
            }
            config.items = 25;
            url += commonUtils.buildQueryString(config);
            return $http.get(url);
        };
        this.getComments = function (subreddit, id, title, config) {
            var url = self.api.base + "/r/" + subreddit + "/comments/" + id + "/" + title + "/.json";
            return $http.get(url);
        };
        this.getThumbnailSrc = function (thumbnail) {
            switch (thumbnail) {
                case "self":
                    return "img/self-post.png";
                case "default":
                    return "img/default-post.png";
                case "nsfw":
                    return "img/nsfw-post.png";
                default:
                    return thumbnail;
            }
        };

    }
    SubredditService.$inject = ["$http"];
    function AuthService($http) {
        var self = this;
        var authPath = "api/v1/auth/";
        var redditAccessTokenUrl = "https://www.reddit.com/api/v1/access_token";
        processQueryParams();
        $http.get(authPath + "token").
                success(function (data) {
                    self.token = data;
                });
        this.login = function (user) {
            window.location = generateOAuthURL();
        };
        function doLogin(code) {
            $http.post(redditAccessTokenUrl, {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": commonUtils.hostAndContextPath() + "/"
            }).success(function (data, status, headers, config) {
                console.log("LOGGED IN! " + JSON.stringify(data));
            }).error(function (data, status, headers, config) {
                console.log("LOGGED ERROR! " + data);
            });
        }
        function processQueryParams() {
            var queryParams = commonUtils.queryString();
            console.log("Query String: " + JSON.stringify(queryParams));
            var error = queryParams.error;
            var code = queryParams.code;
            var state = queryParams.state;
            if (error) {
                switch (error) {
                    case "access_denied":
                        break;
                    case "unsupported_response_type":
                        break;
                    case "invalid_scope":
                        break;
                    case "invalid_request":
                        break;
                }
                console.log("ERROR:" + error);
            } else {
                if (code) {
                    doLogin(code);
                }
            }
        }
        function generateOAuthURL() {
            var OAuthURL = "https://www.reddit.com/api/v1/authorize?client_id=K03CAkPohNiTag";
            OAuthURL += "&response_type=code&state=" + self.token;
            OAuthURL += "&redirect_uri=http://" + commonUtils.hostAndContextPath() + "/&duration=permanent&scope=identity,edit,vote";
            return OAuthURL;
        }

    }
    AuthService.$inject = ["$http"];
})(angular);