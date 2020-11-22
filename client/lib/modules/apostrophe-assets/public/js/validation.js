function commonValidationOnValueEnter(e, type, context) {
    debugger;
    var phoneRegex = /^[0-9,-]{10,15}$|^$/;
    var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
    if (type === 'name') {
        if (e.target.value.length === 0) {
            context.hasNameReqError = true;
        } else {
            if (!nameRegex.test(e.target.value)) {
                context.hasNameInvalidError = true;
            } else {
                context.hasNameInvalidError = false;
            }
            context.hasNameReqError = false;
        }

    } else if (type === 'contact') {
        if (e.target.value.length === 0) {
            context.hasContactReqError = true;
            context.hasContactInvalidError = false;
        } else {
            if (!phoneRegex.test(e.target.value)) {
                context.hasContactInvalidError = true;
            } else {
                context.hasContactInvalidError = false;
            }
            context.hasContactReqError = false;
        }

    }
    else if (type === 'info') {
        if (e.target.value.length === 0) {
            context.requiredFields.hasInfoReqError = true;
        } else {
            context.requiredFields.hasInfoReqError = false;
        }

    } else if (type === 'anything') {
        if (e.target.value.length === 0) {
            context.requiredFields.hasAnythingReqError = true;
        } else {
            context.requiredFields.hasAnythingReqError = false;
        }

    } else if (type === 'triggers') {
        if (e.target.value.length === 0) {
            context.requiredFields.hasTriggersReqError = true;
        } else {
            context.requiredFields.hasTriggersReqError = false;
        }

    } else if (type === 'disabilities') {
        if (e.target.value.length === 0) {
            context.requiredFields.hasHistoryReqError = true;
        } else {
            context.requiredFields.hasHistoryReqError = false;
        }

    }
    else if (type === 'serviceName') {
        if (!e.target.value) {
            context.serviceData.hasNameReqError = true;
        } else {
            context.serviceData.hasNameReqError = false;
        }
    } else if (type === 'profName') {
        if (!e.target.value) {
            context.serviceData.hasProfReqError = true;
        } else {
            context.serviceData.hasProfReqError = false;
        }
    }
    else if (type === 'profContact') {
        if (!e.target.value) {
            context.serviceData.hasContactReqError = true;
            context.serviceData.hasContactInvalidError = false;
        } else {
            if (!phoneRegex.test(e.target.value)) {
                context.serviceData.hasContactInvalidError = true;
            } else {
                context.serviceData.hasContactInvalidError = false;
            }
            context.serviceData.hasContactReqError = false;
        }
    }
}

