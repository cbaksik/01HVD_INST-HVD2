// for creating hyperlink to retrieve all results for a given library + location code
(function () {
  'use strict';

  angular.module('viewCustom')
  .factory('liblocService', liblocService);

	function liblocService() {

		var liblocs = [	
			{ lib: 'AJP', id: '124011140003941-dgh', locName:'Arnold Arboretum: Dana Greenhouse' },
			{ lib: 'AJP', id: '124011140003941-fol', locName:'Arnold Arboretum: Folio' },
			{ lib: 'AJP', id: '124011140003941-gen', locName:'Arnold Arboretum: GEN' },
			{ lib: 'AJP', id: '124011140003941-gena', locName:'Arnold Arboretum: General Collections Aeon' },
			{ lib: 'AJP', id: '124011140003941-hd', locName:'Arnold Arboretum: Offsite Storage (HD)' },
			{ lib: 'AJP', id: '124011140003941-hort', locName:'Arnold Arboretum: Horticulture Crew Office' },
			{ lib: 'AJP', id: '124011140003941-ipm', locName:'Arnold Arboretum: Integrated Pest Management Office' },
			{ lib: 'AJP', id: '124011140003941-jrnl', locName:'Arnold Arboretum: Journals' },
			{ lib: 'AJP', id: '124011140003941-overs', locName:'Arnold Arboretum: Oversize' },
			{ lib: 'AJP', id: '124011140003941-plant', locName:'Arnold Arboretum: Plant Information Office' },
			{ lib: 'AJP', id: '124011140003941-prec', locName:'Arnold Arboretum: Plant Records' },
			{ lib: 'AJP', id: '124011140003941-ref', locName:'Arnold Arboretum: Reference' },
			{ lib: 'AJP', id: '124011140003941-rr', locName:'Arnold Arboretum: Reading Room' },
			{ lib: 'AJP', id: '124011140003941-rra', locName:'Arnold Arboretum: Reading Room Aeon' },
			{ lib: 'AJP', id: '124011140003941-vcenter', locName:'Arnold Arboretum: Visitor Center' },
			{ lib: 'AJP', id: '124011140003941-weld', locName:'Arnold Arboretum: Botany Arboretum Weld Hill' },
			{ lib: 'AJP', id: '124011140003941-wgh', locName:'Arnold Arboretum: Weld Hill Greenhouse' },
			{ lib: 'HUA', id: '124017720003941-gen', locName:'Harvard University Archives: GEN' },
			{ lib: 'HUA', id: '124017720003941-hd', locName:'Harvard University Archives: Offsite Storage (HD)' },
			{ lib: 'HUA', id: '124017720003941-net', locName:'Harvard University Archives: Offline Digital' },
			{ lib: 'HUA', id: '124017720003941-refde', locName:'Harvard University Archives: Reference Desk' },
			{ lib: 'HUA', id: '124017720003941-rr', locName:'Harvard University Archives: Reading Room' },
			{ lib: 'HUA', id: '124017720003941-vault', locName:'Harvard University Archives: Vault' }
		];

		 var serviceLoc = {
            getliblocs: getliblocs
        	};

        return serviceLoc;

	   function getliblocs() {
            return liblocs;
        }

	}

})();