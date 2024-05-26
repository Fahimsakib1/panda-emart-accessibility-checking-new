anchorTags.each(function () {
    anchorCount++;
    totalLinkScanned++
    const $anchor = $(this);
    const anchorText = $anchor.text().trim();
    const hrefAttribute = $anchor.attr('href');
    const specialCharRegex = /^[!@#$%^&*()_+{}\[\]:;<>,.?/~\\\-]+$/;
    const containsImage = $anchor.find('img').length > 0;


    // Lines for having some other tags inside anchor tag
    const containsIcon1 = $anchor.children('i.fab').length > 0;
    const containsIcon2 = $anchor.children('i.fa').length > 0;
    const containsIcon3 = $anchor.children('i.fas').length > 0;
    const containsIcon4 = $anchor.children('i.far').length > 0;
    const containsText1 = anchorText.trim() !== '';
    const containsImproperElements = $anchor.children().filter(function () {
        return !$(this).is('i.fab' || 'i.fa' || 'i.fas' || 'i.far') || !$(this).is('img[src][alt]') || !$(this).is('label[for]') || !$(this).is('div, section, p, span, h1, h2, h3, h4, h5, h6, button, b, li, ul, ol, small, strong, sub, sup');
    }).length > 0;


    // These conditions should be in the first. Otherwise there will be mismatch. Tokhon Anchor tag er moddhe image thik moto thakleo sehita k refer kore as "no text in anchor tag".
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
        console.log('Hi')
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
        console.log("#### Solution: Add a proper text to the anchor that defines what this anchor tag is about (if proper href is provided)");
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
