
var pdfCrowdUrl = 'https://pdfcrowd.com';
var PDFapiUrl = {
    1: pdfCrowdUrl + '/session/json/convert/uri/',
    2: pdfCrowdUrl + '/session/json/convert/uri/v2/'
};
var apiVersionUrl = pdfCrowdUrl + '/session/api-version/';

function onDataReady(XMLrequest, callbacks) {
    return function(data) {

            if (XMLrequest.status == 200) {
                        var data = JSON.parse(XMLrequest.responseText);
                        callbacks.onSuccess(data);

            } 
            if (callbacks.onComplete)
                callbacks.onComplete();
    };
}



chrome.browserAction.onClicked.addListener(function (tab) {

    var XMLrequest = new XMLHttpRequest();
    XMLrequest.onreadystatechange = onDataReady(XMLrequest, {
        onSuccess: function(data) {
            var apiUrl = PDFapiUrl[data.api_version];

                apiUrl = PDFapiUrl[2];


        },
        onError: function(responseText) {
            showError("Fail connect to Pdfcrowd");
        },
    });

    XMLrequest.open('GET', apiVersionUrl, true);
    XMLrequest.send(null);
});
