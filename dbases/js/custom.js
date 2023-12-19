/* Update: Lynette Brown */
/* Date: 25/7/2017, 12/12/2017, 14/5/2018, 4/3/2019, 11/3/2019, 9/5/2019, 12/6/2019 */
(function () {
    "use strict";
    'use strict';


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
	
	// Adds the chat button
	
   (function() {
        var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = 'true';
        lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'latrobe.libanswers.com/load_chat.php?hash=16f4a310dcd007c4fff853f28ece1970';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
    })();
	
	// End the chat button 



})();

   
