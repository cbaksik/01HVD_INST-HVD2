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
			{ sourceKey: 'creationdate', targetKey: 'Creation date' },
			{ sourceKey: 'edition', targetKey: 'Edition' },
			{ sourceKey: 'description', targetKey: 'Summary' },
			{ sourceKey: 'format', targetKey: 'Description' },
			{ sourceKey: 'lds13', targetKey: 'Notes' },
			{ sourceKey: 'subject', targetKey: 'Subject' },
			{ sourceKey: 'lds31', targetKey: 'Place' },
			{ sourceKey: 'lds23', targetKey: 'Culture' },
			{ sourceKey: 'lds22', targetKey: 'Style' },
			{ sourceKey: 'genre', targetKey: 'Form / genre' },
			{ sourceKey: 'identifier', targetKey: 'Identifier' },
			{ sourceKey: 'lds44', targetKey: 'Associated name' },
			{ sourceKey: 'lds24', targetKey: 'Related work' },
			{ sourceKey: 'lds25', targetKey: 'Related information' },
			{ sourceKey: 'lds27', targetKey: 'Restrictions' },
			{ sourceKey: 'rights', targetKey: 'Copyright' },
			{ sourceKey: 'lds15', targetKey: 'Rights' },
			{ sourceKey: 'lds26', targetKey: 'Repository' },
			{ sourceKey: 'lds01', targetKey: 'HOLLIS number' }
    ])
    	// component level data from lds65
	//              NOTE
	// there are 2-levels - component and component flat (was surrogate in old via)
	// not mapped below but in use: 
	// u - image href
	// x - restriction flag
	// y - caption or thumbnail
    .constant('keyOrderMap', [
			{ oldKey: 'L', newKey: 'Title' },
			{ oldKey: '2', newKey: 'Creator' },
			{ oldKey: '4', newKey: 'Date' },
			{ oldKey: '9', newKey: 'Summary' },
			{ oldKey: '5', newKey: 'Description' },
			{ oldKey: 'E', newKey: 'Notes' },
			{ oldKey: 'B', newKey: 'Subject' },
			{ oldKey: 'P', newKey: 'Place' },
			{ oldKey: '3', newKey: 'Culture' },
			{ oldKey: 'M', newKey: 'Style' },
			{ oldKey: 'F', newKey: 'Form / genre' },
			{ oldKey: 'I', newKey: 'Classification' },
			{ oldKey: '0', newKey: 'Associated name' },
			{ oldKey: '7', newKey: 'Related work' },
			{ oldKey: '6', newKey: 'Related information' },
			{ oldKey: 'J', newKey: 'Use restrictions' },
			{ oldKey: '1', newKey: 'Copyright' },
			{ oldKey: 'Q', newKey: 'Rights' },
			{ oldKey: '8', newKey: 'Repository' },

			{ oldKey: 'T', newKey: 'Image title' },
			{ oldKey: 'A', newKey: 'Image creator' },
			{ oldKey: 'D', newKey: 'Image date' },
			{ oldKey: 'Z', newKey: 'Image description' },
			{ oldKey: 'S', newKey: 'Image subject' },
			{ oldKey: 'G', newKey: 'Image form' },
			{ oldKey: 'H', newKey: 'Image classification' },	
			{ oldKey: 'N', newKey: 'Image associated name' },		
			{ oldKey: 'K', newKey: 'Image use restrictions' },
			{ oldKey: 'C', newKey: 'Image copyright' },
			{ oldKey: 'R', newKey: 'Harvard repository' },
			{ oldKey: 'W', newKey: 'Image ID' }
    ]);
})();