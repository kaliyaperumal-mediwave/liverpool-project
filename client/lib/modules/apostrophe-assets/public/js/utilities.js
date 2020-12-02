//Reset Two-Way-Model Values 
function resetValues(currentForm, context, formObj) {
    debugger;
    console.log('this', this);
    console.log('this', context);
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
    // if (section == 'referral') {
    //     context.allAvailableService.splice(index, 1)
    // }
};

//Back tp previous page navigation
function backToPreviousPage(section) {
    var uuid = this.getQueryStringValue('userid');
    var role = this.getQueryStringValue('role');
    location.href = section + "?userid=" + uuid + "&role=" + role + "&edt=1";
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
    debugger;
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
function apiCall(reqType, endPoint, params) {
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

