var currentTextSize = 18;

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
        context.openShowMoreOrLessFlag = false;
    }
    context.isFormSubmitted = false;
};


// Prevention of entering white spaces
function preventWhiteSpaces(e, context, sectionObj, key) {
    if (e.target.value && !e.target.value.replace(/ /g, "").length) {
        context[sectionObj][key] = e.target.value.trim();
        return false;
    } else {
        return true;
    }
};

// Common function for resetting the form
function dynamicFormReset(context, object) {
    Object.keys(context[object]).map(function (k) {
        if (context[object][k] && typeof context[object][k] === 'object') {
            return dynamicFormReset(context[object][k]);
        }
        context[object][k] = '';
    });
}

//Common Function to toggle password's show,hide icon
function commonToggleVisibility(context, element, visibility) {
    context[visibility] = !context[visibility];
    if ($(element).attr("type") == "text") {
        $(element).attr('type', 'password');
    } else if ($(element).attr("type") == "password") {
        $(element).attr('type', 'text');
    }
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

//Common Modal for API error messages
function showError(content) {
    if (!content) {
        content = "Something went wrong.Please try again"
    }
    $('#errorContent').text(content);
    $('#errorCommon').modal('show');
};


//Function to Identify space Logic 2
function trimSpace(str) {
    if (str.replace(/ /g, "").length) {
        return true;
    } else {
        return false;
    }
};

//Back tp previous page navigation
function backToPreviousPage(section, userId, userRole) {
    var parameter = userId + "&" + userRole + "&" + "edit"
    var enCodeParameter = btoa(parameter)
    location.href = section + enCodeParameter
};


//Scroll to top for an Invalid Inputs
function scrollToInvalidInput() {
    var headerHeight = document.querySelector('.headerTop').clientHeight;
    var errorElements = $('.invalid-fields');
    if (Array.from(errorElements).length) {
        if (errorElements[0].parentElement) {
            errorElements[0].parentElement.scrollIntoView(true, { behavior: "smooth", });
        } else {
            errorElements[0].scrollIntoView(true, { behavior: "smooth", });
        }
        var scrolledY = window.scrollY;
        if (scrolledY) {
            window.scroll(0, scrolledY - headerHeight);
        }
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

//Common API Call for post Function
function apiCallPost(reqType, endPoint, payload) {
    var response;
    var trimmedPayload = trimObj(payload);
    $.ajax({
        url: API_URI + endPoint,
        type: reqType,
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(trimmedPayload),
        cache: false,
        success: function (res) {
            response = res;
        },
        error: function (error) {
            $('#loader').removeClass('d-block').addClass('d-none');
            if (error) {
                showError(error.responseJSON.message);
                // setTimeout(function () {
                //     $('#errorCommon').modal('hide');
                // }, 1000);
            }
        }
    });
    return response;
};

//Common API Call for post Function
function apiCallGet(reqType, endPoint, API_URI) {
    var response;
    console.log(API_URI + endPoint)
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
            $('#loader').hide();
            console.log(error.responseJSON.message)
        }
    });
    return response
};

//Common API Call for put Function
function apiCallPut(reqType, endPoint, payload) {
    var response;
    var trimmedPayload = trimObj(payload);
    payload =
        $.ajax({
            url: API_URI + endPoint,
            type: reqType,
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(trimmedPayload),
            success: function (res) {
                response = res;
            },
            error: function (error) {
                console.log(error.responseJSON.message)
            }
        });
    return response
};

//Function to trim white spaces for an object and array
function trimObj(obj) {
    if (obj === null || !Array.isArray(obj) && typeof obj != 'object') {
        return obj;
    }
    return Object.keys(obj).reduce(function (acc, key) {
        acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimObj(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}


//get URL parameter

function getParameter(url) {
    var allParameter = url.substring(url.indexOf("?") + 1);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
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
    var body = document.body;
    element[0].classList.add('body-bg');
    body.classList.add('net');
    body.classList.add('default');
}




//for make referral 1 to 5 section
function redirectUrl(currentPge, nextPge, usrId, roles) {
    let decryptedUrl;
    var gotopage;
    var getParamsRedirect
    var getParams = currentPge.substring(currentPge.indexOf("?") + 1);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    if (base64Matcher.test(getParams)) {
        const deCodeParameter = atob(getParams);
        let decodeValues = deCodeParameter.split("&");
        console.log(decodeValues[2])

        if (decodeValues[2] == "sec5back" && nextPge != "acknowledge") {
            getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&sec5back";
            decryptedUrl = btoa(getParamsRedirect);
            gotopage = "/review?" + decryptedUrl;
        }
        else if (decodeValues[2] == "backbutton") {
            getParamsRedirect = decodeValues[0] + "&" + decodeValues[1] + "&backbutton";
            decryptedUrl = btoa(getParamsRedirect);
            gotopage = "/" + nextPge + "?" + decryptedUrl;

        }
        else if (decodeValues[2] == undefined) {
            getParamsRedirect = usrId + "&" + roles;
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
//for dashboard,check referral and all static pages
function decryptUrl(nextPge, loginId, roles) {
    let decryptedUrl;
    var gotopage;
    var getParamsRedirect = loginId + "&" + roles;
    decryptedUrl = btoa(getParamsRedirect);
    gotopage = "/" + nextPge + "?" + decryptedUrl;
    return gotopage;
}

function setTextSize() {
    var textSize = localStorage.getItem('textSize');
    if (textSize && Number(textSize) >= 16) {
        var inc = Number(textSize) - Number(currentTextSize);
        $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
            var fontsize = parseInt($(this).css('font-size'));
            var newFontsize = (fontsize + inc) + 'px';
            $(this).css('font-size', newFontsize);
        });
        currentTextSize = textSize;
    }
}

$(document).ready(function () {
    setLoaderStyle();
    setTextSize();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' });
        $('[data-toggle="popover"]').popover(
            {
                container: 'body',
                boundary: 'window'
            }
        )
    })
})

//window resize function
window.onresize = resize;

function resize() {
    var header = document.getElementById("heightTopSet");
    var middleContent = document.getElementById("middleCont");
    if (middleContent) {
        if (header) {
            middleContent.style.paddingTop = header.offsetHeight + 'px';
            //middleContent.style.paddingTop = middleContent.offsetHeight + 'px';
        }
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

function logOut() {
    var API_URI = "/modules/auth-module";
    var response;
    console.log(API_URI + "/doLogout")
    $.ajax({
        url: API_URI + "/doLogout",
        type: "get",
        dataType: 'json',
        async: false,
        contentType: 'application/json',
        success: function (res) {
            $('#logoutModal').modal('hide');
            location.href = window.location.origin + '/users/login';
        },
        error: function (error) {
            $('#logoutModal').modal('hide');
            console.log(error.responseJSON.message)
        }
    });
    return response
}

window.onload = function (e) {
    if (document.getElementById('heightTopSet') && document.getElementById("middleCont")) {
        document.getElementById("middleCont").style.paddingTop = document.querySelector('#heightTopSet').offsetHeight + 'px';
    }
}


// When the user scrolls down 20px from the top of the document, show the button
//window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    //Get the button:
    var gotoTopButton = document.getElementById("myBtn");
    if (gotoTopButton) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            gotoTopButton.style.display = "block";
        } else {
            gotoTopButton.style.display = "none";
        }
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}