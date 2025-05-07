/**
 * Created by samsan on 9/13/17.
 */


angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityLineAfterCtrl',['$timeout','customHathiTrustService','customService','$q','prmSearchService',function ($timeout, customHathiTrustService,customService, $q, prmSearchService) {
        var vm=this;
        var custService=customService;
        var chts=customHathiTrustService;
        var prmsv=prmSearchService;
        vm.OpenLib = {'rtype':'book','isbn':[],'display':false};
        vm.itemPNX={};
	   vm.hasTOC='';
        vm.hathiTrust={};
        vm.isSerial='';
        var map;
        var openLibUrl = 'https://openlibrary.org/api/books?bibkeys=ISBN:';
        //var tocUrl = 'https://secure.syndetics.com/index.aspx?isbn=9780674055360/xml.xml&client=harvard&type=xw10';
        // for testing : var tocUrlBad = 'https://secure.syndetics.com/index.aspx?isbn=2939848394/xml.xml&client=harvard&type=xw10';



        // see if book is in open library
        vm.findOpenLib=function () {            
            if (vm.itemPNX.pnx.display.type[0] === vm.OpenLib.rtype && vm.itemPNX.pnx.addata.isbn) {
                var param={'isbn':'','hasData':false};
                param.isbn = vm.itemPNX.pnx.addata.isbn[0];
                var ourTitle = vm.itemPNX.pnx.addata.btitle[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g,"").toLowerCase().substring(0,10);
                //console.log('ours: '+ourTitle);
                    //fetch(openLibUrl+param.isbn+'&format=json&jscmd=viewapi', {                        
                // trying jscmd = details to get title in addition to borrow status so i can perform remedial check that it's the same title before presenting link; sometimes the isbn request returns the wrong book b/c openLib is also searching 020$z
                    fetch(openLibUrl+param.isbn+'&format=json&jscmd=details', {                        
                        method: 'GET',
                        headers: {
                            'Accept': '*/*'
                          }
                    })
                        .then(function (response) {  
                            return response.json();
                        })
                        .then(function (data) { 
                            var objKey = (Object.keys(data)); 
                            var objKeyValue = objKey[0]; 
                            var openLibPreview = data[objKeyValue].preview;                                              
                            var openLibTitle = data[objKeyValue].details.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g,"").toLowerCase().substring(0,10); 
                            //console.log('openlib: '+openLibTitle);                                             
                            if (openLibPreview === 'borrow' && openLibTitle === ourTitle) {
                                vm.OpenLib.display = true;
                                vm.OpenLib.infoURL = data[objKeyValue].info_url;
                                vm.OpenLib.previewURL = data[objKeyValue].preview_url;   
                            } 
                        })
                        .catch(function (err) {
                            //console.log("Open Library call did  not work", err);
                        });
          }
        };


        // hathitrust, this is also used for openlibrary since it needs same identifiers, isbn and oclcid
        vm.getHathiTrustData=function () {
            chts.doGet(vm.hathiTrust.isbn, vm.hathiTrust.oclcid)
                .then(function (data) {
                    if (data.data.items) {
                        vm.hathiTrustItem = chts.validateHarvard(data.data.items);
                        }
                    },
                    function (error) {
                        console.log(error);
                    }
                );
        };


        vm.$onInit=function() {
            vm.itemPNX=vm.parentCtrl.result;
		  if (vm.itemPNX.pnx.display.contents) {
			vm.hasTOC = 'true';
		  }
            vm.findOpenLib();
            if(vm.itemPNX.pnx.display.type[0] == 'journal') {
                vm.isSerial=true;
            } else {
                vm.isSerial=false;
            }
            //console.log(vm.isSerial);



        };

    }]);


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchResultAvailabilityLineAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-search-result-availability-line-after.html'
    });
