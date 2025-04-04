/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

(function () {

	angular.module('viewCustom')
	.controller('customViewComponentController', [ '$sce','$mdMedia','prmSearchService','$location','$stateParams', '$element','$timeout','customMapXmlKeys','$window','customMapXmlValues', function ($sce,$mdMedia,prmSearchService,$location,$stateParams, $element, $timeout, customMapXmlKeys,$window, customMapXmlValues) {

        let vm = this;
        var sv=prmSearchService;
        var cMap=customMapXmlKeys;
        var cMapValue=customMapXmlValues;
        // get location parameter
        vm.params=$location.search();
        // get parameter from angular ui-router
        vm.docid=$stateParams.docid; // eg alma99158322666803941
        vm.recordid='';
        vm.filename = vm.params.imageId; // eg urn-3:DOAK.LIB:3205217
        vm.index=''; // this is used for scrolling feature (x of y images)
        vm.photo={};
        vm.flexsize=80;
        vm.total=0;
        vm.itemData={};
        vm.imageNav=true;
        vm.xmldata={};
        vm.keys=[];
        vm.imageTitle='';
        vm.componentData={}; 
        vm.componentKey=[];

	   /* my list for VEtesting */
	   vm.viewComponent={};
	   vm.viewComponent2={};
	   vm.viewComponentA={};
	   vm.viewComponentB={};
	   vm.viewComponentE={};
	   vm.viewComponentF={};
	   vm.viewComponentU={};
	   vm.viewComponentR={};
	   vm.viewComponentH={};
	   vm.viewComponentS={};



	   /***********************************************/
		console.log("custom-view-component.js: vm");
		console.log(vm);
	   /***********************************************/
	   
     //    remove HVD_VIA from record id of vm.docid
	//    docid is being pulled from URL
        vm.removeHVD_VIA=function () {
          var pattern = /^(HVD_VIA)/;
          var docid=angular.copy(vm.docid);
          if(pattern.test(docid)) {
              vm.recordid=docid.substring(7,docid.length);
          } else {
              vm.recordid = docid;
          }
        };

        // find index of component array based on filename (URN)
	   // sending vm.componentData, vm.filename
     //    vm.findFilenameIndex=function (arrList,filename) {
	// 	console.log("findFilenameIndex fx fx");
	// 	console.log("testing new log");
     //        var k= -1;
     //        for(var i=0; i < arrList.length; i++){
     //            var entry=arrList[i];
	// 		 console.log(i);
	// 		 console.log("entry value from findFilenameIndex fx");
	// 		 console.log(entry);
	// 		 console.log("preparts");
	// 		 var parts = entry.split('==');
	// 		 console.log("parts");
	// 		 console.log(parts);
     //            for (let part of parts) {
	// 			console.log(part.substring(1).trim());
	// 			if (part.charAt(0) === 'U' && part.toLowerCase().includes(filename.toLowerCase())) {
	// 				console.log("i");
	// 				console.log(i);
	// 				return i;
	// 			}
	// 		 }
     //        }
		  // ***  write section here for returning attribute if no image exists ****
            //return null; // Return null if the filename is not found
       // };

	   /* ai fx to modify arrow for html page */
	//    vm.convertToKeyValuePairs=function (array) {
	// 	return array
	// 	    .filter(str => str.trim())
	// 	    .map(str => ({ 
	// 		   key: str.charAt(0), 
	// 		   value: str.substring(1).trim() 
	// 	    }));
	//  }
	   /* end ai  */


	   /* example ajax call http://localhost:8003/primaws/rest/pub/pnxs/L/alma99158322666803941?vid=01HVD_INST:HVD2&lang=en&search_scope=MyInst_and_CI&adaptor=Local%20Search%20Engine&lang=en */

        // ajax call to get data
        vm.getData=function () {
		console.log("get ajax fx");
		//var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/L/'+vm.docid;
		/* REDO THIS LATER TO SEND VARIABLE */
		var urlVE ='/primaws/rest/pub/pnxs/L/alma99158322666803941';
		var params={'vid':'','lang':'','search_scope':'','adaptor':''};
		params.vid='01HVD_INST:HVD2';
          params.lang='en';
          params.search_scope='MyInst_and_CI';
          params.adaptor='Local%20Search%20Engine';

          sv.getAjax(urlVE,params,'get')
                .then(function (result) {
                    vm.item=result.data; 
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

        // get json key and remove image from the key
        vm.getKeys=function (obj) {
            var keys=Object.keys(obj);
            var removeList = cMap.getRemoveList();
            for(var i=0; i < removeList.length; i++) {
                var key=removeList[i];
                var index = keys.indexOf(key);
                if (index !== -1) {
                    // remove image from the list
                    keys.splice(index, 1);
                }
            }
            return cMap.getOrderList(keys);
        };


        // get value base on json key
        vm.getValue=function(val,key){
            return cMapValue.getValue(val,key);
        };


        vm.getComponentValue=function(key){
           var text='';
           var texttype='';
           if(vm.componentData && key) {
                    var data=vm.componentData[key];
                    text = cMapValue.getValue(data,key);
           }
           return text;
        };


        // display component photo and component metadata
	   // function receives array of all components
		vm.displayPhoto=function () {
			vm.photo={}; // this will be URL to image
			console.log("vm.displayPhoto=function");
			if (vm.componentData) {
				if(!vm.index && vm.index !== 0) {
					for(var i=0; i < vm.componentData.length; i++) {
						if (vm.componentData[i].toLowerCase().includes(vm.filename.toLowerCase())) {
							vm.index = i;
						}
					}
				}
				if(vm.index >= 0 && vm.index < vm.total) {
					vm.viewComponent = vm.componentData[vm.index].split('==').filter(str => str.trim()).map(str => ({ 
						key: str.charAt(0), 
						value: str.substring(1).trim() 
						}));;
					console.log("vm.viewComponent test");
					console.log(vm.viewComponent);
					
					vm.viewComponentU= vm.viewComponent.filter(item => item.key === 'U').map(item => item.value);
					vm.viewComponentT= vm.viewComponent.filter(item => item.key === 'T').map(item => item.value);
					vm.viewComponentW= vm.viewComponent.filter(item => item.key === 'W').map(item => item.value);
					vm.viewComponentX= vm.viewComponent.filter(item => item.key === 'X').map(item => item.value);


				}
			}
		};

        vm.$onInit=function() {
            vm.removeHVD_VIA();
            // if the smaller screen size, make the flex size to 100.
            if($mdMedia('sm')) {
                vm.flexsize=100;
            } else if($mdMedia('xs')) {
                vm.flexsize=100;
            }
            // call ajax and display data
            vm.getData();
            // initialize label for image component page
            vm.parentCtrl.bannerTitle='FULL IMAGE DETAIL';
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
            } else {
                vm.index=0;
                vm.displayPhoto();
            }
        };


        // prev photo
        vm.prevPhoto=function () {
            vm.index--;
            if(vm.index >= 0 && vm.index < vm.total) {
                vm.displayPhoto();
            } else {
                vm.index=vm.total - 1;
                vm.displayPhoto();
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
