// var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#changeEmail',
        data: {
            changeEmailData: {
                oldEmail: "",
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
                if (formData.oldEmail && this.emailRegex.test(formData.oldEmail) && formData.newEmail && this.emailRegex.test(formData.newEmail)) {
                    console.log('payload', formData);
                    // $('#loader').show();
                    // var successData = apiCallPost('post', '/doLogin', formData);
                    // if (successData && Object.keys(successData)) {
                    //     $('#loader').hide();
                    //     if (false || !!document.documentMode) {
                    //         alert("Login successful.");
                    //         location.href = redirectUrl(location.href, "dashboard", successData.data.sendUserResult.loginId, successData.data.sendUserResult.role);
                    //     } else {
                    //         Vue.$toast.success('Login successful.', {
                    //             position: 'top',
                    //             duration: 1000,
                    //             onDismiss: function () {
                    //                 location.href = redirectUrl(location.href, "dashboard", successData.data.sendUserResult.loginId, successData.data.sendUserResult.role);
                    //             }
                    //         });
                    //     }

                    // } else {
                    //     $('#loader').hide();
                    // }

                } else {
                    return false;
                }
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.changeEmailData.oldEmail = '';
                this.changeEmailData.newEmail = '';
            }

        }
    })

});