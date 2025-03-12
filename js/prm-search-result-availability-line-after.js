/**
 * Created by samsan on 9/13/17.
 */


angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityLineAfterCtrl',['$timeout','customHathiTrustService','customService','$q','prmSearchService',function ($timeout, customHathiTrustService,customService, $q, prmSearchService) {
        var vm=this;
        var custService=customService;
        var chts=customHathiTrustService;
        var prmsv=prmSearchService;
        // display of table of content
        vm.TOC = {'type':'01HVD_ALMA','isbn':[],'display':false};
        vm.OpenLib = {'rtype':'book','isbn':[],'display':false};
        vm.itemPNX={};
        vm.hathiTrust={};
        vm.FAlink='';
        vm.isSerial='';
        var map;
        var tocUrl = 'https://secure.syndetics.com/index.aspx?isbn=';
        var openLibUrl = 'https://openlibrary.org/api/books?bibkeys=ISBN:';
        //var tocUrl = 'https://secure.syndetics.com/index.aspx?isbn=9780674055360/xml.xml&client=harvard&type=xw10';
        // for testing : var tocUrlBad = 'https://secure.syndetics.com/index.aspx?isbn=2939848394/xml.xml&client=harvard&type=xw10';


        // find if pnx has table of content
        vm.findTOC=function () {
            if (vm.itemPNX.pnx.control.sourceid[0] === vm.TOC.type && vm.itemPNX.pnx.addata.isbn) {
                var param={'isbn':'','hasData':false};
                //console.log("test for toc");
                param.isbn = vm.itemPNX.pnx.addata.isbn[0];
                 /* fetch chained response to get data (first response is not actual data yet) */
                    fetch(tocUrl+param.isbn+'/toc.xml&client=harvard&type=xw10', {                        
                        method: 'GET',
                        headers: {
                            'Accept': '*/*'
                            //'Content-Type': 'text/xml; charset=UTF-8',
                            // 'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',                           
                            //'Access-Control-Allow-Origin': '*/*' ,     
                            //'Access-Control-Request-Headers': '*/*'
                          }
                    })
                        .then(function (response) {
                            //console.log(response);
                            //console.log(response.headers); 
                            return response.text();
                        })
                        .then(function (data) {  
                            if (data.substr(0,7) == '<USMARC') {                                
                                vm.TOC.display = true;
                                vm.TOC.isbn = param.isbn;
                            }
                        })
                        .catch(function (err) {
                            console.log("Syndetics call did not work", err);
                        });
          }
        };

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

        // find if pnx had EAD finding aid link
        // vm.findFindingAid=function () {
        //     var ead = '';
        //     var eadURN = '';
        //     if (vm.itemPNX.pnx.links.linktofa) {
        //         ead = vm.itemPNX.pnx.links.linktofa[0];
        //         ead=ead.slice(3);
        //         eadURN = ead.replace(' $$Elinktofa','');
        //         vm.FAlink=eadURN;
        //   }
        // };


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
            // get table of content
            vm.findTOC();
            vm.findOpenLib();
            // vm.findFindingAid();
            if(vm.itemPNX.pnx.display.type[0] == 'journal') {
                vm.isSerial=true;
            } else {
                vm.isSerial=false;
            }
            //console.log(vm.isSerial);


            // validate Hathi Trust to see if it is existed
            // vm.hathiTrust=chts.validateHathiTrust(vm.itemPNX);
            // vm.hathiTrustItem={};
            // if(vm.hathiTrust.flag) {
            //     vm.getHathiTrustData();
            // }

        };

    }]);


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchResultAvailabilityLineAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-search-result-availability-line-after.html'
    });
