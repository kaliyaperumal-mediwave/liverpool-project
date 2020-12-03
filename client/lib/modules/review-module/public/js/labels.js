var currentRole = getQueryStringValue("role");
var section5Labels = {
    aboutLabel: "",
};
if (currentRole == 'child') {
    section5Labels.aboutLabel = "About You";
} else if (currentRole == 'parent') {
    section5Labels.aboutLabel = "About Your Child";
} else if (currentRole == 'professional') {
    section5Labels.aboutLabel = "About The Child";
}
