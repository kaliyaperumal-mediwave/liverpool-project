var API_URI = "/modules/auth-module";
$(document).ready(function () {

    new Vue({
        el: '#resources_user',

        data: {
            loginObject: {
                email: "",
                password: ""
            },
            isFormSubmitted: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-]).{8,}$/,
            resourceContainer :[{
                text: "ADHD",
                image: '/modules/my-apostrophe-assets/img/ADHD-01.svg'
            },
            {
                text: "Anxiety",
                image: '/modules/my-apostrophe-assets/img/Anxiety-01.svg'
            },
            {
                text: "Autism",
                image: '/modules/my-apostrophe-assets/img/Autism-01.svg'
            },
            {
                text: "Bullying",
                image: '/modules/my-apostrophe-assets/img/Bullying-01.svg'
            },
            {
                text: "Conduct Disorder",
                image: '/modules/my-apostrophe-assets/img/Conduct_Disorder-01.svg'
            },
            {
                text: "Depression",
                image: '/modules/my-apostrophe-assets/img/Depression-01.svg'
            },
            {
                text: "Drinking & Drugs",
                image: '/modules/my-apostrophe-assets/img/Drinking_And_Drugs-01.svg'
            },
            {
                text: "Dyslexia",
                image: '/modules/my-apostrophe-assets/img/Dyslexia-01.svg'
            },
            {
                text: "Dyspraxia",
                image: '/modules/my-apostrophe-assets/img/Dyspraxia-01.svg'
            },
            {
                text: "Eating Disorders",
                image: '/modules/my-apostrophe-assets/img/Eating_Disorders-01.svg'
            },
            {
                text: "Family difficulties",
                image: '/modules/my-apostrophe-assets/img/Family_difficulties-01.svg'
            },
            {
                text: "Gender Identity",
                image: '/modules/my-apostrophe-assets/img/Gender_Identity-01.svg'
            },
            {
                text: "OCD",
                image: '/modules/my-apostrophe-assets/img/OCD-01.svg'
            },
            {
                text: "Panic",
                image: '/modules/my-apostrophe-assets/img/Panic-01.svg'
            },
            {
                text: "Phobias",
                image: '/modules/my-apostrophe-assets/img/Phobias-01.svg'
            },
            {
                text: "Psychosis",
                image: '/modules/my-apostrophe-assets/img/Psychosis-01.svg'
            },
            {
                text: "PTSD",
                image: '/modules/my-apostrophe-assets/img/PTSD-01.svg'
            },
            {
                text: "Pulling Your Hair Out",
                image: '/modules/my-apostrophe-assets/img/Pulling_Your_Hair_Out-01.svg'
            },
            {
                text: "Self Harm",
                image: '/modules/my-apostrophe-assets/img/Self_Harm-01.svg'
            },
            {
                text: "Separation Anxiety",
                image: '/modules/my-apostrophe-assets/img/Separation_Anxiety-01.svg'
            },
            {
                text: "Sleeping difficulties",
                image: '/modules/my-apostrophe-assets/img/Sleeping_difficulties-01.svg'
            },
            {
                text: "Social Phobia",
                image: '/modules/my-apostrophe-assets/img/Social_Phobia-01.svg'
            },
            {
                text: "Stress",
                image: '/modules/my-apostrophe-assets/img/Stress-01.svg'
            },
            {
                text: "Tics and Tourettes",
                image: '/modules/my-apostrophe-assets/img/Tics_and_Tourettes-01.svg'
            },
            {
                text: "Wetting and soiling",
                image: '/modules/my-apostrophe-assets/img/Wetting_and_soiling-01.svg'
            }]
        },

        mounted: function () {
        },

        methods: {
            submitLogin: function () {
                let formData = this.loginObject;
                this.isFormSubmitted = true
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    console.log('payload', formData);
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (Object.keys(successData)) {
                        console.log(successData);
                    } else {
                        console.log('empty response')
                    }

                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

        },
         swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
            loop: true,
            loopFillGroupWithBlank: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          }),
    })

});