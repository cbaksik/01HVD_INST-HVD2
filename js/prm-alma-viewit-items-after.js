/**
 * ve testing for via
 */

(function () {

    angular.module('viewCustom')
    .controller('prmAlmaViewitItemsAfterController', [ '$scope','$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','$window','$http', function ($scope,$sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, $window, $http) {

	var vm=this;
	var sv=prmSearchService;
	vm.isVIArecord=false;
	vm.singleImageFlag=false;
	vm.imageRestricted=''; // PNX lds63 is 'restricted' if there is 1 image and it's restricted, or if there are multiple and any are restricted
	vm.filename=''; // eg urn-3:DOAK.LIB:3205217
	// vm.noImage=false; can't test here because this controller doesn't exist if there is no image
	vm.componentJSON={};

	vm.$onInit=function () {
		
		// console.log(vm.parentCtrl.item.pnx);
		if (vm.parentCtrl.item.pnx.display.source) {
			if (vm.parentCtrl.item.pnx.display.source[0] == 'HVD_VIA') {
				vm.isVIArecord = true;
				if (vm.parentCtrl.item.pnx.display.lds63) {
					vm.imageRestricted = true;
					// console.log(vm.imageRestricted);
				}
			}
			if (vm.parentCtrl.item.pnx.display.lds20) {
				if (vm.parentCtrl.item.pnx.display.lds20[0] == '1') {
					vm.singleImageFlag = true;
					if (vm.parentCtrl.item.pnx.display.lds67) { 
						vm.filename = vm.parentCtrl.item.pnx.display.lds67[0];
						vm.filename = vm.filename.split('/').pop();
					}
					vm.mpsEmbed(vm.filename);
				}
			}
			if (vm.parentCtrl.item.pnx.display.lds65) {
				vm.componentJSON = convertArrayToJSON(vm.parentCtrl.item.pnx.display.lds65);
				//console.log(vm.componentJSON);
			}
		}

		// legacy scanned key content feature
		if (vm.parentCtrl.item.pnx.display.lds62) {
			if (vm.parentCtrl.item.pnx.display.lds62[0] == 'legacyKeyContent') {
				//console.log("legacyKeyContent");
				//console.log(vm.parentCtrl.services);
			    vm.skcLinks = vm.parentCtrl.services.filter(function (item) {
					return item.serviceType === 'GENERAL_ELECTRONIC';
					})
					.map(function (item) {
					return {
						serviceUrl: item.serviceUrl,
						packageName: item.packageName
					};
				});
				//console.log(vm.skcLinks);
			}
		}


	};

	// MPS Embed function also exists in custom-view-component.js for cases of multi-image records
	vm.mpsEmbed=function (objectID) {
		//console.log("start mpsEmbed fx for objectID:");
		//console.log(objectID);
		if (objectID.startsWith("urn-3:") || objectID.startsWith("URN-3:")) {
			const restUrl = 'https://embed.lib.harvard.edu/api/nrs'
			var params={'urn':objectID,'prod':1}
			sv.getAjax(restUrl,params,'get')
			//start section added to log as part of troubleshooting
			// console.log('%c[AJAX Request] ► Sending...', 'font-weight: bold;', {
               //  url: restUrl,
        		// params: params
			// });
			// return $http({
			// 	'url': restUrl,
			// 	'params': params
			// }) 
			//end section added to log as part of troubleshooting
			.then(function (result) {
				// start console log 
				// console.log("received response");
				// console.log('%c[AJAX Success] ✔ Received a response from: ' + restUrl, 'font-weight: bold;', {
				// 	status: result.status,
				// 	statusText: result.statusText
                	// });
				// end console log 
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
				console.log(vm.iframeAttributes);
			},function (err) {
			//     console.log(err);
			    console.err('%c[AJAX Error] ✖ Failed to reach: ' + restUrl, 'color: red; font-weight: bold;', {
                    status: err.status,
                    statusText: err.statusText,
                    data: err.data
                	});
			});
		}
	};

	// begin function to convert lds65 image components to json
	function convertArrayToJSON(array) {
		return array.map(item => {
		    const parts = item.split('==').reduce((result, part) => {
			   if (part.length > 0) {
				  const key = part.charAt(0);
				  const value = part.substring(1).trim(); 
				  if (result[key]) {
					 result[key].push(value);
				  } else {
					 result[key] = [value]; 
				  }
			   }
			   return result;
		    }, {});
		    return parts; 
		});
	 };
	// end function for image component data conversion


        // view all component metadata
        vm.viewAllComponentMetaData=function () {
		//console.log("prm-alma-view-items-after.js viewAllComponentMetadata function");
            var url='/discovery/viewallcomponentmetadata/L/' + vm.parentCtrl.item.pnx.control.recordid[0] + '?vid=01HVD_INST:HVD2';
          //   url+='&tab='+vm.params.tab+'&search_scope='+vm.params.search_scope;
          //   url+='&adaptor='+vm.item.adaptor;
		//console.log(url);
          $window.open(url,'_blank');

        };

	// function to open component thumbnail in a new tab with all its data and scrolling feature
	// this gets called from prm-alma-viewit-items-after.html
	vm.gotoFullPhoto=function ($event, item, index) {
		var filename='';
		if(item.U) {
		    var urlList=item.U[0];
		    urlList = urlList.split('/');
		    if(urlList.length >=3) {
			   filename=urlList[3];
		    }
		} else if(item._attr.componentID) {
		    filename = item._attr.componentID._value;
		}
		var url='/discovery/viewcomponent/L/'+vm.parentCtrl.item.pnx.control.recordid[0]+'?vid=01HVD_INST:HVD2'+'&imageId='+filename;
		$window.open(url,'_blank');
	 }	

	
 }]);

    angular.module('viewCustom')
    .component('prmAlmaViewitItemsAfter', {
	bindings: {item: '<',services:'<',parentCtrl:'<'},
	controller: 'prmAlmaViewitItemsAfterController',
	controllerAs:'vm',
	'templateUrl':'/discovery/custom/01HVD_INST-HVD2/html/prm-alma-viewit-items-after.html'
    });

})();
