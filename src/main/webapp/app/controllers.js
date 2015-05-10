(function (angular) {
    var app = angular.module("m-reddit");
    app.controller("AppCtrl", AppController);
    app.controller("SubredditPaneCtrl", SubredditPaneCtrl);
    app.controller("SubredditCtrl", SubredditController);
    app.controller("CommentsCtrl", CommentsController);
    app.controller("PostModalCtrl", PostModalCtrl);

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
    function SubredditController(SubredditService, $state, $stateParams, $modal) {
        var self = this;
        self.itemsLoaded = 25;
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
                goToComments(post);
            } else {
                if (!post.lazyLoadedSource) {
                    post.lazyLoadedSource = post.data.url;
                }
                var modal = createPostContentModal(post);
                modal.result.then(function (post) {
                });
            }
        };
        self.onCommentClick = function (post) {
            goToComments(post);
        };
        self.getThumbnailSrc = function (src) {
            return SubredditService.getThumbnailSrc(src);
        };

        self.pageLeft = function () {
            self.itemsLoaded -= 25;
            getSubredditPosts(self.currentSubreddit, {before: self.pageSlice, count: self.itemsLoaded});
        };
        self.pageRight = function () {
            self.itemsLoaded += 25;
            getSubredditPosts(self.currentSubreddit, {after: self.pageSlice, count: self.itemsLoaded});
        };
        self.canPageLeft = function(){
            return self.itemsLoaded > 25;
        };


        function goToComments(post) {
            var permalink = post.data.permalink;
            var subreddit = post.data.subreddit;
            var id = post.data.id;
            var title = permalink.substring(permalink.indexOf(id) + id.length + 1, permalink.length - 1);
            $state.go("app.subreddit.comments", {subreddit: subreddit, commentId: id, commentTitle: title});
        }

        function getSubredditPosts(subreddit, config) {
            self.currentSubreddit = subreddit;
            SubredditService.getSubredditPosts(subreddit, config).success(function (response) {
                self.notFound = false;
                self.posts = response.data.children;
                self.pageSlice = response.data.after ? response.data.after : response.data.before;
            }).error(function () {
                self.notFound = true;
            });
        }
        function getFrontPage() {
            SubredditService.getFrontPage().success(function (response) {
                self.posts = response.data.children;
            });
        }
        function createPostContentModal(post) {
            return $modal.open({
                animation: true,
                templateUrl: 'app/pages/external-post-content.html',
                controller: 'PostModalCtrl',
                controllerAs: "postModalCtrl",
                windowClass: "subreddit-post-modal",
                resolve: {
                    post: function () {
                        return post;
                    }
                }
            });
        }

    }
    function CommentsController(SubredditService, $state, $stateParams) {
        var self = this;
        var subreddit = $stateParams.subreddit;
        var id = $stateParams.commentId;
        var title = $stateParams.commentTitle;
        SubredditService.getComments(subreddit, id, title).success(function (response) {
            self.selfPost = response[0].data.children[0].data;
            self.comments = response[1].data.children;
        });
        function commentRecursiveTest(comments) {
            comments.forEach(function (comment) {
                if (comment.data.replies) {
                    commentRecursiveTest(comment.data.replies.data.children);
                }
            });
        }
    }

    function PostModalCtrl($modalInstance, $sce, post) {
        var self = this;
        self.post = post;
        self.ok = function () {
            $modalInstance.close(post);
        };
        self.src = function (src) {
            return $sce.trustAsResourceUrl(src);
        };
    }
    SubredditPaneCtrl.$inject = [
        "SubredditService",
        "$state"
    ];
    SubredditController.$inject = [
        "SubredditService",
        "$state",
        "$stateParams",
        "$modal"
    ];
    CommentsController.$inject = [
        "SubredditService",
        "$state",
        "$stateParams"
    ];
})(angular);