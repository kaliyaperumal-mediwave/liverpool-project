function getDynamicLabels(currentLocation, responsibilityFlow) {
  // var currentLocation = getQueryStringValue("role");
  var section2Labels = {
    headerLabel: "",
    aboutYouLabel: "",
    houseHoldLabel: "",
    houseHoldAddMemberLabel: "",
    carerLabel: "",
    nhsLabel: "",
    childTitleLabel: "",
    childTitlePlaceHoldTitle: "",
    nhsPlaceLabel: "",
    fullNameLabel: "",
    fullNamePlacLabel: "",
    referralPlaceHolder: "",
    emailLabel: "",
    emailPlacLabel: "",
    contactLabel: "",
    contactPlacLabel: "",
    addressLabel: "",
    postLabel: "",
    genderLabel: "",
    genderPlacLabel: "",
    identityLabel: "",
    sexAssignedLabel: "",
    sexOrientLabel: "",
    sexOrientPlacLabel: "",
    ethincityLabel: "",
    ethincityPlaceLabel: "",
    careAdultLabel: "",
    listServiceLabel: "",
    yourNameLabel: "",
    yourNamePlacLabel: "",
    parentalResLabel: "",
    responsibilityToastLabel: "",
    parentOrCarerNameLabel: "",
    relationShipLabel: "",
    guardContactLabel: "",
    guardContactPlacLabel: "",
    guardEmailLabel: "",
    guardEmailPlacLabel: "",
    sameHouseLabel: "",
    guardAddress: "",
    guardPlacAddress: "",
    legalCareLabel: "",
    legalCarePlacLabel: "",
    firstNameLabel: "",
    firstNamePlacLabel: "",
    lastNameLabel: "",
    lastNamePlacLabel: "",
    yourFirstNameLabel: "",
    yourFirstNamePlacLabel: "",
    yourLastNameLabel: "",
    yourLastNameLabelPlacLabel: "",
    parentOrCarerFirstNameLabel: "",
    parentOrCarerLastNameLabel: "",
  };

  if (currentLocation === "child") {
    section2Labels.headerLabel = "Section 2 of 5: About you & your household";
    section2Labels.aboutYouLabel = "About you";
    section2Labels.houseHoldLabel = "Your household";
    section2Labels.houseHoldAddMemberLabel = "Add your household members";
    section2Labels.carerLabel = "Your parent/carer details";
    section2Labels.nhsLabel = "Your NHS number";
    section2Labels.childTitleLabel = "What is your title?";
    section2Labels.childTitlePlaceHoldTitle = "Select your title"
    section2Labels.nhsPlaceLabel = "Enter your 10 digit NHS number";
    section2Labels.fullNameLabel = "Your full name";
    section2Labels.fullNamePlacLabel = "Enter your first and last name";
    section2Labels.emailLabel = "Your email address";
    section2Labels.emailPlacLabel = "Enter your email address";
    section2Labels.contactLabel = "Your contact number";
    section2Labels.contactPlacLabel = "Enter your contact number";
    section2Labels.addressLabel = "Your address";
    section2Labels.postLabel =
      "Are you happy for the post to be sent to this address?";
    section2Labels.genderLabel = "Your gender?";
    section2Labels.genderPlacLabel = "Enter your gender";
    section2Labels.identityLabel =
      "Do you identify with the gender you were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex were you assigned at birth?";
    section2Labels.sexOrientLabel = "Your sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter your sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your ethnicity";
    section2Labels.ethincityPlaceLabel = "Enter your ethnicity";
    section2Labels.careAdultLabel = "Do you care for an adult?";
    section2Labels.yourNameLabel = "What is your parent / carer’s name?";
    section2Labels.yourNamePlacLabel =
      "Enter this person’s first and last name";
    section2Labels.parentalResLabel =
      "Does this person have parental responsibility for you?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for you.";
    section2Labels.parentOrCarerNameLabel =
      "What is your parent or carers name?";
    section2Labels.firstNameLabel = "Your first name";
    section2Labels.firstNamePlacLabel = "Enter your first name";
    section2Labels.lastNameLabel = "Your last name";
    section2Labels.lastNamePlacLabel = "Enter your last name";

    section2Labels.yourFirstNameLabel = "What is your parent / carer’s first name?";
    section2Labels.yourFirstNamePlacLabel = "Enter this person’s first name";
    section2Labels.yourLastNameLabel = "What is your parent / carer’s last name?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter this person’s last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is your parent or carer's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is your parent or carer's last name?";

    if (responsibilityFlow === "no" || responsibilityFlow === "yes") {
      section2Labels.relationShipLabel =
        "What is this person's relationship to you?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel =
        "Enter your parent/carer's phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel =
        "Enter your parent/carer's email address";
      section2Labels.sameHouseLabel =
        "Does this person live in the same house as you?";
      section2Labels.guardAddress = "What is your parent/carer's address?";
      section2Labels.guardPlacAddress = "Enter your parent/carer's address";
      section2Labels.legalCareLabel =
        "Your legal care status (“legal care status” means who has legal guardianship over you)";
      section2Labels.legalCarePlacLabel = "Select your legal care status";
    }
  } else if (currentLocation === "parent") {
    section2Labels.headerLabel =
      "Section 2 of 5: About your child & their household";
    section2Labels.aboutYouLabel = "About your child";
    section2Labels.houseHoldLabel = "Your child's household";
    section2Labels.houseHoldAddMemberLabel = "Add your child's household members";
    section2Labels.carerLabel = "Your details";
    section2Labels.nhsLabel = "Your child's NHS number";
    section2Labels.childTitleLabel = "What is your child/young person's title?";
    section2Labels.childTitlePlaceHoldTitle = "Select your child/young person's title"
    section2Labels.nhsPlaceLabel = "Enter your child's 10 digit NHS number";
    section2Labels.fullNameLabel = "Your child's full name";
    section2Labels.fullNamePlacLabel =
      "Enter child/young person's first and last name";
    section2Labels.emailLabel = "Your child's email address";
    section2Labels.emailPlacLabel = "Enter your child's email address";
    section2Labels.contactLabel = "Your child's contact number";
    section2Labels.contactPlacLabel = "Enter your child's contact number";
    section2Labels.addressLabel = "Your child's address";
    section2Labels.postLabel =
      "Are you and your child happy for the post to be sent to this address?";
    section2Labels.genderLabel = "Your child's gender";
    section2Labels.genderPlacLabel = "Enter your child's gender";
    section2Labels.identityLabel =
      "Does your child identify with the gender you were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was your child/young person assigned at birth?";
    section2Labels.sexOrientLabel = "Your child's sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter your child's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your child's ethnicity";
    section2Labels.ethincityPlaceLabel = "Enter your child's ethnicity";
    section2Labels.careAdultLabel = "Does your child care for an adult?";
    section2Labels.yourNameLabel = "What is your name?";
    section2Labels.yourNamePlacLabel = "Enter your first and last name";
    section2Labels.parentalResLabel =
      "Do you have parental responsibility for your child?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for your child.";
    section2Labels.parentOrCarerNameLabel =
      "What is the parent or carers name?";
    section2Labels.firstNameLabel = "Your child's first name";
    section2Labels.firstNamePlacLabel = "Enter your child's first name";
    section2Labels.lastNameLabel = "Your child's last name";
    section2Labels.lastNamePlacLabel = "Enter your child's last name";

    section2Labels.yourFirstNameLabel = "What is your first name?";
    section2Labels.yourFirstNamePlacLabel = "Enter your first name";
    section2Labels.yourLastNameLabel = "What is your last name?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter your last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the parent or carer's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the parent or carer's last name?";

    if (responsibilityFlow === "no") {
      section2Labels.relationShipLabel =
        "What is their relationship to your child?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as your child?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "Their child ’s legal care status (“legal care status” means who has legal guardianship over the child / young person)";
      section2Labels.legalCarePlacLabel =
        "Select the child's legal care status";
    } else if (responsibilityFlow === "yes") {
      section2Labels.relationShipLabel =
        "What is your relationship to your child?";
      section2Labels.guardContactLabel = "What is your contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is your email address?";
      section2Labels.guardEmailPlacLabel = "Enter your email address";
      section2Labels.sameHouseLabel =
        "Do you live in the same house as your child?";
      section2Labels.guardAddress = "What is your address?";
      section2Labels.guardPlacAddress = "Enter your address";
      section2Labels.legalCareLabel =
        "The child/young person's legal care status (“legal care status” means who has legal guardianship over the child/young person)";
      section2Labels.legalCarePlacLabel =
        "Select the child's legal care status";
    }
  } else if (currentLocation === "professional") {
    section2Labels.headerLabel =
      "Section 2 of 5: About the child/young person & their household";
    section2Labels.aboutYouLabel = "About the child/young person";
    section2Labels.houseHoldLabel = "The child/young person's household";
    section2Labels.houseHoldAddMemberLabel = "Add child/young person's household members";
    section2Labels.carerLabel = "Child/young person's parent/carer details";
    section2Labels.nhsLabel = "The child/young person's NHS number";
    section2Labels.childTitleLabel = "What is the child/young person's title?";
    section2Labels.childTitlePlaceHoldTitle = "Select the child/young person's title"
    section2Labels.nhsPlaceLabel =
      "Enter child/young person's your 10 digit NHS number";
    section2Labels.fullNameLabel = "The child / young person’s full name";
    section2Labels.fullNamePlacLabel =
      "Enter child/young person's first and last name";
    section2Labels.emailLabel = "The child/young person's email address";
    section2Labels.emailPlacLabel =
      "Enter child / young person's email address";
    section2Labels.contactLabel = "The child/young person's contact number";
    section2Labels.contactPlacLabel =
      "Enter child / young person's contact number";
    section2Labels.addressLabel = "The child/young person's address";
    section2Labels.postLabel =
      "Is the child/young person happy for the post to be sent to this address?";
    section2Labels.genderLabel = "The child / young person’s gender";
    section2Labels.genderPlacLabel = "Enter the child / young person’s gender";
    section2Labels.identityLabel =
      "Does the child / young person identify with the gender they were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was the child/young person assigned at birth?";
    section2Labels.sexOrientLabel =
      "The child/young person's sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter the child/young person's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "The child/young person's  ethnicity";
    section2Labels.ethincityPlaceLabel =
      "Enter the child/young person's ethnicity";
    section2Labels.careAdultLabel =
      "Does the child/young person care for an adult?";
    section2Labels.yourNameLabel =
      "What is the name of the young person's parent / carer?";
    section2Labels.yourNamePlacLabel = "Enter the person’s first and last name";
    section2Labels.parentalResLabel =
      "Does this person have parental responsibility for the child/young person?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for the child/young person.";
    section2Labels.parentOrCarerNameLabel =
      "What is the parent or carers name?";
    section2Labels.firstNameLabel = "The child/young person's first name";
    section2Labels.firstNamePlacLabel = "Enter child/young person's first name";
    section2Labels.lastNameLabel = "The child/young person's last name";
    section2Labels.lastNamePlacLabel = "Enter child/young person's last name";

    section2Labels.yourFirstNameLabel = "What is the first name of the young person's parent / carer?";
    section2Labels.yourFirstNamePlacLabel = "Enter the person’s first name";
    section2Labels.yourLastNameLabel = "What is the last name of the young person's parent / carer?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter the person’s last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the parent or carer's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the parent or carer's last name?";

    if (responsibilityFlow === "no") {
      section2Labels.relationShipLabel =
        "What is their relationship to the child/young person?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as the child/young person?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "Their child legal care status (“legal care status” means who has legal guardianship over the child/young person)";
      section2Labels.legalCarePlacLabel =
        "Select the child's legal care status";
    } else if (responsibilityFlow === "yes") {
      section2Labels.relationShipLabel =
        "What is their relationship to the child/young person?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as the child/young person?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "The child/young person's legal care status (“legal care status” means who has legal guardianship over them)";
      section2Labels.legalCarePlacLabel =
        "Select the child/young person's legal care status";
    }
  }
  return section2Labels;
}
