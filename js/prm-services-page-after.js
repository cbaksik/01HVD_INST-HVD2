/**
 * prm-services-page is openURL resolver when nothing found, and citation linker output when no online found
 */

(function () {
    angular.module('viewCustom')
        .controller('prmServicesPageAfterCtrl',[function() {
            var vm=this;

		 vm.$onInit=function () {
			//console.log(vm);
		 };
            
        }]);

    angular.module('viewCustom')
        .component('prmServicesPageAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmServicesPageAfterCtrl',
            templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-services-page-after.html'
        });

})();
