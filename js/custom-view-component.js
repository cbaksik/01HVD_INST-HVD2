/**
 * Created by samsan on 6/9/17.
 * Custom page for image record components -- full display of single image and metadata when a user clicks on thumbnail from a Primo full display page
 */

(function () {

	angular.module('viewCustom')
	.controller('customViewComponentController', [ '$scope','$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','$window', function ($scope,$sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, $window) {

		let vm = this;
		var sv=prmSearchService;
		// get location parameter
		vm.params=$location.search();
		// get parameter from angular ui-router
		vm.docid=$stateParams.docid; // eg alma99158322666803941
		vm.filename = vm.params.imageId; // eg urn-3:DOAK.LIB:3205217 from URL
		vm.filenameURL = 'https://nrs.harvard.edu/' + vm.filename;
		vm.index=''; // this is used for scrolling feature (x of y images)
		vm.photo={};
		vm.flexsize=80;
		vm.total=0; // number of components, used for image X of Y
		vm.itemData={};
		vm.imageNav=true;
		vm.componentData={}; 
		vm.mainInfoRender = {};	
		vm.viewComponent={};

		const mainInfoMapping = [
			{ sourceKey: 'title', targetKey: 'Main Title' },
			{ sourceKey: 'subject', targetKey: 'Keywords' },
			{ sourceKey: 'type', targetKey: 'Resource Type' },
			{ sourceKey: 'identifier', targetKey: 'Unique ID' }
			// Add or remove objects here to control the output
		];

		const keyOrderMap = [
			{ oldKey: 'W', newKey: 'ID' },
			{ oldKey: '0', newKey: 'Subject' },
			{ oldKey: '1', newKey: 'Rights' },
			{ oldKey: '3', newKey: 'Style' },
			{ oldKey: '4', newKey: 'Date' },
			{ oldKey: '5', newKey: 'Physical Description' },
			{ oldKey: '6', newKey: 'Catalog Record' },
			{ oldKey: '7', newKey: 'Collection' },
			{ oldKey: '8', newKey: 'Location' },
			{ oldKey: '9', newKey: 'Title' },
			{ oldKey: 'A', newKey: 'Photographer' },
			{ oldKey: 'B', newKey: 'Architecture Terms' },
			{ oldKey: 'D', newKey: 'Century' },
			{ oldKey: 'F', newKey: 'Format' },
			{ oldKey: 'I', newKey: 'Identifier' },
			{ oldKey: 'J', newKey: 'Access Information' },
			{ oldKey: 'K', newKey: 'Access Level' },
			{ oldKey: 'N', newKey: 'Authors' },
			{ oldKey: 'R', newKey: 'Library' },
			{ oldKey: 'U', newKey: 'Primary URL' },
			{ oldKey: 'X', newKey: 'Subject Location' },
			{ oldKey: 'Y', newKey: 'Alternate URL' }
			];


	   /***********************************************/
		// console.log("custom-view-component.js: vm");
	   /***********************************************/
	   

	   // mps embed function as written by phil for single-image.js before code consolidation
	   // MPS Embed function also exists in prm-alma-viewit-items-after.js for cases of single image records
		vm.mpsEmbed=function (objectURN) {
		if (objectURN.startsWith("urn-3:")) {
			const restUrl = 'https://embed.lib.harvard.edu/api/nrs'
			var params={'urn':objectURN,'prod':1}
			sv.getAjax(restUrl,params,'get')
			.then(function (result) {
			    vm.items=result.data;
			    vm.iframeHtml = vm.items.html;
			    const doc = new DOMParser().parseFromString(vm.iframeHtml, 'text/html');
			    const element = doc.body.children[0];
			    vm.iframeAttributes = {};
			    for (var i = 0; i < element.attributes.length; i++) {
				   var attrib = element.attributes[i];
				   if (attrib.name == 'src') {
					  vm.iframeAttributes[attrib.name] = $sce.trustAsResourceUrl(attrib.value);
				   }
				   else {
					  vm.iframeAttributes[attrib.name] = attrib.value;  
				   }
				}
			},function (err) {
			    console.log(err);
			});
		  }
		};

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
				vm.mainInfoRender[targetKey] = vm.itemData[sourceKey];
				}
			}
			// handle component info 
			if (vm.componentData) {				
				// find correct component
				if(!vm.index && vm.index !== 0) {
					for(var i=0; i < vm.componentData.length; i++) {
						if (vm.componentData[i].toLowerCase().includes(vm.filename.toLowerCase())) {
							vm.index = i;
						}
					}
				}
				// once found, convert that component into array
				if(vm.index >= 0 && vm.index < vm.total) {
					vm.viewComponent = vm.componentData[vm.index].split('==').filter(str => str.trim()).map(str => ({ 
						key: str.charAt(0), 
						value: str.substring(1).trim() 
						}));;
				};
				// find the image URN to display image, only used for next/prev buttons
				const itemU = vm.viewComponent.find(function(entry) {
					return entry.key === 'U';
					});
				const valueForU = itemU ? itemU.value : null;
				const match = valueForU.match(/urn-3\S*/);
				vm.urnPart = match ? match[0] : null;
				// begin mapping labels and values for display of component data
				var map = {};
				// some keys appear twice; find out which
				vm.viewComponent.forEach(function(item) {
					if (!map[item.key]) {
					map[item.key] = [];
					}
					map[item.key].push(item.value);
				});
				// Convert the grouped map back to array of key/values with unique keys
				vm.viewComponentRev = Object.keys(map).map(function(key) {
					return {
					key: key,
					value: map[key].length === 1 ? map[key][0] : map[key]
					};
				});
				// specify order for component detail display and change keys to display labels
				vm.orderedComponents = keyOrderMap
					.filter(function(mapping) {
						return vm.viewComponentRev.some(function(item) {
						return item.key === mapping.oldKey;
						});
					})
					.map(function(mapping) {
						var original = vm.viewComponentRev.find(function(item) {
							return item.key === mapping.oldKey;
						});
						return {
							key: mapping.newKey,
							value: original.value
						};
					});
			}; // end handle component info 
		};  // end displayPhoto fx


		// Helper function for the view to check if a value is an array
		 $scope.isArray = angular.isArray;


		vm.$onInit=function() {
			// if the smaller screen size, make the flex size to 100.
			if($mdMedia('sm')) {
				vm.flexsize=100;
			} else if($mdMedia('xs')) {
				 vm.flexsize=100;
			}
			// call local embed service to get iframe attributes
			// this one is used when first going to a component from the primo record page since we already know the URN at the point and we can start loading image right away; next/prev buttons will re-call embed
			vm.mpsEmbed(vm.filename);
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

		// next photo
		vm.nextPhoto=function () {
			vm.index++;
		 	if(vm.index < vm.total && vm.index >=0) {
				vm.displayPhoto();
				vm.mpsEmbed(vm.urnPart);
			} else {
				vm.index=0;
				vm.displayPhoto();
				vm.mpsEmbed(vm.urnPart);
			}
		};
		// prev photo
		vm.prevPhoto=function () {
		    vm.index--;
		    if(vm.index >= 0 && vm.index < vm.total) {
				vm.displayPhoto();
				vm.mpsEmbed(vm.urnPart);
		    } else {
		        vm.index=vm.total - 1;
		        vm.displayPhoto();
		        vm.mpsEmbed(vm.urnPart);
		    }
		};

    }]);

    angular.module('viewCustom')
    .component('customViewComponent', {
		bindings: {item: '<',services:'<',params:'<',parentCtrl:'<'},
		controller: 'customViewComponentController',
		controllerAs:'vm',
		'templateUrl':'/discovery/custom/01HVD_INST-HVD2/html/custom-view-component.html'
    });



})();
