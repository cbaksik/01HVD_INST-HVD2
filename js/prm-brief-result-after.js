/**
created to display TOC presence in search results
 */

angular.module('viewCustom')
.controller('prmBriefResultAfterCtrl',[function () {
	var vm=this;
	vm.itemPNX={};
	vm.hasTOC='';

	vm.$onInit=function() {
		vm.itemPNX=vm.parentCtrl.item;
		if (vm.itemPNX.pnx.display.contents) {
			vm.hasTOC = 'true';
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