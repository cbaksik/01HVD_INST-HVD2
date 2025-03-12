/**
 * Created by samsan on 7/18/17.
 * This is a service component and use to store data, get data, ajax call, compare any logic.
 */

angular.module('viewCustom')
    .service('customService',['$http','$sce','$window',function ($http, $sce,$window) {
        var serviceObj={};



        serviceObj.getAjax=function (url,param,methodType) {
            return $http({
                'method':methodType,
                'url':url,
                'params':param
            })
        };

        serviceObj.postAjax=function (url,jsonObj) {
            // pass primo token to header with value call token
            $http.defaults.headers.common.token=jsonObj.token;
            return $http({
                'method':'post',
                'url':url,
                'data':jsonObj
            })
        };



        // action list selected
        serviceObj.actionName='none';
        serviceObj.setActionName=function (actionName) {
            serviceObj.actionName=actionName;
        };
        serviceObj.getActionName=function () {
            return serviceObj.actionName;
        };

        // setter and getter
        serviceObj.items={};
        serviceObj.setItems=function (data) {
            serviceObj.items=data;
        };
        serviceObj.getItems=function () {
            return serviceObj.items;
        };

        // replace & . It cause error in firefox;
        serviceObj.removeInvalidString=function (str) {
            var pattern = /[\&]/g;
            return str.replace(pattern, '&amp;');
        };


        return serviceObj;
    }]);
