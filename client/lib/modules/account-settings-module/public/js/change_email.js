var API_URI = "/modules/account-settings-module";
$(document).ready(function () {
    if (false || !!document.documentMode) {
        // 
    }
    else {
        // Vue.use(VueToast);
    }
    new Vue({
        el: '#changeEmail',

        data: {
            changeEmailData: {
                // oldEmail: "",
                newEmail: "",
            },
            isFormSubmitted: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            setTimeout(function () {
                _self.resetForm();
                $('#loader').hide();
            }, 700);
        },

        methods: {

            changeEmail: function () {
                var formData = this.changeEmailData;
                this.isFormSubmitted = true;
                if (formData.newEmail && this.emailRegex.test(formData.newEmail)) {
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/changeEmail', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        if (false || !!document.documentMode) {
                            alert(successData.message);
                        } else {
                            alert(successData.message);

                            // Vue.$toast.success('Mail successfully sent!', {
                            //     position: 'top',
                            //     duration: 1000,
                            //     onDismiss: function () {
                            //     }
                            // });
                        }

                    } else {
                        $('#loader').hide();
                    }
                } else {
                    return false;
                }
            },

            // navigatePage: function (route) {
            //     window.location.href = window.location.origin + route;
            // },

            resetForm: function () {
                this.isFormSubmitted = false;
                // this.changeEmailData.oldEmail = '';
                this.changeEmailData.newEmail = '';
            }

        }
    })

});