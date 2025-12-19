/**
 * Created by samsan on 9/13/17.
 */


angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityLineAfterCtrl',['$timeout','customHathiTrustService','$q','prmSearchService',function ($timeout, customHathiTrustService, $q, prmSearchService) {

		var vm=this;
		var chts=customHathiTrustService;
		var sv=prmSearchService;
		vm.OpenLib = {'rtype':'book', 'display':false};
		vm.itemPNX={};
		vm.hasTOC='';
		vm.hathiTrust={};
		vm.isSerial=false;
		vm.eadURN ='';
		vm.isVIAonline = '';
		vm.isSKC = '';
		vm.holding856='';
		vm.eDelivery = {};
		var openLibUrl = 'https://openlibrary.org/api/books?bibkeys=';

		// find if pnx had EAD finding aid link, there may be more than one 555 field
		vm.findFindingAid=function () {
			if (vm.itemPNX.pnx.display.lds08) {
				const targets = ["id.lib.harvard.edu", "nrs.harvard.edu"];
				for (const key in vm.itemPNX.pnx.display.lds08) {
					const val = vm.itemPNX.pnx.display.lds08[key];
					if (typeof val === "string" && targets.some(t => val.includes(t))) {
						vm.eadURN = val;
					}
				}
			}
		};		

		// if not already online, hathitrust
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
		)};

		// if not already online, see if book is in open library
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
							if (objKey.length > 0) {
								var objKeyValue = objKey[0];  // this is the ISBN
								if (data[objKeyValue]) {
									var openLibPreview = data[objKeyValue].preview;
									var openLibTitle = data[objKeyValue].details.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g,"").toLowerCase().substring(0,10); 
								//console.log('openlib: '+openLibTitle);
								}
								if (openLibPreview === 'borrow' && openLibTitle === ourTitle) {
									vm.OpenLib.display = true;
									vm.OpenLib.infoURL = data[objKeyValue].info_url;
									vm.OpenLib.previewURL = data[objKeyValue].preview_url;   
								} 
							}

						})
						.catch(function (err) {
							console.log("Open Library call did  not work", err);
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
							if (objKey.length > 0) {
								var objKeyValue = objKey[0]; 
								if (data[objKeyValue]) {
									var openLibPreview = data[objKeyValue].preview;                                              
									var openLibTitle = data[objKeyValue].details.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g,"").toLowerCase().substring(0,10); 
									//console.log('openlib: '+openLibTitle);                                             
									if (openLibPreview === 'borrow' && openLibTitle === ourTitle) {
										vm.OpenLib.display = true;
										vm.OpenLib.infoURL = data[objKeyValue].info_url;
										vm.OpenLib.previewURL = data[objKeyValue].preview_url;   
									} 
								}
							}
						})
						.catch(function (err) {
							console.log("Open Library call did  not work", err);
						});
				}
			}
		};
		// end of open library

		// 856 LINKS: online button override
		//
		// OTB online button for 856 links opens bib in new tab instead of taking you to resource
		// n.b. deliveryCategory will be Alma-P if holding, in addition to Alma-E if a holding has 856
		// before calling this fx, already tested for Alma-E exists and there is at least 1 hol
		// remember that p+e are deduped already
		//
		// notes about the /rest/pub/edelivery api: 
		// returns electronicServices instance for each portfolio
		// if there is a port --> serviceType:ELECTRONIC
		// if there is an 856, there is also serviceType:GENERAL_ELECTRONIC
		// either way, url is in serviceUrl
		// openUrl links will have serviceUrl: /view/action/uresolver
		vm.override856=function () {
			const holFigNet = vm.itemPNX.delivery.holding.some(holding => 
				holding.libraryCode === 'NET' || holding.libraryCode === 'FIG'
			);
			// .(some...) guaranteed to be true/fase. check stops as soon as the first match is found	
			if (holFigNet) {
				var url ='/primaws/rest/pub/edelivery/' + vm.itemPNX.pnx.control.recordid[0];	
				var data = { doc: vm.itemPNX };	
				sv.postAjax(url, data)
					.then(function(result) {
						vm.eDelivery = result.data;
						//console.log("directlink rest response (eDelivery)");
						// console.log(vm.eDelivery);						
						if (vm.eDelivery && vm.eDelivery.electronicServices) {
							if (vm.eDelivery.electronicServices.length === 1) {
								// one eService and we know there is net/fig, so there is no portfolio only an 856
								vm.holding856 = vm.eDelivery.electronicServices[0].serviceUrl;
							} 
							if (vm.eDelivery.electronicServices.length > 1) {
								// if serial, prefer portfolio, if not serial prefer GES, NET over FIG
								// if serial FIG,NET -- don't promise full access
								const services = vm.eDelivery.electronicServices;
								if(!vm.isSerial) {
									const serviceGES = services.find(service => service.serviceType === 'GENERAL_ELECTRONIC');
									// .(find...) returns first match then stops
									vm.holding856 = serviceGES.serviceUrl;
								} 
								if(vm.isSerial) {
									var serviceSerial_Port = false;
									serviceSerial_Port = services.find(service => service.serviceType === 'ELECTRONIC');
									if (serviceSerial_Port) {
										//console.log("quit function - this is a serial and it has a portfolio");
										return;
									}
									if (!serviceSerial_Port) {
										const serviceSerial_GES = services.find(service => service.serviceType === 'GENERAL_ELECTRONIC');
										vm.holding856 = serviceSerial_GES.serviceUrl;
									}
								}  
							}
						}
					}, function(error) {
						console.log("Error fetching eDelivery data:", error);
				});
			}
		};


		vm.$onInit=function() {
			//console.log(vm.parentCtrl);
			vm.itemPNX=vm.parentCtrl.result;
			console.log('score: ' + vm.itemPNX.pnx.control.score[0]);
			if(vm.itemPNX.pnx.display.type[0] == 'journals'|| vm.itemPNX.pnx.display.type[0] == 'newspapers') {
				vm.isSerial=true;
			}
			vm.findFindingAid();
			if (vm.itemPNX.pnx.display.contents) {
				vm.hasTOC = 'true';
			}
			if (vm.itemPNX.pnx.display.source) {
				if (vm.itemPNX.pnx.display.source[0] == 'HVD_VIA') {
					const numImages = vm.itemPNX.pnx.display.lds20 ? vm.itemPNX.pnx.display.lds20[0] : null;
					if (numImages > 0) {
						vm.isVIAonline=true;
					}
				}			
			}
			if (vm.itemPNX.pnx.display.lds62) {
				if (vm.itemPNX.pnx.display.lds62[0] == 'legacyKeyContent') {
						vm.isSKC=true;
					}
			}
			// if not already online, do openLib and hathi checks
			var bibOnline = vm.itemPNX.delivery.deliveryCategory.some(deliveryCategory => 
				deliveryCategory === 'Alma-E' || deliveryCategory === 'Alma-D'
			);
			// also test VE external resources for Online
			if (vm.itemPNX.delivery.availabilityLinks.some(availabilityLinks => availabilityLinks === 'directlink')) {				
				bibOnline = 'true';
			}
			console.log(bibOnline);
			if (!bibOnline) {
				vm.findOpenLib();
				vm.hathiTrust=chts.validateHathiTrust(vm.itemPNX);
				vm.hathiTrustItem={};
				if(vm.hathiTrust.flag) {
					vm.getHathiTrustData();
				}
			}
			if (bibOnline && vm.itemPNX.delivery.holding) {vm.override856();}
		};
		// end of onInit



	}]);
	// end of controller


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchResultAvailabilityLineAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-search-result-availability-line-after.html'
    });
