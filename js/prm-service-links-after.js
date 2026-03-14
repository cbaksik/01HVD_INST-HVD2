/**
 * Created by samsan on 8/7/17.
 * This component is used for Digital Bookplates
 * also adds link to HT from below full bib
 * 
 */
(function(){
    'use strict';
    angular.module('viewCustom')
    .controller('prmServiceLinksAfterCtrl',['customBookplateService','$timeout','$sce',function (customBookplateService, $timeout,$sce) {
        let vm=this;
        let cisv=customBookplateService;
        vm.plateList=[];
	   vm.hasPlates = 'false';
	   vm.isVIArecord='';
	   vm.isReCAP = false;
	   vm.isSignedIn = false;
	   vm.addata = [];
	   vm.illiadBaseUrl = 'https://rsezp.lib.harvard.edu/login?qurl=https%3A%2F%2Filliad.hul.harvard.edu%2Filliad%2FHUL%2Filliad.dll?Action=10%26Form=30%26rft.genre=';
	   vm.illiadFormType = 'book';
	   vm.illiadRestOfUrl = '';
	   vm.illiadIsxn = '';
	   vm.illiadTitle = '';
        vm.getData=()=> {
            // make a copy to avoid data binding
            vm.recordLinks = angular.copy(vm.parentCtrl.recordLinks);		  
		  vm.addata = vm.parentCtrl.item.pnx.addata;
            /* START hathi section */    
            var searchHathiBase = 'https://catalog.hathitrust.org/Search/Home?adv=1&lookfor%5B%5D=';
            var searchHathiLinkAppend = '&urlappend=%3Bsignon=swle:https://fed.huit.harvard.edu/idp/shibboleth';
            //console.log(vm.parentCtrl.item.pnx.addata);
            //console.log(vm.parentCtrl.item.pnx.display.type[0]);
            // only present hathi link for book, music, journal
            var format = vm.parentCtrl.item.pnx.display.type[0];  
            var title = vm.parentCtrl.item.pnx.display.title[0]; 
            var author = '';
            var year = '';            
            if (vm.parentCtrl.item.pnx.addata.aulast) {
                author = vm.parentCtrl.item.pnx.addata.aulast[0];
            }
            if (!format == 'journal' && !author && vm.parentCtrl.item.pnx.addata.addau) {
                author = vm.parentCtrl.item.pnx.addata.addau[0];
            }
            if (vm.parentCtrl.item.pnx.addata.risdate){
                year = vm.parentCtrl.item.pnx.addata.risdate[0];       
            }                       
            if (format == 'book' || format == 'journal' || format == 'music') {
                vm.showHathiLink = "true";                
            }
            //console.log(vm.showHathiLink );
            vm.searchHathiLink = searchHathiBase + author + '&type%5B%5D=author&bool%5B%5D=AND&lookfor%5B%5D='  + title + '&type%5B%5D=title&bool[]=AND&lookfor[]=' + year + '&type[]=year&bool[]=AND&yop=after' + searchHathiLinkAppend;  
            /* END hathi section */   

            /* ALMA-D AUX IMAGE DISPLAY */
            if (vm.parentCtrl.item.pnx.display.lds69){
                    vm.almaDaux = vm.parentCtrl.item.pnx.display.lds69[0];
                    vm.almaDauxEmbed = 'https://hvd.alma.exlibrisgroup.com/view/UniversalViewer/01HVD_INST/' + vm.almaDaux + '#?iiifVersion=3&updateStatistics=false&embedded=true&c=0&m=0&s=0&cv=0&config=&locales=en-GB:English (GB),cy-GB:Cymraeg,fr-FR:Français (FR),pl-PL:Polski,sv-SE:Svenska,xx-XX:English (GB) (xx-XX)&r=0';
                    
                    vm.almaDauxEmbed = $sce.trustAsResourceUrl(vm.almaDauxEmbed);
          	}

			//   DIGITAL BOOKPLATES
			if (vm.parentCtrl.item.pnx.display.lds06) {
				vm.hasPlates = 'true';
				vm.plateList=cisv.extractImageUrl(vm.parentCtrl.item);
			}
			//   IS VIA or RECAP
			if (vm.parentCtrl.item.pnx.display.source) {
				if (vm.parentCtrl.item.pnx.display.source[0] == 'HVD_VIA') {
					vm.isVIArecord = true;
				}
				if (vm.parentCtrl.item.pnx.display.source[0] == 'HVD_RECAP') {
					vm.isReCAP=true;			
					//console.log(vm.addata);
					//
					if ((vm.addata.isbn && vm.addata.isbn[0])) {
						vm.illiadIsxn = '%26rft.isbn=' + vm.addata.isbn[0];
					}
					if ((vm.addata.btitle && vm.addata.btitle[0])) {
						vm.illiadTitle = '%26rft.btitle=' + vm.addata.btitle[0];
					}
					if (vm.addata.ristype[0] === 'JOUR' || vm.addata.ristype[0] === 'newspapers' ) {
						vm.illiadFormType = 'article';
						if (vm.addata.issn && vm.addata.issn[0]) {
							vm.illiadIsxn = '%26rft.issn=' + vm.addata.issn[0];
						}
						if ((vm.addata.jtitle && vm.addata.jtitle[0])) {
						vm.illiadTitle = '%26rft.jtitle=' + vm.addata.jtitle[0];
						}
					} else if (vm.addata.ristype[0] === 'BOOK' ) {
						vm.illiadFormType = 'bookitem';
					} else {
						vm.illiadFormType = 'book';
					}
					//vm.illiadRestOfUrl =
						// '%26rft.isbn=' + vm.addata.isbn[0] +
						// '%26rft.btitle=' + vm.addata.btitle[0] +
						// '%26rft.au=' + vm.addata.au[0] +
						// '%26rft.date=' + vm.addata.date[0] +
						// '%26rft.edition=' + vm.addata.edition[0] +
						// '%26rft.pub=' + vm.addata.pub[0] +
						// '%26rft.pubdate=' + vm.addata.date[0] +
						// '%26rft.publisher=' + vm.addata.pub[0] +
						// '%26rft.place=' + vm.addata.cop[0] +
						// '%26rft.doi=' + vm.addata.doi[0]+
						// '%26rfe_dat=' + vm.addata.oclcid[0] +
						// '%26rfr_id=info:sid/primo.exlibrisgroup.com-alma_local';

					vm.illiadRestOfUrl =
						vm.illiadTitle +
						'%26rft.au='        + ((vm.addata.au       && vm.addata.au[0])       || '') +
						'%26rft.date='      + ((vm.addata.date     && vm.addata.date[0])     || '') +
						'%26rft.edition='   + ((vm.addata.edition  && vm.addata.edition[0])  || '') +
						'%26rft.pub='       + ((vm.addata.pub      && vm.addata.pub[0])      || '') +
						'%26rft.pubdate='   + ((vm.addata.date     && vm.addata.date[0])     || '') +
						'%26rft.publisher=' + ((vm.addata.pub      && vm.addata.pub[0])      || '') +
						'%26rft.place='     + ((vm.addata.cop      && vm.addata.cop[0])      || '') +
						'%26rft.doi='       + ((vm.addata.doi      && vm.addata.doi[0])      || '') +
						'%26rfe_dat='       + ((vm.addata.oclcid   && vm.addata.oclcid[0])   || '') +
						vm.illiadIsxn +
						'%26rfr_id=info:sid/primo.exlibrisgroup.com-alma_local';

				}
			}

        };
	   // end of getData

        vm.$onInit=()=> {
		vm.getData();
		vm.isSignedIn = vm.parentCtrl.primolyticsService.jwtUtilService.isSignedIn();
        }


    }]);


    angular.module('viewCustom')
    .component('prmServiceLinksAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmServiceLinksAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-service-links-after.html'
    });

})();