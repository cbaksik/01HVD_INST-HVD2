/**
 * ve testing for via
 */

(function () {

    angular.module('viewCustom')
    .controller('prmAlmaViewitItemsAfterController', [ '$scope','$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','$window', function ($scope,$sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, $window) {

	var vm=this;
	var sv=prmSearchService;
	vm.isVIArecord=false;
	vm.singleImageFlag=false; // refer to this in html as {{$ctrl.singleImageFlag}} 
	vm.filename=''; // eg urn-3:DOAK.LIB:3205217
	// vm.noImage=false; can't test here because this controller doesn't exist if there is no image
	vm.componentJSON={};

	vm.$onInit=function () {
		if (vm.parentCtrl.item.pnx.display.lds20) {
			vm.isVIArecord = true;
			if (vm.parentCtrl.item.pnx.display.lds20 == '1') {
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
		}
	};

	// MPS Embed function also exists in custom-view-component.js for cases of multi-image records
	vm.mpsEmbed=function (objectID) {
		if (objectID.startsWith("urn-3:")) {
			const restUrl = 'https://embed.lib.harvard.edu/api/nrs'
			var params={'urn':objectID,'prod':1}
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
