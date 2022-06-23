
const moment = require('moment');
const config = require('../config');
var axios = require('axios');
const { payloadMandatoryField } = require('../validation/IaptusValidation');
const errorHandler = require('../middlewares/errorHandler');

exports.sendReferralData = async ctx => {
    var apiToCall;
    try {

        if (ctx.request.body.emailToProvider == "Venus") {
            console.log("--------------------------------------------------------------------------------------------Iaptus api hit to : VENUS")
            apiToCall = config.mayden_api_venus;
            //Mapping name title to match venus doc
            if (ctx.request.body.referralData.section2.child_name_title == "Mr") {
                ctx.request.body.referralData.section2.child_name_title = "1122655"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Miss") {
                ctx.request.body.referralData.section2.child_name_title = "1122657"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Ms") {
                ctx.request.body.referralData.section2.child_name_title = "1122658"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Mrs") {
                ctx.request.body.referralData.section2.child_name_title = "1122656"
            }
            else {
                ctx.request.body.referralData.section2.child_name_title = "1142085"
            }

            //Mapping gender to match venus doc
            if (ctx.request.body.referralData.section2.sex_at_birth == "Male") {
                ctx.request.body.referralData.section2.sex_at_birth = "1122901"
            }
            else if (ctx.request.body.referralData.section2.sex_at_birth == "Female") {
                ctx.request.body.referralData.section2.sex_at_birth = "1122902"
            }
            else {
                ctx.request.body.referralData.section2.sex_at_birth = "1122903"
            }
        }
        else {
            console.log("-------------------------------------------------------------------------------------Iaptus api hit to : YPAS")
            apiToCall = config.mayden_api_ypas;
            //Mapping name title to match ypas doc
            if (ctx.request.body.referralData.section2.child_name_title == "Mr") {
                ctx.request.body.referralData.section2.child_name_title = "1072718"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Miss") {
                ctx.request.body.referralData.section2.child_name_title = "1072720"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Ms") {
                ctx.request.body.referralData.section2.child_name_title = "1072721"
            }
            else if (ctx.request.body.referralData.section2.child_name_title == "Mrs") {
                ctx.request.body.referralData.section2.child_name_title = "1072719"
            }
            else {
                ctx.request.body.referralData.section2.child_name_title = "1109049"
            }

            //Mapping gender to match ypas doc
            if (ctx.request.body.referralData.section2.sex_at_birth == "Male") {
                ctx.request.body.referralData.section2.sex_at_birth = "1072964"
            }
            else if (ctx.request.body.referralData.section2.sex_at_birth == "Female") {
                ctx.request.body.referralData.section2.sex_at_birth = "1072965"
            }
            else {
                ctx.request.body.referralData.section2.sex_at_birth = "1072966"
            }

        }
        if (ctx.request.body.referralData.section2.child_contact_type == 'mobile') {
            ctx.request.body.referralData.section2.child_mobile_number = ctx.request.body.referralData.section2.child_contact_number;
            ctx.request.body.referralData.section2.child_land_number = "No";
        }
        else {
            ctx.request.body.referralData.section2.child_land_number == ctx.request.body.referralData.section2.child_contact_number;
            ctx.request.body.referralData.section2.child_contact_number = "No";
        }
        var resultObj = createPayload(ctx)
        console.log(resultObj);
        //console.log(ctx.request.body.referralData.section2)
        const config_api = {
            method: 'post',
            url: apiToCall,
            headers: { 'api-key': config.mayden_apiToken, 'Content-Type': 'application/json' },
            data: JSON.stringify(resultObj)
        };
        console.log(config_api)
        try {
            console.log("--------------------------------------apiResponse-----------start------------------------")
            return await axios(config_api)
                .then(async (response) => {
                    console.log("--------------------------------------apiResponse----api-------success------------------------")
                    ctx.res.successCodeApi = 200;
                    ctx.res.iaptusApiDetail = {
                        payload: resultObj,
                        apiInfo: response
                    };
                    return ctx.res.ok({
                        message: "referral sent to iaptus",
                    });

                })
                .catch(async (error) => {
                    ctx.res.successCodeApi = 500;
                    ctx.res.iaptusApiDetail = {
                        payload: resultObj,
                        apiInfo: error
                    };
                    console.log("--------------------------------------apiResponse----api-------error------------------------")
                    return errorHandler.iaptusUnauthorizedError(ctx, error, config_api);
                })

        } catch (error) {
            console.log("error in api call")
            return errorHandler.iaptusUnauthorizedError(ctx, error);
        }

        // console.log("--------------------------------------apiResponse-----------------------------------")
        // console.log(apiResponse)
        // return ctx.res.ok({
        //     data: config_api
        // });
        // console.log("---------------------resultObj")
        // const { error } = payloadMandatoryField(resultObj);
        // if (error) {
        //     console.log("---------------------error"+error)
        //     return ctx.res.badRequest({
        //         message: error.details[0].message,
        //     });
        // } else {
        //     try {
        //         console.log("--------------------------------------apiResponse-----------start------------------------")
        //         const config_api = {
        //             method: 'post',
        //             url: config.mayden_api,
        //             headers: { 'authorization': 'API key ' + config.mayden_apiToken },
        //             data: resultObj
        //         };
        //         const apiResponse = await axios(config_api);
        //         console.log("--------------------------------------apiResponse-----------------------------------")
        //         console.log(apiResponse)
        //         return ctx.res.ok({
        //             data: config_api
        //         });
        //     } catch (error) {
        //         console.log(error.response.data)
        //         return ctx.res.internalServerError({
        //             message: 'Errored in calling mayden api',
        //         });
        //     }
        // }
    } catch (e) {
        console.log('payload bind Exception ', e)
        return errorHandler.handleSequalizeError(ctx, e);
    }
};


function checkArray(array) {
    if (Array.isArray(array) && array.length) {
        //return array.toString();
        return array.join(', ')
    }
    else {
        return "No";
    }
}

var alternativeBlankSpace = undefined;
function createPayload(ctx) {
    var concatString = ", ";
    var payLoad = {};
    var householdMembers = [];
    console.log("------------------------", ctx.query.formType)
    console.log("===============" + ctx.request.body.referralData.role)
    console.log("===============" + ctx.request.body.referralData)
    for (let index = 0; index < ctx.request.body.referralData.section2.household_member.length; index++) {
        var name = ctx.request.body.referralData.section2.household_member[index].name;
        var lastName = ctx.request.body.referralData.section2.household_member[index].lastName;
        var fullName = name + " " + lastName;
        householdMembers.push(fullName);
    }
    if (ctx.request.body.referralData.role == "Professional" || ctx.request.body.referralData.role == "professional") {
        payLoad = { //Section 1
            "00a_referrer": ctx.request.body.referralData.role,
            "00b_referral_type": ctx.request.body.referralData.section4.referral_type,
            "00c_referral_mode": ctx.request.body.referralData.section1.referral_mode ? ctx.request.body.referralData.section1.referral_mode : alternativeBlankSpace,
            "06_professional_referral_service_selection": ctx.request.body.referralData.section1.service_location + concatString + ctx.request.body.referralData.section1.selected_service,
            "07a_professional_name": formatingInput(ctx.request.body.referralData.section1.professional_name) + concatString + formatingInput(ctx.request.body.referralData.section1.professional_lastname) + concatString + formatingInput(ctx.request.body.referralData.section1.professional_profession),
            "07d_professional_email": ctx.request.body.referralData.section1.professional_email ? ctx.request.body.referralData.section1.professional_email : alternativeBlankSpace,
            "07c_professional_contact_number": formatingInput(ctx.request.body.referralData.section1.professional_contact_type) + concatString + ctx.request.body.referralData.section1.professional_contact_number,
            "07b_professional_address": formatingInput(ctx.request.body.referralData.section1.professional_address),
            "pat_dob": moment(ctx.request.body.referralData.section1.child_dob).format('YYYY-MM-DD'),
            "01_consent_from_child_to_share_with_camhs_partners": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,
            "01_consent_from_individual_to_share_with_amhs_partners": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,
            "02_consent_from_parent_or_carer_to_share_with_camhs_partners": formatingInput(ctx.request.body.referralData.section1.consent_parent),
            "04_registered_gp": formatingInput(ctx.request.body.referralData.section1.registered_gp),
            "05_registered_school": formatingInput(ctx.request.body.referralData.section1.gp_school),
            //Section 2
            //"00c_referral_mode":ctx.request.body.referralData.section2.referral_mode,
            "09_nhs_number_provided": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : alternativeBlankSpace,
            "pat_title": formatingInput(ctx.request.body.referralData.section2.child_name_title),
            "pat_firstname": formatingInput(ctx.request.body.referralData.section2.child_name),
            "pat_lastname": formatingInput(ctx.request.body.referralData.section2.child_lastname),
            "pat_home_tel": ctx.request.body.referralData.section2.child_land_number ? ctx.request.body.referralData.section2.child_land_number : alternativeBlankSpace,
            "pat_mob_tel": ctx.request.body.referralData.section2.child_mobile_number ? ctx.request.body.referralData.section2.child_mobile_number : alternativeBlankSpace,
            "pat_mob_tel": ctx.request.body.referralData.section2.child_mobile_number,
            "pat_address1": formatingInput(ctx.request.body.referralData.section2.pat_address1),
            "pat_address2": formatingInput(ctx.request.body.referralData.section2.pat_address2),
            "pat_town_city": formatingInput(ctx.request.body.referralData.section2.pat_town_city),
            "pat_county": formatingInput(ctx.request.body.referralData.section2.pat_county),
            "pat_postcode": (ctx.request.body.referralData.section2.pat_postcode).trim(),
            "10_consent_to_contact_via_post": formatingInput(ctx.request.body.referralData.section2.can_send_post),
            "08a_gender_child_identifies_as": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "08a_gender_individual_indentifies_as": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "pat_gender": formatingInput(ctx.request.body.referralData.section2.sex_at_birth),
            "08b_does_child_identify_with_birth_gender": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "08b_does_individual_identify_with_birth_gender": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "08c_sexual_orientation": formatingInput(ctx.request.body.referralData.section2.child_sexual_orientation),
            "08d_ethnicity": formatingInput(ctx.request.body.referralData.section2.child_ethnicity),
            "13_is_a_carer_for_an_adult": formatingInput(ctx.request.body.referralData.section2.child_care_adult),
            "12_household_members": checkArray(householdMembers),

            "14a_parent_or_carer_details_with_parental_responsibility": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.parental_responsibility) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) : alternativeBlankSpace,

            "14b_parent_or_carer_contact_number": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number : alternativeBlankSpace,

            "14c_parent_or_carer_email": ctx.query.formType == "child" && ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : alternativeBlankSpace,

            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,
            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,

            "14a_emergency_contact_details": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number + concatString + (ctx.request.body.referralData.section2.parent_email != undefined ? ctx.request.body.referralData.section2.parent_email : "") : alternativeBlankSpace,


            "14e_parent_or_carer_address": formatingInput(ctx.request.body.referralData.section2.parent_address),
            "15_other_parent_or_carer_details": ctx.request.body.referralData.section2.parental_responsibility == "no" ? formatingInput(ctx.request.body.referralData.section2.responsibility_parent_firstname) + concatString + formatingInput(ctx.request.body.referralData.section2.responsibility_parent_lastname) : alternativeBlankSpace,
            // //Section3
            "17_profession_or_education_status": formatingInput(ctx.request.body.referralData.section3.child_profession),
            "18_place_of_education": formatingInput(ctx.request.body.referralData.section3.child_education_place),
            "19a_education_and_health_care_plan_EHCP": formatingInput(ctx.request.body.referralData.section3.child_EHCP),
            "19b_early_help_assessment_tool_EHAT": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section3.child_EHAT) : alternativeBlankSpace,
            "16a_care_leaver": formatingInput(ctx.request.body.referralData.section3.careLeaver),
            "20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "yes" ? formatingInputsocialWorker(ctx.request.body.referralData.section3.child_socialworker_firstname, ctx.request.body.referralData.section3.child_socialworker_lastname, ctx.request.body.referralData.section3.child_socialworker_contact_type, ctx.request.body.referralData.section3.child_socialworker_contact) : 'No',
            //"20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "no" ? 'No':alternativeBlankSpace,
            // //section4
            //"Support needs": ctx.request.body.referralData.section4.referral_type,
            "21_referral_related_to_covid": formatingInput(ctx.request.body.referralData.section4.is_covid),
            "27_problem_eating_disorder_difficulties": formatingInput(checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties)),
            "28_problem_food_and_fluid_intake": formatingInput(ctx.request.body.referralData.section4.food_fluid_intake),
            "29a_problem_height": formatingInput(ctx.request.body.referralData.section4.height),
            "29b_problem_weight": formatingInput(ctx.request.body.referralData.section4.weight),
            "22a_reason_for_referral": ctx.request.body.referralData.section4.reason_for_referral ? formatingInput(ctx.request.body.referralData.section4.reason_for_referral.join(', ')) : alternativeBlankSpace,
            "22b_reason_for_referral": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "22b_referral_issues": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "23_has_anything_helped": formatingInput(ctx.request.body.referralData.section4.has_anything_helped),
            "24_problem_any_particular_trigger": formatingInput(ctx.request.body.referralData.section4.any_particular_trigger),
            "25_any_disabilities_difficulties_health_conditions_or_challenging_behaviours": formatingInput(ctx.request.body.referralData.section4.disabilities),
            "26_previously_accessed_services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.join(', ') : alternativeBlankSpace,
            "26a_how_heard_about_service": formatingInput(ctx.request.body.referralData.section4.about_our_service),
            
            
            // ------------ Added By Aritra Basak ------------------

            "22c_bullying": ctx.request.body.referralData.section4.referral_reason_details.bullying ? ctx.request.body.referralData.section4.referral_reason_details.bullying : alternativeBlankSpace,
            "22d_clumsy_uncoordinated": ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated ? ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated : alternativeBlankSpace,
            "22e_compulsive_behaviour": ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour ? ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour : alternativeBlankSpace,
            "22f_drinking_drugs": ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs ? ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs : alternativeBlankSpace,
            "22g_feel_nervous": ctx.request.body.referralData.section4.referral_reason_details.feel_nervous ? ctx.request.body.referralData.section4.referral_reason_details.feel_nervous : alternativeBlankSpace,
            "22h_feel_stressed": ctx.request.body.referralData.section4.referral_reason_details.feel_stressed ? ctx.request.body.referralData.section4.referral_reason_details.feel_stressed : alternativeBlankSpace,
            "22i_hard_to_control": ctx.request.body.referralData.section4.referral_reason_details.hard_to_control ? ctx.request.body.referralData.section4.referral_reason_details.hard_to_control : alternativeBlankSpace,
          
            "22j_hurt_myself_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans : alternativeBlankSpace,
            "22k_hurt_myself_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed : alternativeBlankSpace,
            "22l_hurt_myself_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming : alternativeBlankSpace,
            "22m_hurt_myself_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming : alternativeBlankSpace,
          
          
            "22n_issues_food_diet": ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet ? ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet : alternativeBlankSpace,
            "22o_lack_confidence": ctx.request.body.referralData.section4.referral_reason_details.lack_confidence ? ctx.request.body.referralData.section4.referral_reason_details.lack_confidence : alternativeBlankSpace,
            "22p_low_self_esteem": ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem ? ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem : alternativeBlankSpace,
            "22q_panic_attack": ctx.request.body.referralData.section4.referral_reason_details.panic_attack ? ctx.request.body.referralData.section4.referral_reason_details.panic_attack : alternativeBlankSpace,
            "22r_problem_self_identity": ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity ? ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity : alternativeBlankSpace,
            "22s_problem_with_family": ctx.request.body.referralData.section4.referral_reason_details.problem_with_family ? ctx.request.body.referralData.section4.referral_reason_details.problem_with_family : alternativeBlankSpace,
            "22y_pullying_hair": ctx.request.body.referralData.section4.referral_reason_details.pullying_hair ? ctx.request.body.referralData.section4.referral_reason_details.pullying_hair : alternativeBlankSpace,
          
            "22u_sad_unhappy_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans : alternativeBlankSpace,
            "22v_sad_unhappy_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed : alternativeBlankSpace,
            "22w_sad_unhappy_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming : alternativeBlankSpace,
            "22x_sad_unhappy_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming : alternativeBlankSpace,
         
         
            "22y_scared_anxious": ctx.request.body.referralData.section4.referral_reason_details.scared_anxious ? ctx.request.body.referralData.section4.referral_reason_details.scared_anxious : alternativeBlankSpace,
            "22z_seeing_hearing_things": ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things ? ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things : alternativeBlankSpace,
          
            "22za_self_harming_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans : alternativeBlankSpace,
            "22zb_self_harming_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed : alternativeBlankSpace,
            "22zc_self_harming_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming : alternativeBlankSpace,
            "2zd_self_harming_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming : alternativeBlankSpace,
          
          
            "22ze_traumatic_experience": ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience ? ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience : alternativeBlankSpace,
            "22zf_trouble_concentrating": ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating ? ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating : alternativeBlankSpace,
            "22zg_trouble_read": ctx.request.body.referralData.section4.referral_reason_details.trouble_read ? ctx.request.body.referralData.section4.referral_reason_details.trouble_read : alternativeBlankSpace,
            "22zh_trouble_sleeping": ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping ? ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping : alternativeBlankSpace,
            "22zi_trouble_socialising": ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising ? ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising : alternativeBlankSpace,
            "22zj_uncontrolled_movements": ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements ? ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements : alternativeBlankSpace,
            "22zj_unwant_to_live": ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live ? ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live : alternativeBlankSpace,
            "22zk_wetting_soiling_myself": ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself ? ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself : alternativeBlankSpace,
            
            
            // //Section5
            "11_who_and_how_to_be_contacted_about_referral": ctx.request.body.referralData.section1.contact_person + concatString + ctx.request.body.referralData.section1.contact_preferences.join(', '),
            "30_mindwave_id": ctx.request.body.referralData.section1.reference_code
        }
    }

    else if (ctx.request.body.referralData.role == "Parent" || ctx.request.body.referralData.role == "parent" || ctx.request.body.referralData.role == "Family" || ctx.request.body.referralData.role == "family") {
        //console.log(ctx.request.body.referralData)
        console.log("parent request obj ----------------- #### ",ctx.request.body.referralData.section4.referral_reason_details) 
        console.log("----------------------------- finished --------------------------------")
        payLoad = { //Section 1
            "00a_referrer": ctx.request.body.referralData.role != "Family" ? ctx.request.body.referralData.role : "Family / friends",
            "00b_referral_type": ctx.request.body.referralData.section4.referral_type,
            "pat_dob": moment(ctx.request.body.referralData.section1.child_dob).format('YYYY-MM-DD'),
            "01_consent_from_child_to_share_with_camhs_partners": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,
            "01_consent_from_individual_to_share_with_amhs_partners": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,
            "04_registered_gp": formatingInput(ctx.request.body.referralData.section1.registered_gp),
            "05_registered_school": formatingInput(ctx.request.body.referralData.section1.gp_school),
            //Section 2
            "09_nhs_number_provided": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : "No",
            "pat_title": formatingInput(ctx.request.body.referralData.section2.child_name_title),
            "pat_firstname": formatingInput(ctx.request.body.referralData.section2.child_name),
            "pat_lastname": formatingInput(ctx.request.body.referralData.section2.child_lastname),
            "pat_email": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : alternativeBlankSpace,
            "pat_home_tel": ctx.request.body.referralData.section2.child_land_number != "No" ? ctx.request.body.referralData.section2.child_land_number : alternativeBlankSpace,
            "pat_mob_tel": ctx.request.body.referralData.section2.child_mobile_number != "No" ? ctx.request.body.referralData.section2.child_mobile_number : alternativeBlankSpace,
            "pat_address1": formatingInput(ctx.request.body.referralData.section2.pat_address1),
            "pat_address2": formatingInput(ctx.request.body.referralData.section2.pat_address2),
            "pat_town_city": formatingInput(ctx.request.body.referralData.section2.pat_town_city),
            "pat_county": formatingInput(ctx.request.body.referralData.section2.pat_county),
            "pat_postcode": ctx.request.body.referralData.section2.pat_postcode,
            "10_consent_to_contact_via_post": formatingInput(ctx.request.body.referralData.section2.can_send_post),
            "08a_gender_child_identifies_as": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "08a_gender_individual_indentifies_as": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "pat_gender": formatingInput(ctx.request.body.referralData.section2.sex_at_birth),
            "08b_does_child_identify_with_birth_gender": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "08b_does_individual_identify_with_birth_gender": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "08c_sexual_orientation": formatingInput(ctx.request.body.referralData.section2.child_sexual_orientation),
            "08d_ethnicity": formatingInput(ctx.request.body.referralData.section2.child_ethnicity),
            "13_is_a_carer_for_an_adult": formatingInput(ctx.request.body.referralData.section2.child_care_adult),
            "12_household_members": checkArray(householdMembers),

            "14a_parent_or_carer_details_with_parental_responsibility": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.parental_responsibility) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) : alternativeBlankSpace,

            "14a_emergency_contact_details": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number + concatString + (ctx.request.body.referralData.section2.parent_email != undefined ? ctx.request.body.referralData.section2.parent_email : "") : alternativeBlankSpace,


            "14b_parent_or_carer_contact_number": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number : alternativeBlankSpace,
            "14c_parent_or_carer_email": ctx.query.formType == "child" ? ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : alternativeBlankSpace : alternativeBlankSpace,
            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,

            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,


            "14e_parent_or_carer_address": formatingInput(ctx.request.body.referralData.section2.parent_address),
            "15_other_parent_or_carer_details": ctx.request.body.referralData.section2.parental_responsibility == "no" ? formatingInput(ctx.request.body.referralData.section2.responsibility_parent_firstname) + concatString + formatingInput(ctx.request.body.referralData.section2.responsibility_parent_lastname) : alternativeBlankSpace,
            // //Section3
            "17_profession_or_education_status": formatingInput(ctx.request.body.referralData.section3.child_profession),
            "18_place_of_education": formatingInput(ctx.request.body.referralData.section3.child_education_place),
            "19a_education_and_health_care_plan_EHCP": formatingInput(ctx.request.body.referralData.section3.child_EHCP),
            "19b_early_help_assessment_tool_EHAT": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section3.child_EHAT) : alternativeBlankSpace,
            "16a_care_leaver": formatingInput(ctx.request.body.referralData.section3.careLeaver),
            "20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "yes" ? formatingInputsocialWorker(ctx.request.body.referralData.section3.child_socialworker_firstname, ctx.request.body.referralData.section3.child_socialworker_lastname, ctx.request.body.referralData.section3.child_socialworker_contact_type, ctx.request.body.referralData.section3.child_socialworker_contact) : 'No',
            //"20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "no" ? 'No':alternativeBlankSpace,
            // //section4
            //"Support needs": ctx.request.body.referralData.section4.referral_type,
            "21_referral_related_to_covid": formatingInput(ctx.request.body.referralData.section4.is_covid),
            "27_problem_eating_disorder_difficulties": formatingInput(checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties)),
            "28_problem_food_and_fluid_intake": formatingInput(ctx.request.body.referralData.section4.food_fluid_intake),
            "29a_problem_height": formatingInput(ctx.request.body.referralData.section4.height),
            "29b_problem_weight": formatingInput(ctx.request.body.referralData.section4.weight),
            "22a_reason_for_referral": ctx.request.body.referralData.section4.reason_for_referral ? formatingInput(ctx.request.body.referralData.section4.reason_for_referral.join(', ')) : alternativeBlankSpace,
            "22b_reason_for_referral": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "22b_referral_issues": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "23_has_anything_helped": formatingInput(ctx.request.body.referralData.section4.has_anything_helped),
            "24_problem_any_particular_trigger": formatingInput(ctx.request.body.referralData.section4.any_particular_trigger),
            "25_any_disabilities_difficulties_health_conditions_or_challenging_behaviours": formatingInput(ctx.request.body.referralData.section4.disabilities),
            "26_previously_accessed_services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.join(', ') : alternativeBlankSpace,
            "26a_how_heard_about_service": formatingInput(ctx.request.body.referralData.section4.about_our_service),


             // ------------ Added By Aritra Basak ------------------

            "22c_bullying": ctx.request.body.referralData.section4.referral_reason_details.bullying ? ctx.request.body.referralData.section4.referral_reason_details.bullying : alternativeBlankSpace,
            "22d_clumsy_uncoordinated": ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated ? ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated : alternativeBlankSpace,
            "22e_compulsive_behaviour": ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour ? ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour : alternativeBlankSpace,
            "22f_drinking_drugs": ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs ? ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs : alternativeBlankSpace,
            "22g_feel_nervous": ctx.request.body.referralData.section4.referral_reason_details.feel_nervous ? ctx.request.body.referralData.section4.referral_reason_details.feel_nervous : alternativeBlankSpace,
            "22h_feel_stressed": ctx.request.body.referralData.section4.referral_reason_details.feel_stressed ? ctx.request.body.referralData.section4.referral_reason_details.feel_stressed : alternativeBlankSpace,
            "22i_hard_to_control": ctx.request.body.referralData.section4.referral_reason_details.hard_to_control ? ctx.request.body.referralData.section4.referral_reason_details.hard_to_control : alternativeBlankSpace,
             
            "22j_hurt_myself_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans : alternativeBlankSpace,
            "22k_hurt_myself_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed : alternativeBlankSpace,
            "22l_hurt_myself_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming : alternativeBlankSpace,
            "22m_hurt_myself_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming : alternativeBlankSpace,
          
          
          
            "22n_issues_food_diet": ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet ? ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet : alternativeBlankSpace,
            "22o_lack_confidence": ctx.request.body.referralData.section4.referral_reason_details.lack_confidence ? ctx.request.body.referralData.section4.referral_reason_details.lack_confidence : alternativeBlankSpace,
            "22p_low_self_esteem": ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem ? ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem : alternativeBlankSpace,
            "22q_panic_attack": ctx.request.body.referralData.section4.referral_reason_details.panic_attack ? ctx.request.body.referralData.section4.referral_reason_details.panic_attack : alternativeBlankSpace,
            "22r_problem_self_identity": ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity ? ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity : alternativeBlankSpace,
            "22s_problem_with_family": ctx.request.body.referralData.section4.referral_reason_details.problem_with_family ? ctx.request.body.referralData.section4.referral_reason_details.problem_with_family : alternativeBlankSpace,
            "22y_pullying_hair": ctx.request.body.referralData.section4.referral_reason_details.pullying_hair ? ctx.request.body.referralData.section4.referral_reason_details.pullying_hair : alternativeBlankSpace,
             
            "22u_sad_unhappy_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans : alternativeBlankSpace,
            "22v_sad_unhappy_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed : alternativeBlankSpace,
            "22w_sad_unhappy_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming : alternativeBlankSpace,
            "22x_sad_unhappy_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming : alternativeBlankSpace,
         
            
            "22y_scared_anxious": ctx.request.body.referralData.section4.referral_reason_details.scared_anxious ? ctx.request.body.referralData.section4.referral_reason_details.scared_anxious : alternativeBlankSpace,
            "22z_seeing_hearing_things": ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things ? ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things : alternativeBlankSpace,
           
            "22za_self_harming_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans : alternativeBlankSpace,
            "22zb_self_harming_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed : alternativeBlankSpace,
            "22zc_self_harming_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming : alternativeBlankSpace,
            "2zd_self_harming_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming : alternativeBlankSpace,
          
           
            "22ze_traumatic_experience": ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience ? ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience : alternativeBlankSpace,
            "22zf_trouble_concentrating": ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating ? ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating : alternativeBlankSpace,
            "22zg_trouble_read": ctx.request.body.referralData.section4.referral_reason_details.trouble_read ? ctx.request.body.referralData.section4.referral_reason_details.trouble_read : alternativeBlankSpace,
            "22zh_trouble_sleeping": ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping ? ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping : alternativeBlankSpace,
            "22zi_trouble_socialising": ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising ? ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising : alternativeBlankSpace,
            "22zj_uncontrolled_movements": ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements ? ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements : alternativeBlankSpace,
            "22zj_unwant_to_live": ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live ? ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live : alternativeBlankSpace,
            "22zk_wetting_soiling_myself": ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself ? ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself : alternativeBlankSpace,
            


            // //Section5
            "11_who_and_how_to_be_contacted_about_referral": ctx.request.body.referralData.section2.contact_person + concatString + ctx.request.body.referralData.section2.contact_preferences.join(', '),
            "30_mindwave_id": ctx.request.body.refCode
        }
    }
    else if (ctx.request.body.referralData.role == "Child" || ctx.request.body.referralData.role == "child" || ctx.request.body.referralData.role == "Young" || ctx.request.body.referralData.role == "young") {
        console.log("child request obj ----------------- #### ",ctx.request.body.referralData.section4.referral_reason_details) 
        console.log("----------------------------- finished --------------------------------")
        payLoad = { //Section 1
            "00a_referrer": ctx.request.body.referralData.role != "Young" ? ctx.request.body.referralData.role : "Young Person",
            "00b_referral_type": ctx.request.body.referralData.section4.referral_type,
            "pat_dob": moment(ctx.request.body.referralData.section1.child_dob).format('YYYY-MM-DD'),
            "01_consent_from_child_to_share_with_camhs_partners": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,
            "01_consent_from_individual_to_share_with_amhs_partners": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section1.consent_child) : alternativeBlankSpace,

            "02_consent_from_parent_or_carer_to_share_with_camhs_partners": formatingInput(ctx.request.body.referralData.section1.consent_parent),
            "02_consent_from_parent_or_carer_to_share_with_camhs_partners": formatingInput(ctx.request.body.referralData.section1.consent_parent),

            "03_any_reason_not_to_contact_parent_or_carer": ctx.query.formType == "child" && ctx.request.body.referralData.section1.contact_parent_camhs == 'no' ? formatingInput(ctx.request.body.referralData.section1.contact_parent_camhs) : alternativeBlankSpace,

            "03_any_reason_not_to_contact_parent_or_carer": ctx.query.formType == "child" && ctx.request.body.referralData.section1.contact_parent_camhs == 'yes' ? formatingInput(ctx.request.body.referralData.section1.contact_parent_camhs) + concatString + formatingInput(ctx.request.body.referralData.section1.reason_contact_parent_camhs) : alternativeBlankSpace,

            "04_registered_gp": formatingInput(ctx.request.body.referralData.section1.registered_gp),
            "05_registered_school": formatingInput(ctx.request.body.referralData.section1.gp_school),
            //Section 2
            "09_nhs_number_provided": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : alternativeBlankSpace,
            "pat_title": formatingInput(ctx.request.body.referralData.section2.child_name_title),
            "pat_firstname": formatingInput(ctx.request.body.referralData.section2.child_name),
            "pat_lastname": formatingInput(ctx.request.body.referralData.section2.child_lastname),
            "pat_email": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : alternativeBlankSpace,
            "pat_home_tel": ctx.request.body.referralData.section2.child_land_number ? ctx.request.body.referralData.section2.child_land_number : alternativeBlankSpace,
            "pat_mob_tel": ctx.request.body.referralData.section2.child_mobile_number ? ctx.request.body.referralData.section2.child_mobile_number : alternativeBlankSpace,
            "pat_address1": formatingInput(ctx.request.body.referralData.section2.pat_address1),
            "pat_address2": formatingInput(ctx.request.body.referralData.section2.pat_address2),
            "pat_town_city": formatingInput(ctx.request.body.referralData.section2.pat_town_city),
            "pat_county": formatingInput(ctx.request.body.referralData.section2.pat_county),
            "pat_postcode": ctx.request.body.referralData.section2.pat_postcode,
            "10_consent_to_contact_via_post": formatingInput(ctx.request.body.referralData.section2.can_send_post),
            "08a_gender_child_identifies_as": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "08a_gender_individual_indentifies_as": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender) : alternativeBlankSpace,
            "08b_does_child_identify_with_birth_gender": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "08b_does_individual_identify_with_birth_gender": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.child_gender_birth) : alternativeBlankSpace,
            "pat_gender": formatingInput(ctx.request.body.referralData.section2.sex_at_birth),
            "08c_sexual_orientation": formatingInput(ctx.request.body.referralData.section2.child_sexual_orientation),
            "08d_ethnicity": formatingInput(ctx.request.body.referralData.section2.child_ethnicity),
            "13_is_a_carer_for_an_adult": formatingInput(ctx.request.body.referralData.section2.child_care_adult),
            "12_household_members": checkArray(householdMembers),

            "14a_parent_or_carer_details_with_parental_responsibility": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.parental_responsibility) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) : alternativeBlankSpace,

            "14a_emergency_contact_details": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_name) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_lastname) + concatString + formatingInput(ctx.request.body.referralData.section2.child_parent_relationship) + concatString + formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number + concatString + (ctx.request.body.referralData.section2.parent_email != undefined ? ctx.request.body.referralData.section2.parent_email : "") : alternativeBlankSpace,


            "14b_parent_or_carer_contact_number": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_contact_type) + concatString + ctx.request.body.referralData.section2.parent_contact_number : alternativeBlankSpace,
            "14c_parent_or_carer_email": ctx.query.formType == "child" && ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : alternativeBlankSpace,
            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,
            "14d_parent_or_carer_lives_at_childs_address": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section2.parent_same_house) : alternativeBlankSpace,
            "14e_parent_or_carer_address": formatingInput(ctx.request.body.referralData.section2.parent_address),
            "15_other_parent_or_carer_details": ctx.request.body.referralData.section2.parental_responsibility == "no" ? formatingInput(ctx.request.body.referralData.section2.responsibility_parent_firstname) + concatString + formatingInput(ctx.request.body.referralData.section2.responsibility_parent_lastname) : alternativeBlankSpace,
            // //Section3
            "17_profession_or_education_status": formatingInput(ctx.request.body.referralData.section3.child_profession),
            "18_place_of_education": formatingInput(ctx.request.body.referralData.section3.child_education_place),
            "19a_education_and_health_care_plan_EHCP": formatingInput(ctx.request.body.referralData.section3.child_EHCP),
            "19b_early_help_assessment_tool_EHAT": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section3.child_EHAT) : alternativeBlankSpace,
            "16a_care_leaver": formatingInput(ctx.request.body.referralData.section3.careLeaver),
            "20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "yes" ? formatingInputsocialWorker(ctx.request.body.referralData.section3.child_socialworker_firstname, ctx.request.body.referralData.section3.child_socialworker_lastname, ctx.request.body.referralData.section3.child_socialworker_contact_type, ctx.request.body.referralData.section3.child_socialworker_contact) : 'No',
            //   "20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker == "no" ? 'No':alternativeBlankSpace,
            // //section4
            //"Support needs": ctx.request.body.referralData.section4.referral_type,
            "21_referral_related_to_covid": formatingInput(ctx.request.body.referralData.section4.is_covid),
            "27_problem_eating_disorder_difficulties": formatingInput(checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties)),
            "28_problem_food_and_fluid_intake": formatingInput(ctx.request.body.referralData.section4.food_fluid_intake),
            "29a_problem_height": formatingInput(ctx.request.body.referralData.section4.height),
            "29b_problem_weight": formatingInput(ctx.request.body.referralData.section4.weight),
            "22a_reason_for_referral": ctx.request.body.referralData.section4.reason_for_referral ? formatingInput(ctx.request.body.referralData.section4.reason_for_referral.join(', ')) : alternativeBlankSpace,
            "22b_reason_for_referral": ctx.query.formType == "child" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "22b_referral_issues": ctx.query.formType == "young" ? formatingInput(ctx.request.body.referralData.section4.referral_issues) : alternativeBlankSpace,
            "23_has_anything_helped": formatingInput(ctx.request.body.referralData.section4.has_anything_helped),
            "24_problem_any_particular_trigger": formatingInput(ctx.request.body.referralData.section4.any_particular_trigger),
            "25_any_disabilities_difficulties_health_conditions_or_challenging_behaviours": formatingInput(ctx.request.body.referralData.section4.disabilities),
            "26_previously_accessed_services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.join(', ') : alternativeBlankSpace,
            "26a_how_heard_about_service": formatingInput(ctx.request.body.referralData.section4.about_our_service),

             // ------------ Added By Aritra Basak ------------------

             

            "22c_bullying": ctx.request.body.referralData.section4.referral_reason_details.bullying ? ctx.request.body.referralData.section4.referral_reason_details.bullying : alternativeBlankSpace,
            "22d_clumsy_uncoordinated": ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated ? ctx.request.body.referralData.section4.referral_reason_details.clumsy_uncoordinated : alternativeBlankSpace,
            "22e_compulsive_behaviour": ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour ? ctx.request.body.referralData.section4.referral_reason_details.compulsive_behaviour : alternativeBlankSpace,
            "22f_drinking_drugs": ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs ? ctx.request.body.referralData.section4.referral_reason_details.drinking_drugs : alternativeBlankSpace,
            "22g_feel_nervous": ctx.request.body.referralData.section4.referral_reason_details.feel_nervous ? ctx.request.body.referralData.section4.referral_reason_details.feel_nervous : alternativeBlankSpace,
            "22h_feel_stressed": ctx.request.body.referralData.section4.referral_reason_details.feel_stressed ? ctx.request.body.referralData.section4.referral_reason_details.feel_stressed : alternativeBlankSpace,    
            "22i_hard_to_control": ctx.request.body.referralData.section4.referral_reason_details.hard_to_control ? ctx.request.body.referralData.section4.referral_reason_details.hard_to_control : alternativeBlankSpace,
          
            "22j_hurt_myself_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.ans : alternativeBlankSpace,
            "22k_hurt_myself_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.last_harmed : alternativeBlankSpace,
            "22l_hurt_myself_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.more_about_self_harming : alternativeBlankSpace,
            "22m_hurt_myself_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.hurt_myself.think_about_self_harming : alternativeBlankSpace,
          
            
            "22n_issues_food_diet": ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet ? ctx.request.body.referralData.section4.referral_reason_details.issues_food_diet : alternativeBlankSpace,
            "22o_lack_confidence": ctx.request.body.referralData.section4.referral_reason_details.lack_confidence ? ctx.request.body.referralData.section4.referral_reason_details.lack_confidence : alternativeBlankSpace,
            "22p_low_self_esteem": ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem ? ctx.request.body.referralData.section4.referral_reason_details.low_self_esteem : alternativeBlankSpace,
            "22q_panic_attack": ctx.request.body.referralData.section4.referral_reason_details.panic_attack ? ctx.request.body.referralData.section4.referral_reason_details.panic_attack : alternativeBlankSpace,
            "22r_problem_self_identity": ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity ? ctx.request.body.referralData.section4.referral_reason_details.problem_self_identity : alternativeBlankSpace,
            "22s_problem_with_family": ctx.request.body.referralData.section4.referral_reason_details.problem_with_family ? ctx.request.body.referralData.section4.referral_reason_details.problem_with_family : alternativeBlankSpace,
            "22y_pullying_hair": ctx.request.body.referralData.section4.referral_reason_details.pullying_hair ? ctx.request.body.referralData.section4.referral_reason_details.pullying_hair : alternativeBlankSpace,
           
            "22u_sad_unhappy_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.ans : alternativeBlankSpace,
            "22v_sad_unhappy_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.last_harmed : alternativeBlankSpace,
            "22w_sad_unhappy_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.more_about_self_harming : alternativeBlankSpace,
            "22x_sad_unhappy_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.sad_unhappy.think_about_self_harming : alternativeBlankSpace,
          
           
            "22y_scared_anxious": ctx.request.body.referralData.section4.referral_reason_details.scared_anxious ? ctx.request.body.referralData.section4.referral_reason_details.scared_anxious : alternativeBlankSpace,
            "22z_seeing_hearing_things": ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things ? ctx.request.body.referralData.section4.referral_reason_details.seeing_hearing_things : alternativeBlankSpace,
           
            "22za_self_harming_ever_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.ans : alternativeBlankSpace,
            "22zb_self_harming_last_self_harmed": ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.last_harmed : alternativeBlankSpace,
            "22zc_self_harming_more_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.more_about_self_harming : alternativeBlankSpace,
            "2zd_self_harming_think_about_self_harming": ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming ? ctx.request.body.referralData.section4.referral_reason_details.self_harming.think_about_self_harming : alternativeBlankSpace,
          
           
            "22ze_traumatic_experience": ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience ? ctx.request.body.referralData.section4.referral_reason_details.traumatic_experience : alternativeBlankSpace,
            "22zf_trouble_concentrating": ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating ? ctx.request.body.referralData.section4.referral_reason_details.trouble_concentrating : alternativeBlankSpace,
            "22zg_trouble_read": ctx.request.body.referralData.section4.referral_reason_details.trouble_read ? ctx.request.body.referralData.section4.referral_reason_details.trouble_read : alternativeBlankSpace,
            "22zh_trouble_sleeping": ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping ? ctx.request.body.referralData.section4.referral_reason_details.trouble_sleeping : alternativeBlankSpace,
            "22zi_trouble_socialising": ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising ? ctx.request.body.referralData.section4.referral_reason_details.trouble_socialising : alternativeBlankSpace,
            "22zj_uncontrolled_movements": ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements ? ctx.request.body.referralData.section4.referral_reason_details.uncontrolled_movements : alternativeBlankSpace,
            "22zj_unwant_to_live": ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live ? ctx.request.body.referralData.section4.referral_reason_details.unwant_to_live : alternativeBlankSpace,
            "22zk_wetting_soiling_myself": ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself ? ctx.request.body.referralData.section4.referral_reason_details.wetting_soiling_myself : alternativeBlankSpace,
            

            // //Section5
            "11_who_and_how_to_be_contacted_about_referral": ctx.request.body.referralData.section1.contact_person + concatString + ctx.request.body.referralData.section1.contact_preferences.join(', '),
            "30_mindwave_id": ctx.request.body.referralData.section1.reference_code
        }
    }
    return payLoad;
}


function formatingInput(input) {
    if (input) {
        var inputValue = input[0].toUpperCase() + input.slice(1);
        inputValue = inputValue.replace(/(\r\n|\n|\r)/gm, "");
        return inputValue.trim();
    }
    else {
        return alternativeBlankSpace;
    }

}

function formatingInputsocialWorker(fname, lname, contactType, contactNum) {
    var socialworkerInfo = 'Yes'
    if (fname) {
        socialworkerInfo += "," + fname
    }
    if (lname) {
        socialworkerInfo += "," + lname
    }
    if (contactNum) {
        socialworkerInfo += "," + contactType + "," + contactNum
    }

    // console.log(socialworkerInfo)

    return socialworkerInfo;

}