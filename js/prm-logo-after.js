/**
 * Created by samsan on 8/9/17.
 * It remove old logo and replace it with new logo
 */

angular.module('viewCustom')
    .controller('prmLogoAfterCtrl',['$scope', '$compile', '$sce',function ($scope, $compile, $sce) {
        var vm=this;

    }]);

angular.module('viewCustom')
    .component('prmLogoAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmLogoAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/discovery/custom/01HVD_INST-HVD2/html/prm-logo-after.html'
    });
