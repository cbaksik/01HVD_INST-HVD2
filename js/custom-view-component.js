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
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;
        vm.recordid='';
        vm.filename = vm.params.imageId;
        vm.index='';
        vm.clientIp=sv.getClientIp();

        vm.photo={};
        vm.flexsize=80;
        vm.total=0;
        vm.itemData={};
        vm.imageNav=true;
        vm.xmldata={};
        vm.keys=[];
        vm.imageTitle='';
        vm.jp2=false;
        vm.componentData={}; // single component data
        vm.componentKey=[];

        // remove HVD_VIA from record id of vm.docid
        vm.removeHVD_VIA=function () {
          var pattern = /^(HVD_VIA)/;
          var docid=angular.copy(vm.docid);
          if(pattern.test(docid)) {
              vm.recordid=docid.substring(7,docid.length);
          } else {
              vm.recordid = docid;
          }
        };

        // find index base on file name
        vm.findFilenameIndex=function (arrList,filename) {
            var k= -1;
            for(var i=0; i < arrList.length; i++){
                var img=arrList[i];
                if(img.image) {
                    var url=img.image[0]._attr.href._value.toLowerCase();
                    //console.log(url);
                    //console.log(vm.filename.toLowerCase());
                    //console.log(vm.filename);
                    if(url.match(vm.filename.toLowerCase())) {
                        k = i;
                        i = arrList.length;
                    }
                } else if(img._attr){
                    var componentID = img._attr.componentID._value;
                    if(componentID===vm.filename) {
                        k=i;
                        i=arrList.length;
                    }
                }
            }
            return k;
        };

        // ajax call to get data
        vm.getData=function () {
            var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/'+vm.context+'/'+vm.docid;
            var params={'vid':'','lang':'','search_scope':'','adaptor':''};
            // CB 20220720 commented out next 4 lines causing ang1.8 error; appear to be unneeded
            // params.vid=vm.params.vid;
            // params.lang=vm.params.lang;
            // params.search_scope=vm.params.search_scope;
            // params.adaptor=vm.params.adaptor;
            sv.getAjax(url,params,'get')
                .then(function (result) {
                    vm.item=result.data;
                    // convert xml to json
                    if(vm.item.pnx) {
                        if(vm.item.pnx.addata) {
                            var result = sv.parseXml(vm.item.pnx.addata.mis1[0]);
                            if (result.work) {
                                vm.xmldata = result.work[0];
                                if (vm.xmldata.component) {
                                    vm.total = vm.xmldata.component.length;
                                }
                                if (vm.item.pnx.display) {
                                    vm.keys = Object.keys(vm.item.pnx.display);
                                    // remove unwanted key
                                    var removeList = cMap.getRemoveList();
                                    for (var i = 0; i < removeList.length; i++) {
                                        var key = removeList[i];
                                        var index = vm.keys.indexOf(key);
                                        if (index !== -1) {
                                            vm.keys.splice(index, 1);
                                        }
                                    }

                                    vm.keys = cMap.sort(vm.keys);

                                }

                            }
                        }
                    } else {
                        $window.location.href = '/discovery/search?vid=' + vm.params.vid;
                    }

                    // display photo
                    vm.displayPhoto();

                },function (error) {
                        console.log(error);
                    }

                );

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

        // display each component value key
        // 20200824 component display was only picking up only first note b/c it has different data structure than other elements; adding another loop for it
        // multiple titles weren't not getting rendered either
        // note: the view all components page uses a different js so changes need to be made there too
        vm.getComponentValue=function(key){
           var text='';
           var texttype='';
           if(vm.componentData && key) {
                /* if (key === 'notes' || key === 'workType' || key === 'description') {
                    //console.log(vm.componentData[key]);
                    for (let noteNum= 0; noteNum<vm.componentData[key].length; noteNum+=1) {
                        text = text+vm.componentData[key][noteNum]._text+"<br />";
                    }
                }                
                else if (key === 'title') {        
                    for (let ti= 0; ti<vm.componentData[key].length ; ti+=1 ) {
                        if(vm.componentData[key][ti].type !== undefined) {
                            texttype += vm.componentData[key][ti].type[0]._text + ": ";    
                        }                            
                        texttype += text+vm.componentData[key][ti].textElement[0]._text+"<br />"; 
                    }
                    text = texttype;
                } 
                else { */
                    var data=vm.componentData[key];
                    text = cMapValue.getValue(data,key);
                //}
           }
           return text;
        };


        // display each photo component
        vm.displayPhoto=function () {
            vm.isLoggedIn=sv.getLogInID();
            vm.clientIp=sv.getClientIp();
            vm.photo={};

            if (vm.xmldata.component && !vm.xmldata.image) {
                if(!vm.index && vm.index !== 0) {
                    vm.index = vm.findFilenameIndex(vm.xmldata.component, vm.filename);
                }
                if(vm.index >= 0 && vm.index < vm.total) {
                    vm.componentData = vm.xmldata.component[vm.index];
                    if (vm.componentData.image) {
                        vm.photo = vm.componentData.image[0];
                        // find out if the image is jp2 or not
                        //vm.jp2 = sv.findJP2(vm.photo);
                    }
                }

            } else if(vm.xmldata.image) {
                vm.photo=vm.xmldata.image[0];
                //vm.jp2=sv.findJP2(vm.photo);
                vm.componentData=vm.xmldata.image[0];
            }


            if(vm.photo) {
                if(vm.photo._attr) {
                    var urlList=vm.photo._attr.href._value;
                    urlList = urlList.split('/');
                    if(urlList.length >=3) {
                        vm.filename=urlList[3];
                    }
                } else if(vm.componentData._attr.componentID) {
                    vm.filename = vm.componentData._attr.componentID._value;
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
