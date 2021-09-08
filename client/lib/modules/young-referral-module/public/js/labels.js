function getDynamicLabels(currentLocation, responsibilityFlow) {
  // var currentLocation = getQueryStringValue("role");
  var section2Labels = {
    headerLabel: "",
    aboutYouLabel: "",
    houseHoldLabel: "",
    houseHoldAddMemberLabel: "",
    carerLabel: "",
    nhsLabel: "",
    youngTitleLabel: "",
    youngTitlePlaceHoldTitle: "",
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
    referralLabel: "",
  };

  if (currentLocation === "young") {
    section2Labels.headerLabel = "Section 2 of 5: About you & your household";
    section2Labels.aboutYouLabel = "About you";
    section2Labels.houseHoldLabel = "Your household";
    section2Labels.houseHoldAddMemberLabel = "Add your household members";
    section2Labels.carerLabel = "Your parent/carer details";
    section2Labels.nhsLabel = "Your NHS number";
    section2Labels.youngTitleLabel = "What is your title?";
    section2Labels.youngTitlePlaceHoldTitle = "Select your title"
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
    // section2Labels.referralLabel = "Is this an urgent or routine referral?";

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
      "Section 2 of 5: About your young & their household";
    section2Labels.aboutYouLabel = "About your young";
    section2Labels.houseHoldLabel = "Your young's household";
    section2Labels.houseHoldAddMemberLabel = "Add your young's household members";
    section2Labels.carerLabel = "Your details";
    section2Labels.nhsLabel = "Your young's NHS number";
    section2Labels.youngTitleLabel = "What is your young/young person's title?";
    section2Labels.youngTitlePlaceHoldTitle = "Select your young/young person's title"
    section2Labels.nhsPlaceLabel = "Enter your young's 10 digit NHS number";
    section2Labels.fullNameLabel = "Your young's full name";
    section2Labels.fullNamePlacLabel =
      "Enter young/young person's first and last name";
    section2Labels.emailLabel = "Your young's email address";
    section2Labels.emailPlacLabel = "Enter your young's email address";
    section2Labels.contactLabel = "Your young's contact number";
    section2Labels.contactPlacLabel = "Enter your young's contact number";
    section2Labels.addressLabel = "Your young's address";
    section2Labels.postLabel =
      "Are you and your young happy for the post to be sent to this address?";
    section2Labels.genderLabel = "Your young's gender";
    section2Labels.genderPlacLabel = "Enter your young's gender";
    section2Labels.identityLabel =
      "Does your young identify with the gender you were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was your young/young person assigned at birth?";
    section2Labels.sexOrientLabel = "Your young's sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter your young's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your young's ethnicity";
    section2Labels.ethincityPlaceLabel = "Enter your young's ethnicity";
    section2Labels.careAdultLabel = "Does your young care for an adult?";
    section2Labels.yourNameLabel = "What is your name?";
    section2Labels.yourNamePlacLabel = "Enter your first and last name";
    section2Labels.parentalResLabel =
      "Do you have parental responsibility for your young?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for your young.";
    section2Labels.parentOrCarerNameLabel =
      "What is the parent or carers name?";
    section2Labels.firstNameLabel = "Your young's first name";
    section2Labels.firstNamePlacLabel = "Enter your young's first name";
    section2Labels.lastNameLabel = "Your young's last name";
    section2Labels.lastNamePlacLabel = "Enter your young's last name";

    section2Labels.yourFirstNameLabel = "What is your first name?";
    section2Labels.yourFirstNamePlacLabel = "Enter your first name";
    section2Labels.yourLastNameLabel = "What is your last name?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter your last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the parent or carer's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the parent or carer's last name?";
    // section2Labels.referralLabel = "Is this an urgent or routine referral?";

    if (responsibilityFlow === "no") {
      section2Labels.relationShipLabel =
        "What is their relationship to your young?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as your young?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "Their young ’s legal care status (“legal care status” means who has legal guardianship over the young / young person)";
      section2Labels.legalCarePlacLabel =
        "Select the young's legal care status";
    } else if (responsibilityFlow === "yes") {
      section2Labels.relationShipLabel =
        "What is your relationship to your young?";
      section2Labels.guardContactLabel = "What is your contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is your email address?";
      section2Labels.guardEmailPlacLabel = "Enter your email address";
      section2Labels.sameHouseLabel =
        "Do you live in the same house as your young?";
      section2Labels.guardAddress = "What is your address?";
      section2Labels.guardPlacAddress = "Enter your address";
      section2Labels.legalCareLabel =
        "The young/young person's legal care status (“legal care status” means who has legal guardianship over the young/young person)";
      section2Labels.legalCarePlacLabel =
        "Select the young's legal care status";
    }
  } else if (currentLocation === "professional") {
    section2Labels.headerLabel =
      "Section 2 of 5: About the young/young person & their household";
    section2Labels.aboutYouLabel = "About the young/young person";
    section2Labels.houseHoldLabel = "The young/young person's household";
    section2Labels.houseHoldAddMemberLabel = "Add young/young person's household members";
    section2Labels.carerLabel = "young/young person's parent/carer details";
    section2Labels.nhsLabel = "The young/young person's NHS number";
    section2Labels.youngTitleLabel = "What is the young/young person's title?";
    section2Labels.youngTitlePlaceHoldTitle = "Select the young/young person's title"
    section2Labels.nhsPlaceLabel =
      "Enter young/young person's your 10 digit NHS number";
    section2Labels.fullNameLabel = "The young / young person’s full name";
    section2Labels.fullNamePlacLabel =
      "Enter young/young person's first and last name";
    section2Labels.emailLabel = "The young/young person's email address";
    section2Labels.emailPlacLabel =
      "Enter young / young person's email address";
    section2Labels.contactLabel = "The young/young person's contact number";
    section2Labels.contactPlacLabel =
      "Enter young / young person's contact number";
    section2Labels.addressLabel = "The young/young person's address";
    section2Labels.postLabel =
      "Is the young/young person happy for the post to be sent to this address?";
    section2Labels.genderLabel = "The young / young person’s gender";
    section2Labels.genderPlacLabel = "Enter the young / young person’s gender";
    section2Labels.identityLabel =
      "Does the young / young person identify with the gender they were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was the young/young person assigned at birth?";
    section2Labels.sexOrientLabel =
      "The young/young person's sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter the young/young person's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "The young/young person's  ethnicity";
    section2Labels.ethincityPlaceLabel =
      "Enter the young/young person's ethnicity";
    section2Labels.careAdultLabel =
      "Does the young/young person care for an adult?";
    section2Labels.yourNameLabel =
      "What is the name of the young person's parent / carer?";
    section2Labels.yourNamePlacLabel = "Enter the person’s first and last name";
    section2Labels.parentalResLabel =
      "Does this person have parental responsibility for the young/young person?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for the young/young person.";
    section2Labels.parentOrCarerNameLabel =
      "What is the parent or carers name?";
    section2Labels.firstNameLabel = "The young/young person's first name";
    section2Labels.firstNamePlacLabel = "Enter young/young person's first name";
    section2Labels.lastNameLabel = "The young/young person's last name";
    section2Labels.lastNamePlacLabel = "Enter young/young person's last name";

    section2Labels.yourFirstNameLabel = "What is the first name of the young person's parent / carer?";
    section2Labels.yourFirstNamePlacLabel = "Enter the person’s first name";
    section2Labels.yourLastNameLabel = "What is the last name of the young person's parent / carer?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter the person’s last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the parent or carer's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the parent or carer's last name?";
    // section2Labels.referralLabel = "Is this an urgent or routine referral?";

    if (responsibilityFlow === "no") {
      section2Labels.relationShipLabel =
        "What is their relationship to the young/young person?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as the young/young person?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "Their young legal care status (“legal care status” means who has legal guardianship over the young/young person)";
      section2Labels.legalCarePlacLabel =
        "Select the young's legal care status";
    } else if (responsibilityFlow === "yes") {
      section2Labels.relationShipLabel =
        "What is their relationship to the young/young person?";
      section2Labels.guardContactLabel = "What is their contact number?";
      section2Labels.guardContactPlacLabel = "Enter phone number";
      section2Labels.guardEmailLabel = "What is their email address?";
      section2Labels.guardEmailPlacLabel = "Enter their email address";
      section2Labels.sameHouseLabel =
        "Do they live in the same house as the young/young person?";
      section2Labels.guardAddress = "What is their address?";
      section2Labels.guardPlacAddress = "Enter their address";
      section2Labels.legalCareLabel =
        "The young/young person's legal care status (“legal care status” means who has legal guardianship over them)";
      section2Labels.legalCarePlacLabel =
        "Select the young/young person's legal care status";
    }
  }
  return section2Labels;
}
