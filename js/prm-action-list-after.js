/**
 * Created by samsan on 8/15/17.
 * This component will insert textsms and its icon into the action list
 */


angular.module('viewCustom')
    .controller('prmActionListAfterCtrl',['$element','$compile','$scope','$timeout','customService',function ($element,$compile,$scope,$timeout, customService) {
        var vm=this;
        var cisv=customService;
        var url='https://harvard-lts.libanswers.com/form?queue_id=5895&';
        var currentURL = "https://hollis.harvard.edu/discovery/fulldisplay?docid="; 
        var currentURLtail = "&vid=01HVD_INST-HVD2&search_scope=default_scope&tab=default_tab&lang=en_US";    
        vm.$onInit=function () {


                    // report a problem
                    
                    // console.log(vm.parentCtrl);
                    // console.log('******************************** prm-action-list-after.js');
                    // console.log(vm.parentCtrl.actionLabelNamesMap);
                    // console.log(Object.keys(vm.parentCtrl.actionLabelNamesMap).length);
                    vm.parentCtrl.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
                    vm.parentCtrl.actionIconNamesMap["report_a_problem"] = "report_a_problem";
                    vm.parentCtrl.actionIcons["report_a_problem"] = {
                        icon: "ic_report_problem_24px",
                        iconSet: "action",
                        type: "svg"
                      };
                      if (!vm.parentCtrl.actionListService.actionsToIndex["report_a_problem"]) {
                        vm.parentCtrl.actionListService.requiredActionsList.push("report_a_problem");
                        vm.parentCtrl.actionListService.actionsToDisplay.push("report_a_problem");
                        vm.parentCtrl.actionListService.actionsToIndex["report_a_problem"] = 9;
                      } 
                      
                      //console.log(window.location.href);
                      // start to construct user's present url
                      // var primoContext = '&context=' + vm.parentCtrl.item.context[0];
                      // if (vm.parentCtrl.item.context[0] === 'P') {
                      //   primoContext = '&context=PC';
                      // }
                      // var nativePerma = vm.parentCtrl.item.pnx.control.recordid[0];    
                      // if (nativePerma.includes("dedup")) {                        
                      //   nativePerma = vm.parentCtrl.item.pnx.control.sourceid[0].substring(16);
                      // }                      
                      // url+='referrer='+currentURL+nativePerma+currentURLtail+primoContext;  
                      // finish construct user's present url
                      url+='referrer='+window.location.href;
                      if (vm.parentCtrl.actionListService.onToggle) {
                        vm.parentCtrl.actionListService.onToggle["report_a_problem"] = function () {
                          window.open(url, '_blank');
                        };
                      }
                      if (vm.parentCtrl.onToggle) {
                        vm.parentCtrl.onToggle["report_a_problem"] = function () {
                          window.open(url, '_blank');
                        };
                      }
        
                    // end report a problem                


        };


    }]);

angular.module('viewCustom')
    .component('prmActionListAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmActionListAfterCtrl',
        controllerAs:'vm'
    });

