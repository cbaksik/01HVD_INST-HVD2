/**

 */

angular.module('viewCustom')
.controller('prmJournalsAfterCtrl',['$scope', '$window', function ($scope, $window) {
	var vm=this;
	vm.itemPNX={};

	vm.$onInit=function() {
   
		//console.log("Journals");

		// Initialize the model for our text input
		$scope.searchQuery = '';
		
		// This is the base URL with 'foo' as a placeholder
		const baseUrl = 'https://hvd.primo.exlibrisgroup.com/discovery/search?query=title,begins_with,foo,AND&pfilter=rtype,exact,journals,AND&tab=LibraryCatalog&search_scope=MyInstitution&sortby=title&vid=01HVD_INST:HVD2&mode=advanced&offset=0';
		
		// 3. This function is called when the form is submitted
		$scope.performSearch = function() {
		// Make sure the search query isn't empty
		if (!$scope.searchQuery) {
			alert('Title starts with');
			return;
		}
		
		// IMPORTANT: Encode the user's input to make it safe for a URL.
		// This handles spaces, ampersands, and other special characters.
		const encodedQuery = encodeURIComponent($scope.searchQuery);
		
		// Replace the 'foo' placeholder with the user's encoded query
		const finalUrl = baseUrl.replace('foo', encodedQuery);
		
		// Use the $window service to open the final URL in a new tab
		$window.open(finalUrl, '_blank');
		};


	};
}]);
 
angular.module('viewCustom')
.component('prmJournalsAfter',{
	bindings:{parentCtrl:'<'},
	controller: 'prmJournalsAfterCtrl',
	controllerAs:'vm',
	templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-journals-after.html'
});