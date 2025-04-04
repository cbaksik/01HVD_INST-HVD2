/**
 * Created by mferrarini on 2/24/22.
 * Adds placeholder text below the search bar.
 */

 angular.module('viewCustom')
 .controller('prmSearchBarAfterCtrl',[function () {
		 var vm=this;
		 vm.$onInit=function () {
			vm.parentCtrl.showTabsAndScopes = true;
			console.log("prmSearchBarAfterCtrl");
		 };

 }]);

angular.module('viewCustom')
 .component('prmSearchBarAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmSearchBarAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-search-bar-after.html'
 });
