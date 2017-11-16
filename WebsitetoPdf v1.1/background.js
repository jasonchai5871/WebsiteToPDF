
var pdfCrowdUrl = 'https://pdfcrowd.com';
var PDFapiUrl = {
    1: pdfCrowdUrl + '/session/json/convert/uri/',
    2: pdfCrowdUrl + '/session/json/convert/uri/v2/'
};
var apiVersionUrl = pdfCrowdUrl + '/session/api-version/';

function onDataReady(XMLrequest, callbacks) {
    return function (data) {

        var data = JSON.parse(XMLrequest.responseText);

        if (callbacks.onComplete)
            callbacks.onComplete();
    }
}


chrome.browserAction.onClicked.addListener(function (tab) {

    var XMLrequest = new XMLHttpRequest();
    XMLrequest.onreadystatechange = onDataReady(XMLrequest);

    XMLrequest.open('GET', apiVersionUrl, true);
    XMLrequest.send(null);
});

