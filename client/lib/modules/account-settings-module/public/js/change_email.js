var API_URI = "/modules/account-settings-module";
$(document).ready(function () {
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
                    $('#loader').removeClass('d-none').addClass('d-block');
                    var successData = apiCallPost('post', '/changeEmail', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').removeClass('d-block').addClass('d-none');
                        $('#changeEmailSuccess').modal('show');
                        setTimeout(function () {
                            $('#changeEmailSuccess').modal('hide');
                        }, 1000);

                    } else {
                        $('#loader').removeClass('d-block').addClass('d-none');
                    }
                } else {
                    return false;
                }
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.changeEmailData.newEmail = '';
            }

        }
    })

});