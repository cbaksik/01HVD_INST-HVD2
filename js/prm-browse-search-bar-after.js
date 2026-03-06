/**
 * Adds placeholder text below the browse search bar.
 */

 angular.module('viewCustom')
 .controller('prmBrowseSearchBarAfterCtrl',[function () {
		 var vm=this;
		 vm.$onInit=function () {
			//vm.parentCtrl.showTabsAndScopes = true;
		 };

 }]);

angular.module('viewCustom')
 .component('prmBrowseSearchBarAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmBrowseSearchBarAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-browse-search-bar-after.html'
 });
