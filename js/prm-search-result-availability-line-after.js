/**
 * Created by samsan on 9/13/17.
 */


angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityLineAfterCtrl',['$timeout','customHathiTrustService','$q','prmSearchService',function ($timeout, customHathiTrustService, $q, prmSearchService) {
        var vm=this;
        var chts=customHathiTrustService;
        var prmsv=prmSearchService;
        vm.OpenLib = {'rtype':'book', 'display':false};
        vm.itemPNX={};
	   vm.hasTOC='';
        vm.hathiTrust={};
        vm.isSerial='';
        var openLibUrl = 'https://openlibrary.org/api/books?bibkeys=';

	// find if pnx had EAD finding aid link
	vm.findFindingAid=function () {
		var ead = '';
		var eadURN = '';
		if (vm.itemPNX.pnx.links.linktofa) {
			ead = vm.itemPNX.pnx.links.linktofa[0];
			ead=ead.slice(3);
			eadURN = ead.replace(' $$Elinktofa','');
			vm.FAlink=eadURN;
		}
	};

        // see if book is in open library
	vm.findOpenLib=function () {
		if (vm.itemPNX.pnx.display.type[0] === vm.OpenLib.rtype) {
			var ourTitle = vm.itemPNX.pnx.addata.btitle[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g,"").toLowerCase().substring(0,10);
			// doing remedial check on title because sometimes API returns wrong book for given identifer
			if (vm.itemPNX.pnx.addata.isbn) {
				var param={'isbn':'','hasData':false};
				param.isbn = vm.itemPNX.pnx.addata.isbn[0];
					fetch(openLibUrl+'ISBN:'+param.isbn+'&format=json&jscmd=details', 
					{
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

			} else if (vm.itemPNX.pnx.addata.oclcid) {
				var param={'oclc':'','hasData':false};
				param.oclc = vm.itemPNX.pnx.addata.oclcid[0].replace(/\D/g,'');
				fetch(openLibUrl+'OCLC:'+param.oclc+'&format=json&jscmd=details', 
					{
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
          }
        };


        // hathitrust
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
            console.log(vm.itemPNX.pnx.control.score[0]);
          //   console.log(vm.itemPNX.pnx.display.contents[0]);
          //   console.log(vm.itemPNX.pnx.addata.abstract[0]);
		  if (vm.itemPNX.pnx.display.contents) {
			vm.hasTOC = 'true';
		  }
            vm.findOpenLib();
            if(vm.itemPNX.pnx.display.type[0] == 'journal') {
                vm.isSerial=true;
            } else {
                vm.isSerial=false;
            }
		  if (vm.itemPNX.pnx.display.source) {
			if (vm.itemPNX.pnx.display.source[0] == 'HVD_VIA') {
				vm.isVIA=true;
			}			
		 }
		  // HathiTrust 
            vm.hathiTrust=chts.validateHathiTrust(vm.itemPNX);
            vm.hathiTrustItem={};
            if(vm.hathiTrust.flag) {
                vm.getHathiTrustData();
            }
            vm.findFindingAid();

        };

    }]);


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchResultAvailabilityLineAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-search-result-availability-line-after.html'
    });
