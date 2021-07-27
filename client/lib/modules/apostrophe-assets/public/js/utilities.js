var currentTextSize = 18;

//Reset Two-Way-Model Values 
function resetValues(currentForm, context, formObj) {
    var allForms = Array.from(document.forms);
    var formIndex = allForms.indexOf(currentForm);
    for (var i = 0; i < allForms.length; i++) {
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

//Common Function to entering manual address
function manualAddressLogic(context, object, arr, modal, isOrganization, role) {
    var postCodeRegex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
    if (!context.isAddressFormParentSubmitted) {
        context.isAddressFormParentSubmitted = true;
    }
    context['isAddressFormSubmitted'] = true;
    var addressForm = context[object];
    if (isOrganization) {
        if (addressForm.school && addressForm.addressLine1 && addressForm.city && addressForm.addressLine1 && addressForm.postCode && postCodeRegex.test(addressForm.postCode)) {
            if (addressForm.mode === 'update') {
                context[arr] = [];
                delete addressForm.mode;
                context[arr].push(addressForm);
                if (role == 'child') {
                    context.isAddressFormSubmitted = false;
                }
                if (role == 'parent') {
                    context.isAddressFormParentSubmitted = false;
                }
            } else {
                addressForm.id = uuidV4();
                addressForm.mode = 'add';
                context[arr].push(addressForm);
                if (role == 'child') {
                    context.isAddressFormSubmitted = false;
                }
                if (role == 'parent') {
                    context.isAddressFormParentSubmitted = false;
                }
            }
            $('#' + modal).modal('hide');

        } else {
            return;
        }
    } else {
        if (addressForm.addressLine1 && addressForm.city && addressForm.addressLine1 && addressForm.postCode && postCodeRegex.test(addressForm.postCode)) {
            if (addressForm.mode === 'update') {
                context[arr] = [];
                delete addressForm.mode;
                context[arr].push(addressForm);
                if (role == 'child') {
                    context.isAddressFormSubmitted = false;
                }
                if (role == 'parent') {
                    context.isAddressFormParentSubmitted = false;
                }
            } else {
                addressForm.id = uuidV4();
                addressForm.mode = 'add';
                context[arr].push(addressForm);
                if (role == 'child') {
                    context.isAddressFormSubmitted = false;
                }
                if (role == 'parent') {
                    context.isAddressFormParentSubmitted = false;
                }
            }
            $('#' + modal).modal('hide');
            //context.resetModalValues();

        } else {
            return;
        }
    }
};

//Patching the manual address logic
function patchManualAddress(context, object, address, arr) {
    context[arr] = [];
    var addressForm = context[object];
    if (address.school) {
        addressForm.school = address.school;
    }
    addressForm.addressLine1 = address.addressLine1;
    addressForm.addressLine2 = address.addressLine2;
    addressForm.city = address.city;
    addressForm.country = address.country;
    addressForm.postCode = address.postCode;
    addressForm.id = address.id;
    addressForm.mode = 'update';
    context[arr].push(addressForm);
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

//Common Delete Logic for manual address
function deleteLogicManualAddress(arr, value, context, section, textId, inputId) {
    var index;
    arr.some(function (e, i) {
        if (e.id == value.id) {
            index = i;
            return true;
        }
    });
    context[section].splice(index, 1);
    document.getElementById(textId).style.pointerEvents = "auto";
    document.getElementById(textId).style.opacity = 1;
    document.getElementById(inputId).style.pointerEvents = "auto";
    document.getElementById(inputId).style.opacity = 1;
};

//Common Function to convert an array to an object
function convertArrayToObj(arr) {
    var obj = arr.reduce(function (acc, cur, i) {
        acc[i] = cur;
        return acc;
    }, {});
    return obj['0'];
};

//function toCSV(obj, separator) {
function dynamicSeparator(obj, separator, isOrganization) {
    var arr = [];
    var temp2 = Object.keys(obj).sort();

    for (var i = 0; i < temp2.length; i++) {
        if (obj[temp2[i]].length) {
            arr.push(obj[temp2[i]]);
        }
    }

    if (isOrganization) {
        if (arr.indexOf(obj['school']) != -1) {
            var index = arr.indexOf(obj['school']);
            arr.splice(index, 1);
            arr.unshift(obj['school']);
        }

    }

    return arr.join(separator || ",");
}

//Common Modal for API error messages
function showError(content, statusCode) {
    if (!content) {
        content = "Something went wrong.Please try again"
    }
    $('#errorContent').text(content);
    if (statusCode) {
        $('#74dae8ad-4a79-4a60-845b-603e8a643ceb').text(statusCode);
    }
    $('#errorCommon').modal('show');
};

function closeError() {
    var statusCode = $('#74dae8ad-4a79-4a60-845b-603e8a643ceb').text();
    $('#errorCommon').modal('hide');
    if (statusCode && statusCode == '401') {
        location.href = "/users/login";
    }
}

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
            console.log(error)
            $('#loader').removeClass('d-block').addClass('d-none');
            if (endPoint == '/resetEmail') {
                return;
            } else {
                if (error) {
                    showError(error.responseJSON.message, error.status);
                }
            }
        }
    });
    return response;
};

//Common API Call for Get Function
function apiCallGet(reqType, endPoint, API_URI) {
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
            $('#loader').hide();
            $('#piecesLoader').hide();
            if (error) {
                showError(error.responseJSON.message, error.status);
            }
            // showError(error.responseJSON.message, error.status);
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
                if (error) {
                    showError(error.responseJSON.message, error.status);
                }
            }
        });
    return response
};

//Determine the mobile operating system.
// This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

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
    if (!localStorage.getItem('voiceOver')) {
        localStorage.setItem('voiceOver', 'off');
    }
}

//common function to make first letter capital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//for make referral 1 to 5 section
function redirectUrl(currentPge, nextPge, usrId, roles) {
    var decryptedUrl;
    var gotopage;
    var getParamsRedirect
    var getParams = currentPge.substring(currentPge.indexOf("?") + 1);
    var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
    if (base64Matcher.test(getParams)) {
        const deCodeParameter = atob(getParams);
        var decodeValues = deCodeParameter.split("&");
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
    var decryptedUrl;
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
            // var setLineHeight = Number(fontsize + inc) + 4;
            // $('p,h1,h2,h3,h4,h5').css('line-height', setLineHeight + 'px');
        });
        currentTextSize = textSize;
    }
}

function setTheme() {
    var logoElem = document.getElementById('logoBgHome');
    var placeholderImg = document.getElementsByClassName('toggle-img-placehold');
    var theme = localStorage.getItem('theme');
    if (theme == 'light') {
        $('body').removeClass().addClass('net off').addClass('body-bg');
        if (logoElem) {
            logoElem.src = "/modules/my-apostrophe-assets/img/liverpool.svg";
            placeholderImg.src = "/modules/my-apostrophe-assets/img/placeholder.svg";
        }
        localStorage.setItem('theme', 'light');
    } else if (theme == 'dark') {
        if (logoElem) {
            logoElem.src = "/modules/my-apostrophe-assets/img/liverpool_dark.svg";
            placeholderImg.src = "/modules/my-apostrophe-assets/img/placeholder_white.svg";
        }
        $('body').removeClass().addClass('net on').addClass('body-bg');
        localStorage.setItem('theme', 'dark');
    }
}

$(document).ready(function () {
    setLoaderStyle();
    setTextSize();
    setTheme();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' });
        $('[data-toggle="popover"]').popover(
            {
                container: 'body',
                boundary: 'window'
            }
        );
        if (document.getElementById('capabilitiesDropdown')) {
            $('#capabilitiesDropdown').multiselect({
                includeSelectAllOption: false,
            });
        }
        if (document.getElementById('designedForDropdown')) {
            $('#designedForDropdown').multiselect({
                includeSelectAllOption: false,
            });
        }
        if (document.getElementById('costDropdown')) {
            $('#costDropdown').multiselect({
                includeSelectAllOption: false,
            });
        }
        // searchable dropdown for  orcha page
        if (document.getElementById('category_list')) {
            $('#category_list').multiselect({
                includeSelectAllOption: false,
                multiple: false,
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true
            });
        }

        if (document.getElementById('countrySelect')) {
            $('#countrySelect').multiselect({
                includeSelectAllOption: false,
                multiple: false,
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true
            });
        }
    });
    //Setting First Letter capitalize;
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
})

//window resize function
window.onresize = resize;

function resize() {
    var header = document.getElementById("heightTopSet");
    var middleContent = document.getElementById("middleCont");
    if (middleContent) {
        if (header) {
            middleContent.style.paddingTop = header.offsetHeight + 'px';
            // middleContent.style.paddingTop = middleContent.offsetHeight + 'px';
        }
    }
}
function openSideDrawer() {
    document.getElementById("side-drawer").style.left = "0";
    document.getElementById("side-drawer-void").classList.add("d-block");
    document.getElementById("side-drawer-void").classList.remove("d-none");
    if(window.innerWidth < 768){
    document.body.classList.toggle('lock-scroll');
    }
}

function closeSideDrawer() {
    document.getElementById("side-drawer").style.left = "-336px";
    document.getElementById("side-drawer-void").classList.add("d-none");
    document.getElementById("side-drawer-void").classList.remove("d-block");
    if(window.innerWidth < 768){
    document.body.classList.toggle('lock-scroll');
    }
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
        cache: false,
        contentType: 'application/json',
        success: function (res) {
            $('#logoutModal').modal('hide');
            if (localStorage.getItem("role") !== null) {
                localStorage.removeItem("role");
            }
            location.href = window.location.origin + '/users/login';
        },
        error: function (error) {
            if (error.status == 401) {
                location.href = window.location.origin + '/users/login';
            } else {
                $('#loader').hide();
                console.log(error.responseJSON.message);
            }
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

window.onscroll = function () { hideGoogleMapZIndex() };

function hideGoogleMapZIndex() {
    $(".pac-container").css({ "display": "none" });
}

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

function openApps() {
    localStorage.removeItem("orFilData");
    location.href = window.location.origin + '/apps';
}