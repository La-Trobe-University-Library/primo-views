// Primo custom file - updated 17 July 2023 to fix logo problem

(function(){ //Talis-Primo integration 
    "use strict";
    'use strict';
    
 	// Based on https://github.com/alfi1/primo-aspire-api
	
	// Rewrite for Angular 1.6.  Tim Graves.  16/06/2017
    // This version:
    // Addresses the Trust issue by whitelisting the Talis url
    // Changes the format in which a callback is declared
    // Replaces the deprecated .success function
    // Updated prior to VE update to Angular 1.8. TG. 05/09/2022
    
    var app = angular.module('viewCustom', ['angularLoad'])
    
    // Whitelisting
    .constant('AspireTrustBaseUrl', "https://latrobe.rl.talis.com/").config(['$sceDelegateProvider', 'AspireTrustBaseUrl', function ($sceDelegateProvider, AspireTrustBaseUrl) {
      var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
      urlWhitelist.push(AspireTrustBaseUrl + '**');
      $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
    }]);
    
    // End of whitelisting
      
           app.component('prmServiceDetailsAfter', {
           bindings: { parentCtrl: '<' },
           controller: 'DisplayAspireListsController',
           //template: '<div ng-show="listsFound != null"><span class="bold text">Cited on reading lists:</span><ul><li ng-repeat="(url,listname) in listsFound"><a href="{{url}}">{{listname}} </a></li></ul></div>'
           // Improved line. TG. 06/06/2022
           template: '<div ng-if="listsFound"><span class="bold text">Cited on reading lists:</span><ul><li ng-repeat="(url,listname) in listsFound"><a href="{{url}}">{{listname}} </a></li></ul></div>'
                           
                           
           });
     
     
    app.controller('DisplayAspireListsController', function($scope, $http) {
        //We changed the name of this variable to avoid conflict with definition in the logo
		var vmt = this;
    
        this.$onInit = function(){
          {
            // Uncomment if you want to browse the object's contents
            //console.log(this);
            //console.log(vm.parentCtrl.item.pnx.search.addsrcrecordid[0];
    
            // Declare a global variable to hold the MMSID when it comes from the function
            var theMMSID = vmt.parentCtrl.item.pnx.search.addsrcrecordid[0];
            console.log("LY: function returns " + theMMSID);
    
            var url = 'https://latrobe.rl.talis.com/lcn/' + theMMSID + '/lists.json';
    
    
            // Make the call to Aspire
    
            $http.jsonp(url,{jsonpCallbackParam: 'cb'})
    
            .then(function handleSuccess(response) {
    
             $scope.listsFound = response.data;
                
                });
          }
        };
    });
    
    
    
    
    })();

(function() { // load libchat
	var libchatHash = '18578295f317837477f054d32b1e7b01'; // hash string goes inside quotation marks
	var div = document.createElement('div');
	div.id = 'libchat_' + libchatHash;
	document.getElementsByTagName('body')[0].appendChild(div);
	var scr = document.createElement('script');
	scr.src = 'https://latrobe.libanswers.com/load_chat.php? hash=' + libchatHash;
	setTimeout(function() {
		document.getElementsByTagName('body')[0].appendChild(scr);
	}, 2000);
}());

(function () { // BrowZine integration
    "use strict";
    'use strict';

	var app = angular.module('viewCustom', ['chat'])

		angular
		.module('chat', ['angularLoad'])
		.component('addChat', {
			controller: ['angularLoad', function (angularLoad) {
				this.$onInit = function () {
            angularLoad.loadScript('https://latrobe.libanswers.com/load_chat.php?hash=16f4a310dcd007c4fff853f28ece1970')
			}
		}]
	})

	app.component('prmTopBarBefore', {template: '<add-chat />'})

    var app = angular.module('viewCustom', ['angularLoad'])

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/

	// Begin BrowZine - Primo Integration...
		window.browzine = {
		api: "https://public-api.thirdiron.com/public/v1/libraries/889",
		apiKey: "a8d9b1e9-fda2-4043-9e64-08f7bbc85754",
	  journalCoverImagesEnabled: true,

      journalBrowZineWebLinkTextEnabled: true,
      journalBrowZineWebLinkText: "View Journal Contents",

      articleBrowZineWebLinkTextEnabled: true,
      articleBrowZineWebLinkText: "View Issue Contents",

      articlePDFDownloadLinkEnabled: true,
      articlePDFDownloadLinkText: "Download PDF",

      printRecordsIntegrationEnabled: true,
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


	/* Clickable Logo in banner */

	app.controller('prmLogoAfterController', [function () {
		var vm = this;
		vm.getIconLink = getIconLink;
		function getIconLink() {
              return vm.parentCtrl.iconLink;
		}
	}]);

	app.component('prmLogoAfter',{
		bindings: {parentCtrl: '<'},
		controller: 'prmLogoAfterController',
		template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner"><img src="custom/LATROBE/img/library-logo.png" alt="La Trobe University Library" usemap="#logomap_lg" class="logo-image"><map name="logomap_lg"><area shape="rect" coords="0,0,135,48" alt="La Trobe" href="http://latrobe.edu.au"><area shape="rect" coords="0,0,210,48" alt="Library" href="http://latrobe.edu.au/library"></map></div>'
	});

	/* app.component('prmSearchBarAfter', {
      template: '<div role="alert" layout-align="center center" class="layout-align-center-center"><div layout="row" class="bar alert-bar layout-align-center-center layout-row alert-info md-margin-top" layout-align="center center">Books in the Borchardt (Bundoora) library are now available on Level 3</div></div>'
	}); */

	  // Add EasyCite link after Citations area
	  /*Thanks to Amelia Rowe, RMIT 09/08/2019 . Added 20/09/21 Rachel S Discovery LTU*/

	                app.component('prmCitationAfter', {
	      bindings: { parentCtrl: '<' },
	                template: `<div class="layout-align-center-center layout-row" layout-align="center center" style="background-color: #ede49e; padding-top: 0.5em;" ><span class="bar-text"><p style="font-size: medium;font-family: arial;font-weight: bold;">Ensure your Citation meets La Trobe standards via our <a target=_blank href=https://latrobe.libguides.com/academicreftoolgroup target="_blank">Academic Referencing Tool</a></p></span></div>`
	                });




	


});




