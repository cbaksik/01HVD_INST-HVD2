/**
created to display TOC presence in search results
 */

angular.module('viewCustom')
.controller('prmBriefResultAfterCtrl',['prmSearchService', function (prmSearchService) {
	var vm=this;
	vm.itemPNX={};
	vm.hasTOC='';
	vm.isVIAonline='';
	var sv=prmSearchService;

	vm.$onInit=function() {
		vm.itemPNX=vm.parentCtrl.item;
		if (vm.itemPNX.pnx.display.contents) {
			vm.hasTOC = 'true';
		}
		// add fake via 'online' button to override problematic otb button which opens bib in new tab, clicking on it invokes the OTB function of opening full record in overlay mode
		//console.log(vm.itemPNX); 
		if (vm.itemPNX.pnx.display.source) {
			if (vm.itemPNX.pnx.display.source[0] === 'HVD_VIA') {
				const numImages = vm.itemPNX.pnx.display.lds20 ? vm.itemPNX.pnx.display.lds20[0] : null;
				if (numImages > 0) {
					vm.isVIAonline=true;
				}
			}			
		 }
   
	};
}]);
 
angular.module('viewCustom')
.component('prmBriefResultAfter',{
	bindings:{parentCtrl:'<'},
	controller: 'prmBriefResultAfterCtrl',
	controllerAs:'vm',
	templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-brief-result-after.html'
});