/**
 * created by cbaksik 20260302
 * workaround b/c otb holding list truncates up-front notes including urls
 * 
 * 
 */

angular.module('viewCustom')
        .controller('prmLocationHoldingsAfterCtrl',['$scope','$sce','$timeout','$element', '$compile',function($scope,$sce,$timeout,$element, $compile) {
            let vm = this;
		  vm.holNotesreadyOpen = false;      // flag to control template rendering
		  vm.holListOpen= null;       // will hold the array when ready

		 vm.$onInit=function () {

			//console.log('prm location holdings after');
			//console.log(vm);

			var stopWatching = $scope.$watch(
				function () {
					// safely walk down to summaryHoldings.allLines
					return vm.parentCtrl &&
							vm.parentCtrl.currLoc &&
							vm.parentCtrl.currLoc.summaryHoldings &&
							vm.parentCtrl.currLoc.summaryHoldings.allLines;
				},
				function (newVal, oldVal) {   // <-- listener function, Angular passes newVal/oldVal
					//console.log('prmLocationHoldingsAfterCtrl listener fired, newVal:', newVal, 'oldVal:', oldVal);
					// Wait until it's a non-empty array
					if (Array.isArray(newVal) && newVal.length) {
						vm.holListOpen = newVal;
						vm.holNotesreadyOpen = true;
						//console.log('holListOpen (allLines):', vm.holListOpen);
						//stopWatching();
					}
				}
			);


	};
		
}]);

angular.module('viewCustom')
        .component('prmLocationHoldingsAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmLocationHoldingsAfterCtrl',
            templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-location-holdings-after.html'
});


