
//Reset Two-Way-Model Values 
function resetValues(currentForm, context, formObj) {
    var allForms = Array.from(document.forms);
    var formIndex = allForms.indexOf(currentForm);
    for (let i = 0; i < allForms.length; i++) {
        var attributeValue = $(allForms[i]).data('options');
        if (formIndex < i) {
            context[formObj][attributeValue] = '';
        }
        if (context.currentSection == 'referral') {
            if (formIndex <= i) {
                context.clearDependentValues(attributeValue);
            }
        }
    }
    if (context.currentSection == 'referral') {
        context.showAddOtherService = false;
        context.allAvailableService = [];
        context.storeDeleteData = null;
    }
    context.isFormSubmitted = false;
};


//Common Delete Logic for Service and HouseHold Modal
function deleteLogic(arr, value, context, section) {
    var index;
    arr.some(function (e, i) {
        if (e.id == value.id) {
            index = i;
            return true;
        }
    });
    context[section].splice(index, 1);
};

//Back tp previous page navigation
function backToPreviousPage(section, userId, userRole) {
    // var uuid = this.getQueryStringValue('userid');
    // var role = this.getQueryStringValue('role');
    var parameter = userId + "&" + userRole + "&" + "edit"
    // console.log(parameter)
    var enCodeParameter = btoa(parameter)
    //console.log(section + enCodeParameter)
    location.href = section + enCodeParameter
};


//Scroll to top for an Invalid Inputs
function scrollToInvalidInput() {
    var headerHeight = document.querySelector('.headerTop').clientHeight;
    var errorElements = $('.invalid-fields');
    errorElements[0].parentElement.scrollIntoView(true, { behavior: "smooth", });
    var scrolledY = window.scrollY;
    if (scrolledY) {
        window.scroll(0, scrolledY - headerHeight);
    }
    // errorElements[0].scrollIntoView(true, { behavior: 'smooth' })
    // setTimeout(function () {
    //     window.scroll({
    //         top: errorElements[0].offsetTop - headerHeight,
    //         left: 0,
    //         behavior: "smooth"
    //     });
    // }, 200)

};

function getTopOffset(controlEl) {
    var labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
};

//Random UUID Generator
function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


// Get Query Params value use case 1
function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
};

//Get Query Params value use case 2
function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        });
    return vars;
};

//Commom API Call for post Function
function apiCallPost(reqType, endPoint, payload) {
    var response;
    $.ajax({
        url: API_URI + endPoint,
        type: reqType,
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(payload),
        success: function (res) {
            response = res;
        },
        error: function (error) {
            console.log(error.responseJSON.message)
        }
    });
    return response
};

//Commom API Call for post Function
function apiCallGet(reqType, endPoint) {
    var response;
    $.ajax({
        url: API_URI + endPoint,
        type: reqType,
        dataType: 'json',
        async: false,
        contentType: 'application/json',
        success: function (res) {
            response = res;
        },
        error: function (error) {
            console.log(error.responseJSON.message)
        }
    });
    return response
};

//Commom API Call for put Function
function apiCallPut(reqType, endPoint, payload) {
    var response;
    $.ajax({
        url: API_URI + endPoint,
        type: reqType,
        dataType: 'json',
        async: false,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
            response = res;
        },
        error: function (error) {
            console.log(error.responseJSON.message)
        }
    });
    return response
};
//get URL parameter

function getParameter(url) {
    var allParameter = url.substring(url.indexOf("?") + 1);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    console.log(allParameter)
    if (base64Matcher.test(allParameter)) {
        var deCodeParameter = atob(allParameter)
        var decodeValues = deCodeParameter.split("&");
        return decodeValues;
    } else {
        // It's definitely not base64 encoded.
    }
    //  console.log(decodeURIComponent(allParameter));

}

function getAllSectionData(userid, role) {
    var response;
    $.ajax({
        url: API_URI + "/fetchReview/" + userid + "&role=" + role,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        // data: JSON.stringify(payloadData),
        success: function (data) {
            console.log(data)
            response = data;
            //response = data;
        },
        error: function (error) {
            console.log('Something went Wrong', error)
        }
    });
    return response;
}

function convertDate(dbDate) {
    var date = new Date(dbDate)
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}
function setLoaderStyle() {
    var element = document.body;
    element.classList.add('body-bg');
}

function redirectUrl(currentPge, nextPge, usrId, roles) {
    let decryptedUrl;
    var gotopage;
    var getParamsRedirect
    var getParams = currentPge.substring(currentPge.indexOf("?") + 1);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    if (base64Matcher.test(getParams)) {
        const deCodeParameter = atob(getParams);
        let decodeValues = deCodeParameter.split("&");
        if (decodeValues[2] == "sec5back" && nextPge != "acknowledge") {
            getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&sec5back";
            decryptedUrl = btoa(getParamsRedirect);
            gotopage = "/review?" + decryptedUrl;
        }
        else {
            getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
            decryptedUrl = btoa(getParamsRedirect);
            gotopage = "/" + nextPge + "?" + decryptedUrl;

        }
    } else {
        getParamsRedirect = usrId + "&" + roles;
        decryptedUrl = btoa(getParamsRedirect);
        gotopage = "/" + nextPge + "?" + decryptedUrl;
    }
    return gotopage;
}

$(document).ready(function () {
    setLoaderStyle();
})

//window resize function
window.onresize = resize;

function resize() {
    var middleContent = document.getElementById("middleCont");
    if (middleContent) {
        middleContent.style.paddingTop = `${document.querySelector('#heightTopSet').offsetHeight}px`;
        // middleContent.style.paddingTop = middleContent.offsetHeight + 'px';

    }
}
function openSideDrawer() {
    document.getElementById("side-drawer").style.left = "0";
    document.getElementById("side-drawer-void").classList.add("d-block");
    document.getElementById("side-drawer-void").classList.remove("d-none");
}

function closeSideDrawer() {
    document.getElementById("side-drawer").style.left = "-336px";
    document.getElementById("side-drawer-void").classList.add("d-none");
    document.getElementById("side-drawer-void").classList.remove("d-block");
}
window.onload = (event) => {
    if (document.getElementById('heightTopSet') && document.getElementById("middleCont")) {
        document.getElementById("middleCont").style.paddingTop = `${document.querySelector('#heightTopSet').offsetHeight}px`;
    }
}