/**
 * Created by samsan on 9/20/17.
 */

angular.module('viewCustom')

    .service('customHathiTrustService',['$http',function ($http) {
        var serviceObj={};

        serviceObj.doGet=function (isbn,oclc) {
            if (isbn) {
                return $http({
                    method: 'GET',
                    headers: {
                        'Token': undefined
                      },
                    url: 'https://catalog.hathitrust.org/api/volumes/brief/isbn/'+isbn+'.json', 
                    timeout:5000               
                })   
            } else if (oclc) {
                return $http({
                    method: 'GET',
                    headers: {
                        'Token': undefined
                      },
                    url: 'https://catalog.hathitrust.org/api/volumes/brief/oclc/'+oclc+'.json', 
                    timeout:5000                  
                })                  
            };
        }; 

        /* test whether we want to call Hathi API, and if so, grab params we want to send */
	serviceObj.validateHathiTrust=function (pnxItem) {
		var online = false;
		var veExtRes = false; // is this a Primo VE external resource e.g. VIA record? 
		var item={'flag':false,'isbn':'','oclcid':'','data':{}};
		if(pnxItem.delivery.deliveryCategory) {
			let delCat=pnxItem.delivery.deliveryCategory;
			for(let i=0; i < delCat.length; i++){
				let str=delCat[i];
				if (str==='Alma-E' || str==='Alma-D' ) {
					online = true;
				}
			}
		}
		if (pnxItem.pnx.display.source) {
			if (pnxItem.pnx.display.source[0] == 'HVD_VIA') {
				veExtRes = true;
			}			
		}
		if (!online && !veExtRes && pnxItem.pnx.control.sourceid === 'alma') {
			item.flag = true;
			if(pnxItem.pnx.addata.oclcid) {
				item.oclcid=pnxItem.pnx.addata.oclcid[0];
			}
			if(pnxItem.pnx.addata.isbn){
				item.isbn=pnxItem.pnx.addata.isbn[0];
			}
		}
		return item;
	};

        // validate if orig data is harvard, if so, present our copy, otherwise present any full-view, else limited search
        serviceObj.validateHarvard=function (arrList) {
            //console.log(arrList);
            //console.log("review content of what hathi api returned to check for full view or limited search");
          var item={};
          for(var i=0; i < arrList.length; i++) {
              if(arrList[i].orig==='Harvard University' && arrList[i].usRightsString==='Full view') {
                item=arrList[i];
                item.huflag=true;
                item.fullview=true;
                i=arrList.length;
              } else if(arrList[i].usRightsString==='Full view') {
                  item=arrList[i];
                  item.huflag=false;
                  item.fullview=true;
                  i=arrList.length;
              } else if(arrList[i].usRightsString==='Limited (search-only)') {
                  item=arrList[i];
                  item.huflag=false;
                  item.fullview=false;
                  i=arrList.length;
              }
          }
          return item;
        };

        return serviceObj;
    }]);

