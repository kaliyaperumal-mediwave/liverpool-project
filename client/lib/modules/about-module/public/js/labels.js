// $(document).ready(function () {
var currentLocation = getQueryStringValue("role");
var section2Labels = {
    headerLabel: '', innerHeaderLabel1: '', nhsLabel: '', nhsPlaceLabel: '', fullNameLabel: '', fullNamePlacLabel: '', referralPlaceHolder: '',
    emailLabel: '', emailPlacLabel: '', contactLabel: '', contactPlacLabel: '', gpLabel: '', postLabel: '', genderLabel: '', genderPlacLabel: '',
    identityLabel: '', sexOrientLabel: '', sexOrientPlacLabel: '', ethincityLabel: '', ethincityPlaceLabel: '', careAdultLabel: '', listServiceLabel: ''
}

if (currentLocation === "child") {
    headerLabel = "Section 2 of 5: About you & your household";
    innerHeaderLabel1 = "About You";
    nhsLabel = "Your NHS number - optional";
    nhsPlaceLabel = "Enter your 10 digit NHS number";
} else if (currentLocation === "parent") {
    headerLabel = "Section 2 of 5: About the child & their household";
    innerHeaderLabel1 = "About Your Child"
    nhsLabel = "Your child's NHS number - optional";
    nhsPlaceLabel = "Enter your child'su 10 digit NHS number";
}
else if (currentLocation === "professional") {
    headerLabel = "Section 2 of 5: About the child /young person & their household";
    innerHeaderLabel1 = "About the child/young person"
    nhsLabel = "The child/young person's NHS number - optional";
    nhsPlaceLabel = "Enter child/young person's your 10 digit NHS number";
}