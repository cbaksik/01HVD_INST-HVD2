/**
 * Created by mferrarini on 2/9/22.
 * Modified for VE by CB April 2025
 */

 angular.module('viewCustom')
 .controller('prmTopBarBeforeCtrl',[ 'prmSearchService', '$scope', '$document', function (prmSearchService, $scope, $document) {
		 var vm=this;
		 vm.banner='';
		 var sv=prmSearchService;

		 $scope.dismissAlert = function(id) {
			var alertBanner = angular.element($document[0].querySelector('#hl__site-alert-banner'));
			alertBanner.remove();;
		 };

		 vm.$onInit=function () {
			//var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/L/'+vm.docid;
			// https://hvd-psb.primo.exlibrisgroup.com/primaws/rest/pub/resourceRecommender?lang=en&query=dogs&view=01HVD_INST:HVD2

			var url ='/primaws/rest/pub/resourceRecommender';
			var params={'view':'','lang':'','query':''};
			params.view='01HVD_INST:HVD2';
			params.lang='en';
			params.query='ltsBannerAlertRESTrequest';
			// query is only needed b/c it's a required param to get resource recommender results
	
			sv.getAjax(url,params,'get')
					.then(function (result) {
						vm.item=result.data; 
						// console.log(vm.item[0].resources);
						if(vm.item[0].resourceType === 'banner' && vm.item[0].resources[0].display_always === 'true') {
							vm.banner = 'true';
						} else {
							console.log(error);
						}
						},function (error) {
							console.log(error);
						}
					)

		 };

 }]);

angular.module('viewCustom')
 .component('prmTopBarBefore',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmTopBarBeforeCtrl',
		 controllerAs:'vm',
		 templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-topbar-before.html'
 });
