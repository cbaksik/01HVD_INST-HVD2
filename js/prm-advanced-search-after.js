/**
 * Created by cbaksik on Sep 8 2025.
 * MARC lang helper.
 */

 angular.module('viewCustom')
 .controller('prmAdvancedSearchAfterCtrl',['$scope','$mdDialog', '$timeout','languageService',function ($scope,$mdDialog, $timeout,languageService) {
		 var vm=this;

            vm.copyMessage = '';      // The feedback message
            vm.copyStatus = '';       // 'success' or 'error' for styling

            vm.searchText = '';

		 vm.languages = languageService.getLanguages();
		 //console.log(vm.languages);
		
		vm.selectLanguage = function(language) {
                // populate the search box and hide the list
                vm.searchText = language.name;

			//const codeToCopy = language.code;
               //   if (!navigator.clipboard) {
               //       vm.copyStatus = 'error';
               //       vm.copyMessage = 'Clipboard API not supported by your browser.';
               //       return;
               //   }

               //   navigator.clipboard.writeText(codeToCopy).then(function() {
               //       vm.copyStatus = 'success';
               //      //  vm.copyMessage = `Copied to clipboard`;
               //       vm.copyMessage = `Copied code '${codeToCopy}' to clipboard`;
               //       $timeout(function() {
               //           vm.copyMessage = '';
               //       }, 30000);

               //   }).catch(function(err) {
               //       vm.copyStatus = 'error';
               //       vm.copyMessage = 'Failed to copy. See console for error.';
               //       console.error('Could not copy text: ', err);
               //   });
	
            };


		 vm.$onInit=function () {
			// console.log("prmAdvancedSearchAfterCtrl");
			// $scope.isCollapsed = true;
			$scope.isCollapsedLang = true;
			$scope.isCollapsedHelp = true;
			$scope.isCollapsedPub = true;
		 };
		 vm.$onChanges=function () {			
		 };

 }]);

angular.module('viewCustom')
 .component('prmAdvancedSearchAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmAdvancedSearchAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-advanced-search-after.html'
 });
