/**

 */

 angular.module('viewCustom')
 .controller('prmAdvancedSearchAfterCtrl',['$scope','$log','$mdDialog', '$timeout','languageService',function ($scope,$log,$mdDialog, $timeout,languageService) {
		 var vm=this;

            vm.copyMessage = '';      // The feedback message
            vm.copyStatus = '';       // 'success' or 'error' for styling

            vm.searchText = '';

		  vm.languages = []; 

		vm.tabs = [
				{ id: 'advHelpTabGuide', title: 'Help with Advanced Search '},
				{ id: 'advHelpTabLang', title: 'Language Codes'},
				{ id: 'advHelpTabPub', title: 'Place of publication codes'}
			];

		vm.onTabSelected = function(tab) {
            $log.info('Selected tab:', tab.title);
            // Check if it's the language tab AND if the data hasn't been loaded yet.
            // The !vm.languages.length check prevents re-loading if the user clicks away and comes back.
            if (tab.id === 'advHelpTabLang' && !vm.languages.length) {
                $log.info('Loading language codes...');                
                // Now we call the service to get the data.
                vm.languages = languageService.getLanguages();
            }
		};

		vm.announceDeselected = function(tab) {
			$log.info('Deselected tab:', tab.title);
		};

		vm.removeTab = function(tab) {
			var index = vm.tabs.indexOf(tab);
			if (index !== -1) {
				vm.tabs.splice(index, 1);
				$log.info('Removed tab:', tab.title);
			}
		};
		 		
		vm.closeActiveTab = function() {
		vm.selectedIndex = -1;
		};

		vm.selectLanguage = function(language) {
                // populate the search box and hide the list
                vm.searchText = language.code;	
          };


		 vm.$onInit=function () {
			vm.selectedIndex = -1;
		 };

		vm.copyCodeToClipboard = function(language) {
			// Stop the event from bubbling up and triggering other clicks if any exist.
			// event.stopPropagation(); 

			const codeToCopy = language.code;

			// Use the modern Navigator Clipboard API.
			if (!navigator.clipboard) {
				vm.copyStatus = 'error';
				vm.copyMessage = 'Clipboard API not available in your browser.';
				return;
			}

			navigator.clipboard.writeText(codeToCopy).then(function() {

				$timeout(function() {
					vm.copyStatus = 'success';
					vm.copyMessage = `Copied code '${codeToCopy}' to clipboard`;
				});

			}).catch(function(err) {
				$timeout(function() {
					vm.copyStatus = 'error';
					vm.copyMessage = 'Failed to copy code. See console for details.';
				});
				console.error('Could not copy text: ', err);
			});
		};

 }]);

angular.module('viewCustom')
 .component('prmAdvancedSearchAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmAdvancedSearchAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-advanced-search-after.html'
 });
