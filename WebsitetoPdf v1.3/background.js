
var pdfCrowdUrl = 'https://pdfcrowd.com';
var PDFapiUrl = {
    1: pdfCrowdUrl + '/session/json/convert/uri/',
    2: pdfCrowdUrl + '/session/json/convert/uri/v2/'
};
var apiVersionUrl = pdfCrowdUrl + '/session/api-version/';

function onDataReady(XMLrequest, callbacks) {
    return function(data) {
        if (XMLrequest.readyState == 4) {
            if (XMLrequest.status == 200) {
                if (callbacks.onSuccess) {
                        var data = JSON.parse(XMLrequest.responseText);
                        callbacks.onSuccess(data);
                        //window.alert("success");
                }
            } else {
                if (callbacks.onError)
                    callbacks.onError(XMLrequest.responseText)
            }
            if (callbacks.onComplete)
                callbacks.onComplete();
        }
    };
}



chrome.browserAction.onClicked.addListener(function (tab) {

    var XMLrequest = new XMLHttpRequest();
    XMLrequest.onreadystatechange = onDataReady(XMLrequest, {
        onSuccess: function(data) {
            var apiUrl = PDFapiUrl[data.api_version];
            chrome.windows.create({
                url: "https://www.google.com/search?q=success",
                type: "popup",
                width: 1000,
                height: 500
            });
            if (apiUrl === undefined) {
                apiUrl = PDFapiUrl[2];

            }
        },
        onError: function(responseText) {
            showError("Fail connect to Pdfcrowd");
        },
    });

    XMLrequest.open('GET', apiVersionUrl, true);
    XMLrequest.send(null);
});
