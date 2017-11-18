
var logo;
var logoContext;
var image;
var logoanimation = new Animation();
var pdfCrowdUrl = 'https://pdfcrowd.com';
var PDFapiUrl = {
    1: pdfCrowdUrl + '/session/json/convert/uri/',
    2: pdfCrowdUrl + '/session/json/convert/uri/v2/'
};

var apiVersionUrl = pdfCrowdUrl + '/session/api-version/';


function Animation() {
    this.imgRefreshTimer_ = 0;
    this.imgMovePosition_ = 0;
}


Animation.prototype.paintFrame = function() {
    logoContext.save();

    
    var h = logo.height - 6;
    var w = logo.width - this.imgMovePosition_;

    logoContext.drawImage(image, 0, 0);
    logoContext.drawImage(image, 0, 3, w, h, this.imgMovePosition_, 3, w, h);
    
    if (this.imgMovePosition_) {
        logoContext.drawImage(
            image, 0, 3, logo.width, h, -logo.width + this.imgMovePosition_, 3, logo.width, h);
    }
      
    logoContext.restore();
    
    chrome.browserAction.setIcon({imageData: logoContext.getImageData(0, 0, logo.width, logo.height)});
    this.imgMovePosition_ += 1;
    
    if (this.imgMovePosition_ >= logo.width)
        this.imgMovePosition_ = 0;
}


Animation.prototype.start = function() {
    if (this.imgRefreshTimer_)
        return;
    
    var self = this;
    this.imgRefreshTimer_ = window.setInterval(function () {
        self.paintFrame();
    }, 10);
}


Animation.prototype.stop = function() {
    if (!this.imgRefreshTimer_)
        return;
    window.clearInterval(this.imgRefreshTimer_);
    this.imgRefreshTimer_ = 0;
    this.imgMovePosition_ = 0;
    showStaticIcon();
}


function showStaticIcon() {
    if (logoanimation.imgRefreshTimer_ != 0) return;
    logoContext.drawImage(image, 0, 0);
    drawLoggedIn();
    chrome.browserAction.setIcon({imageData: logoContext.getImageData(0, 0, logo.width, logo.height)});
}


function drawLoggedIn() {

    logoContext.save();
    logoContext.fillStyle = "green";
    logoContext.arc(15, 4, 4, 0, 2*Math.PI);
    logoContext.fill();
    logoContext.restore();
}



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
	            alert("Convert Fail!");
            } else if (data.status === 'redirect') {
                alert("Convert Fail!");
            }

        },
       
        onError: function(responseText) {
            alert("Convert Fail!");
        },

        onComplete: function() { 
            logoanimation.stop(); 
        }
    });

    XMLrequest.open('POST', apiUrl, true);
    XMLrequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    XMLrequest.send("src=" + escape(tab.url));
};


function init() {

    image = document.getElementById("standard_icon")
    logo = document.getElementById("canvas");
    logoContext = logo.getContext("2d");

}


chrome.browserAction.onClicked.addListener(function (tab) {

    logoanimation.start();

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
            animation.stop();
        },
    });
    XMLrequest.open('GET', apiVersionUrl, true);
    XMLrequest.send(null);
});

init();
