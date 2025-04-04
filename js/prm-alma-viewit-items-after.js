/**
 * ve testing for via
 */

(function () {

    angular.module('viewCustom')
    .controller('prmAlmaViewitItemsAfterController', ['$window', function($window) {

	var vm=this;
	vm.componentJSON={};
	vm.testFlag=false; // refer to this in html as {{$ctrl.testFlag}} 

	vm.$onInit=function () {
		console.log("prm-alma-viewit-items-after");
		console.log(vm);
		if (vm.parentCtrl.item.pnx.display.lds65) {
 			vm.componentJSON = convertArrayToJSON(vm.parentCtrl.item.pnx.display.lds65);
		}		
	};

	// begin ai function to convert lds65 image components to json
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
        bindings: {parentCtrl: '<'},
        controller: 'prmAlmaViewitItemsAfterController',
        'templateUrl':'/discovery/custom/01HVD_INST-HVD2/html/prm-alma-viewit-items-after.html'
    });

})();
