// $(document).ready(function () {
var currentLocation = getQueryStringValue("role");
var section2Labels = {
    headerLabel: "", aboutYouLabel: "", houseHoldLabel: "", carerLabel: "", nhsLabel: "", nhsPlaceLabel: "", fullNameLabel: "", fullNamePlacLabel: "",
    referralPlaceHolder: "", emailLabel: "", emailPlacLabel: "", contactLabel: "", contactPlacLabel: "", addressLabel: "", postLabel: "", genderLabel: "",
    genderPlacLabel: "", identityLabel: "", sexOrientLabel: "", sexOrientPlacLabel: "", ethincityLabel: "", ethincityPlaceLabel: "", careAdultLabel: "",
    listServiceLabel: "", yourNameLabel: "", yourNamePlacLabel: "", parentalResLabel: "", responsibilityToastLabel: "", parentOrCarerNameLabel: "",
    relationShipLabel: "", guardContactLabel: "", guardContactPlacLabel: "", guardEmailLabel: "", guardEmailPlacLabel: "",
}

if (currentLocation === "child") {
    debugger
    section2Labels.headerLabel = "Section 2 of 5: About you & your household";
    section2Labels.aboutYouLabel = "About You";
    section2Labels.houseHoldLabel = "Your household";
    section2Labels.carerLabel = "Your parent / carer";
    section2Labels.nhsLabel = "Your NHS number - optional";
    section2Labels.nhsPlaceLabel = "Enter your 10 digit NHS number";
    section2Labels.fullNameLabel = "Your full name";
    section2Labels.fullNamePlacLabel = "Enter your first and last name";
    section2Labels.emailLabel = "Your email address - optional";
    section2Labels.emailPlacLabel = "Enter your email address";
    section2Labels.contactLabel = "Your contact number";
    section2Labels.contactPlacLabel = "Enter your contact number";
    section2Labels.addressLabel = "Your address";
    section2Labels.postLabel = "Are you happy for post to be sent to this address?";
    section2Labels.genderLabel = "Your gender?";
    section2Labels.genderPlacLabel = "Enter your gender";
    section2Labels.identityLabel = "Do you identify with the gender you were assigned at birth?";
    section2Labels.sexOrientLabel = "Your sexual orientation - optional";
    section2Labels.sexOrientPlacLabel = "Enter your sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your ethnicity - optional";
    section2Labels.ethincityPlaceLabel = "Enter your ethnicity";
    section2Labels.careAdultLabel = "Do you care for an adult?";
    section2Labels.yourNameLabel = "What is your parent / carer’s name?";
    section2Labels.yourNamePlacLabel = "Enter this person’s first and last name";
    section2Labels.parentalResLabel = "Does this person have parental responsibility for you?";
    section2Labels.responsibilityToastLabel = "Please enter the details below for the person who has parental responsibility for you.";
    section2Labels.parentOrCarerNameLabel = "What is your parent or carers name?";
    section2Labels.relationShipLabel = "What is this persons relationship to you?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter your parent / carer’s phone number";
    section2Labels.guardEmailLabel = "What is their email address? - optional";
    section2Labels.guardEmailPlacLabel = "Enter your parent / carer’s email address";

} else if (currentLocation === "parent") {
    section2Labels.headerLabel = "Section 2 of 5: About the child & their household";
    section2Labels.aboutYouLabel = "About Your Child";
    section2Labels.houseHoldLabel = "Your child's household";
    section2Labels.carerLabel = "Your Details";
    section2Labels.nhsLabel = "Your child's NHS number - optional";
    section2Labels.nhsPlaceLabel = "Enter your child's 10 digit NHS number";
    section2Labels.fullNameLabel = "Your child's full name";
    section2Labels.fullNamePlacLabel = "Enter child/young person's first and last name";
    section2Labels.emailLabel = "Your child's email address - optional";
    section2Labels.emailPlacLabel = "Enter child's your email address";
    section2Labels.contactLabel = "Your chils's contact number-optional";
    section2Labels.contactPlacLabel = "Enter your child's contact number";
    section2Labels.addressLabel = "Your child's address";
    section2Labels.postLabel = "Are you and your child happy for post to be sent to this address?";
    section2Labels.genderLabel = "Your child's gender-optional";
    section2Labels.genderPlacLabel = "Enter your child's gender";
    section2Labels.identityLabel = "Does your child identify with the gender you were assigned at birth?";
    section2Labels.sexOrientLabel = "Your child's sexual orientation - optional";
    section2Labels.sexOrientPlacLabel = "Enter your child's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your child's ethnicity - optional";
    section2Labels.ethincityPlaceLabel = "Enter your child's ethnicity";
    section2Labels.careAdultLabel = "Does your child care for an adult?";
    section2Labels.yourNameLabel = "What is your name?";
    section2Labels.yourNamePlacLabel = "Enter your first and last name";
    section2Labels.parentalResLabel = "Do you have parental responsibility for your child?";
    section2Labels.responsibilityToastLabel = "Please enter the details below for the person who has parental responsibility for your child.";
    section2Labels.parentOrCarerNameLabel = "What is the parent or carers name?"
    section2Labels.relationShipLabel = "What is their relationship to your child?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter phone number";
    section2Labels.guardEmailLabel = "What is their email address? - optional";
    section2Labels.guardEmailPlacLabel = "Enter their email address";

}
else if (currentLocation === "professional") {
    section2Labels.headerLabel = "Section 2 of 5: About the child /young person & their household";
    section2Labels.aboutYouLabel = "About the child/young person";
    section2Labels.houseHoldLabel = "Your child's household";
    section2Labels.carerLabel = "Child/Young Person's Parent Details";
    section2Labels.nhsLabel = "The child/young person's NHS number - optional";
    section2Labels.nhsPlaceLabel = "Enter child/young person's your 10 digit NHS number";
    section2Labels.fullNameLabel = "The child / young person’s full name";
    section2Labels.fullNamePlacLabel = "Enter child/young person's first and last name";
    section2Labels.emailLabel = "The child/young person's email address - optional";
    section2Labels.emailPlacLabel = "Enter child / young person's email address";
    section2Labels.contactLabel = "The child/young person's contact number - optional";
    section2Labels.contactPlacLabel = "Enter child / young person's contact number";
    section2Labels.addressLabel = "The child/young person's address";
    section2Labels.postLabel = "Is the child /young person happy for post to be sent to this address?";
    section2Labels.genderLabel = "The child / young person’s gender - optional";
    section2Labels.genderPlacLabel = "Enter the child / young person’s gender";
    section2Labels.identityLabel = "Does the child / young person identify with the gender they were assigned at birth?";
    section2Labels.sexOrientLabel = "The child /young person's sexual orientation - optional";
    section2Labels.sexOrientPlacLabel = "Enter the child /young person's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "The child /young person's  ethnicity - optional";
    section2Labels.ethincityPlaceLabel = "Enter the child /young person's ethnicity";
    section2Labels.careAdultLabel = "Does the child /young person care for an adult?";
    section2Labels.yourNameLabel = "What is the name of the young person's parent / carer?";
    section2Labels.yourNamePlacLabel = "Enter the person’s first and last name";
    section2Labels.parentalResLabel = "Does this person have parental responsibility for the child /young person?";
    section2Labels.responsibilityToastLabel = "Please enter the details below for the person who has parental responsibility for the child /young person.";
    section2Labels.parentOrCarerNameLabel = "What is the parent or carers name?"
    section2Labels.relationShipLabel = "What is their relationship to the child /young person?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter phone number";
    section2Labels.guardEmailLabel = "What is their email address? - optional";
    section2Labels.guardEmailPlacLabel = "Enter their email address";

}