/**

 */

angular.module('viewCustom')
.controller('prmSnippetAfterCtrl',[ 'prmSearchService', '$scope', '$document','$http', function (prmSearchService, $scope, $document,$http) {
	var vm=this;
	vm.itemPNX={};
	vm.hvdSnipBefore='';
	vm.hvdSnipMatch='';
	vm.hvdSnipAfter='';
	var sv=prmSearchService;
	vm.eadId = '';
	vm.eadDelivery = {};
	vm.fileContent = '';
	vm.localhostFT = 'Bertha is a sweet pibble who likes to sleep and hunt critters. When she is hunting she buries her face in the leaves and comes out with a mouse in her mouth. In the summer she might dive into a perennial and do the same. She is always hungry and loves treats and scraps. Wyman papers. When she sleeps she makes the cutest little sleep noises and makes heavy sighs when she is relaxed. She was formerly a professor of Biology at Harvard. Sometimes she runs in her sleep. In rare moments she gets playful and nibbles and we get to rub her tummy.';

	// this is same as fx in prm-search-result-availability-line-after.js
	// find if pnx had EAD finding aid link, there may be more than one 555 field
	// ead full-text txt file in alma-d:
	//"url": "https://hvd-psb.primo.exlibrisgroup.com/view/delivery/text/01HVD_INST/132703410790003941"
	vm.findFindingAidSnippet=function () {
		if (vm.itemPNX.pnx.display.lds08) {
			const targets = ["id.lib.harvard.edu", "nrs.harvard.edu"];
			for (const key in vm.itemPNX.pnx.display.lds08) {
				const val = vm.itemPNX.pnx.display.lds08[key];
				if (typeof val === "string" && targets.some(t => val.includes(t))) {
					vm.eadId = val;
				}
			}
		}
		if (vm.eadId) {
			console.log("if vm.eadID");
			const recordid = vm.itemPNX.pnx.control.sourcerecordid[0];
			var url ='/view/delivery/01HVD_INST/' + recordid + '.json';	
			var params={};
			sv.getAjax(url,params,'get')
				.then(function(result) {
					vm.eadDelivery = result.data;
					 console.log("rest response (eadDelivery)");
					 console.log(vm.eadDelivery);
					 console.log(vm.eadDelivery.files);
					if (vm.eadDelivery.files) {
						console.log("if true: vm.eadDelivery.files");
						const txtFile = vm.eadDelivery.files[0].fulltext ? vm.eadDelivery.files[0].fulltext.format : null;
						console.log(txtFile);
						if (txtFile === 'PLAIN') {
							//pull file
							var fileUrl = vm.eadDelivery.files[0].fulltext.url;
							console.log(vm.eadDelivery.files[0].fulltext.url);
							$http.get(fileUrl).then(
							// Success function
							function(response) {
								vm.fileContent = response.data; 
								console.log("fx response to set vm.fileContent");
								prepareSnippet(vm.fileContent);

							},
							// Error function
							function(error) {
								console.error("Failed to fetch the file.", error);
							});
						}
					}
				}, function(error) {
					console.log("Error fetching data:", error);
			}); 	//end getajax
		}


		//prepareSnippet(vm.localhostFT); // COMMENT THIS LINE AFTER LOCAL HOST TESTING

		function prepareSnippet(fileContent) {

			console.log("fx prepareSnippet");
			const words = fileContent.split(/\s+/);
			const string1 = document.getElementById('searchBar').value;
			const string2 = string1.split(/\s+/)[0];
			console.log(string1);
			console.log(string2);

			 // normalize a word: lowercase + strip punctuation
			function normalize(w) {
				return w.toLowerCase().replace(/[^\w]/g, "");
 			}

			function findSequenceIndex(sequence) {
				const seqWords = sequence.trim().split(/\s+/).map(normalize);
				const len = seqWords.length;

				for (let i = 0; i <= words.length - len; i++) {
					const segment = words.slice(i, i + len).map(normalize);
					if (segment.join(" ") === seqWords.join(" ")) {
					return i;
					}
				}
				return -1;
			}

			let matchString = '';
			let index = findSequenceIndex(string1);			
			console.log("index for string1: " + index);

			if (index > 0) {
				matchString = string1;
				console.log("matchString1: " + matchString);
			}
			if (index === -1) {
				index = findSequenceIndex(string2);
				matchString = string2;					
				console.log("index for string2: " + index);
				console.log("matchString2: " + matchString);
			}

			const matchWordCount = matchString.trim().split(/\s+/).length;
			console.log("matchWordCount: " + matchWordCount);
			console.log("index: " + index);

			vm.hvdSnipBefore = words.slice(0,20).join(" ") + "... " + words.slice(Math.max(0, index - 10), index).join(" ");
			vm.hvdSnipMatch = words.slice(index, index + matchWordCount).join(" ");
			vm.hvdSnipAfter= words.slice(index + matchWordCount, index + matchWordCount + 10).join(" ") + "... ";

			if (matchString === '' || index <= 0 ) {
				vm.hvdSnipBefore = words.slice(0,20).join(" ") + "... ";
				vm.hvdSnipMatch = '';
				vm.hvdSnipAfter = words.slice(-15).join(" ");
			}

			console.log(vm.hvdSnipBefore);
			console.log(vm.hvdSnipMatch);
			console.log(vm.hvdSnipAfter);

			
		}


	};	


	vm.$onInit=function() {
   
		vm.itemPNX=vm.parentCtrl.record;
		vm.findFindingAidSnippet();

	};
}]);
 
angular.module('viewCustom')
.component('prmSnippetAfter',{
	bindings:{parentCtrl:'<'},
	controller: 'prmSnippetAfterCtrl',
	controllerAs:'vm',
	templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-snippet-after.html'
});