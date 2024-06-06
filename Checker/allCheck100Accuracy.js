const fs = require('fs');
const cheerio = require('cheerio');




// total count of all elements for the final evaluation 
let totalButtonScanned = 0;
let totalImageScanned = 0;
let totalLinkScanned = 0;
let totalFormScanned = 0;
let totalInputFieldScanned = 0;
let totalSelectTagScanned = 0;
let totalTextareaFieldScanned = 0;
let totalLabelScanned = 0;


// total issues count of all elements for the final evaluation
let totalButtonWithIssuesScanned = 0;
let totalLinkWithIssuesScanned = 0;
let totalImageWithIssuesScanned = 0;
let totalFormWithIssuesScanned = 0;
let totalInputFieldWithIssuesScanned = 0;
let totalLabelWithIssuesScanned = 0;



let totalIssuesInImages = [];
let totalIssuesInButtons = [];
let totalAnchorTagsWithIssues = [];
// let totalIssuesInForms = [];


let totalUndefinedAltAttributeInImages = [] // array for missing alt attributes
let totalEmptyAltAttributeInImages = []
let totalMeaningLessTextInAltAttributeInImages = []
let totalUndefinedSrcAttributeInImages = [] // array for missing alt attributes
let totalEmptySrcAttributeInImages = []
let totalMeaningLessTextInSrcAttributeInImages = []
let totalEmptyAltAndSrcAttributeInImages = []
let totalInvalidSrcExtensionInImages = []
let totalNumberOfIssueLessImages = []



// Performance scan of each elements for the final evaluation
let totalButtonPerformanceScanned;
let totalLinkPerformanceScanned;
let totalImagePerformanceScanned;
let totalFormPerformanceScanned;






const startTime = new Date().getTime(); // Start timing

function findEmptyButtonsAndEmptyAnchorLink(htmlContent) {

    const $ = cheerio.load(htmlContent);

    const buttonTags = $('button');
    const anchorTags = $('a');


    let buttonCount = 0;
    let emptyButtons = [];
    let meaningLessTextInButtons = [];
    let issueFreeButtons = []



    let anchorCount = 0;
    let emptyAnchors = [];
    let meaningLessTextInAnchors = [];
    let emptyHrefInAnchors = [];
    let invalidHrefAnchors = [];
    let issueFreeAnchors = [];
    let anchorNotContainImageProperly = [];


    const altRegexButton = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const altRegexAnchor = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;


    // Code for checking the buttons and anchor tags that are empty. Means no text in the button and anchor tags
    buttonTags.each(function () {
        buttonCount++;
        totalButtonScanned++
        const buttonText = $(this).text().trim();
        if (!buttonText) {
            emptyButtons.push($(this).toString());
            totalIssuesInButtons.push($(this).toString());
            totalButtonWithIssuesScanned++
            return;
        }
        if (altRegexButton.test(buttonText.trim())) {
            meaningLessTextInButtons.push($(this).toString());
            totalIssuesInButtons.push($(this).toString());
            totalButtonWithIssuesScanned++
            return;
        }
        issueFreeButtons.push($(this).toString());
    });




    anchorTags.each(function () {
        anchorCount++;
        totalLinkScanned++
        const $anchor = $(this);
        const anchorText = $anchor.text().trim();
        const hrefAttribute = $anchor.attr('href');
        const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
        const containsImage = $anchor.find('img').length > 0;

        // Lines for having some other tags inside anchor tag
        // const containsIcon1 = $anchor.children('i.fab').length > 0;
        // const containsIcon2 = $anchor.children('i.fa').length > 0;
        // const containsIcon3 = $anchor.children('i.fas').length > 0;
        // const containsIcon4 = $anchor.children('i.far').length > 0;
        // const containsText1 = anchorText.trim() !== '';



        const containsIcon1 = $anchor.find('i.fab[aria-hidden="true"]').length > 0;
        const containsIcon2 = $anchor.find('i.fa[aria-hidden="true"]').length > 0;
        const containsIcon3 = $anchor.find('i.fas[aria-hidden="true"]').length > 0;
        const containsIcon4 = $anchor.find('i.far[aria-hidden="true"]').length > 0;
        const containsText1 = anchorText.trim() !== '';
        const containsImproperElements = $anchor.children().filter(function () {
            return !$(this).is('i.fab' || 'i.fa' || 'i.fas' || 'i.far') || !$(this).is('img[src][alt]') || !$(this).is('label[for]') || !$(this).is('div, section, p, span, h1, h2, h3, h4, h5, h6, button, b, li, ul, ol, small, strong, sub, sup');
        }).length > 0;



        // These conditions should be in the first. Otherwise there will be mismatch. Tokhon Anchor tag er moddhe image thik moto thakleo sheita k refer kore as "no text in anchor tag".
        if (containsImage) {
            if (!hrefAttribute || hrefAttribute.trim() === '') {
                emptyHrefInAnchors.push($anchor.toString());
                totalAnchorTagsWithIssues.push($anchor.toString());
                totalLinkWithIssuesScanned++
                return;
            }
            const $img = $anchor.find('img');
            const altAttribute = $img.attr('alt');
            const srcAttribute = $img.attr('src');
            if (!altAttribute || altAttribute.trim() === '' || !srcAttribute || srcAttribute.trim() === '' || specialCharRegex.test(altAttribute)) {
                anchorNotContainImageProperly.push($anchor.toString());
                totalAnchorTagsWithIssues.push($anchor.toString());
                totalLinkWithIssuesScanned++
                return;
            }
            issueFreeAnchors.push($anchor.toString());
            return;
        }

        // These conditions should be in the third.
        if (altRegexAnchor.test(anchorText.trim())) {
            meaningLessTextInAnchors.push($anchor.toString());
            totalAnchorTagsWithIssues.push($anchor.toString());
            totalLinkWithIssuesScanned++
            return;
        } else if (!hrefAttribute || hrefAttribute.trim() === '') {
            emptyHrefInAnchors.push($anchor.toString());
            totalAnchorTagsWithIssues.push($anchor.toString());
            totalLinkWithIssuesScanned++
            return;
        } else if (!/^https?:\/\/|^www\./i.test(hrefAttribute) || specialCharRegex.test(anchorText)) {
            invalidHrefAnchors.push($anchor.toString());
            totalAnchorTagsWithIssues.push($anchor.toString());
            totalLinkWithIssuesScanned++
            return;
        }
        else {
            console.log('')
        }

        // These conditions should be in the last. Condition to determine if anchor tag contains icon in it and its issue free.
        if (containsText1 || containsIcon1 || containsIcon2 || containsIcon3 || containsIcon4 || !containsImproperElements) {
            issueFreeAnchors.push($anchor.toString());
            return;
        } else {
            emptyAnchors.push($anchor.toString());
            totalAnchorTagsWithIssues.push($anchor.toString());
            totalLinkWithIssuesScanned++;
            return;
        }

    });




    if (emptyButtons.length === 0 && meaningLessTextInButtons.length === 0) {
        console.log('\n');
        console.log('*********************** Button Summary ***********************');
        console.log("There is no empty button that contains no text in the code.");

        //Issue free buttons
        console.log('\n')
        console.log("Total Issue Free Buttons:", issueFreeButtons.length);
        issueFreeButtons.map(singleButton => {
            console.log(singleButton);
        });

    } else {
        console.log('\n');
        console.log('*********************** Button Summary ***********************');

        //empty buttons
        console.log("Total empty buttons or has no value text found:", emptyButtons.length);
        emptyButtons.map(singleButton => {
            console.log(singleButton);
        });

        if (emptyButtons.length > 0) {
            console.log("#### Solution: Don't let the button be empty. Add Text to the button.");
        }

        //Special character in button name
        console.log('\n')
        console.log("Total meaning less texts in buttons found:", meaningLessTextInButtons.length);
        meaningLessTextInButtons.map(singleButton => {
            console.log(singleButton);
        });
        if (meaningLessTextInButtons.length > 0) {
            console.log("#### Solution: Give a specific text to the button. Don't add meaningless texts");
        }


        //Total buttons with issues 
        console.log('\n')
        console.log("Total Buttons With Issues:", totalIssuesInButtons.length);
        totalIssuesInButtons.map(singleButton => {
            console.log(singleButton);
        });

        //Issue free buttons
        console.log('\n')
        console.log("Total Issue Free Buttons:", issueFreeButtons.length);
        issueFreeButtons.map(singleButton => {
            console.log(singleButton);
        });
    }


    // Calculate performance percentage of Buttons
    const totalButtons = buttonCount;
    const totalButtonsWithIssues = totalButtons - issueFreeButtons.length;
    let performancePercentageButtons;
    if (totalButtons > 0) {
        performancePercentageButtons = ((issueFreeButtons.length / totalButtons) * 100).toFixed(2) + '%';
        totalButtonPerformanceScanned = performancePercentageButtons
    } else {
        performancePercentageButtons = "Can't Calculate Performance as there is no button";
        totalButtonPerformanceScanned = performancePercentageButtons
    }
    console.log('\n');
    console.log("Total Buttons Found: ", buttonCount);
    console.log("Total Issue Free Buttons: ", issueFreeButtons.length);
    console.log("Total", buttonCount + " Buttons found and among them ", totalButtonsWithIssues + " Buttons have issues");
    console.log("Buttons Accuracy percentage:", performancePercentageButtons);

    console.log('\n');
    const emptyButton1 = 'https://webaim.org/standards/wcag/checklist#sc2.4.4'
    const emptyButton2 = 'https://webaim.org/standards/wcag/checklist#sc1.1.1'
    const moreGuidelineButton = 'https://www.w3.org/WAI/perspective-videos/controls/'
    if (emptyButtons.length > 0 || meaningLessTextInButtons.length > 0) {
        console.log('---------- WCAG Guidelines For Button Text ------------')
        console.log('Guideline for empty text in button:', emptyButton1);
        console.log('Guideline 2 for button:', emptyButton2);
        console.log('More Guidelines for button:', moreGuidelineButton);
    }




    //Anchor Summary Starts
    if (emptyAnchors.length === 0 && meaningLessTextInAnchors.length === 0 && emptyHrefInAnchors.length === 0) {
        console.log('\n');
        console.log('*********************** Anchor Summary ***********************');
        console.log("There is no empty anchor tag that contains no text in the code.");

        console.log('\n')
        console.log("Total Issue Free Anchor Tags:", issueFreeAnchors.length);
        issueFreeAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });

    } else {
        console.log('\n')
        console.log('*********************** Anchor Summary ***********************');

        // anchor tags with no text
        console.log("Total number of anchor tags with no text:", emptyAnchors.length);
        emptyAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (emptyAnchors.length > 0) {
            console.log("#### Solution: Add a proper text to the anchor that defines what this anchor tag is about (if proper href is provided). If there is an icon inside the anchor tag then check the if the aria-hidden provided or not. Do consider writing aria-hidden = 'true'. Also, add a title to the icon that defines what the icon is about");
        }

        // empty href in anchor tags
        console.log('\n')
        console.log("Total Anchors with No href or empty href:", emptyHrefInAnchors.length);
        emptyHrefInAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (emptyHrefInAnchors.length > 0) {
            console.log("#### Solution: Add href to the anchor tag if it is missing. If there is href than don't put it empty. Give a proper destination link in the href");
        }

        //Invalid href in anchor tag or contains special characters in it
        console.log('\n')
        console.log("Total Anchors with Invalid or meaning less text in href:", invalidHrefAnchors.length);
        invalidHrefAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (invalidHrefAnchors.length > 0) {
            console.log("#### Solution: Don't use invalid or  meaning less texts or links in href. Use a proper href link instead");
        }

        //Anchor Tag has images with issues
        console.log('\n')
        console.log("Anchor Tag Contains Image With Issues:", anchorNotContainImageProperly.length);
        anchorNotContainImageProperly.map(singleAnchor => {
            console.log(singleAnchor);
        });
        if (anchorNotContainImageProperly.length > 0) {
            console.log("#### Solution: Check the alt attribute if missing,  and use proper names to the alt attribute");
        }

        //Total anchor tags with issues 
        console.log('\n')
        console.log("Total Anchor Tags With Issues:", totalAnchorTagsWithIssues.length);
        totalAnchorTagsWithIssues.map(singleAnchor => {
            console.log(singleAnchor);
        });

        //Issue free anchor tags
        console.log('\n')
        console.log("Total Issue Free Anchor Tags:", issueFreeAnchors.length);
        issueFreeAnchors.map(singleAnchor => {
            console.log(singleAnchor);
        });

        // console.log('\n')
        // console.log("Total meaning less texts in anchor tag:", meaningLessTextInAnchors.length);
        // meaningLessTextInAnchors.map(singleAnchor => {
        //     console.log(singleAnchor);
        // });
    }


    // Calculate performance percentage of Anchors
    const totalAnchors = anchorCount;
    const totalAnchorsWithIssues = anchorCount - issueFreeAnchors.length;
    let performancePercentageAnchors;
    if (totalAnchors > 0) {
        performancePercentageAnchors = ((issueFreeAnchors.length / totalAnchors) * 100).toFixed(2) + '%';
        totalLinkPerformanceScanned = performancePercentageAnchors
    } else {
        performancePercentageAnchors = "Can't Calculate Performance as there is no anchor tag";
        totalLinkPerformanceScanned = performancePercentageAnchors
    }
    console.log('\n');
    console.log("Total Anchors Found: ", anchorCount);
    console.log("Total Issue Free Anchors: ", issueFreeAnchors.length);
    console.log("Total", anchorCount + " Anchors found and among them ", totalAnchorsWithIssues + " Anchors have issues");
    console.log("Anchors Accuracy percentage:", performancePercentageAnchors);


    console.log('\n');
    const anchorLinkGuideline = 'https://webaim.org/standards/wcag/checklist#sc2.4.4'
    const moreGuidelineLink = 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html'
    if (emptyAnchors.length > 0 || emptyHrefInAnchors.length > 0 || invalidHrefAnchors.length > 0 || meaningLessTextInAnchors.length > 0) {
        console.log('---------- WCAG Guidelines For link ------------')
        console.log('Guideline for empty text in Link:', anchorLinkGuideline);
        console.log('More Guidelines for Link:', moreGuidelineLink);
    }




    const forms = $('form');
    let totalForms = forms.length;
    // totalFormScanned = forms.length;
    console.log('\n')
    console.log("Total forms found in this code:", totalForms);


    let totalInputFieldsCount = 0;
    let totalInputFieldsIssueCount = 0;

    let totalLabelsCount = 0;
    let totalLabelsIssueCount = 0;





    //New Form Function 
    forms.each(function (index) {
        totalFormScanned++
        const form = $(this);
        const formLabels = form.find('label');
        const formInputs = form.find('input, select, textarea');
        // const formInputs = form.find('input, textarea, select');

        let emptyLabels = [];
        let labelsWithSpecialCharacters = [];
        let issueLessFormLabel = [];
        let missingTypeAttributesInInputField = [];
        let labeledInputFields = 0;


        let totalIssuesInForms = [];



        const forAttributesCount = {};
        const multipleLabelsWithSameFor = [];

        // Check labels for empty text or special characters
        formLabels.each(function () {
            totalLabelScanned++
            const labelText = $(this).text().trim();
            const forAttribute = $(this).attr('for');
            if (!labelText) {
                emptyLabels.push($(this).toString());
                totalIssuesInForms.push($(this).toString());
                totalFormWithIssuesScanned++
                totalLabelWithIssuesScanned++
            } else if (/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(labelText)) {
                labelsWithSpecialCharacters.push($(this).toString());
                totalIssuesInForms.push($(this).toString());
                totalFormWithIssuesScanned++
                totalLabelWithIssuesScanned++
            } else if (labelText && labelText.trim() !== '' && forAttribute && forAttribute.trim() !== '') {
                issueLessFormLabel.push($(this).toString());
            }
            else {
                // issueLessFormLabel.push($(this).toString());
            }


            //Check labels that have same name in multiple for attribute
            if (forAttribute && forAttribute.trim() !== '') {
                if (forAttributesCount[forAttribute]) {
                    forAttributesCount[forAttribute].count++;
                    forAttributesCount[forAttribute].labels.push($(this).toString());
                } else {
                    forAttributesCount[forAttribute] = {
                        count: 1,
                        labels: [$(this).toString()]
                    };
                }
            }


        });


        // Identify labels with duplicate 'for' attributes
        Object.keys(forAttributesCount).forEach(forAttr => {
            if (forAttributesCount[forAttr].count > 1) {
                multipleLabelsWithSameFor.push(...forAttributesCount[forAttr].labels);
            }
        });


        // Only consider the type attribute inside an input tag. It will not be included for the select tag 
        formInputs.each(function () {
            const $this = $(this);
            const tagName = $this.prop('tagName').toLowerCase();
            if (tagName === 'input') {
                totalInputFieldScanned++;
                const inputType = $this.attr('type');
                if (!inputType || inputType.trim() === '' || /[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]/.test(inputType)) {
                    missingTypeAttributesInInputField.push($this.toString());
                    totalIssuesInForms.push($(this).toString());
                    totalFormWithIssuesScanned++;
                    totalInputFieldWithIssuesScanned++;
                }
            }
            if (tagName === 'select') {
                totalSelectTagScanned++;
                // totalInputFieldScanned++;
            }
            if (tagName === 'textarea') {
                totalTextareaFieldScanned++;
                // totalInputFieldScanned++;
            }
        });


        // Count labeled input fields
        formInputs.each(function () {
            const input = $(this);
            const inputParent = input.parent();
            const associatedLabel = inputParent.is('label') ? inputParent : inputParent.find('label');
            if (associatedLabel.length > 0) {
                labeledInputFields++;
            }
        });

        console.log('\n')
        console.log("************** Form " + (index + 1) + "  **************");

        // Type related issues of input fields
        if (missingTypeAttributesInInputField.length > 0) {
            console.log('\n');
            console.log("Total number of input fields with missing or invalid type attribute:", missingTypeAttributesInInputField.length);
            missingTypeAttributesInInputField.forEach(inputField => {
                console.log(inputField);
            });
            console.log('#### Solution: Add type attribute and give proper value that defines what the input field is about.');
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same...")
        } else {
            console.log('\n')
            console.log("No type issues of input fields in this form.");
        }

        // Empty labels
        if (emptyLabels.length > 0) {
            console.log('\n')
            console.log("Total number of empty labels in this form found:", emptyLabels.length);
            emptyLabels.forEach(singleLabel => {
                console.log(singleLabel);
            });
            console.log("#### Solution: Don't put the form labels empty. Use propr name instead");
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same. There can not be same text in multiple for attributes...")
        } else {
            console.log('\n')
            console.log("No empty labels found in this form.");
        }

        // Labels with special characters
        if (labelsWithSpecialCharacters.length > 0) {
            console.log('\n');
            console.log("Total number of labels with special characters (Meaningless characters) in this form found:", labelsWithSpecialCharacters.length);
            labelsWithSpecialCharacters.forEach(singleLabel => {
                console.log(singleLabel);
            });
            console.log("#### Solution: Don't use meaningless text in form labels. It does not define what the inout put about");
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same. There can not be same text in multiple for attributes...")
        } else {
            console.log('\n')
            console.log("No labels found with special characters in this form.");
        }


        // Label that has same text in the "for" attribute
        if (multipleLabelsWithSameFor.length > 0) {
            console.log('\n')
            console.log("Total number of same text in multiple for attribute in this form:", multipleLabelsWithSameFor.length);
            multipleLabelsWithSameFor.forEach(singleLabel => {
                console.log(singleLabel);
            });
            console.log("#### Solution: Don't use same name in multiple 'for' attributes in a label.");
            console.log("#### Suggestion: In order to make a form label issue-free, you have to look to the for attribute of the label and the for attribute can not be empty. Labels can not be empty. You have to add proper text to the label.  Finally, the value of the for attribute of the label and the corresponding id value of the input field should be same. There can not be same text in multiple for attributes...")
        } else {
            console.log('\n')
            console.log("No multiple labels found that have same name in the 'for' attribute in this form.");
        }


        // Total number of Issues (including all) In Forms
        if (totalIssuesInForms.length > 0) {
            console.log('\n')
            console.log("Total number of Issues in this form:", totalIssuesInForms.length);
            totalIssuesInForms.forEach(singleIssue => {
                console.log(singleIssue);
            });
            console.log('\n')
            console.log("##### Note: There are some potential issues found for this form.")
            console.log("1. type attribute related issues (missing type attribute, empty type attribute, special character in type attribute) of an input field. ")
            console.log("2. label related issues (empty label, special character in label), etc. ")
        } else {
            console.log('\n')
            console.log("No issue found in this form.");
        }


        // Issue less Form Labels
        if (issueLessFormLabel.length > 0) {
            console.log('\n')
            console.log("Total number of Issue free labels in this form:", issueLessFormLabel.length);
            issueLessFormLabel.forEach(singleLabel => {
                console.log(singleLabel);
            });
        } else {
            console.log('\n')
            console.log("No issue free labels found in this form.");
        }

        // Input fields without labels
        const totalInputFields = formInputs.length;
        const inputFieldsWithLabels = labeledInputFields;
        const inputFieldsWithoutLabels = totalInputFields - inputFieldsWithLabels;
        console.log('\n');
        console.log("Total number of input fields in this form:", totalInputFields);
        console.log("Number of input fields with labels:", inputFieldsWithLabels);
        console.log("Number of input fields without labels:", inputFieldsWithoutLabels);
        console.log("Total number of labels in this form:", formLabels.length);
        console.log("Total number of issues in this form:", totalIssuesInForms.length);


        // Increment total counts
        totalInputFieldsCount += totalInputFields;
        totalLabelsCount += formLabels.length;
        totalInputFieldsIssueCount += missingTypeAttributesInInputField.length;
        totalLabelsIssueCount += emptyLabels.length + labelsWithSpecialCharacters.length;


        if (emptyLabels.length > 0 || labelsWithSpecialCharacters.length > 0 || issueLessFormLabel.length > 0 || labeledInputFields > 0 || missingTypeAttributesInInputField.length.length > 0) {
            console.log('\n');
            const formGuideline = 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
            const formGuidelineMore = 'https://www.w3.org/WAI/tutorials/forms/labels/'
            console.log('---------- WCAG Guidelines For Form ------------')
            console.log('Guideline for Form:', formGuideline);
            console.log('More Guidelines for Form:', formGuidelineMore);
        }

        //setting the total input fields and label numbers for evaluation
        getAllInputFieldsCount = formInputs.length;
        getAllLabelsCount = formLabels.length;
        getAllInputFieldsIssueCount = totalInputFieldsIssueCount;
        getAllLabelsIssueCount = totalLabelsIssueCount;
    });




    // Calculate performance percentage of Forms
    let performancePercentageForms;
    if (forms.length > 0) {
        performancePercentageForms = (((0.5 * ((totalInputFieldsCount - totalInputFieldsIssueCount) / totalInputFieldsCount)) + (0.5 * ((totalLabelsCount - totalLabelsIssueCount) / totalLabelsCount))) * 100).toFixed(2) + '%';
        totalFormPerformanceScanned = performancePercentageForms
    } else {
        performancePercentageForms = "Can't Calculate Performance as there is no forms";
        totalFormPerformanceScanned = performancePercentageForms
    }


    //Total counts for forms
    console.log('\n');
    console.log('************** Form Summary **************');
    console.log('Total Form Count: ', totalForms)
    console.log("Total number of input fields across all forms ", totalInputFieldsCount + " among them ", totalInputFieldsIssueCount + ' have issues');
    console.log("Total number of labels across all forms ", totalLabelsCount + " among them ", totalLabelsIssueCount + ' have issues');
    console.log("Form Accuracy Percentage:", performancePercentageForms);



    // Code for checking the multiple form labels.
    let inputLabels = {}; // Object to store input labels and associated form labels
    forms.each(function (index) {
        const form = $(this);
        const formLabels = form.find('label');
        const formInputs = form.find('input, select, textarea, option, fieldset');
        formLabels.each(function () {
            const labelText = $(this).text().trim();
            if (!labelText) {
                const inputId = $(this).attr('for');
                if (inputId) {
                    if (!inputLabels[inputId]) {
                        inputLabels[inputId] = {
                            count: 1,
                            forms: [index + 1]
                        };
                    } else {
                        inputLabels[inputId].count++;
                        if (!inputLabels[inputId].forms.includes(index + 1)) {
                            inputLabels[inputId].forms.push(index + 1);
                        }
                    }
                }
            }
        });
    });


    // console the results
    console.log('\n')
    Object.keys(inputLabels).forEach(inputId => {
        const labelInfo = inputLabels[inputId];
        if (labelInfo.count > 1) {
            console.log(`Input label with ID "${inputId}" has multiple form labels associated with form ${labelInfo.forms.join(', ')}`);
        }
    });
}


// function for checking the issues (Missing alt attribute, Missing src attribute, Empty alt attribute, Empty src attribute, Issue less alt attribute) with alt attributes of image tag
console.log('\n')
console.log('*********************** Image Summary ***********************');
function findImagesWithoutAlt(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const imgTags = $('img');
    let undefinedAltCount = 0;
    let emptyAltCount = 0;
    let undefinedSrcCount = 0;
    let emptySrcCount = 0;
    let emptyAltAndSrcCount = 0;
    let issueLessImageTagCount = 0;
    let meaningLessTextInAltCount = 0;
    let meaningLessTextInSrcCount = 0;
    let invalidSrcExtensionCount = 0;



    const altRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const srcRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;


    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.pjp', '.pjpeg', '.jfif'];



    imgTags.each(function () {
        totalImageScanned++
        const altAttribute = $(this).attr('alt');
        const srcAttribute = $(this).attr('src');

        if (altAttribute === undefined) {
            undefinedAltCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalUndefinedAltAttributeInImages.push($(this).toString());
        }
        else if ((altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) && !(srcAttribute !== undefined && (srcAttribute.trim() === "" || srcAttribute.trim() === " " || srcAttribute.trim() === '' || srcAttribute.trim() === ' ')) && validExtensions.some(ext => srcAttribute.toLowerCase().endsWith(ext))) {
            emptyAltCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalEmptyAltAttributeInImages.push($(this).toString());
        }
        else if (srcAttribute === undefined) {
            undefinedSrcCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalUndefinedSrcAttributeInImages.push($(this).toString());
        }
        else if ((srcAttribute !== undefined && (srcAttribute.trim() === "" || srcAttribute.trim() === " " || srcAttribute.trim() === '' || srcAttribute.trim() === ' ')) && !((altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')))) {
            emptySrcCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalEmptySrcAttributeInImages.push($(this).toString());
        }
        else if ((altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) && (srcAttribute !== undefined && (srcAttribute.trim() === "" || srcAttribute.trim() === " " || srcAttribute.trim() === '' || srcAttribute.trim() === ' '))) {
            emptyAltAndSrcCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalEmptyAltAndSrcAttributeInImages.push($(this).toString());
        }
        else if (altRegex.test(altAttribute.trim())) {
            meaningLessTextInAltCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalMeaningLessTextInAltAttributeInImages.push($(this).toString());
        }
        else if (srcRegex.test(srcAttribute.trim())) {
            meaningLessTextInSrcCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalMeaningLessTextInSrcAttributeInImages.push($(this).toString());
        }
        else if (!validExtensions.some(ext => srcAttribute.toLowerCase().endsWith(ext))) {
            invalidSrcExtensionCount++;
            totalImageWithIssuesScanned++;
            totalIssuesInImages.push($(this).toString());
            totalInvalidSrcExtensionInImages.push($(this).toString());
        }
        else {
            issueLessImageTagCount++;
            totalNumberOfIssueLessImages.push($(this).toString());
        }
    });
    return { undefinedAltCount, emptyAltCount, undefinedSrcCount, emptySrcCount, emptyAltAndSrcCount, issueLessImageTagCount, meaningLessTextInAltCount, meaningLessTextInSrcCount, invalidSrcExtensionCount, totalIssuesInImages };
}



// Read the file that we want to check accessibility issue
fs.readFile('../mainTestScriptFile.html', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // *************** coder for showing issues with alt attributes of image tags ***************

    // Extract HTML content from JSX
    const htmlContent = data.match(/<div[^>]*>(.*?)<\/div>/gs);
    let totalUndefinedAltCount = 0;
    let totalEmptyAltCount = 0;
    let totalUndefinedSrcCount = 0;
    let totalEmptySrcCount = 0;
    let totalEmptyAltAndSrcCount = 0;
    let totalIssueLessImageTagCount = 0;
    let totalMeaningLessTextInAltCount = 0;
    let totalMeaningLessTextInSrcCount = 0;
    let totalInvalidSrcExtensionCount = 0;


    htmlContent.forEach((content) => {
        const { undefinedAltCount, emptyAltCount, undefinedSrcCount, emptySrcCount, emptyAltAndSrcCount, issueLessImageTagCount, meaningLessTextInAltCount, meaningLessTextInSrcCount, invalidSrcExtensionCount, totalIssuesInImages } = findImagesWithoutAlt(content);
        totalUndefinedAltCount += undefinedAltCount;
        totalEmptyAltCount += emptyAltCount;
        totalUndefinedSrcCount += undefinedSrcCount;
        totalEmptySrcCount += emptySrcCount;
        totalEmptyAltAndSrcCount += emptyAltAndSrcCount;
        totalIssueLessImageTagCount += issueLessImageTagCount;
        totalMeaningLessTextInAltCount += meaningLessTextInAltCount;
        totalMeaningLessTextInSrcCount += meaningLessTextInSrcCount;
        totalInvalidSrcExtensionCount += invalidSrcExtensionCount;
    });



    // Total Missing Alt Attributes In Images
    if (totalUndefinedAltAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total missing Alt Attribute in images :", totalUndefinedAltAttributeInImages.length);
        totalUndefinedAltAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Add alt attribute to image tag and give a proper alt attribute name")
    } else {
        console.log('\n')
        console.log("No Image found that has missing alt attribute issue.");
    }

    // Total Empty Alt Attributes In Images
    if (totalEmptyAltAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total empty Alt Attribute in images :", totalEmptyAltAttributeInImages.length);
        totalEmptyAltAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Don't put the alt attribute empty and give a proper alt attribute name")
    } else {
        console.log('\n')
        console.log("No Image found that has empty alt attribute.");
    }

    // Total Meaningless Text in Alt Attributes In Images
    if (totalMeaningLessTextInAltAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total Meaningless text in Alt Attribute in images :", totalMeaningLessTextInAltAttributeInImages.length);
        totalMeaningLessTextInAltAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Don't give meaningless/invalid names to alt attribute, give a proper alt attribute name instead")
    } else {
        console.log('\n')
        console.log("No Image found that has meaningless alt attribute.");
    }

    // Total Missing src  Attributes In Images
    if (totalUndefinedSrcAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total missing Src Attribute in images :", totalUndefinedSrcAttributeInImages.length);
        totalUndefinedSrcAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Add src attribute to image tag and give a proper source to the image")
    } else {
        console.log('\n')
        console.log("No Image found that has missing src attribute issue.");
    }

    // Total Empty src Attributes In Images
    if (totalEmptySrcAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total empty src Attribute in images :", totalEmptySrcAttributeInImages.length);
        totalEmptySrcAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Don't put the src attribute empty and give a proper src attribute name")
    } else {
        console.log('\n')
        console.log("No Image found that has empty src attribute.");
    }

    // Total Meaningless Text in Alt Attributes In Images
    if (totalMeaningLessTextInSrcAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total Meaningless text in Src Attribute in images :", totalMeaningLessTextInSrcAttributeInImages.length);
        totalMeaningLessTextInSrcAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Don't give meaningless/invalid names to the src attribute, give a proper source to the image instead")
    } else {
        console.log('\n')
        console.log("No Image found that has meaningless Src attribute.");
    }

    // Total empty Alt and src Attributes In Images
    if (totalEmptyAltAndSrcAttributeInImages.length > 0) {
        console.log('\n')
        console.log("Total empty Alt and src Attribute in images :", totalEmptyAltAndSrcAttributeInImages.length);
        totalEmptyAltAndSrcAttributeInImages.forEach(singleImage => {
            console.log(singleImage);
        });
    } else {
        console.log('\n')
        console.log("No Image found that has empty Alt and src attribute.");
    }

    // Total Invalid Src Extension In Images
    if (totalInvalidSrcExtensionInImages.length > 0) {
        console.log('\n');
        console.log("Total invalid src extension in images :", totalInvalidSrcExtensionInImages.length);
        totalInvalidSrcExtensionInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Add proper src extension like: jpg, png, webp, jpeg, gif, etc.")
    } else {
        console.log('\n');
        console.log("No Image found that has invalid src extension.");
    }

    // Total Issue In Images
    if (totalIssuesInImages.length > 0) {
        console.log('\n')
        console.log("Total issues in images :", totalIssuesInImages.length);
        totalIssuesInImages.forEach(singleImage => {
            console.log(singleImage);
        });
        console.log("#### Solution: Don't put the src and alt attribute empty and give a proper alt attribute name and add a proper image source")
        console.log('\n')
    } else {
        console.log('\n')
        console.log("No Image found that has issue.");
    }

    // Total number of Issueless Images
    if (totalNumberOfIssueLessImages.length > 0) {
        console.log('\n')
        console.log("Total issue less images :", totalNumberOfIssueLessImages.length);
        totalNumberOfIssueLessImages.forEach(singleImage => {
            console.log(singleImage);
        });
    } else {
        console.log('\n')
        console.log("No Image found that has no issues.");
    }


    if (totalUndefinedAltCount === 0 && totalEmptyAltCount === 0 && totalUndefinedSrcCount === 0 && totalEmptySrcCount === 0 && totalEmptyAltAndSrcCount === 0 && totalIssueLessImageTagCount === 0 && totalMeaningLessTextInAltCount === 0 && totalMeaningLessTextInSrcCount === 0 && totalInvalidSrcExtensionCount === 0) {
        console.log('\n')
        console.log("Total number of image tags that do not have alt attributes:", 0);
        console.log("Total number of image tags with empty alt attributes:", 0);
        console.log("Total number of meaning less text in alt attributes:", 0);

        console.log("Total number of image tags that do not have src attribute:", 0);
        console.log("Total number of image tags with empty src attribute:", 0);
        console.log("Total number of meaning less text in src attribute:", 0);


        console.log("Total number of issues related to src extension on image:", 0);

        console.log("Total number of image tags that are issue free:", 0);
    } else {

        // Calculate performance percentage of Images
        const totalImages = totalImageScanned;
        const issueFreeImages = totalIssueLessImageTagCount;
        const totalIssues = totalImages - issueFreeImages;

        let performancePercentageImages;
        if (totalImages > 0) {
            performancePercentageImages = ((issueFreeImages / totalImages) * 100).toFixed(2) + '%';
            totalImagePerformanceScanned = performancePercentageImages
        } else {
            performancePercentageImages = "Can't Calculate Performance as there is no Image";
            totalImagePerformanceScanned = performancePercentageImages
        }

        console.log('\n')
        console.log("Total Images Found: ", totalImages);
        console.log("Total number of image tags that do not have alt attributes:", totalUndefinedAltCount);
        console.log("Total number of image tags with empty alt attributes:", totalEmptyAltCount);
        console.log("Total number of meaning less text in alt attributes:", totalMeaningLessTextInAltCount);
        console.log("Total number of image tags that do not have src attributes:", totalUndefinedSrcCount);
        console.log("Total number of image tags with empty src attributes:", totalEmptySrcCount);
        console.log("Total number of meaning less text in src attributes:", totalMeaningLessTextInSrcCount);
        console.log("Total number of empty alt and  src attributes:", totalEmptyAltAndSrcCount);
        console.log("Total number of improper image extension in src attribute:", totalInvalidSrcExtensionCount);
        console.log("Total number of image tags that are issue free:", totalIssueLessImageTagCount);
        console.log('\n');
        console.log("Total", totalImages + " Images found and among them ", totalIssues + `${totalIssues > 1 ? '  Images have' : ' Image has'} issues`);
        console.log("Image Accuracy percentage:", performancePercentageImages);


        console.log('\n');
        const nullOrEmptyTextOrMissingAltImage = 'https://webaim.org/standards/wcag/checklist#sc1.1.1'
        const howToSolveThisIssue = 'https://www.w3.org/WAI/WCAG20/quickref/20160105/#text-equiv-all'
        if (totalUndefinedAltCount > 0 || totalEmptyAltCount > 0 || totalMeaningLessTextInAltCount > 0) {
            console.log('---------- WCAG Guidelines For Image Alt Attribute------------')
            console.log('Guidelines for null or empty or suspicious alt text: ', nullOrEmptyTextOrMissingAltImage)
            console.log('Guidelines for how to Meet 1.1.1 (Non-text Content): ', howToSolveThisIssue)
        }

    }




    // call the function for showing issues of buttons, anchor tags, form label 
    findEmptyButtonsAndEmptyAnchorLink(data);

    console.log('\n')
    console.log('#################### Final Evaluation Summary ####################')

    console.log("Total", totalImageScanned + `${totalImageScanned > 1 ? ' Images' : ' Image'} found and among them `, totalImageWithIssuesScanned + `  ${totalImageWithIssuesScanned > 1 ? ' Images have' : ' Image has'} issues.... Image Accuracy: `, totalImagePerformanceScanned);

    console.log("Total", totalButtonScanned + `${totalButtonScanned > 1 ? ' buttons' : ' button'} found and among them `, totalButtonWithIssuesScanned + `${totalButtonWithIssuesScanned > 1 ? ' buttons have' : ' button has'} issues.... Button Accuracy: `, totalButtonPerformanceScanned);

    console.log("Total", totalLinkScanned + `${totalLinkScanned > 1 ? ' anchor tags' : ' anchor tag'} found and among them `, totalLinkWithIssuesScanned + `${totalLinkWithIssuesScanned > 1 ? ' anchor tags have' : ' anchor tags has'} issues.... Link Accuracy: `, totalLinkPerformanceScanned);


    console.log((`Total ${totalFormScanned} ${totalFormScanned > 1 ? ' forms' : ' form'} found. Total Input Field Scanned: ${totalInputFieldScanned}. Total Label Scanned: ${totalLabelScanned}`))

    console.log((`Total Select Field Scanned: ${totalSelectTagScanned}, and Total Textarea Field Scanned: ${totalTextareaFieldScanned}`))

    console.log((`Form related total issues ${totalFormWithIssuesScanned} (Input Field Issue: ${totalInputFieldWithIssuesScanned}, Label Issue: ${totalLabelWithIssuesScanned}). Overall Form Accuracy: ${totalFormPerformanceScanned}`))


    let totalElements = totalImageScanned + totalButtonScanned + totalLinkScanned + totalInputFieldScanned + totalLabelScanned + totalSelectTagScanned + totalTextareaFieldScanned;
    console.log("Total Elements (Image, Button, Link, Input, Label): ", totalElements);


    let totalElementsWithIssues = totalImageWithIssuesScanned + totalButtonWithIssuesScanned + totalLinkWithIssuesScanned + totalInputFieldWithIssuesScanned + totalLabelWithIssuesScanned;
    console.log("Total Elements (Image, Button, Link, Input, Label) with Issues : ", totalElementsWithIssues);

    let overallPerformancePercentage = ((totalElements - totalElementsWithIssues) / totalElements * 100).toFixed(2) + '%';
    let websiteIssuesTotal = (100 - parseFloat(overallPerformancePercentage)).toFixed(2) + '%'
    console.log("Overall Accuracy of Scanned Elements: ", overallPerformancePercentage);
    console.log("Website's Issue Found: ", websiteIssuesTotal);


    const endTime = new Date().getTime(); // End timing
    const totalTime = (endTime - startTime) / 1000; // Calculate total time in seconds

    console.log(`Total scanning time: ${totalTime} seconds`);


});

