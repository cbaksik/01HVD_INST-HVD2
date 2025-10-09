/**
 * Created by cbaksik on 3/29/19.
 * This component used to add a block on the My Account overview page
 * 
 * prm-messages-and-blocks-after
 */

(function () {
    angular.module('viewCustom')
        .controller('prmFavoritesToolBarAfterCtrl',[function() {
            var vm=this;

		 vm.$onInit=function () {
			//console.log(vm);
		 };
            
        }]);

    angular.module('viewCustom')
        .component('prmFavoritesToolBarAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmFavoritesToolBarAfterCtrl',
            templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-favorites-tool-bar-after.html'
        });

})();
