// component-image-key-value-pairs.js for rendering VIA components
(function () {
  'use strict';

  angular.module('viewCustom')
	// work level data
    .constant('mainInfoMapping', [
			{ sourceKey: 'title', targetKey: 'Title' },
			{ sourceKey: 'lds14', targetKey: 'Attribution' },
			{ sourceKey: 'creator', targetKey: 'Creator' },
			{ sourceKey: 'addtitle', targetKey: 'Variant title' },
			{ sourceKey: 'edition', targetKey: 'Edition' },
			{ sourceKey: 'lds07', targetKey: 'Produced' },
			{ sourceKey: 'format', targetKey: 'Description' },
			{ sourceKey: 'description', targetKey: 'Summary' },
			{ sourceKey: 'lds13', targetKey: 'Notes' },
			{ sourceKey: 'subject', targetKey: 'Subject' },
			{ sourceKey: 'lds22', targetKey: 'Style' },
			{ sourceKey: 'genre', targetKey: 'Form / genre' },
			{ sourceKey: 'lds23', targetKey: 'Culture' },
			{ sourceKey: 'lds31', targetKey: 'Place' },
			{ sourceKey: 'identifier', targetKey: 'Identifier' },
			{ sourceKey: 'lds24', targetKey: 'Related work' },
			{ sourceKey: 'lds25', targetKey: 'Related information' },
			{ sourceKey: 'lds44', targetKey: 'Associated name' },
			{ sourceKey: 'lds27', targetKey: 'Restrictions' },
			{ sourceKey: 'lds15', targetKey: 'Rights' },
			{ sourceKey: 'lds26', targetKey: 'Repository' },
			{ sourceKey: 'creationdate', targetKey: 'Creation date' },
			{ sourceKey: 'lds01', targetKey: 'HOLLIS number' },
			{ sourceKey: 'lds64', targetKey: 'Image detail' }
    ])
    	// component level data from lds65
	//              NOTE
	// there are 2-levels - component and component flat (was surrogate in old via)
	// not mapped below but in use: 
	// u - image href
	// x - restriction flag
	// y - caption or thumbnail
	// this are avail if needed: o e l
    .constant('keyOrderMap', [
			{ oldKey: '9', newKey: 'Title' },
			{ oldKey: '2', newKey: 'Creator' },
			{ oldKey: '5', newKey: 'Description' },
			{ oldKey: 'B', newKey: 'Subject' },
			{ oldKey: '3', newKey: 'Culture' },
			{ oldKey: 'M', newKey: 'Style' },
			{ oldKey: 'F', newKey: 'Form / genre' },
			{ oldKey: 'P', newKey: 'Place' },
			{ oldKey: '7', newKey: 'Related work' },
			{ oldKey: '6', newKey: 'Related information' },
			{ oldKey: 'I', newKey: 'Classification' },
			{ oldKey: '0', newKey: 'Associated name' },
			{ oldKey: 'J', newKey: 'Use restrictions' },
			{ oldKey: '1', newKey: 'Copyright' },
			{ oldKey: 'Q', newKey: 'Rights' },
			{ oldKey: '4', newKey: 'Date' },
			{ oldKey: '8', newKey: 'Repository' },
			{ oldKey: 'W', newKey: 'ID' },

			{ oldKey: 'T', newKey: 'Title' },
			{ oldKey: 'A', newKey: 'Creator' },
			{ oldKey: 'Z', newKey: 'Description' },
			{ oldKey: 'S', newKey: 'Subject' },
			{ oldKey: 'G', newKey: 'Form / genre' },
			{ oldKey: 'H', newKey: 'Classification' },	
			{ oldKey: 'N', newKey: 'Associated name' },		
			{ oldKey: 'K', newKey: 'Use restrictions' },
			{ oldKey: 'C', newKey: 'Copyright' },
			{ oldKey: 'D', newKey: 'Date' },
			{ oldKey: 'R', newKey: 'Repository' }
    ]);
})();