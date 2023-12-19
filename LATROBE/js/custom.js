// Updated custom.js from Third Iron to fix the BrowZine integration errors - 2023-11-30 v3
// Changed unpaywallEmailAddressKey, changed the single quote marks in prmCitationAfter
// Mimecast replaced all the URLs! Fixed them.
// Note that Third Iron removed all the comments from this file. I'll put them back if this works.

(function() {
    "use strict";
    'use strict';
	
	
	// Talis reading list integration, based on the https://github.com/alfi1/primo-aspire-api
	
    var app = angular.module('viewCustom', ['angularLoad']).constant('AspireTrustBaseUrl', "https://latrobe.rl.talis.com/").config(['$sceDelegateProvider', 'AspireTrustBaseUrl', function($sceDelegateProvider, AspireTrustBaseUrl) {
        var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
        urlWhitelist.push(AspireTrustBaseUrl + '**');
        $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
    }]);
	
    app.component('prmServiceDetailsAfter', {
        bindings: {
            parentCtrl: '<'
        },
        controller: 'DisplayAspireListsController',
        template: '<div ng-if="listsFound"><span class="bold text">Cited on reading lists:</span><ul><li ng-repeat="(url,listname) in listsFound"><a href="{{url}}">{{listname}} </a></li></ul></div>'
    });
	
    app.controller('DisplayAspireListsController', function($scope, $http) {
        var vmt = this;
		
        this.$onInit = function() {
            {
                var theMMSID = vmt.parentCtrl.item.pnx.search.addsrcrecordid[0];
                console.log("LY: function returns " + theMMSID);
                
				var url = 'https://latrobe.rl.talis.com/lcn/' + theMMSID + '/lists.json';
				
                $http.jsonp(url, {
                    jsonpCallbackParam: 'cb'
                }).then(function handleSuccess(response) {
                    $scope.listsFound = response.data;
                });
            }
        };
    });
	//end Talis reading list integration

    //LibChat integration
    var libchatHash = '18578295f317837477f054d32b1e7b01';
    var div = document.createElement('div');
    div.id = 'libchat_' + libchatHash;
    document.getElementsByTagName('body')[0].appendChild(div);
    var scr = document.createElement('script');
    scr.src = 'https://latrobe.libanswers.com/load_chat.php? hash=' + libchatHash;
    setTimeout(function() {
        document.getElementsByTagName('body')[0].appendChild(scr);
    }, 2000);
	//end LibChat integration

    //BrowZine integration
    var app = angular.module('viewCustom', ['chat'])
    angular.module('chat', ['angularLoad']).component('addChat', {
        controller: ['angularLoad', function(angularLoad) {
            this.$onInit = function() {
                angularLoad.loadScript('https://latrobe.libanswers.com/load_chat.php?hash=16f4a310dcd007c4fff853f28ece1970')
            }
        }]
    })
    app.component('prmTopBarBefore', {
        template: '<add-chat />'
    })

    
    app.controller('prmLogoAfterController', [function() {
        var vm = this;
        vm.getIconLink = getIconLink;
        function getIconLink() {
            return vm.parentCtrl.iconLink;
        }
    }]);
    app.component('prmLogoAfter', {
        bindings: {
            parentCtrl: '<'
        },
        controller: 'prmLogoAfterController',
        template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner"><img src="custom/LATROBE/img/library-logo.png" alt="La Trobe University Library" usemap="#logomap_lg" class="logo-image"><map name="logomap_lg"><area shape="rect" coords="0,0,135,48" alt="La Trobe" href="http://latrobe.edu.au"><area shape="rect" coords="0,0,210,48" alt="Library" href="http://latrobe.edu.au/library"></map></div>'
    });
	
	// Add EasyCite link after Citations area
	/*Thanks to Amelia Rowe, RMIT 09/08/2019 . Added 20/09/21 Rachel S Discovery LTU*/
    app.component('prmCitationAfter', {
        bindings: {
            parentCtrl: '<'
        },
        template: '<div class="layout-align-center-center layout-row" layout-align="center center" style="background-color: #ede49e; padding-top: 0.5em;" ><span class="bar-text"><p style="font-size: medium;font-family: arial;font-weight: bold;">Ensure your Citation meets La Trobe standards via our <a target=_blank href=https://latrobe.libguides.com/academicreftoolgroup target="_blank">Academic Referencing Tool</a></p></span></div>'
    });

    
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
    showFormatChoice: false,
    showLinkResolverLink: true,
    enableLinkOptimizer: true,
  
    articleRetractionWatchEnabled: true,
    articleRetractionWatchText: "Retracted Article",
    
    unpaywallEmailAddressKey: "d.witteveen@latrobe.edu.au",
    articlePDFDownloadViaUnpaywallEnabled: true,
    articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)",
    articleLinkViaUnpaywallEnabled: true,
    articleLinkViaUnpaywallText: "Read Article (via Unpaywall)",
    articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
    articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall)",
    articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
    articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall)",
  };

  browzine.script = document.createElement("script");
  browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
  document.head.appendChild(browzine.script);

  app.controller('prmSearchResultAvailabilityLineAfterController', function($scope) {
    window.browzine.primo.searchResult($scope);
  });

  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityLineAfterController'
  });
// ... End BrowZine - Primo Integration

})();
