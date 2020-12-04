
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
        context.deleteData = null;
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
    var errorElements = $('.invalid-fields');
    window.scroll({
        top: this.getTopOffset(errorElements[0].parentElement.parentElement),
        left: 0,
        behavior: "smooth"
    });
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
            console.log('Something went Wrong', error)
        }
    });
    return response
};

//Commom API Call for post Function
function apiCallGet(reqType, endPoint, params) {
    var response;
    $.ajax({
        url: API_URI + endPoint,
        type: reqType,
        async: false,
        data: params,
        success: function (res) {
            response = res;
        },
        error: function (error) {
            console.log('Something went Wrong', error)
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
    var element = document.getElementsByClassName('apos-refreshable');
    element[0].classList.add('position-relative')
}

$(document).ready(function () {
    setLoaderStyle();
})
