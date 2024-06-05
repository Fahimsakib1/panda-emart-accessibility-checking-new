const fs = require('fs');
const cheerio = require('cheerio');




// total count of all elements for the final evaluation 
let totalImageScanned = 0;
let totalImageWithIssuesScanned = 0;
let totalIssuesInImages = [];


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
let totalImagePerformanceScanned;


const startTime = new Date().getTime(); // Start timing




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
        else if ((altAttribute !== undefined && (altAttribute.trim() === "" || altAttribute.trim() === " " || altAttribute.trim() === '' || altAttribute.trim() === ' ')) && !(srcAttribute !== undefined && (srcAttribute.trim() === "" || srcAttribute.trim() === " " || srcAttribute.trim() === '' || srcAttribute.trim() === ' ')) && validExtensions.some(ext => srcAttribute.toLowerCase().endsWith(ext)) ) {
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
fs.readFile('../index.html', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

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
        console.log("Total missing src Attribute in images :", totalUndefinedSrcAttributeInImages.length);
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
        console.log("#### Solution: Add proper src extension like: jpg, png, webp, jpeg, etc,")
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
        console.log("#### Solution: Don't put the src and alt attribute empty and give a proper alt attribute name and add a proper image source with proper src extension like jpg, png, jpeg, etc")
        console.log('\n')
    } else {
        console.log('\n')
        console.log("No Image found that has issue.");
    }

    // Total number of Issueless Images
    if (totalNumberOfIssueLessImages.length > 0) {
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
        console.log("Total number of meaning less text in src attributes:", totalEmptyAltAndSrcCount);
        console.log("Total number of empty alt and  src attributes:", totalMeaningLessTextInSrcCount);
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



    console.log('\n')
    console.log('#################### Final Evaluation Summary ####################')

    console.log("Total", totalImageScanned + `${totalImageScanned > 1 ? ' Images' : ' Image'} found and among them `, totalImageWithIssuesScanned + `  ${totalImageWithIssuesScanned > 1 ? ' Images have' : ' Image has'} issues.... Image Accuracy: `, totalImagePerformanceScanned);

    let totalElements = totalImageScanned;
    console.log("Total Elements (Image): ", totalElements);

    let totalElementsWithIssues = totalImageWithIssuesScanned;
    console.log("Total Elements (Image) with Issues : ", totalElementsWithIssues);

    let overallPerformancePercentage = ((totalElements - totalElementsWithIssues) / totalElements * 100).toFixed(2) + '%';
    let websiteIssuesTotal = (100 - parseFloat(overallPerformancePercentage)).toFixed(2) + '%'
    console.log("Overall Accuracy of Scanned Elements: ", overallPerformancePercentage);
    console.log("Website's Issue Found: ", websiteIssuesTotal);

    const endTime = new Date().getTime(); // End timing
    const totalTime = (endTime - startTime) / 1000; // Calculate total time in seconds

    console.log(`Total scanning time: ${totalTime} seconds`);


});

