// $(document).ready(function () {
function getDynamicLabels(currentLocation) {
  var allLabels = {
    supportNeedsLabel: "",
    diagnosisLabel: "",
    symptomsOrSupportLabel: "",
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
  };

  if (currentLocation === "child") {
    allLabels.supportNeedsLabel = "What are your support needs?";
    allLabels.diagnosisLabel = "Do you have a mental health diagnosis?";
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
  } else if (currentLocation === "parent") {
    allLabels.supportNeedsLabel = "What are the support needs of your child?";
    allLabels.diagnosisLabel =
      "Does your child have a mental health diagnosis?";
    allLabels.historyLabel = "The child/young person's history";
    allLabels.symptomsOrSupportLabel =
      "Does your child have any other symptoms or support needs you would like to discuss?";
    allLabels.referralLabel =
      "Please provide more information on the main referral issues.";
    allLabels.referralSubLabel =
      "(Please include how long this has been an issue and how it is impacting your child's day-to-day life).";
    allLabels.referralPlaceHolder =
      "Tell us more about the issues they are facing.";
    allLabels.anythingHelpedPlaceHolder =
      "Have they tried anything before that has helped them with this issue? Tell us more about it here.";
    allLabels.triggersLabel = "Do they have any particular triggers?";
    allLabels.triggersPlaceHolder =
      "Is there anything that you or your child have noticed that makes this issue worse for them? Tell us about it here.";
    allLabels.disabilitiesLabel =
      "Do you have any disabilities, difficulties, health conditions or challenging behaviours (diagnosed or under investigation)?";

    allLabels.disabilitiesPlaceHolder =
      "Tell us about any disabilities, difficulties, health conditions or challenging behaviours you might have.";
    allLabels.prevAccessedServiceLabel =
      "Has your child previously accessed any other services?";
    allLabels.listServiceLabel =
      "Have they accessed any of the following services? (Select all options that are relevant) or select 'Other' to add your service.";
  } else if (currentLocation === "professional") {
    allLabels.supportNeedsLabel =
      "What are the support needs of the child/young person?";
    allLabels.historyLabel = "The child/young person's history";
    allLabels.diagnosisLabel =
      "Does the child/young person have a mental health diagnosis?";
    allLabels.symptomsOrSupportLabel =
      "Does the child/young person have any other symptoms or support needs you would like to discuss?";
    allLabels.referralLabel =
      "Please provide more information on your main referral issues.";
    allLabels.referralSubLabel =
      " (Please include how long this has been an issue and how it is impacting the child/young person's day-to-day life).";
    allLabels.referralPlaceHolder =
      "Tell us more about the issues they are facing.";
    allLabels.anythingHelpedPlaceHolder =
      "Have they tried anything before that has helped them with this issue? Tell us more about it here.";
    allLabels.triggersLabel = "Do they have any particular triggers?";
    allLabels.triggersPlaceHolder =
      "Is there anything that you or the child/young person have noticed that makes this issue worse for them? Tell us about it here.";
    allLabels.disabilitiesLabel =
      "Do you have any disabilities, difficulties, health conditions or challenging behaviours (diagnosed or under investigation)?";
    allLabels.disabilitiesPlaceHolder =
      "Tell us about any disabilities, difficulties, health conditions or challenging behaviours you might have.";
    allLabels.prevAccessedServiceLabel =
      "Has the child/young previously accessed any other services?";
    allLabels.listServiceLabel =
      "Have they accessed any of the following services? (Select all options that are relevant) or select 'Other' to add your service.";
  }
  return allLabels;
}
