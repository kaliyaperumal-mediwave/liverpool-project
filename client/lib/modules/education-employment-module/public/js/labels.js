// $(document).ready(function () {
var currentLocation = getQueryStringValue("role");
var section3Labels = {
    positionLabel: '', locationLabel: '', ehcpPlanLabel: '', ehatToolLabel: '', isSocialWorkerLabel: '', socialWorkerNameLabel: '', socialWorkerContactLabel: '',
}

if (currentLocation === "child") {
    section3Labels.postionLabel = "I am in";
    section3Labels.locationLabel = "Which school / college / university / do you attend?";
    section3Labels.ehcpPlanLabel = "Do you have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Do you have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.isSocialWorkerLabel = "Do you have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the name of your social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for your social worker";

} else if (currentLocation === "parent") {
    section3Labels.postionLabel = "Your child is in";
    section3Labels.locationLabel = "Which school/ college / university / does your child attend?";
    section3Labels.ehcpPlanLabel = "Does your child have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Do your child have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.isSocialWorkerLabel = "Does your child have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the name of their social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for their social worker";

}
else if (currentLocation === "professional") {
    section3Labels.postionLabel = "The child/young person is in";
    section3Labels.locationLabel = "Which school / college / university / does the child/young person you attend?";
    section3Labels.ehcpPlanLabel = "Does the child/young person have an Education & Health Care Plan (EHCP)?";
    section3Labels.ehatToolLabel = "Does the child/young person have an open Early Help Assessment Tool (EHAT)?";
    section3Labels.isSocialWorkerLabel = "Does the child/young  have a social worker?";
    section3Labels.socialWorkerNameLabel = "What is the name of the child/young person's social worker?";
    section3Labels.socialWorkerContactLabel = "What is the contact number for the child/young person's  social worker";
}