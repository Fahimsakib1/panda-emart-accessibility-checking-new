const fs = require('fs');
const cheerio = require('cheerio');




function findImageAccessibilityIssues(htmlContent) {
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
        else if ((altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) && validExtensions.some(ext => srcAttribute.toLowerCase().endsWith(ext)) ) {
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
        else if (altRegex.test(altAttribute.trim())) {
            meaningLessTextInAltCount++;
            totalImageWithIssuesScanned++
            totalIssuesInImages.push($(this).toString());
            totalMeaningLessTextInAltAttributeInImages.push($(this).toString());
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