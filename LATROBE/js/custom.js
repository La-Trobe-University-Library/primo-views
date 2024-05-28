(function(){
  "use strict";
  'use strict';
  
  var app = angular.module('viewCustom', ['angularLoad']);
  
  console.log('LATROBE view version 0.1.20');
  //console.log('includes: LibChat, Browzine, Talis (v2), guided tours');
  
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
      '<style>:not(body):has(> .driver-active-element) { overflow: inherit !important; }</style>'+
      '<a id="tour_button" href="" ng-show="tourLabel" ng-click="startTour()" ng-class="{\'animate\':animateButton, \'show\':tourLabel}">'+
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" style="margin: 0 5px 0 0;font-size: 1.1em;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 32H64C46.3 32 32 46.3 32 64v64c0 17.7 14.3 32 32 32H441.4c4.2 0 8.3-1.7 11.3-4.7l48-48c6.2-6.2 6.2-16.4 0-22.6l-48-48c-3-3-7.1-4.7-11.3-4.7H288c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 256c0-17.7-14.3-32-32-32H288V192H224v32H70.6c-4.2 0-8.3 1.7-11.3 4.7l-48 48c-6.2 6.2-6.2 16.4 0 22.6l48 48c3 3 7.1 4.7 11.3 4.7H448c17.7 0 32-14.3 32-32V256zM288 480V384H224v96c0 17.7 14.3 32 32 32s32-14.3 32-32z"></path></svg>'+
        '<span ng-bind-html="tourLabel"></span>'+
      '</a>'
      
      /*'<div class="notice">'+
        '<div class="notice-icon">'+
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>'+
        '</div>'+
        '<div class="notice-text"><p><strong>Note:</strong> This site has been updated.</p></div>'+
      '</div>'*/
  });

  app.controller('GuidedTourController', function($scope, $rootScope, $timeout, angularLoad) {
    this.$onInit = function () {
      $scope.driverObj;
      $scope.tourLabel;
      $scope.tourSteps;
      $scope.advSearchTourSteps;
      $scope.animateButton;
      $scope.timer;

      if(!window.driver?.js?.driver) {
        // load driverJS
        angularLoad.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/driver.js/1.3.1/driver.css')
        angularLoad.loadScript('https://cdnjs.cloudflare.com/ajax/libs/driver.js/1.3.1/driver.js.iife.js')
          .then(function() {
            // set up the guided tour
            $scope.setupGuidedTour();
          })
      } else {
        // driverJS already loaded, so just set it up
        $scope.setupGuidedTour();
      }
    };

    $scope.startTour = function() {
      // start the tour (removing any active ones)
      if($scope.driverObj && $scope.tourSteps) {
        $scope.driverObj.destroy();
        $scope.driverObj.setSteps($scope.tourSteps);
        $scope.driverObj.drive();
      }
    }

    $scope.setupGuidedTour = function() {
      $scope.driverObj = window.driver.js.driver({
        animate: 0,
        popoverClass: 'ltu-tour',
        showProgress: !0,
        showButtons: ["next", "previous", "close"],
        nextBtnText: "Next",
        prevBtnText: "Previous",
        doneBtnText: "Done"
      });

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

      // flag whether the tour button should animate down into position
      $scope.animateButton = false;

      // check whether Primo is showing its 'mobile' (xs) view
      var isMobileView = document.querySelector('primo-explore.__xs') != null;

      // time (in ms) to allow for the menu to open/close when navigating to next/prev step
      var menuDelay = 100;
      
      // check which page we're on
      if(/\/search\?/.test(url)) {
        // standard search
        
        if(/query/.test(url)) {
          // results view
          $scope.tourLabel = 'Tour the <strong>Library collections</strong> search results page';

          var advSearchUrl = window.location.href.replace('&mode=simple', '').replace('&mode=advanced', '').replace('&startTour=1', '') + '&mode=advanced';

          $scope.tourSteps = [
            {
              element: "prm-brief-result-container",
              popover: {
                title: "Library collections search results",
                description: "The results of your library collections search are listed on the page. Select an item from the results to see its details.",
                showButtons: ["next", "close"],
                side: "bottom",
                align: "center"
              }
            }, {
              element: ".result-item-actions prm-save-to-favorites-button",
              popover: {
                title: "Save to favourites",
                description: "You can save an item to your favourites to make it easier to find again.",
                side: "right",
                align: "center"
              }
            },
            // FOLLOWING ELEMENTS ARE DIFFERENT DEPENDING ON THE VIEW
            {
              element: isMobileView ? null : ".result-item-actions button[data-qa='open_up_front_Citation_action']",
              popover: {
                title: "View citation formats",
                description: "If you need to cite an item in your work, you can select its citation button to view its details in various standard reference formats.",
                side: "right",
                align: "center"
              }
            }, {
              element: isMobileView ? "#mobilePersonalization" : "#personalizationBtn",
              popover: {
                title: "Personalise your results",
                description: "You can specify your preferred disciplines to have relevant items listed higher in the search results.",
                side: "right",
                align: "center"
              }
            }, {
              element: isMobileView ? "#sidebar-trigger" : "prm-facet:has(.sidebar-section)",
              popover: {
                title: "Narrow your results",
                description: "Apply filters (such as 'Peer-reviewed' and 'Resource type') to narrow down your search. You can also 'Search beyond our collection' to include results from other libraries.",
                side: "right",
                align: "center"
              }
            }, 
            // FOLLOWING ELEMENTS ARE ON THE PAGE
            {
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
                title: "Search form",
                description: "If you didn't get the results that you were after, try a new search. You can always add more search parameters using an <a href='"+advSearchUrl+"'>Advanced search</a>.",
                side: "bottom",
                align: "center"
              }
            }, {
              element: ".s-lch-widget-float-btn",
              popover: {
                title: "Need help?",
                description: "Use the chat feature to talk with a librarian, or use the 'Help' option in the main menu to access resources and information to help you with your library search.",
                side: "bottom",
                align: "center",
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the next element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to show
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay); 
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENT IS EITHER IN MENU OR ON THE PAGE
            {
              element: isMobileView ? "prm-main-menu[menu-type='full'] button:has([translate='report.Title'])" : "#reportProblem",
              popover: {
                title: "Ran into an issue?",
                description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
                side: "right",
                align: "end",
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the previous element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }
                },
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the next element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay); 
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENT IS ON THE PAGE
            {
              element: "#banner",
              popover: {
                title: "Library website",
                description: "To return to the library website, select the La Trobe University logo.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour',
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the next element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }
                }
              }
            }]
        } else {
          $scope.tourLabel = "Tour the <strong>Library collections</strong> search page";

          $scope.tourSteps = [
            { 
              popover: { 
                  title: "Welcome to the Library collections search", 
                  description: "This search allows you to find any resource within the library's many collections.",
                  showButtons: ["next", "close"],
                  popoverClass: 'ltu-tour ltu-begin-tour'
              }
            },
            // FOLLOWING ELEMENT IS DIFFERENT DEPENDING ON THE VIEW
            {
              element: isMobileView ? "prm-topbar button.mobile-menu-button" : "#more-links-button",
              popover: {
                title: "Check the menu",
                description: "<p>Select the '3-dot' menu item to view the full main menu.</p><p>Note that when you're in 'mobile' view, some options that are usually on the page (e.g. the 'Advanced search') are instead within this menu.</p>",
                side: "bottom",
                align: "center"
              }
            }, {
              element: ".search-elements-wrapper",
              popover: {
                title: "Search form",
                description: "<p>Enter the term that you want to search for. Use the drop-downs to apply filters to your search.</p><p>You can also 'Search by voice' in supported web browsers (Chrome or Edge are recommended).</p>",
                side: "bottom",
                align: "center",
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the next element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to show
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay);
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENTS ARE EITHER IN MENU OR ON THE PAGE
            {
              element: isMobileView ? "prm-main-menu[menu-type='full'] button:has([translate='label.advanced_search'])" : ".search-switch-buttons button",
              popover: {
                title: "Need more search fields?",
                description: "Switch between a simple search and an advanced search that lets you specify more filters and criteria.",
                side: "bottom",
                align: "center",
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the previous element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }
                }
              }
            }, {
              element: isMobileView ? "prm-main-menu[menu-type='full'] button:has([translate='eshelf.signin.title'])" : "prm-user-area-expandable",
              popover: {
                title: "Your library account",
                description: "Sign in to access your library account, where you can view the status of any loans or requests for library resources.",
                side: "bottom",
                align: "center",
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the next element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay); 
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENTS ARE ON THE PAGE
            {
              element: "#favorites-button",
              popover: {
                title: "View your favourites",
                description: "If you have saved any items or searches to your favourites, you can view them via this button.",
                side: "bottom",
                align: "center",
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the previous element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to show
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);    
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }            
                }
              }
            }, {
              element: ".s-lch-widget-float-btn",
              popover: {
                title: "Need help?",
                description: "Use the chat feature to talk with a librarian, or use the 'Help' option in the main menu to access resources and information to help you with your library search.",
                side: "bottom",
                align: "center",
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the next element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to show
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay); 
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENTS ARE EITHER IN MENU OR ON THE PAGE
            {
              element: isMobileView ? "prm-main-menu[menu-type='full'] button:has([translate='report.Title'])" : "#reportProblem",
              popover: {
                title: "Ran into an issue?",
                description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
                side: "right",
                align: "end",
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the previous element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }
                },
                onNextClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to close the menu so we can highlight the next element
                    var closeBtn = document.querySelector('#mainMenuFullCloseButton');
                    if(closeBtn) closeBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // continue to the next step
                      $scope.driverObj.moveNext();
                    }, menuDelay); 
                  } else {
                    // continue to the next step
                    $scope.driverObj.moveNext();
                  }
                }
              }
            },
            // FOLLOWING ELEMENTS ARE ON THE PAGE
            {
              element: "#banner",
              popover: {
                title: "Library website",
                description: "To return to the library website, select the La Trobe University logo.",
                side: "bottom",
                align: "center",
                onPrevClick: function(element, step, options) {
                  if(isMobileView) {
                    // we want to open the menu so we can highlight the next element
                    var menuBtn = document.querySelector('prm-topbar button.mobile-menu-button');
                    if(menuBtn) menuBtn.click();

                    // allow time for the menu to hide
                    setTimeout(function() {
                      // go back to the previous step
                      $scope.driverObj.movePrevious();
                    }, menuDelay);
                  } else {
                    // go back to the previous step
                    $scope.driverObj.movePrevious();
                  }
                }
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
            }        
          ]
        }
      } else if(/\/dbsearch\?/.test(url)) {
        // database search
        
        if(/query/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>Databases</strong> search results page';

          var stdSearchUrl = url.replace('/dbsearch', '/search').replace('&tab=jsearch_slot','').replace('&startTour=1', '') + '&facet=rtype,include,Databases';

          $scope.tourSteps = [
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
              element: ".result-item-actions prm-save-to-favorites-button",
              popover: {
                title: "Save to favourites",
                description: "You can save an item to your favourites to make it easier to find again.",
                side: "right",
                align: "center"
              }
            }, {
              element: isMobileView ? null : ".result-item-actions button[data-qa='open_up_front_Citation_action']",
              popover: {
                title: "View citation formats",
                description: "If you need to cite an item in your work, you can select its citation button to view its details in various standard reference formats.",
                side: "right",
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
                title: "Search form",
                description: "<p>If you didn't get the results that you were after, try a new search term or select a letter/number to search databases whose name begins with that character.</p><p>You can also try searching the <a href='"+stdSearchUrl+"'>library collections</a>, which will allow you to apply filters to narrow down your results.</p>",
                side: "bottom",
                align: "center"
              }
            }, {
              element: ".databases-categories",
              popover: {
                title: "Database categories",
                description: "You can browse categories to see a list of relevant databases. Select the arrow next to a category to see any sub-categories.",
                side: "top",
                align: "start"
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
                title: "Ran into an issue?",
                description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
                side: "right",
                align: "end"
              }
            }, {
              element: "#banner",
              popover: {
                title: "Library website",
                description: "To return to the library website, select the La Trobe University logo.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Tour the <strong>Databases</strong> search page';

          $scope.tourSteps = [{ 
            popover: { 
                title: 'Welcome to the databases search', 
                description: "This search allows you to find databases within the library's many collections.",
                //nextBtnText: "Let's begin!",
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
              title: "Ran into an issue?",
              description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
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
      } else if(/\/npsearch\?/.test(url)) {
        // newspaper article search
        
        if(/query/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>Newspaper articles</strong> search results page';

          $scope.tourSteps = [
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
              element: ".result-item-actions prm-save-to-favorites-button",
              popover: {
                title: "Save to favourites",
                description: "You can save an item to your favourites to make it easier to find again.",
                side: "right",
                align: "center"
              }
            }, {
              element: isMobileView ? null : ".result-item-actions button[data-qa='open_up_front_Citation_action']",
              popover: {
                title: "View citation formats",
                description: "If you need to cite an item in your work, you can select its citation button to view its details in various standard reference formats.",
                side: "right",
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
                title: "Ran into an issue?",
                description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
                side: "right",
                align: "end"
              }
            }, {
              element: "#banner",
              popover: {
                title: "Library website",
                description: "To return to the library website, select the La Trobe University logo.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Tour the <strong>Newspaper articles</strong> search page';
          
          $scope.tourSteps = [{ 
            popover: { 
                title: 'Welcome to the newspaper articles search', 
                description: "This search allows you to find newspaper articles within the library's collections.",
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
            element: "prm-newspapers-home div:has(> .newspapers-card-container)",
            popover: {
              title: "Featured newspapers",
              description: "You may limit your search to within one of the featured newspapers.",
              side: "top",
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
              title: "Ran into an issue?",
              description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
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
      } else if(/\/jsearch\?/.test(url)) {
        // journal search
        
        var stdJSearchUrl = url.replace('/jsearch', '/search').replace('&tab=jsearch_slot','').replace('&startTour=1', '') + '&facet=rtype,include,journals';

        if(/query/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>E-journals</strong> search results page';

          $scope.tourSteps = [
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
                description: "If you didn't get the results that you were after, try a new search. You can also try a <a href='"+stdJSearchUrl+"'>search using the standard library search</a>.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }]
        } else {
          $scope.tourLabel = 'Tour the <strong>E-journals</strong> search page';

          $scope.tourSteps = [{ 
            popover: { 
                title: 'Welcome to the journal search tour', 
                description: 'Take a quick tour to view some of the main features available for a journal search.',
                //nextBtnText: "Let's begin!",
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
          $scope.tourLabel = 'Tour the <strong>Browse results</strong> page';

          $scope.tourSteps = [
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
              element: "#speedDialWidget",
              popover: {
                title: "There's more",
                description: "Use the pagination buttons to move between pages of results.",
                side: "left",
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
          $scope.tourLabel = 'Tour the <strong>Browse</strong> page';

          $scope.tourSteps = [{ 
            popover: { 
                title: 'Welcome to the browse search', 
                description: "This search allows you to find a range of resources that are similar in a specific way (e.g. that have a simliar title, or have a similar call number).",
                //nextBtnText: "Let's begin!",
                showButtons: ["next", "close"],
                popoverClass: 'ltu-tour ltu-begin-tour'
            }
          }, {
            element: ".search-elements-wrapper",
            popover: {
              title: "Search form",
              description: "<p>Enter the term that you want to search for. Select the drop-down to specify which field to use for the search.</p><p>Browsing by call number will provide a list of items that would normally appear on the shelf next to the call number that you specify.</p>",
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
              title: "Ran into an issue?",
              description: "If you have encountered a problem with a search, resource, or logging in, select 'Report a problem' to report it to the library. ",
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
      } else if(/\/account\?/.test(url)) {
        // my account
        
        if(/section=loans/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>Loans</strong> tab';

          $scope.tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your loans",
                description: "Any loans that you have are listed here. You can see their due dates and renew to extend the loan period.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            }, {
              element: "#loans-focus",
              popover: {
                title: "View active or previous loans",
                description: "Use this drop-down to view any previous loans you have made.",
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
          $scope.tourLabel = 'Tour the <strong>Requests</strong> tab';

          $scope.tourSteps = [
            {
              element: "md-tab-content.md-active",
              popover: {
                title: "Your requests",
                description: "Any requests for library resources that you have made are listed here. You can also cancel any requests if you need to.",
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
          $scope.tourLabel = 'Tour the <strong>Fines</strong> tab';

          $scope.tourSteps = [
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
          $scope.tourLabel = 'Tour the <strong>Messages</strong> tab';

          $scope.tourSteps = [
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
          $scope.tourLabel = 'Tour the <strong>Personal details</strong> tab';

          $scope.tourSteps = [
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
          $scope.tourLabel = 'Tour the <strong>My account</strong> page';

          $scope.tourSteps = [{ 
            popover: { 
                title: "Welcome to 'My account'", 
                description: 'Take a quick tour to view some of the main features available in your account.',
                //nextBtnText: "Let's begin!",
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
      } else if(/\/favorites\?/.test(url)) {
        // My favourites

        if(/section=queries/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>Saved searches</strong> tab';

          $scope.tourSteps = [
            {
              element: "md-tab-content.md-active md-list",
              popover: {
                title: "Your saved searches",
                description: "Any searches that you have saved are listed here. Select the search term to perform that search again.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            },
            {
              element: "button[aria-label='Set an RSS for this search']",
              popover: {
                title: "RSS feed",
                description: "An RSS feed of results is available for each saved search.",
                side: "left",
                align: "center"
              }
            },
            {
              element: "button[aria-label*='lert For this saved search']",
              popover: {
                title: "Set an alert",
                description: "You can opt to receive email alerts when there is an update to a saved search query. Select the alert button again to remove that alert.",
                side: "top",
                align: "center"
              }
            },
            {
              element: "md-tab-content.md-active button[aria-label='Remove Saved Search']",
              popover: {
                title: "Remove a saved search",
                description: "You can 'unpin' a search to remove it from your saved searches.",
                side: "top",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }];
        } else if(/section=search_history/.test(url)) {
          $scope.tourLabel = 'Tour the <strong>Search history</strong> tab';

          $scope.tourSteps = [
            {
              element: "md-tab-content.md-active md-list",
              popover: {
                title: "Your previous searches",
                description: "Any searches that you have performed are listed here. Select the search term to perform that search again.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            },
            {
              element: "md-tab-content.md-active button[aria-label='Add this search']",
              popover: {
                title: "Add to saved searches",
                description: "If you're signed in, you can add a search from your history to your saved searches.",
                side: "left",
                align: "start"
              }
            },            
            {
              element: "md-tab-content.md-active button[aria-label='Remove this search']",
              popover: {
                title: "Remove a saved search",
                description: "You can remove searches from your search history.",
                side: "top",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }];
        } else {
          $scope.tourLabel = 'Tour the <strong>My favourites</strong> page';

          $scope.tourSteps = [
            {
              element: "md-tab-item:has([translate='nui.favorites.records.tabheader'])",
              popover: {
                title: "Your saved records",
                description: "Any item that you have added to your favourites is listed under the 'Saved records' tab.",
                showButtons: ["next", "close"],
                side: "top",
                align: "start"
              }
            },
            {
              element: "md-tab-content.md-active prm-search-result-list .search-within",
              popover: {
                title: "Search within your favourites",
                description: "You can search to find an item within your favourites.",
                side: "right",
                align: "start"
              }
            },
            {
              element: "md-tab-content.md-active  md-list-item .unpin-button",
              popover: {
                title: "Remove from your favourites",
                description: "You can 'unpin' an item to remove it from your favourites.",
                side: "right",
                align: "start"
              }
            }, 
            {
              element: "md-tab-content.md-active prm-favorites-edit-labels-menu button",
              popover: {
                title: "Label your favourites",
                description: "You can add labels to your saved items to categorise them. It will make finding them again easier.",
                side: "right",
                align: "start"
              }
            },
            {
              element: "prm-favorites-labels .sidebar-inner-wrapper",
              popover: {
                title: "Filter by label",
                description: "Select a label to only show saved items that have that label applied.",
                side: "left",
                align: "start"
              }
            },
            {
              element: "md-tab-item:has([translate='nui.favorites.search.tabheader'])",
              popover: {
                title: "Your saved searches",
                description: "If you're signed in, any queries that you have saved are listed under the 'Saved searches' tab.",
                side: "top",
                align: "center"
              }
            },
            {
              element: "md-tab-item:has([translate='nui.favorites.history.tabheader'])",
              popover: {
                title: "Your search history",
                description: "Your previously used search queries are listed under the 'Search history' tab.",
                side: "bottom",
                align: "center",
                popoverClass: 'ltu-tour ltu-end-tour'
              }
            }
          ];
        }
      } else {
        $scope.tourLabel = null;
      }

      if($scope.tourLabel != null) {
        // animate the button if the type of tour has changed
        $scope.animateButton = $rootScope.tourLabel != $scope.tourLabel;
        $rootScope.tourLabel = $scope.tourLabel;      
        console.log('animate tour button: '+$scope.animateButton);

        if($scope.animateButton) {
          // remove the 'animate' class after the animation would have finished
          $timeout.cancel($scope.timer);
          $scope.timer = $timeout(function(e){
            $scope.animateButton = false;
          }, 550);

          // check whether the tour should be launched automatically (via a URL param)
          if(/startTour=1/.test(url)) {
            $timeout(function(e) {
              $scope.startTour();
            }, 500);
          }
        }
      }

      if(/mode=advanced/.test(url)) {
        // add another guided tour specifically for the advanced search
        
        // remove any previous GT btn
        var prevGTBtn = document.getElementById("adv_search_tour");
        if(prevGTBtn) prevGTBtn.remove();

        // create a link/button to launch the tour
        var div = document.createElement('div');
        div.innerHTML = '<a href="" id="adv_search_tour" title="Tour the advanced search"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg></a>';
        var btn = div.firstElementChild;

        // set up the tour steps
        $scope.advSearchTourSteps = [
          {
            popover: {
              title: "Using the advanced search",
              description: "The advanced search lets you specify more search criteria to narrow down the results that are returned.",
              showButtons: ["next", "close"],
              side: "top",
              align: "center"
            }
          }, {
            element: "prm-advanced-search md-input-container:has([translate='search-advanced.scopes.label'])",
            popover: {
              title: "Set the scope",
              description: "If you want to limit your search to either physical or online resources, select that option here.",
              showButtons: ["next", "close"],
              side: "bottom",
              align: "center"
            }
          }, {
            element: "prm-advanced-search md-select:has([translate='search-advanced.scope.option.nui.advanced.index.any']",
            popover: {
              title: "Specify a field",
              description: "To search in a specific field (e.g. title or subject), you can select it here.",
              side: "top",
              align: "center"
            }
          }, {
            element: "prm-advanced-search md-select:has([translate='search-advanced.precisionOperator.option.contains']",
            popover: {
              title: "Specify the precision",
              description: "Select whether the field should contain, match exactly, or begin with your search term.",
              side: "top",
              align: "center"
            }
          }, {
            element: "prm-advanced-search input[aria-label^='Type Search Query for complex line number']",
            popover: {
              title: "Add your search term",
              description: "Enter the search term for this line here.",
              side: "top",
              align: "center"
            }
          }, {
            element: "prm-advanced-search div:has(> button[aria-label='Add a new line'])",
            popover: {
              title: "Add another line",
              description: "You can add up to seven lines in your search query.",
              side: "top",
              align: "center"
            }
          }, {
            element: "prm-advanced-search .advanced-drop-downs",
            popover: {
              title: "Apply filters",
              description: "You can apply filters to limit the results to certain types (e.g. Articles or Databases), languages, and date of publication.",
              side: "left",
              align: "center",
            }
          }, {
            element: "prm-advanced-search button.button-confirm",
            popover: {
              title: "Perform the search",
              description: "When you have prepared all the search filters and terms, select 'Search' to view the results of your query. Note that you will be able to apply additional filters to narrow down the search results after performing the search.",
              side: "top",
              align: "center",
              popoverClass: 'ltu-tour ltu-end-tour'
            }
          }];
        
        btn.addEventListener("click", function(e) {
          e.preventDefault();
          
          // expand the advanced search (if it's collapsed)
          var expBtn = document.querySelector("prm-advanced-search .collapsed-button[aria-expanded='false']");
          if(expBtn) expBtn.click();

          // start the tour (removing any active ones)
          if($scope.driverObj && $scope.advSearchTourSteps) {
            $scope.driverObj.destroy();
            $scope.driverObj.setSteps($scope.advSearchTourSteps);
            $scope.driverObj.drive();
          }
        });

        // set a timeout as the advanced tab may not be there straight away
        setTimeout(function() {
          // add the button to the tab
          var tab = document.querySelector("prm-advanced-search md-tab-item");
          console.log('Add adv tour - '+(tab != null))
          
          if(tab) tab.appendChild(btn);
        }, 200);
      }
    }
  });
  // ------------------------------------------- end Guided tour integration
  
})();
