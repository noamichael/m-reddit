(function (angular) {
    var app = angular.module("m-reddit", ["ui.router", "ui.bootstrap","ngSanitize"]);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/r/front-page");
        //
        // Now set up the states
        $stateProvider
                .state('app', {
                    data: {
                        title: "m-reddit"
                    },
                    abstract: true,
                    templateUrl: "app/pages/template.html"
                })
                .state('app.login', {
                    data: {
                        title: "m-reddit | Login"
                    },
                    url: "/login",
                    templateUrl: "app/pages/login.html",
                    controller: function ($scope) {

                    }
                })
                .state('app.subreddit', {
                    data: {
                        title: "m-reddit | Posts"
                    },
                    abstract: true,
                    url: "/r",
                    templateUrl: "app/pages/subreddit-pane.html",
                    controller: "SubredditPaneCtrl",
                    controllerAs: "subredditPaneCtrl"
                })
                .state('app.subreddit.posts', {
                    data: {
                        title: "m-reddit | Posts"
                    },
                    url: "/:subreddit",
                    templateUrl: "app/pages/subreddit.html",
                    controller: "SubredditCtrl",
                    controllerAs: "subredditCtrl"
                })
                .state('app.subreddit.comments', {
                    data: {
                        title: "m-reddit | Comments"
                    },
                    url: "/:subreddit/comments/:commentId/:commentTitle",
                    templateUrl: "app/pages/comments.html",
                    controller: "CommentsCtrl",
                    controllerAs: "commentsCtrl"
                });
    });
    app.run([
        '$rootScope', '$state',function ($rootScope, $state) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data.title) {
                    $rootScope.pageTitle = toState.data.title;
                }
            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // something else 
            });
        }
    ]);
})(angular);

