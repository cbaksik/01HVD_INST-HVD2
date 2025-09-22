/**
created to display TOC presence in search results
 */

angular.module('viewCustom')
.controller('prmOpacAfterCtrl',[function () {
	var vm=this;
	vm.singleHolding = '';

	vm.$onInit=function() {
		console.log(vm.parentCtrl.item.delivery.holding);
		if (vm.parentCtrl.item.delivery.holding) {
			const holdingCount=vm.parentCtrl.item.delivery.holding.length;
			if (holdingCount === 1) {
				vm.singleHolding = 'true';
			}
			/* loop through holding availabilityStatement and read # copies? */
			/* example: "(1 copy, 1 available, 0 requests)" */
			/* example: is null when items have descriptions, i think */
		}		   
	};
}]);
 
angular.module('viewCustom')
.component('prmOpacAfter',{
	bindings:{parentCtrl:'<'},
	controller: 'prmOpacAfterCtrl',
	controllerAs:'vm',
	templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-opac-after.html'
});