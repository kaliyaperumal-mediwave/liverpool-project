function getDynamicLabels(currentLocation, responsibilityFlow, section_no) {
  console.log(currentLocation, responsibilityFlow)

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
    section2Labels.carerLabel = "Your emergency contact";
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

    section2Labels.yourFirstNameLabel = "What is your emergency contact first name?";
    section2Labels.yourFirstNamePlacLabel = "Enter the emergency contact first name";
    section2Labels.yourLastNameLabel = "What is your emergency contact last name?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter the emergency contact last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is your family or friend's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is your family or friend's last name?";
    section2Labels.relationShipLabel = "What is this person's relationship to you?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter your family/friend's phone number";
    section2Labels.guardEmailLabel = "What is their email address?";
    section2Labels.guardEmailPlacLabel = "Enter your family/friend's email address";
    section2Labels.sameHouseLabel = "Does this person live in the same house as you?";
    section2Labels.guardAddress = "What is your family/friend's address?";
    section2Labels.guardPlacAddress = "Enter your family/friend's address";
    section2Labels.legalCareLabel = "Your legal care status (“legal care status” means who has legal guardianship over you)";
    section2Labels.legalCarePlacLabel = "Select your legal care status";

  } else if (currentLocation === "family") {
    section2Labels.headerLabel = "Section 2 of 5: About your young person's & their household";
    section2Labels.aboutYouLabel = "About your young person's";
    section2Labels.houseHoldLabel = "Your young person's household";
    section2Labels.houseHoldAddMemberLabel = "Add your young person's household members";
    section2Labels.carerLabel = "Your emergency contact";
    section2Labels.nhsLabel = "Your young person's NHS number";
    section2Labels.youngTitleLabel = "What is your young person's title?";
    section2Labels.youngTitlePlaceHoldTitle = "Select your young person's title"
    section2Labels.nhsPlaceLabel = "Enter your young person's 10 digit NHS number";
    section2Labels.fullNameLabel = "Your young person's full name";
    section2Labels.fullNamePlacLabel = "Enter young person's first and last name";
    section2Labels.emailLabel = "Your young person's email address";
    section2Labels.emailPlacLabel = "Enter your young person's email address";
    section2Labels.contactLabel = "Your young person's contact number";
    section2Labels.contactPlacLabel = "Enter your young person's contact number";
    section2Labels.addressLabel = "Your young person's address";
    section2Labels.postLabel = "Are you and your young person's happy for the post to be sent to this address?";
    section2Labels.genderLabel = "Your young person's gender";
    section2Labels.genderPlacLabel = "Enter your young person's gender";
    section2Labels.identityLabel = "Does your young person's identify with the gender you were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was your young person assigned at birth?";
    section2Labels.sexOrientLabel = "Your young person's sexual orientation";
    section2Labels.sexOrientPlacLabel = "Enter your young person's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "Your young person's ethnicity";
    section2Labels.ethincityPlaceLabel = "Enter your young person's ethnicity";
    section2Labels.careAdultLabel = "Does your young person's care for an adult?";
    section2Labels.yourNameLabel = "What is your name?";
    section2Labels.yourNamePlacLabel = "Enter your first and last name";
    section2Labels.parentalResLabel = "Do you have parental responsibility for your young person's?";
    section2Labels.responsibilityToastLabel = "Please enter the details below for the person who has parental responsibility for your young person's.";
    section2Labels.parentOrCarerNameLabel = "What is the parent or carers name?";
    section2Labels.firstNameLabel = "Your young person's first name";
    section2Labels.firstNamePlacLabel = "Enter your young person's first name";
    section2Labels.lastNameLabel = "Your young person's last name";
    section2Labels.lastNamePlacLabel = "Enter your young person's last name";

    section2Labels.yourFirstNameLabel = "What is your emergency contact first name?";
    section2Labels.yourFirstNamePlacLabel = "Enter your emergency contact first name";
    section2Labels.yourLastNameLabel = "What is your emergency contact last name?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter your emergency contact last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the family or friend's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the family or friend's last name?";

    section2Labels.relationShipLabel = "What is their relationship to your young person?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter phone number";
    section2Labels.guardEmailLabel = "What is their email address?";
    section2Labels.guardEmailPlacLabel = "Enter their email address";
    section2Labels.sameHouseLabel = "Do they live in the same house as the young person?";
    section2Labels.guardAddress = "What is their address?";
    section2Labels.guardPlacAddress = "Enter their address";
    section2Labels.legalCareLabel = "Their young person's legal care status (“legal care status” means who has legal guardianship over the young person)";
    section2Labels.legalCarePlacLabel = "Select the young person's legal care status";

  } else if (currentLocation === "professional") {
    section2Labels.headerLabel =
      "Section 2 of 5: About the young person & their household";
    section2Labels.aboutYouLabel = "About the young person";
    section2Labels.houseHoldLabel = "The young person's household";
    section2Labels.houseHoldAddMemberLabel = "Add young person's household members";
    section2Labels.carerLabel = "Young person's emergency contact";
    section2Labels.nhsLabel = "The young person's NHS number";
    section2Labels.youngTitleLabel = "What is the young person's title?";
    section2Labels.youngTitlePlaceHoldTitle = "Select the young person's title"
    section2Labels.nhsPlaceLabel =
      "Enter young person's your 10 digit NHS number";
    section2Labels.fullNameLabel = "The young person’s full name";
    section2Labels.fullNamePlacLabel =
      "Enter young person's first and last name";
    section2Labels.emailLabel = "The young person's email address";
    section2Labels.emailPlacLabel =
      "Enter young person's email address";
    section2Labels.contactLabel = "The young person's contact number";
    section2Labels.contactPlacLabel =
      "Enter young person's contact number";
    section2Labels.addressLabel = "The young person's address";
    section2Labels.postLabel =
      "Is the young person happy for the post to be sent to this address?";
    section2Labels.genderLabel = "The young person’s gender";
    section2Labels.genderPlacLabel = "Enter the young person’s gender";
    section2Labels.identityLabel =
      "Does the young person identify with the gender they were assigned at birth?";
    section2Labels.sexAssignedLabel = "What sex was the young person assigned at birth?";
    section2Labels.sexOrientLabel =
      "The young person's sexual orientation";
    section2Labels.sexOrientPlacLabel =
      "Enter the young person's sexual orientation (e.g. straight, pan, bi etc.)";
    section2Labels.ethincityLabel = "The young person's  ethnicity";
    section2Labels.ethincityPlaceLabel =
      "Enter the young person's ethnicity";
    section2Labels.careAdultLabel =
      "Does the young person care for an adult?";
    section2Labels.yourNameLabel =
      "What is the name of the young person's parent / carer?";
    section2Labels.yourNamePlacLabel = "Enter the person’s first and last name";
    section2Labels.parentalResLabel =
      "Does this person have parental responsibility for the young person?";
    section2Labels.responsibilityToastLabel =
      "Please enter the details below for the person who has parental responsibility for the young person.";
    section2Labels.parentOrCarerNameLabel =
      "What is the parent or carers name?";
    section2Labels.firstNameLabel = "The young person's first name";
    section2Labels.firstNamePlacLabel = "Enter young person's first name";
    section2Labels.lastNameLabel = "The young person's last name";
    section2Labels.lastNamePlacLabel = "Enter young person's last name";

    section2Labels.yourFirstNameLabel = "What is the first name of the young person's emergency contact?";
    section2Labels.yourFirstNamePlacLabel = "Enter the emergency contact first name";
    section2Labels.yourLastNameLabel = "What is the last name of the young person's emergency contact?";
    section2Labels.yourLastNameLabelPlacLabel = "Enter the emergency contact last name";

    section2Labels.parentOrCarerFirstNameLabel = "What is the family or friend's first name?";
    section2Labels.parentOrCarerLastNameLabel = "What is the family or friend's last name?";

    section2Labels.relationShipLabel = "What is their relationship to the young person?";
    section2Labels.guardContactLabel = "What is their contact number?";
    section2Labels.guardContactPlacLabel = "Enter phone number";
    section2Labels.guardEmailLabel = "What is their email address?";
    section2Labels.guardEmailPlacLabel = "Enter their email address";
    section2Labels.sameHouseLabel = "Do they live in the same house as the young person?";
    section2Labels.guardAddress = "What is their address?";
    section2Labels.guardPlacAddress = "Enter their address";
    section2Labels.legalCareLabel = "Their young legal care status (“legal care status” means who has legal guardianship over the young person)";
    section2Labels.legalCarePlacLabel = "Select the young's legal care status";
  }


  var section3Labels = {
    positionLabel: '', locationLabel: '', ehcpPlanLabel: '', ehatToolLabel: '', isSocialWorkerLabel: '', socialWorkerNameLabel: '', socialWorkerLastNameLabel: '', socialWorkerContactLabel: '',
  }

  if (currentLocation === "young") {
    section3Labels.postionLabel = "I am in";
    section3Labels.locationLabel = "Which school / college / university / do you attend?";
    section3Labels.ehcpPlanLabel = "Do you have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Do you have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.careLeaver = "Are you a care leaver?";
    section3Labels.isSocialWorkerLabel = "Do you have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the first name of your social worker?";
    section3Labels.socialWorkerLastNameLabel = "What is the last name of your social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for your social worker";

  } else if (currentLocation === "family") {
    section3Labels.postionLabel = "Your young is in";
    section3Labels.locationLabel = "Which school/ college / university / does your young attend?";
    section3Labels.ehcpPlanLabel = "Does your young have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Do your young have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.careLeaver = "Are you a care leaver?";
    section3Labels.isSocialWorkerLabel = "Does your young have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the first name of their social worker?";
    section3Labels.socialWorkerLastNameLabel = "What is the last name of their social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for their social worker";

  }
  else if (currentLocation === "professional") {
    section3Labels.postionLabel = "The young person is in";
    section3Labels.locationLabel = "Which school / college / university / does the young person you attend?";
    section3Labels.ehcpPlanLabel = "Does the young person have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Does the young person have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.careLeaver = "Are you a care leaver?";
    section3Labels.isSocialWorkerLabel = "Does the young  have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the first name of the young person's social worker?";
    section3Labels.socialWorkerLastNameLabel = "What is the last name of the young person's social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for the young person's  social worker";
  }

  var allLabels = {
    supportNeedsLabel: "",
    diagnosisLabel: "",
    symptomsOrSupportLabel: "",
    briefOutlineLabel: "",
    referralLabel: "",
    historyLabel: "",
    referralSubLabel: "",
    referralPlaceHolder: "",
    anythingHelpedPlaceHolder: "",
    triggersLabel: "",
    triggersPlaceHolder: "",
    disabilitiesLabel: "",
    disabilitiesPlaceHolder: "",
    prevAccessedServiceLabel: "",
    listServiceLabel: "",
    about_our_service: ""
  };
  if (currentLocation === "young") {
    allLabels.supportNeedsLabel = "What are your support needs?";
    allLabels.diagnosisLabel = "Do you have a mental health diagnosis?";
    allLabels.briefOutlineLabel = "your";
    allLabels.historyLabel = "Your history";
    allLabels.symptomsOrSupportLabel =
      "Do you have any other symptoms or support needs you would like to discuss?";
    allLabels.referralLabel =
      "Please provide more information on your main referral issues.";
    allLabels.referralSubLabel =
      "(Please include how long this has been an issue and how it is impacting your day-to-day life).";
    allLabels.referralPlaceHolder =
      "Tell us more about the issues you are facing.";
    allLabels.anythingHelpedPlaceHolder =
      "Have you tried anything before that has helped you with this issue? Tell us more about it here.";
    allLabels.triggersLabel = "Do you have any particular triggers?";
    allLabels.triggersPlaceHolder =
      "Is there anything that you  have noticed that makes this issue worse for you? Tell us about it here.";
    allLabels.disabilitiesLabel =
      "Do you have any disabilities, difficulties, health conditions or challenging behaviours (diagnosed or under investigation)?";
    allLabels.disabilitiesPlaceHolder =
      "Tell us about any disabilities, difficulties, health conditions or challenging behaviours you might have.";
    allLabels.prevAccessedServiceLabel =
      "Have you previously accessed any other services?";
    allLabels.listServiceLabel =
      "Have you accessed any of the following services? (Select all options that are relevant) or select 'Other' to add your service.";
    allLabels.about_our_service = "How did you hear about our service?";
  } else if (currentLocation === "family") {
    allLabels.supportNeedsLabel = "What are the support needs of your young?";
    allLabels.briefOutlineLabel = "your young's";
    allLabels.diagnosisLabel =
      "Does your young have a mental health diagnosis?";
    allLabels.historyLabel = "The young person's history";
    allLabels.symptomsOrSupportLabel =
      "Does your young have any other symptoms or support needs you would like to discuss?";
    allLabels.referralLabel =
      "Please provide more information on the main referral issues.";
    allLabels.referralSubLabel =
      "(Please include how long this has been an issue and how it is impacting your young's day-to-day life).";
    allLabels.referralPlaceHolder =
      "Tell us more about the issues they are facing.";
    allLabels.anythingHelpedPlaceHolder =
      "Have they tried anything before that has helped them with this issue? Tell us more about it here.";
    allLabels.triggersLabel = "Do they have any particular triggers?";
    allLabels.triggersPlaceHolder =
      "Is there anything that you or your young have noticed that makes this issue worse for them? Tell us about it here.";
    allLabels.disabilitiesLabel =
      "Does the young person have any disabilities, difficulties, health conditions or challenging behaviours (diagnosed or under investigation)?";

    allLabels.disabilitiesPlaceHolder =
      "Tell us about any disabilities, difficulties, health conditions or challenging behaviours the young person might have.";
    allLabels.prevAccessedServiceLabel =
      "Has your young previously accessed any other services?";
    allLabels.listServiceLabel =
      "Have they accessed any of the following services? (Select all options that are relevant) or select 'Other' to add your service.";
    allLabels.about_our_service = "How did you hear about our service?";
  } else if (currentLocation === "professional") {
    allLabels.briefOutlineLabel = "the young person's";
    allLabels.supportNeedsLabel =
      "What are the support needs of the young person?";
    allLabels.historyLabel = "The young person's history";
    allLabels.diagnosisLabel =
      "Does the young person have a mental health diagnosis?";
    allLabels.symptomsOrSupportLabel =
      "Does the young person have any other symptoms or support needs you would like to discuss?";
    allLabels.referralLabel =
      "Please provide more information on your main referral issues.";
    allLabels.referralSubLabel =
      " (Please include how long this has been an issue and how it is impacting the young person's day-to-day life).";
    allLabels.referralPlaceHolder =
      "Tell us more about the issues they are facing.";
    allLabels.anythingHelpedPlaceHolder =
      "Have they tried anything before that has helped them with this issue? Tell us more about it here.";
    allLabels.triggersLabel = "Do they have any particular triggers?";
    allLabels.triggersPlaceHolder =
      "Is there anything that you or the young person have noticed that makes this issue worse for them? Tell us about it here.";
    allLabels.disabilitiesLabel =
      "Does the young person have any disabilities, difficulties, health conditions or challenging behaviours (diagnosed or under investigation)?";
    allLabels.disabilitiesPlaceHolder =
      "Tell us about any disabilities, difficulties, health conditions or challenging behaviours the young person might have.";
    allLabels.prevAccessedServiceLabel =
      "Has the young previously accessed any other services?";
    allLabels.listServiceLabel =
      "Have they accessed any of the following services? (Select all options that are relevant) or select 'Other' to add your service.";
    allLabels.about_our_service = "How did you hear about our service?";
  }

  var currentRole = getQueryStringValue("role");
  var section5Labels = {
    aboutLabel: "",
  };
  if (currentRole == 'young') {
    section5Labels.aboutLabel = "About You";
  } else if (currentRole == 'family') {
    section5Labels.aboutLabel = "About Your young";
  } else if (currentRole == 'professional') {
    section5Labels.aboutLabel = "About The young";
  }


  if (section_no == 2) {
    return section2Labels;
  } else if (section_no == 3) {
    return section3Labels;
  } else {
    return allLabels;
  }
}
