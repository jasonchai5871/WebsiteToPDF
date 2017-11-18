
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
                    try {
                        var data = JSON.parse(XMLrequest.responseText);
                        callbacks.onSuccess(data);
                    } catch (e) {
                        showError("Conversion failed.");
                    }
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



function convertToPDF(tab, apiUrl) {
    
    var XMLrequest = new XMLHttpRequest();
    XMLrequest.onreadystatechange = onDataReady(XMLrequest, {
        onSuccess: function(data) {
            if (data.status === 'ok') {
                chrome.tabs.update(tab.id, {url: data.url});
	        } else if (data.status === 'error') {
	
            } else if (data.status === 'redirect') {
  
        }

        },
       
        onError: function(responseText) {

        },

        onComplete: function() { 
        }
    });

    XMLrequest.open('POST', apiUrl, true);
    XMLrequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    XMLrequest.send("src=" + escape(tab.url));
};



chrome.browserAction.onClicked.addListener(function (tab) {


    var XMLrequest = new XMLHttpRequest();
    XMLrequest.onreadystatechange = onDataReady(XMLrequest, {
        onSuccess: function(data) {
            var apiUrl = PDFapiUrl[data.api_version];
            if (apiUrl === undefined) {
                apiUrl = PDFapiUrl[2];
            }

            convertToPDF(tab, apiUrl);
        },
        onError: function(responseText) {
            showError("Fail connect to Pdfcrowd");
        },
    });
    XMLrequest.open('GET', apiVersionUrl, true);
    XMLrequest.send(null);
});

