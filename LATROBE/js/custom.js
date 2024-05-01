(function(){
  "use strict";
  'use strict';
  
  var app = angular.module('viewCustom', ['angularLoad']);
  
  console.log('LATROBE view version 0.1.16.4');
  //console.log('includes: LibChat, Browzine, Talis (v2)');
  
  /* -------------------------------------------
  / LibChat integration
  ------------------------------------------- */
  angular.module('chat', ['angularLoad'])
    .component('addChat', {
      controller: ['angularLoad', function(angularLoad) {
        this.$onInit = function() {
          angularLoad.loadScript('https://latrobe.libanswers.com/load_chat.php?hash=18578295f317837477f054d32b1e7b01');
        }
      }]
    })
  app.component('prmExploreFooterAfter', {
    template: '<add-chat></add-chat>'
  })
  app.requires.push('chat');
  // ------------------------------------------- end LibChat integration
  
  
  /* -------------------------------------------
  / Browzine integration
  ------------------------------------------- */
  app.controller('SearchResultAvailabilityLineAfterController', [function () {
    var vm = this;
  }]);
  
  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchResultAvailabilityLineAfterController',
    template: '\n    <primo-browzine parent-ctrl="$ctrl.parentCtrl"></primo-browzine>\n'
  
  });
  
  PrimoBrowzineController.$inject = ["$scope"];
  
  function isBrowzineLoaded() {
    var validation = false;
    var scripts = document.head.querySelectorAll("script");
  
    if (scripts) {
      Array.prototype.forEach.call(scripts, function (script) {
        if (script.src.indexOf("browzine-primo-adapter") > -1) {
          validation = true;
        }
      });
    }
  
    return validation;
  };
  
  function PrimoBrowzineController($scope) {
    if (!isBrowzineLoaded()) {
      window.browzine = {
        libraryId: "889",
        apiKey: "a8d9b1e9-fda2-4043-9e64-08f7bbc85754",
  
        journalCoverImagesEnabled: true,
  
        journalBrowZineWebLinkTextEnabled: true,
        journalBrowZineWebLinkText: "View Journal Contents",
  
        articleBrowZineWebLinkTextEnabled: true,
        articleBrowZineWebLinkText: "View Issue Contents",
  
        articlePDFDownloadLinkEnabled: true,
        articlePDFDownloadLinkText: "Download PDF",
  
        articleLinkEnabled: true,
        articleLinkText: "Read Article",
  
        printRecordsIntegrationEnabled: true,
  
        unpaywallEmailAddressKey: "ltu-library@latrobe.edu.au",
  
        articlePDFDownloadViaUnpaywallEnabled: true,
        articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)",
  
        articleLinkViaUnpaywallEnabled: true,
        articleLinkViaUnpaywallText: "Read Article (via Unpaywall)",
  
        articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
        articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall)",
  
        articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
        articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall)"
      };
  
      window.browzine.script = document.createElement("script");
      window.browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
      window.document.head.appendChild(window.browzine.script);
    }
  
    (function poll() {
      if (isBrowzineLoaded() && window.browzine.primo) {
        window.browzine.primo.searchResult($scope);
      } else {
        requestAnimationFrame(poll);
      }
    })();
  };
  
  var PrimoBrowzineComponent = {
    selector: "primoBrowzine",
    controller: PrimoBrowzineController,
    bindings: { parentCtrl: "<" }
  };
  
  var PrimoBrowzineModule = angular.module("primoBrowzine", []).component(PrimoBrowzineComponent.selector, PrimoBrowzineComponent).name;
  
  app.requires.push(PrimoBrowzineModule);
  // ------------------------------------------- end Browzine integration
  
  
  /* -------------------------------------------
  / Talis reading list integration (v2)
  / Based on https://github.com/uqlibrary/exlibris-primo/blob/master/src/view_package/js/custom.js
  ------------------------------------------- */
  app.constant('AspireTrustBaseUrl', "https://latrobe.rl.talis.com/")
    .config([
      '$sceDelegateProvider', 
      'AspireTrustBaseUrl', 
      function($sceDelegateProvider, AspireTrustBaseUrl) {
        var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
        urlWhitelist.push(AspireTrustBaseUrl + '**');
        $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
      }
    ]);
  
  function isFullDisplayPage() {
    return window.location.pathname.includes("fulldisplay");
  }
  
  function getListTalisUrls(item) {
    const TALIS_DOMAIN = "https://latrobe.rl.talis.com/"; // AspireTrustBaseUrl
    const list = [];
    // need to restrict a new type and don't know the exact name? Get an example url for the type and put a debug
    // stop in the browser Source Inspection in getListTalisUrls, and check what is found at
    // Local > item > pnx > type in the variable Scope
    const materialType = !!item?.pnx?.display?.type && item.pnx.display.type[0];
    const restrictedCheckList = [
      "article",
      "book_chapter",
      "conference_paper",
      "conference_proceeding",
      "design",
      ///"government_document",
      ///"magazinearticle", // Primo currently using a non-standard format
      ///"magazine_article", // future-proof it
      "market_research",
      ///"newsletterarticle", // Primo currently using a non-standard format
      ///"newsletter_article", // future-proof it
      "newspaper_article",
      "patent",
      "questionnaire",
      "report",
      "review",
      ///"web_resource",
      "working_paper",
    ];
    const isRestrictedCheckType = restrictedCheckList.includes(materialType);
  
    // LCN
    if (!!item?.pnx?.search?.addsrcrecordid && item.pnx.search.addsrcrecordid.length > 0) {
      item.pnx.search.addsrcrecordid.forEach(r => {
        list.push(TALIS_DOMAIN + 'lcn/' + r + '/lists.json');
      })
    }
  
    // DOI
    if (!!item?.pnx?.addata?.doi && item.pnx.addata.doi.length > 0) {
      item.pnx.addata.doi.forEach(r => {
        list.push(TALIS_DOMAIN + 'doi/' + r + '/lists.json');
      })
    }

    // check if the identifier is actually a DOI (as has been observed for some theses)
    if (!!item?.pnx?.display?.identifier && item.pnx.display.identifier.length == 1) {
      // single identifier, so if it looks like a DOI, use that
      var ident = item.pnx.display.identifier[0];
      if(ident.indexOf('10.') == 0) {
        list.push(TALIS_DOMAIN + 'doi/' + ident + '/lists.json');
      }
    }    
  
    // EISBN
    if (!isRestrictedCheckType && !!item?.pnx?.addata?.eisbn && item.pnx.addata.eisbn.length > 0) {
      item.pnx.addata.eisbn.forEach(r => {
        const isbn = r.replace(/[^0-9X]+/gi, '');
        [10, 13].includes(isbn.length) && list.push(TALIS_DOMAIN + 'eisbn/' + isbn + '/lists.json');
      })
    }
  
    // ISBN
    if (!isRestrictedCheckType && !!item?.pnx?.addata?.isbn && item.pnx.addata.isbn.length > 0) {
      item.pnx.addata.isbn.forEach(r => {
        const isbn = r.replace(/[^0-9X]+/gi, '');
        [10, 13].includes(isbn.length) && list.push(TALIS_DOMAIN + 'isbn/' + isbn + '/lists.json');
      })
    }
  
    // EISSN
    if (!isRestrictedCheckType && !!item?.pnx?.addata?.eissn && item.pnx.addata.eissn.length > 0) {
      item.pnx.addata.eissn.forEach(r => {
        list.push(TALIS_DOMAIN + 'eissn/' + r + '/lists.json');
      })
    }
  
    // ISSN
    if (!isRestrictedCheckType && !!item?.pnx?.addata?.issn && item.pnx.addata.issn.length > 0) {
      item.pnx.addata.issn.forEach(r => {
        list.push(TALIS_DOMAIN + 'issn/' + r + '/lists.json');
      })
    }
  
    return list;
  }
  
  app.component('prmServiceDetailsAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'DisplayTalisListsController',
    template: 
      '<div class="reading-lists" ng-if="totalCourses > 0">' +
        '<div layout="row" layout-xs="column">' +
          '<div flex-gt-sm="20" flex-gt-xs="25" flex="">' +
            '<span class="bold-text word-break" title="Reading lists">Included in {{totalCourses}} reading list{{totalCourses == 1 ? "" : "s"}}:</span>' +
            '<a ng-if="totalCourses > 3" class="accessible-only skip-option" href="#afterRL" onclick="location.hash=\'\';">Skip over reading lists</a>' +
          '</div>' +

          '<div class="item-details-element-container" flex="">' +
            '<div role="list" class="reading-lists-wrapper item-details-element" ng-switch="totalCourses">' +
              '<div ng-switch-when="1">' +
                '<span ng-repeat="(url,listname) in talisCourses">' +
                  '<a href="{{url}}" target="_blank">{{listname}}</a>' +
                '</span>' +
              '</div>' +
              '<ul ng-switch-default>' +
                '<li ng-repeat="(url,listname) in talisCourses">' +
                  '<a href="{{url}}" target="_blank">{{listname}}</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +        
        '<span ng-if="totalCourses > 3" id="afterRL"></span>' +
      '</div>'
  });
  
  app.controller('DisplayTalisListsController', function($scope, $http) {
    var vm = this;
    
    this.$onInit = function () {
      $scope.talisCourses = [];
      $scope.totalCourses = 0;
  
      if (!isFullDisplayPage()) {
        return;
      }
  
      let courseList = {}; // associative arrays are done in js as objects
  
      async function getTalisDataFromAllApiCalls(listUrls) {
        const listUrlsToCall = listUrls.filter(url => url.startsWith('http'))
        const promiseList = listUrlsToCall.map(url => $http.jsonp(url, {jsonpCallbackParam: 'cb'}));
        // get all the urls then sort them into a non-repeating list
        await Promise.allSettled(promiseList)
          .then(response => {
            response.forEach(r => {
              if (!r.status || r.status !== 'fulfilled' || !r.value || !r.value.data) {
                return;
              }
              for (let talisUrl in r.value.data) {
                const subjectCode = r.value.data[talisUrl];
                !courseList[talisUrl] && (courseList[talisUrl] = subjectCode);
              }
            });
          })
          .finally(() => {
            if (Object.keys(courseList).length > 0) {
              const recordid = !!vm?.parentCtrl?.item?.pnx?.control?.recordid && vm.parentCtrl.item.pnx.control.recordid; // eg Almalu51268459680002146
              
              $scope.talisCourses = {};
              var totalTestCourses = 0;
              // sort by course code for display
              let sortable = [];
              for (let talisUrl in courseList) {
                const subjectCode = courseList[talisUrl];
                sortable.push([talisUrl, subjectCode]);
              }
              sortable.sort(function(a, b) {
                return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
              });
              sortable.forEach((entry) => {
                const subjectCode = entry[1];
                const talisUrl = entry[0];

                // exclude any list with '[TEST LIST]' or '[RETIRED]' in its name
                if(subjectCode.toLowerCase().indexOf("[test list]") == -1 && subjectCode.toLowerCase().indexOf("[retired]") == -1) $scope.talisCourses[talisUrl] = subjectCode;
                else totalTestCourses++;
              });

              $scope.totalCourses = sortable.length - totalTestCourses;
            }
          });
      }
  
      const listTalisUrls = vm?.parentCtrl?.item && getListTalisUrls(vm.parentCtrl.item);
      if (!!listTalisUrls && listTalisUrls.length > 0) {
        getTalisDataFromAllApiCalls(listTalisUrls);
      }
    };
  });
  // ------------------------------------------- end Talis reading list integration (v2)


  /* -------------------------------------------
  / Scaling iframes' height to match their responsive width
  /
  / If an iframe has the class 'maintain-aspect-ratio', the width & height attributes will determine its aspect ratio.
  / If an iframe has the attribute 'data-aspect-ratio', that aspect ratio is used.
  / If an iframe has the attribute 'data-aspect-ratio-offset', that value is added to the height calculated by the ratio.
  ------------------------------------------- */
  window.onresize = function() {
    var iframes = angular.element(document).find('iframe');  
    angular.forEach(iframes, function(el){
        var iframe = angular.element(el);

        var iRatio;
        if(iframe.hasClass('maintain-aspect-ratio')) {
            var iWidth = parseInt(iframe.attr('width'));
            var iHeight = parseInt(iframe.attr('height'));
            
            iRatio = (iWidth && iHeight > 0) ? iWidth / iHeight : NaN;
        } else {
            iRatio = parseFloat(iframe.attr('data-aspect-ratio'));
        }

        if(iRatio) {
            var actualWidth = iframe[0].offsetWidth;
            
            var newHeight = actualWidth / iRatio;
            
            var arOffset = parseInt(iframe.attr('data-aspect-ratio-offset'));
            if(arOffset) newHeight += arOffset;

            iframe.css('height', newHeight+'px');
        }
    });
  }
  // ------------------------------------------- end scaling iframes' height


  /* -------------------------------------------
  / Guided tour integration
  ------------------------------------------- */
  var guidedTourObserving = false;
  app.component('prmTopbarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'GuidedTourController',
    template: 
      '<div class="notice">'+
        '<div class="notice-icon">'+
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>'+
        '</div>'+
        '<div class="notice-text"><p><strong>Note:</strong> This site has been updated. <a id="tour_button" href="" ng-show="tourLabel" ng-click="startTour()" ng-bind-html="tourLabel"></a></p></div>'+
      '</div>'
  });

  app.controller('GuidedTourController', function($scope, $location, angularLoad) {
    this.$onInit = function () {
      $scope.tourLabel;
      $scope.driverObj;

      if(!window.driver?.js?.driver) {
        // load driverJS
        angularLoad.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/driver.js/1.1.0/driver.css')
        angularLoad.loadScript('https://cdnjs.cloudflare.com/ajax/libs/driver.js/1.1.0/driver.js.iife.js')
          .then(function() {
            // set up the listener
            $scope.setupNavigationListener();
          })
      } else {
        // driverJS already loaded, so just set up the listener
        $scope.setupNavigationListener();
      }
    };

    $scope.startTour = function() {
      if($scope.driverObj) $scope.driverObj.drive();
    }

    $scope.setupNavigationListener = function() {
      // listen for the location change event
      $scope.$on('$locationChangeStart', function(event, next, current) {
        console.log('locationChangeStart - next: '+next);
        
        // update the tour for the new content
        $scope.updateTour(next);
      });

      // update the tour for the initial page content
      $scope.updateTour();
    }

    $scope.updateTour = function(url) {
      if(!url) url = window.location.href;
      
      if(!window.driver?.js?.driver) {
        console.log('DriverJS not defined');
        return;
      }
      
      var tourSteps;
      
      // check which page we're on
      if(/\/search\?/.test(url)) {
        // standard search
        
        if(/query/.test(url)) {
          // results view
          $scope.tourLabel = 'Take a tour of the <strong>Library search results</strong> page.';

          var equivSearchUrl = window.location.href.replace('&mode=simple', '').replace('&mode=advanced', '') + '&mode=advanced';

          tourSteps = [
            {
              element: "prm-brief-result-container",
              popover: {
                title: "Search results",
                description: "The results of your search are listed on the page. Select an item from the results to see its details.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: "prm-facet:has(.sidebar-section)",
              popover: {
                title: "Narrow your results",
                description: "Apply filters (such as 'Resource type' and 'Location') to narrow down your search.",
                side: "right",
                align: "center"
              }
            }, {
              element: "prm-newspapers-spotlight",
              popover: {
                title: "Search newspaper articles",
                description: "A standard library search doesn't include newspaper articles. If you would like to search newspapers, you can select this link.",
                side: "top",
                align: "center",
              }
            }, {
              element: ".search-wrapper",
              popover: {
                title: "Search fields",
                description: "If you didn't get the results that you were after, try a new search. You can always add more search parameters using an <a href='"+equivSearchUrl+"'>Advanced search</a>.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>Library search</strong> page.';

          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the Library search tour', 
                description: 'Take a quick tour to view some of the main features available on this site.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search field",
              description: "Enter the term that you want to search for. Use the drop-downs to apply filters to your search.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: ".search-switch-buttons button",
            popover: {
              title: "Need more search fields?",
              description: "Switch between a simple search and an advanced search with more options.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "prm-user-area-expandable",
            popover: {
              title: "Access your account",
              description: "Use these menu items to sign in and view your library account. Access your account to view the status of any loans or requests for library resources.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: ".s-lch-widget-float-btn",
            popover: {
              title: "Need help?",
              description: "Use the chat feature to talk with a librarian, or use the 'Help' option in the main menu to access resources and information to help you with your library search.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#reportProblem",
            popover: {
              title: "Run into an issue?",
              description: "If you have encountered a problem with a search, resource, or logging in, use this form to report it to the library. ",
              side: "right",
              align: "end"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      } else if(/\/dbsearch\?/.test(url)) {
        // database search
        
        if(/query/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Database search results</strong> page.';

          var equivSearchUrl = url.replace('/dbsearch', '/search').replace('&tab=jsearch_slot','') + '&facet=rtype,include,Databases';

          tourSteps = [
            {
              element: "prm-brief-result-container",
              popover: {
                title: "Search results",
                description: "The results of your search are listed on the page. Select an item from the results to see its details.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: "prm-alert-bar:has(prm-authentication)",
              popover: {
                title: "Sign in",
                description: "You may need to be signed in to view some databases.",
                side: "top",
                align: "center"
              }
            }, {
              element: "prm-resource-recommender:not(.ng-hide)",
              popover: {
                title: "Suggested databases",
                description: "You may be presented with suggestions for other databases that could provide relevant resources.",
                side: "top",
                align: "center"
              }
            }, {
              element: "prm-atoz-search-bar .layout-row[role='search'] > .layout-column",
              popover: {
                title: "Search field",
                description: "If you didn't get the results that you were after, try a new search. You can also try a <a href='"+equivSearchUrl+"'>search using the standard library search</a>.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>Database search</strong> page.';

          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the database search tour', 
                description: 'Take a quick tour to view some of the main features available for a database search.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search field",
              description: "Enter the term that you want to search for.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: ".language-characters",
            popover: {
              title: "Know what it starts with?",
              description: "Search titles starting with these characters.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: ".databases-categories",
            popover: {
              title: "Database categories",
              description: "Browse by database category. Select the arrow next to a category to see any sub-categories.",
              side: "top",
              align: "start"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      } else if(/\/npsearch\?/.test(url)) {
        // newspaper article search
        
        if(/query/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Newspaper search results</strong> page.';

          tourSteps = [
            {
              element: "prm-brief-result-container",
              popover: {
                title: "Search results",
                description: "The results of your search are listed on the page. Select an item from the results to see its details.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: "prm-facet",
              popover: {
                title: "Narrow your results",
                description: "Apply filters (such as 'Date' and 'Subject') to narrow down your search.",
                side: "right",
                align: "center"
              }
            }, {
              element: "prm-alert-bar:has(prm-authentication)",
              popover: {
                title: "Sign in",
                description: "You may need to be signed in to view some articles.",
                side: "top",
                align: "center"
              }
            }, {
              element: ".search-elements-wrapper",
              popover: {
                title: "Search field",
                description: "If you didn't get the results that you were after, try searching for a different term.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>Newspaper search</strong> page.';
          
          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the newspaper article search tour', 
                description: 'Take a quick tour to view some of the main features available for a newspaper article search.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search field",
              description: "Enter the term that you want to search for.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "[ng-if='$ctrl.displayFeaturedNewspapers()']",
            popover: {
              title: "Featured newspapers",
              description: "You may limit your search to within one of the featured newspapers.",
              side: "top",
              align: "center"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      } else if(/\/jsearch\?/.test(url)) {
        // journal search
        
        var equivSearchUrl = url.replace('/jsearch', '/search').replace('&tab=jsearch_slot','') + '&facet=rtype,include,journals';

        if(/query/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>E-journal search results</strong> page.';

          tourSteps = [
            {
              element: "prm-brief-result-container",
              popover: {
                title: "Search results",
                description: "The results of your search are listed on the page. Select an item from the results to see its details.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: "prm-alert-bar:has(prm-authentication)",
              popover: {
                title: "Sign in",
                description: "You may need to be signed in to view some results.",
                side: "top",
                align: "center"
              }
            }, {
              element: "prm-atoz-search-bar .layout-row[role='search'] > .layout-column",
              popover: {
                title: "Search field",
                description: "If you didn't get the results that you were after, try a new search. You can also try a <a href='"+equivSearchUrl+"'>search using the standard library search</a>.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>E-journal search</strong> page.';

          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the journal search tour', 
                description: 'Take a quick tour to view some of the main features available for a journal search.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search field",
              description: "Enter the term that you want to search for.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: ".language-characters",
            popover: {
              title: "Know what it starts with?",
              description: "Search titles starting with these characters.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      } else if(/\/browse\?/.test(url)) {
        // Browse
        
        if(/browseQuery/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Browse results</strong> page.';

          tourSteps = [
            {
              element: "prm-browse-result",
              popover: {
                title: "Search results",
                description: "The results of your search are listed on the page. Select an item from the results to see the records it contains.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: ".search-elements-wrapper",
              popover: {
                title: "Search field",
                description: "If you didn't get the results that you were after, try a different search term.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>Browse</strong> page.';

          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the browse tour', 
                description: 'Take a quick tour to view some of the main features available when browsing.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search field",
              description: "Enter the term that you want to search for.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      } else if(/\/account\?/.test(url)) {
        // my account
        
        if(/section=loans/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Loans</strong> tab.';

          tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your loans",
                description: "Any loans that you have are listed here.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            }, {
              element: "#loans-focus",
              popover: {
                title: "View active or previous loans",
                description: "Use this drop-down to view any previous loans your have made.",
                side: "right",
                align: "start"
              }
            }, {
              element: "md-tabs-canvas",
              popover: {
                title: "Account sections",
                description: "Use the tabs to view other aspects of your library account.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else if(/section=requests/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Requests</strong> tab.';

          tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your requests",
                description: "Any requests for library resources that you have made are listed here.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            }, {
              element: "md-tabs-canvas",
              popover: {
                title: "Account sections",
                description: "Use the tabs to view other aspects of your library account.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else if(/section=fines/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Fines</strong> tab.';

          tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your fines",
                description: "Any fines that you are required to pay are listed here.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            }, {
              element: "prm-fines a[ng-if='$ctrl.payFinesLink']",
              popover: {
                title: "Pay your fines",
                description: "Follow this link to pay any fines you have.",
                side: "right",
                align: "start"
              }
            }, {
              element: "md-tabs-canvas",
              popover: {
                title: "Account sections",
                description: "Use the tabs to view other aspects of your library account.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else if(/section=blocks_messages/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Messages</strong> tab.';

          tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your messages",
                description: "Any messages regarding your loans or requests are listed here.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            }, {
              element: "md-tabs-canvas",
              popover: {
                title: "Account sections",
                description: "Use the tabs to view other aspects of your library account.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else if(/section=personal_details/.test(url)) {
          $scope.tourLabel = 'Take a tour of the <strong>Personal details</strong> tab.';

          tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your personal details",
                description: "The personal details that the library stores for your account are displayed here.",
                showButtons: ["next", "close"],
                side: "top",
                align: "center"
              }
            }, {
              element: "#personal_settings-focus",
              popover: {
                title: "Edit details",
                description: "You can edit the details and notification settings for your library account.",
                side: "bottom",
                align: "center",
              }
            }, {
              element: "md-tabs-canvas",
              popover: {
                title: "Account sections",
                description: "Use the tabs to view other aspects of your library account.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Take a tour of the <strong>My account</strong> page.';

          tourSteps = [{ 
            popover: { 
                title: 'Welcome to the \'My account\' tour', 
                description: 'Take a quick tour to view some of the main features available in your account.',
                nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: "md-tab-item:has([translate='nui.loans.header'])",
            popover: {
              title: "Your loans",
              description: "Select this tab to see a list of your current loans.",
              side: "top",
              align: "center"
            }
          }, {
            element: "md-tab-item:has([translate='nui.requests.header'])",
            popover: {
              title: "Your requests",
              description: "Select this tab to see the status of any requests for library resources.",
              side: "top",
              align: "center"
            }
          }, {
            element: "md-tab-item:has([translate='nui.fines.header'])",
            popover: {
              title: "Your fines",
              description: "Select this tab to see if you have any outstanding fines for overdue or lost items.",
              side: "top",
              align: "center"
            }
          }, {
            element: "md-tab-item:has([translate='nui.blocks.header'])",
            popover: {
              title: "Your messages",
              description: "Select this tab to see any messages regarding your loans or requests.",
              side: "top",
              align: "center"
            }
          }, {
            element: "md-tab-item:has([translate='nui.details.header'])",
            popover: {
              title: "Your personal details",
              description: "Select this tab to view and modify your library account details.",
              side: "top",
              align: "center"
            }
          }, {
            element: "#mainMenu",
            popover: {
              title: "Main menu",
              description: "Use this menu to start a search for any library resources or view help documentation.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#banner",
            popover: {
              title: "Library website",
              description: "To return to the library website, select the La Trobe University logo.",
              side: "bottom",
              align: "center"
            }
          }, {
            element: "#tour_button",
            popover: {
              title: "That's all for now",
              description: "Thanks for taking the tour. You can restart it at any time from here.",
              side: "bottom",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }]
        }
      }

      if(tourSteps != null) {
        $scope.driverObj = window.driver.js.driver({
          animate: 0,
          popoverClass: 'ltu-tour',
          showProgress: !0,
          showButtons: ["next", "previous", "close"],
          nextBtnText: "Next",
          prevBtnText: "Previous",
          doneBtnText: "Done",
          steps: tourSteps
        });
      }
    }
  });
  // ------------------------------------------- end Guided tour integration
  
})();
