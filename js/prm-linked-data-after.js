/**
 * 
NOTE - this hides all author images on page

Also need to put this in css: 

prm-linked-data:has(div.hvd-hide-lod-image) prm-linked-data-card md-card-avatar  {
	display:none;
}

Purpose: linked open data - wait for it to load, then evaluate for entites and hide images for select control numbers
 */

 angular.module('viewCustom')
 .controller('prmLinkedDataAfterCtrl',['$scope',function ($scope) {
		 var vm=this;
		 vm.lodReady = false;      // flag to control template rendering
		 vm.lodArray= null;       // will hold the array when ready\
		 vm.shouldHide= false;       // will true to true if match is found

		 // NARs for which we want to hide image
		 const toHide = [
			'n79130881',
			'nr89011547',
			'n79084784'
		];
		// n79130881 Muḥammad, Prophet, -632
		// nr89011547 Jesus Christ

		//              !!!!!!!!!!!!!!!
		//              IMPORTANT NOTE
		//              you also have to hide image from person-entity page using css
		//              see bottom of hvd_core.css
		//              !!!!!!!!!!!!!!!

		 vm.$onInit=function () {

		 	//console.log("prmLinkedDataAfterCtrl");
		 	//console.log(vm);

			var stopWatching = $scope.$watch(
				function () {
					// safely walk down
					return vm.parentCtrl &&
							vm.parentCtrl.linkedData 
				},
				function (newVal, oldVal) {   // <-- listener function, Angular passes newVal/oldVal
					//console.log('prmLinkedDataAfterCtrl listener fired, newVal:', newVal, 'oldVal:', oldVal);
					// Wait until it's a non-empty array
					if (Array.isArray(newVal) && newVal.length) {
						vm.lodArray = newVal;
						vm.lodReady = true;

						if (vm.lodReady) {
							vm.shouldHide = vm.lodArray.some(function (person) {
								return toHide.indexOf(person._personId) !== -1;
							});
						} 				
						//console.log('shouldHide ' + vm.shouldHide);
						//console.log('lodArray (newVal):', vm.lodReady);
						stopWatching();
					}
				}
			);


		};
 }]);

angular.module('viewCustom')
 .component('prmLinkedDataAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmLinkedDataAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-linked-data-after.html'
 });
