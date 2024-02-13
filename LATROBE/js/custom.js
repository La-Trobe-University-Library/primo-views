(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);

console.log('libTest JS version 0.1.11.5');
console.log('includes: LibChat, Browzine, Talis');

/* -------------------------------------------
/ LibChat integration (via JS)
------------------------------------------- */
/*
var libchatHash = '18578295f317837477f054d32b1e7b01';
var div = document.createElement('div');
div.id = 'libchat_' + libchatHash;
document.getElementsByTagName('body')[0].appendChild(div);
var scr = document.createElement('script');
scr.src = 'https://latrobe.libanswers.com/load_chat.php?hash=' + libchatHash;
setTimeout(function() {
  console.log('Adding LibChat script...');
  document.getElementsByTagName('body')[0].appendChild(scr);
}, 2000);
*/
// ------------------------------------------- end LibChat integration (via JS)

/* -------------------------------------------
/ LibChat integration (via Angular)
------------------------------------------- */
angular.module('chat', ['angularLoad'])
  .component('addChat', {
    controller: ['angularLoad', function(angularLoad) {
      this.$onInit = function() {
        angularLoad.loadScript('https://latrobe.libanswers.com/load_chat.php?hash=18578295f317837477f054d32b1e7b01')
      }
    }]
  })
app.component('prmExploreFooterAfter', {
  template: '<add-chat></add-chat>'
})
app.requires.push('chat');
// ------------------------------------------- end LibChat integration (via Angular)


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
/ Talis reading list integration, based on https://github.com/alfi1/primo-aspire-api
------------------------------------------- */
app.constant('AspireTrustBaseUrl', "https://latrobe.rl.talis.com/")
  .config(['$sceDelegateProvider', 'AspireTrustBaseUrl', function($sceDelegateProvider, AspireTrustBaseUrl) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push(AspireTrustBaseUrl + '**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }]);

app.component('prmServiceDetailsAfter', {
  bindings: {
    parentCtrl: '<'
  },
  controller: 'DisplayAspireListsController',
  template: '<div ng-if="listsFound"><span class="bold text">Cited on reading lists:</span><ul><li ng-repeat="(url,listname) in listsFound"><a href="{{url}}" target="_blank">{{listname}}</a></li></ul></div>'
});

app.controller('DisplayAspireListsController', function($scope, $http) {
  var vmt = this;

  this.$onInit = function() {
    try {
      console.log('Checking for MMSID...');
      var theMMSID = vmt?.parentCtrl?.item?.pnx?.search?.addsrcrecordid[0];
      
      if(theMMSID && theMMSID != '') {
        console.log("Found MMSID: " + theMMSID);
        
        var url = 'https://latrobe.rl.talis.com/lcn/' + theMMSID + '/lists.json';

        $http.jsonp(url, {
          jsonpCallbackParam: 'cb'
        })
          .then(function handleSuccess(response) {
            $scope.listsFound = response.data;
          });
      } else {
        console.log('No MMSID found');
      }
    } catch(error) {
      console.log('Error reading the MMSID')
    }
  };
});
// ------------------------------------------- end Talis reading list integration


})();