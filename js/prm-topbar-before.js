/**
 * Created by mferrarini on 2/9/22.
 * This header will use for image component page and image detail page
 */

 angular.module('viewCustom')
 .controller('prmTopBarBeforeCtrl',[function () {
		 var vm=this;
		 vm.$onInit=function () {

		 };

 }]);

angular.module('viewCustom')
 .component('prmTopBarBefore',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmTopBarBeforeCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-topbar-before.html'
 });
