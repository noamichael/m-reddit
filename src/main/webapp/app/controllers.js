(function (angular) {
    var app = angular.module("m-reddit");
    app.controller("AppCtrl", AppController);
    app.controller("SubredditPaneCtrl", SubredditPaneCtrl);
    app.controller("SubredditCtrl", SubredditController);
    app.controller("CommentsCtrl", CommentsController);

    function AppController(AuthService) {
        var vm = this;
        vm.login = function () {
            AuthService.login(vm.user);
            vm.user = {};
        };
    }
    function SubredditPaneCtrl(SubredditService, $state) {
        var self = this;
        self.subreddit = null;
        getSubreddits();
        self.onSubredditClick = function (subreddit) {
            self.currentSubreddit = subreddit;
            $state.go("app.subreddit.posts", {subreddit: subreddit.data.display_name});
        };

        self.isSubredditActive = function (subreddit) {
            return self.currentSubreddit && subreddit.data.url === self.currentSubreddit.data.url;
        };
        function getSubreddits() {
            SubredditService.getSubreddits().success(function (response) {
                self.subreddits = response.data.children;
            });
        }
    }
    function SubredditController(SubredditService, $state, $stateParams, $sce) {
        var self = this;
        var subredditTitle = $stateParams.subreddit;
        if (!subredditTitle || subredditTitle === "") {
            $state.go($state.current, {subreddit: "front-page"}, {reload: true});
            return;
        }
        if (subredditTitle === "front-page") {
            getFrontPage();
        } else {
            getSubredditPosts(subredditTitle);
        }
        self.onPostClick = function (post) {
            if (post.data.is_self) {
                var permalink = post.data.permalink;
                var subreddit = post.data.subreddit;
                var id = post.data.id;
                var title = permalink.substring(permalink.indexOf(id) + id.length + 1, permalink.length - 1);
                $state.go("app.subreddit.comments", {subreddit: subreddit, commentId: id, commentTitle: title});
            } else {


            }
            post.lazyLoadedSource = post.data.url;
        };
        self.trust = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
        function getSubredditPosts(subreddit) {
            SubredditService.getSubredditPosts(subreddit).success(function (response) {
                self.notFound = false;
                self.posts = response.data.children;
            }).error(function () {
                self.notFound = true;
            });
        }
        function getFrontPage() {
            SubredditService.getFrontPage().success(function (response) {
                self.posts = response.data.children;
            });
        }
    }
    function CommentsController(SubredditService, $state, $stateParams) {
        var self = this;
        var subreddit = $stateParams.subreddit;
        var id = $stateParams.commentId;
        var title = $stateParams.commentTitle;
        SubredditService.getComments(subreddit, id, title).success(function (response) {
            self.comments = response[1].data.children;
            commentRecursiveTest(response[1].data.children);
        });
        function commentRecursiveTest(comments) {
            comments.forEach(function (comment) {
                if (comment.data.replies) {
                    commentRecursiveTest(comment.data.replies.data.children);
                }
            });
        }
    }
    SubredditPaneCtrl.$inject = [
        "SubredditService",
        "$state"
    ];
    SubredditController.$inject = [
        "SubredditService",
        "$state",
        "$stateParams",
        "$sce"
    ];
    CommentsController.$inject = [
        "SubredditService",
        "$state",
        "$stateParams"
    ];
})(angular);