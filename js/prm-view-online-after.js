/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section and Scanned Key Content.
 * If pnx.display.lds41 exist, it will display scanned key content. 
 */

(function () {

    angular.module('viewCustom')
    .controller('prmViewOnlineAfterController', ['prmSearchService','$mdDialog','$timeout','$window','$location','$mdMedia', function (prmSearchService, $mdDialog, $timeout,$window,$location, $mdMedia) {

        var vm = this;
        var sv=prmSearchService;
        var itemData=sv.getItem();
        vm.item=itemData.item;
        vm.searchData=itemData.searchData;
        vm.params=$location.search();
        vm.zoomButtonFlag=false;
        vm.viewAllComponetMetadataFlag=false;
        vm.singleImageFlag=false;
        vm.photo = {}; // single image
        vm.jp2 = false;
        vm.imageTitle = '';
        vm.auth = sv.getAuth();
        vm.gridColumn='3'; // default print view size
        vm.pnxControlSourceId='HVD_VIA'; // display only pnx control sourceid of HVD_VIA
        vm.pnxControlSourceIdFlag=false;
        //console.log("prm-view-online-after.js");

        vm.$onInit=function() {
            vm.isLoggedIn=sv.getLogInID();
           // get item data from service
           itemData=sv.getItem();
           vm.item=itemData.item;
           if(vm.item.pnx.addata.mis1) {
               vm.item.mis1Data=sv.getXMLdata(vm.item.pnx.addata.mis1[0]);
           }
           if(vm.item.pnx.control.sourceid) {
               if(vm.item.pnx.control.sourceid.indexOf(vm.pnxControlSourceId) !== -1) {
                   vm.pnxControlSourceIdFlag = true;
               }
           }
           vm.searchData=itemData.searchData;
           vm.searchData.sortby=vm.params.sortby;
           vm.pageInfo=sv.getPage();

           if(vm.item.mis1Data) {
               if(Array.isArray(vm.item.mis1Data)===false) {
                   vm.singleImageFlag=true;
                   if (vm.item.mis1Data.image) {
                       vm.photo=vm.item.mis1Data.image[0];
                       vm.jp2=sv.findJP2(vm.photo); // check to see if the image is jp2 or not
                   }
                   if(vm.item.mis1Data.title) {
                       vm.imageTitle = vm.item.mis1Data.title[0].textElement[0]._text;
                   }
               } else {
                   vm.viewAllComponetMetadataFlag = true;
                   vm.singleImageFlag = false;
                   vm.zoomButtonFlag = true;
               }
           }

            // show print view base on the screen size
            if($mdMedia('xs')) {
                vm.gridColumn='1';
            } else if($mdMedia('sm')){
                vm.gridColumn='2';
            }

        };

        // view all component metadata
        vm.viewAllComponentMetaData=function () {
            var url='/discovery/viewallcomponentmetadata/'+vm.item.context+'/'+vm.item.pnx.control.recordid[0]+'?vid='+vm.params.vid;
            url+='&tab='+vm.params.tab+'&search_scope='+vm.params.search_scope;
            url+='&adaptor='+vm.item.adaptor;
            $window.open(url,'_blank');

        };


        // show the pop up image
        vm.gotoFullPhoto=function ($event, item, index) {
            var filename='';
            if(item.image) {
                var urlList=item.image[0]._attr.href._value;
                urlList = urlList.split('/');
                if(urlList.length >=3) {
                    filename=urlList[3];
                }
            } else if(item._attr.componentID) {
                filename = item._attr.componentID._value;
            }
            // go to full display page
            var url='/discovery/viewcomponent/'+vm.item.context+'/'+vm.item.pnx.control.recordid[0]+'?vid='+vm.searchData.vid+'&imageId='+filename;
            if(vm.item.adaptor) {
                url+='&adaptor='+vm.item.adaptor;
            } else {
                url+='&adaptor='+(vm.searchData.adaptor?vm.searchData.adaptor:'');
            }
            $window.open(url,'_blank');
        }

    }]);


    angular.module('viewCustom')
    .component('prmViewOnlineAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmViewOnlineAfterController',
        'templateUrl':'/discovery/custom/01HVD_INST-HVD2/html/prm-view-online-after.html'
    });

})();
