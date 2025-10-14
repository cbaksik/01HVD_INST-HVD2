/**
 * Created by samsan on 6/9/17.
 * Custom page for image record components -- full display of single image and metadata when a user clicks on thumbnail from a Primo full display page
 */

(function () {

	angular.module('viewCustom')
	.controller('customViewAllComponentMetadataController', [ '$scope','$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','$window','mainInfoMapping','keyOrderMap', function ($scope,$sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, $window,mainInfoMapping,keyOrderMap) {

		let vm = this;
		var sv=prmSearchService;
		// get location parameter
		vm.params=$location.search();
		// get parameter from angular ui-router
		vm.docid=$stateParams.docid; // eg alma99158322666803941
		vm.index='0'; 
		vm.photo={};
		vm.flexsize=80;
		vm.total=0; // number of components
		vm.itemData={};
		vm.componentData={}; 
		vm.componentDataRev={}; 
		vm.componentDataThumb={}; // to contain thumbnails for rendering
		vm.orderedComponents = {};
		vm.mainInfoRender = {};	


	   /* example ajax call http://localhost:8003/primaws/rest/pub/pnxs/L/alma99158322666803941?vid=01HVD_INST:HVD2&lang=en&search_scope=MyInst_and_CI&adaptor=Local%20Search%20Engine&lang=en */

		// ajax call to get data
		vm.getData=function () {
			//var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/L/'+vm.docid;
			var urlVE ='/primaws/rest/pub/pnxs/L/' + vm.docid;
			var params={'vid':'','lang':'','search_scope':'','adaptor':''};
			params.vid='01HVD_INST:HVD2';
			params.lang='en';
			params.search_scope='MyInst_and_CI';
			params.adaptor='Local%20Search%20Engine';

			sv.getAjax(urlVE,params,'get')
				.then(function (result) {
					vm.item=result.data; 
					vm.itemData=vm.item.pnx.display;
					vm.componentData=vm.item.pnx.display.lds65;
					if(vm.componentData) {
						vm.total = vm.componentData.length;
					} else {
						console.log(error);
					}
					vm.displayPhoto();
				},function (error) {
						console.log(error);
				}
			)
		};

		// display component photo and component metadata
		// function receives array of all components
		vm.displayPhoto=function () {
			vm.photo={}; // this will be URL to image
			// handle main info 
			for (const mapping of mainInfoMapping) {
				const sourceKey = mapping.sourceKey;
				const targetKey = mapping.targetKey;
				if (vm.itemData.hasOwnProperty(sourceKey)) {
					vm.mainInfoRender[targetKey] = vm.itemData[sourceKey].map(function(val) {
						// Remove $$Q and everything after it
						var idx = val.indexOf('$$Q');
						var cleaned = idx !== -1 ? val.substring(0, idx) : val;
						// If the cleaned value looks like HTML, trust it
						if (cleaned.match(/<[^>]+>/)) {
							return $sce.trustAsHtml(cleaned);
						}
						return cleaned;
					});
				}
			}
			// handle component info 
			for(var i=0; i < vm.componentData.length; i++) {
				vm.index = i;				
				vm.componentData[i] = vm.componentData[i].split('==').filter(str => str.trim()).map(str => ({ 
					key: str.charAt(0), 
					value: str.substring(1).trim() 
				}));
				// some keys appear twice; find out which
				var map = {};
				vm.componentData[i].forEach(function(item) {
					if (!map[item.key]) {
					map[item.key] = [];
					}
					map[item.key].push(item.value);
				});
				// Convert the grouped map back to array of key/values with unique keys
				vm.componentDataRev[i] = Object.keys(map).map(function(key) {
					return {
					key: key,
					value: map[key].length === 1 ? map[key][0] : map[key]
					};
				});
				// convert related work into html link
				var relatedWorkUrl = vm.componentDataRev[i].find(function(entry) {
					return entry.key === '6';
					});
				//console.log(relatedWorkUrl);
				if (relatedWorkUrl) {
					relatedWorkUrl.value = '<a href="' + relatedWorkUrl.value.split('--')[1] + '">' + relatedWorkUrl.value.split('--')[0] + '</a>';
				}
				// components will always have w, get that to ensure same # of items, then get y thumbnail
				var thumbnailLink = vm.componentDataRev[i].find(function(entry) {
					return entry.key === 'U';
				});
				vm.componentDataThumb[i] = thumbnailLink ? thumbnailLink.value : null;
				// console.log(vm.componentDataRev[i]);
				// specify order for component detail display and change keys to display labels
				vm.orderedComponents[i] = keyOrderMap
					.filter(function(mapping) {
						return vm.componentDataRev[i].some(function(item) {
						return item.key === mapping.oldKey;
						});
					})
					.map(function(mapping) {
						var original = vm.componentDataRev[i].find(function(item) {
							return item.key === mapping.oldKey;
						});
						return {
							key: mapping.newKey,
							value: original.value
						};
					});

			} // end of for loop

			// Helper function for the view to check if a value is an array
		 	$scope.isArray = angular.isArray;

		}; //end displayPhoto fx

		


		vm.$onInit=function() {
			// console.log("custom-view-all-component-metadata");			
			// if the smaller screen size, make the flex size to 100.
			if($mdMedia('sm')) {
				vm.flexsize=100;
			} else if($mdMedia('xs')) {
				 vm.flexsize=100;
			}
			// call ajax and display component data
			vm.getData();
			setTimeout(()=>{
				// hide search bar
				let searchBar=document.getElementsByTagName('prm-search-bar')[0];
				if(searchBar) {
				searchBar.style.display = 'none';
				}
				// hide top black bar
				let topBar = document.getElementsByTagName('prm-topbar')[0];
				if(topBar) {
				 topBar.style.display='none';
				}
			},5);
		};


    }]);

    angular.module('viewCustom')
    .component('customViewAllComponentMetadata', {
		bindings: {item: '<',services:'<',params:'<',parentCtrl:'<'},
		controller: 'customViewAllComponentMetadataController',
		controllerAs:'vm',
		'templateUrl':'/discovery/custom/01HVD_INST-HVD2/html/custom-view-all-component-metadata.html'
    });



})();
