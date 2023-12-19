/* Update: Lynette Brown */
/* Date: 25/7/2017 */
(function () {
    "use strict";
    'use strict';


    var app = angular.module('viewCustom', ['angularLoad']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/

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
		template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner"><img src="custom/LATROBE/img/library-logo.png" alt="La Trobe University Trendall Centre" usemap="#logomap_lg" class="logo-image"><map name="logomap_lg"><area shape="rect" coords="0,0,135,48" alt="La Trobe" href="http://latrobe.edu.au/trendall"><area shape="rect" coords="0,0,210,48" alt="Library" href="http://latrobe.edu.au/library"></map></div>'
	});

})();

   
