/* =========================================================
   ORANGE Q AI
   CONNECTED PROTOTYPE APPLICATION
========================================================= */


/* =========================================================
   APPLICATION STATE
========================================================= */

const STORAGE_KEY = "orangeQAI_state_v1";

const defaultState = {

    theme: "light",

    role: "Uploader",

    currentPlantId: null,

    selectedExpertCase: null,

    plants: []

};


let state = loadState();


/* =========================================================
   SAMPLE DATA
   Added automatically only on first launch
========================================================= */

function createSamplePlants() {

    return [

        {
            id: "ORG-DEMO-01",

            batch: "NGP-DEMO-01",

            nursery: "Green Valley Nursery",

            variety: "Nagpur Orange",

            createdAt: new Date().toISOString(),

            scenario: "healthy",

            imageData: null,

            imageName: "Demo Plant",

            imageQuality: {
                score: 94,
                resolution: "Good",
                brightness: "Good",
                sharpness: "Good",
                visibility: "Good",
                status: "good",
                message: "Image quality is suitable for AI assessment."
            },

            ai: {
                score: 91,
                confidence: 93,

                status: "suitable",

                factors: {
                    health: 94,
                    vigour: 89,
                    leaf: 92,
                    canopy: 90,
                    symptoms: 95,
                    damage: 96
                },

                trueType: {
                    overall: 91,
                    leafShape: 92,
                    leafColour: 95,
                    canopy: 90,
                    growth: 87
                },

                positives: [
                    "Healthy-looking green foliage detected.",
                    "Good overall plant vigour and canopy development.",
                    "No major visible damage indicators.",
                    "Visual characteristics are reasonably consistent with the selected reference profile."
                ],

                risks: [
                    "Minor natural variation may require routine expert confirmation."
                ],

                summary:
                    "The plant demonstrates strong visual indicators of healthy nursery planting material.",

                nextTitle:
                    "Suitable for selection",

                nextText:
                    "The AI result is suitable for proceeding with normal nursery selection, subject to standard quality procedures."
            },

            expert: {
                status: "approved",

                decision: "Approve",

                comment:
                    "Demo case approved after visual review."
            }

        },

        {
            id: "ORG-DEMO-02",

            batch: "NGP-DEMO-01",

            nursery: "Green Valley Nursery",

            variety: "Nagpur Orange",

            createdAt: new Date(Date.now() - 86400000).toISOString(),

            scenario: "questionable",

            imageData: null,

            imageName: "Demo Plant",

            imageQuality: {
                score: 90,
                resolution: "Good",
                brightness: "Good",
                sharpness: "Good",
                visibility: "Good",
                status: "good",
                message: "Image quality is suitable for AI assessment."
            },

            ai: {
                score: 68,
                confidence: 61,

                status: "questionable",

                factors: {
                    health: 72,
                    vigour: 61,
                    leaf: 68,
                    canopy: 75,
                    symptoms: 64,
                    damage: 82
                },

                trueType: {
                    overall: 63,
                    leafShape: 67,
                    leafColour: 61,
                    canopy: 66,
                    growth: 58
                },

                positives: [
                    "Plant remains visibly assessable.",
                    "Basic canopy structure is present.",
                    "No severe physical damage is apparent."
                ],

                risks: [
                    "Moderate leaf discoloration is visible.",
                    "Plant vigour is below the preferred range.",
                    "True-to-type visual similarity is inconclusive.",
                    "AI confidence is not high enough for automatic approval."
                ],

                summary:
                    "The plant shows mixed quality indicators and requires expert verification before selection.",

                nextTitle:
                    "Expert verification required",

                nextText:
                    "The system recommends human review because the AI confidence and true-to-type similarity are inconclusive."
            },

            expert: {
                status: "pending",

                decision: "",

                comment: ""
            }

        },

        {
            id: "ORG-DEMO-03",

            batch: "NGP-DEMO-02",

            nursery: "Orange Research Nursery",

            variety: "Nagpur Orange",

            createdAt: new Date(Date.now() - 172800000).toISOString(),

            scenario: "poor",

            imageData: null,

            imageName: "Demo Plant",

            imageQuality: {
                score: 92,
                resolution: "Good",
                brightness: "Good",
                sharpness: "Good",
                visibility: "Good",
                status: "good",
                message: "Image quality is suitable for AI assessment."
            },

            ai: {
                score: 38,
                confidence: 89,

                status: "rejected",

                factors: {
                    health: 42,
                    vigour: 35,
                    leaf: 39,
                    canopy: 48,
                    symptoms: 31,
                    damage: 44
                },

                trueType: {
                    overall: 82,
                    leafShape: 84,
                    leafColour: 80,
                    canopy: 82,
                    growth: 81
                },

                positives: [
                    "Some visual characteristics remain consistent with the selected variety."
                ],

                risks: [
                    "Poor plant vigour detected.",
                    "Significant visible leaf abnormalities are present.",
                    "Multiple plant-quality risk indicators were identified.",
                    "Overall health score is below the preferred selection threshold."
                ],

                summary:
                    "The plant shows substantial quality-risk indicators despite reasonable visual variety similarity.",

                nextTitle:
                    "Not recommended",

                nextText:
                    "Do not select this plant as preferred planting material. Inspect other plants in the same batch for similar issues."
            },

            expert: {
                status: "rejected",

                decision: "Reject",

                comment:
                    "Demo case rejected because visible quality-risk indicators are significant."
            }

        }

    ];
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadState() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {

            const parsed = JSON.parse(saved);

            return {
                ...defaultState,
                ...parsed
            };
        }

    } catch (error) {

        console.warn("Could not load saved state.", error);
    }


    const fresh = {
        ...defaultState,
        plants: createSamplePlants()
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(fresh)
    );

    return fresh;
}


function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    applyTheme();

    bindNavigation();

    bindTheme();

    bindNotifications();

    bindAssessment();

    bindModalControls();

    bindPrint();

    renderDashboard();

    renderExpertQueue();

    renderReports();

    renderTrueType();

    updateExpertBadge();

    showView("dashboard");
}


/* =========================================================
   NAVIGATION
========================================================= */

function bindNavigation() {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest("[data-view]");

            if (!target) return;

            const view =
                target.dataset.view;

            showView(view);
        }
    );
}


function showView(viewName) {

    $$(".view").forEach(view => {

        view.classList.remove("active-view");
    });


    const selected =
        $(`#view-${viewName}`);

    if (selected) {

        selected.classList.add("active-view");
    }


    $$(".nav-item").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.view === viewName
        );
    });


    const titles = {

        dashboard: "Dashboard",

        assessment: "AI Assessment",

        truetype: "True-to-Type Verification",

        expert: "Expert Review",

        reports: "Final Reports"

    };


    $("#pageTitle").textContent =
        titles[viewName] || "Dashboard";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (viewName === "dashboard") {
        renderDashboard();
    }

    if (viewName === "expert") {
        renderExpertQueue();
    }

    if (viewName === "reports") {
        renderReports();
    }

    if (viewName === "truetype") {
        renderTrueType();
    }
}


/* =========================================================
   THEME
========================================================= */

function bindTheme() {

    $("#themeToggle").addEventListener(
        "click",
        () => {

            state.theme =
                state.theme === "dark"
                    ? "light"
                    : "dark";

            saveState();

            applyTheme();
        }
    );
}


function applyTheme() {

    document.body.classList.toggle(
        "dark-mode",
        state.theme === "dark"
    );


    $("#themeToggle").innerHTML =
        state.theme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
}


/* =========================================================
   ASSESSMENT BINDINGS
========================================================= */

function bindAssessment() {

    const uploadZone =
        $("#uploadZone");

    const input =
        $("#plantImage");

    const browse =
        $("#browseButton");


    browse.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            input.click();
        }
    );


    uploadZone.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "#removeImage"
                )
            ) return;

            if (
                !$("#uploadedPreview")
                    .classList.contains("hidden")
            ) return;

            input.click();
        }
    );


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (file) {

                handleImageFile(file);
            }
        }
    );


    uploadZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            uploadZone.classList.add(
                "dragover"
            );
        }
    );


    uploadZone.addEventListener(
        "dragleave",
        () => {

            uploadZone.classList.remove(
                "dragover"
            );
        }
    );


    uploadZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            uploadZone.classList.remove(
                "dragover"
            );

            const file =
                event.dataTransfer.files[0];

            if (
                file &&
                file.type.startsWith("image/")
            ) {

                handleImageFile(file);
            }
        }
    );


    $("#removeImage").addEventListener(
        "click",
        event => {

            event.stopPropagation();

            clearUploadedImage();
        }
    );


    $("#assessmentForm").addEventListener(
        "submit",
        handleAssessmentSubmit
    );


    $("#viewExplanationButton").addEventListener(
        "click",
        openExplanation
    );


    $("#sendToExpertButton").addEventListener(
        "click",
        sendCurrentToExpert
    );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function handleImageFile(file) {

    if (!file.type.startsWith("image/")) {

        showToast(
            "Invalid file",
            "Please select an image file."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload = event => {

        const data =
            event.target.result;

        $("#previewImage").src =
            data;

        $("#imageFileName").textContent =
            file.name;

        $("#uploadPlaceholder")
            .classList.add("hidden");

        $("#uploadedPreview")
            .classList.remove("hidden");

        $("#imageQualityBox")
            .classList.remove("hidden");


        checkImageQuality(
            data,
            file
        );
    };


    reader.readAsDataURL(file);
}


function clearUploadedImage() {

    $("#plantImage").value = "";

    $("#previewImage").src = "";

    $("#uploadedPreview")
        .classList.add("hidden");

    $("#uploadPlaceholder")
        .classList.remove("hidden");

    $("#imageQualityBox")
        .classList.add("hidden");
}


/* =========================================================
   IMAGE QUALITY ANALYSIS
========================================================= */

function checkImageQuality(
    dataURL,
    file
) {

    const img =
        new Image();


    img.onload = () => {

        const width =
            img.naturalWidth;

        const height =
            img.naturalHeight;


        const resolutionScore =
            calculateResolutionScore(
                width,
                height
            );


        const canvas =
            document.createElement(
                "canvas"
            );

        const maxSize = 350;

        const scale =
            Math.min(
                1,
                maxSize / Math.max(
                    width,
                    height
                )
            );


        canvas.width =
            Math.max(
                1,
                Math.round(width * scale)
            );

        canvas.height =
            Math.max(
                1,
                Math.round(height * scale)
            );


        const ctx =
            canvas.getContext(
                "2d",
                {
                    willReadFrequently: true
                }
            );


        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );


        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        const brightness =
            calculateBrightness(
                imageData
            );


        const contrast =
            calculateContrast(
                imageData
            );


        const sharpness =
            calculateSharpness(
                ctx,
                canvas.width,
                canvas.height
            );


        const brightnessScore =
            brightnessQuality(
                brightness
            );


        const sharpnessScore =
            sharpnessQuality(
                sharpness
            );


        const visibilityScore =
            Math.min(
                100,
                Math.round(
                    (
                        brightnessScore +
                        contrast +
                        sharpnessScore
                    ) / 3
                )
            );


        const score =
            Math.round(
                resolutionScore * .25 +
                brightnessScore * .20 +
                sharpnessScore * .35 +
                contrast * .20
            );


        const quality =
            score >= 70
                ? "good"
                : "poor";


        const result = {

            score,

            resolution:
                resolutionScore >= 70
                    ? "Good"
                    : "Low",

            brightness:
                brightnessScore >= 70
                    ? "Good"
                    : "Poor",

            sharpness:
                sharpnessScore >= 70
                    ? "Good"
                    : "Poor",

            visibility:
                visibilityScore >= 70
                    ? "Good"
                    : "Limited",

            status: quality,

            message:
                quality === "good"
                    ? "Image quality is suitable for AI assessment."
                    : "Image quality is insufficient. Capture a clearer, better-lit full-plant image."

        };


        window.currentImageQuality =
            result;


        updateQualityUI(
            result
        );
    };


    img.onerror = () => {

        const fallback = {

            score: 40,

            resolution: "Unknown",

            brightness: "Unknown",

            sharpness: "Poor",

            visibility: "Limited",

            status: "poor",

            message:
                "The image could not be analyzed reliably. Please upload another image."

        };


        window.currentImageQuality =
            fallback;

        updateQualityUI(
            fallback
        );
    };


    img.src = dataURL;
}


function calculateResolutionScore(
    width,
    height
) {

    const pixels =
        width * height;

    if (pixels >= 1920 * 1080)
        return 100;

    if (pixels >= 1280 * 720)
        return 90;

    if (pixels >= 900 * 600)
        return 75;

    if (pixels >= 640 * 480)
        return 60;

    return 35;
}


function calculateBrightness(imageData) {

    let total = 0;

    const data =
        imageData.data;

    for (
        let i = 0;
        i < data.length;
        i += 4
    ) {

        total +=
            (
                data[i] * .299 +
                data[i + 1] * .587 +
                data[i + 2] * .114
            );
    }


    return (
        total /
        (data.length / 4)
    );
}


function calculateContrast(imageData) {

    const data =
        imageData.data;

    let total = 0;

    let totalSquared = 0;

    let count = 0;


    for (
        let i = 0;
        i < data.length;
        i += 4
    ) {

        const gray =
            (
                data[i] * .299 +
                data[i + 1] * .587 +
                data[i + 2] * .114
            );

        total += gray;

        totalSquared +=
            gray * gray;

        count++;
    }


    const mean =
        total / count;


    const variance =
        totalSquared / count -
        mean * mean;


    return Math.min(
        100,
        Math.max(
            20,
            Math.round(
                Math.sqrt(
                    Math.max(
                        0,
                        variance
                    )
                ) * 2.2
            )
        )
    );
}


function calculateSharpness(
    ctx,
    width,
    height
) {

    const imageData =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );


    const data =
        imageData.data;


    let variance = 0;

    let count = 0;


    for (
        let y = 1;
        y < height - 1;
        y += 2
    ) {

        for (
            let x = 1;
            x < width - 1;
            x += 2
        ) {

            const center =
                grayAt(
                    data,
                    width,
                    x,
                    y
                );

            const left =
                grayAt(
                    data,
                    width,
                    x - 1,
                    y
                );

            const right =
                grayAt(
                    data,
                    width,
                    x + 1,
                    y
                );

            const top =
                grayAt(
                    data,
                    width,
                    x,
                    y - 1
                );

            const bottom =
                grayAt(
                    data,
                    width,
                    x,
                    y + 1
                );


            const laplacian =
                left +
                right +
                top +
                bottom -
                4 * center;


            variance +=
                laplacian *
                laplacian;

            count++;
        }
    }


    return count
        ? variance / count
        : 0;
}


function grayAt(
    data,
    width,
    x,
    y
) {

    const i =
        (y * width + x) * 4;

    return (
        data[i] * .299 +
        data[i + 1] * .587 +
        data[i + 2] * .114
    );
}


function brightnessQuality(
    brightness
) {

    if (
        brightness >= 65 &&
        brightness <= 205
    ) return 100;

    if (
        brightness >= 45 &&
        brightness <= 225
    ) return 78;

    return 45;
}


function sharpnessQuality(
    sharpness
) {

    if (sharpness > 130)
        return 100;

    if (sharpness > 70)
        return 90;

    if (sharpness > 35)
        return 75;

    if (sharpness > 15)
        return 55;

    return 30;
}


function updateQualityUI(
    quality
) {

    $("#qualityScore").textContent =
        `${quality.score}%`;

    $("#qualityTitle").textContent =
        quality.status === "good"
            ? "Image suitable for assessment"
            : "Image quality insufficient";


    $("#qualityResolution").textContent =
        quality.resolution;

    $("#qualityBrightness").textContent =
        quality.brightness;

    $("#qualitySharpness").textContent =
        quality.sharpness;

    $("#qualityVisibility").textContent =
        quality.visibility;

    $("#qualityMessage").textContent =
        quality.message;


    $("#qualityMessage").style.color =
        quality.status === "good"
            ? "var(--green)"
            : "var(--yellow)";

    $("#qualityScore").style.color =
        quality.status === "good"
            ? "var(--green)"
            : "var(--yellow)";
}


/* =========================================================
   ASSESSMENT SUBMIT
========================================================= */

async function handleAssessmentSubmit(
    event
) {

    event.preventDefault();


    const plantId =
        $("#plantId").value.trim();

    const batch =
        $("#batchId").value.trim()
        || "Unassigned";

    const nursery =
        $("#nursery").value.trim();

    const variety =
        $("#variety").value;

    const scenario =
        $("#demoScenario").value;


    if (
        !plantId ||
        !nursery ||
        !variety
    ) {

        showToast(
            "Missing information",
            "Please complete the required plant details."
        );

        return;
    }


    const image =
        $("#previewImage").src;


    if (!image) {

        showToast(
            "Image required",
            "Upload a plant image before starting the assessment."
        );

        return;
    }


    const button =
        $("#analyzeButton");


    button.disabled = true;

    button.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing...';


    await delay(1300);


    let quality =
        window.currentImageQuality;


    if (!quality) {

        quality = {

            score: 40,

            status: "poor",

            resolution: "Unknown",

            brightness: "Unknown",

            sharpness: "Poor",

            visibility: "Limited",

            message:
                "Image quality could not be confirmed."

        };
    }


    /* DEMO BAD IMAGE SCENARIO */

    if (scenario === "badimage") {

        quality = {

            score: 38,

            status: "poor",

            resolution: "Low",

            brightness: "Poor",

            sharpness: "Poor",

            visibility: "Limited",

            message:
                "The image is not reliable enough for plant-quality assessment. Please upload a clearer image."

        };

        updateQualityUI(
            quality
        );
    }


    let ai;


    if (
        quality.status === "poor" ||
        scenario === "badimage"
    ) {

        ai =
            createBadImageResult();

    } else {

        ai =
            createDemoAIResult(
                scenario
            );
    }


    const plant = {

        id: plantId,

        batch,

        nursery,

        variety,

        createdAt:
            new Date().toISOString(),

        scenario,

        imageData:
            image,

        imageName:
            $("#imageFileName").textContent,

        imageQuality:
            quality,

        ai,

        expert: {

            status:
                ai.status === "suitable"
                    ? "not-required"
                    : "pending",

            decision: "",

            comment: ""

        }

    };


    /* Replace existing plant with same ID */

    state.plants =
        state.plants.filter(
            item =>
                item.id !== plantId
        );


    state.plants.unshift(
        plant
    );


    state.currentPlantId =
        plantId;


    saveState();


    renderAnalysis(
        plant
    );

    renderTrueType();

    renderDashboard();

    renderExpertQueue();

    renderReports();

    updateExpertBadge();


    button.disabled = false;

    button.innerHTML =
        '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Plant <i class="fa-solid fa-arrow-right button-arrow"></i>';


    showToast(
        "Assessment complete",
        "AI assessment and image-quality analysis completed."
    );


    $("#analysisResult")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}


/* =========================================================
   DEMO AI RESULT
========================================================= */

function createDemoAIResult(
    scenario
) {

    if (scenario === "healthy") {

        return {

            score: 91,

            confidence: 93,

            status: "suitable",

            factors: {

                health: 94,
                vigour: 89,
                leaf: 92,
                canopy: 90,
                symptoms: 95,
                damage: 96

            },

            trueType: {

                overall: 91,
                leafShape: 92,
                leafColour: 95,
                canopy: 90,
                growth: 87

            },

            positives: [

                "Healthy-looking green foliage detected.",

                "Strong plant vigour and balanced canopy structure.",

                "No major visible physical damage indicators.",

                "Visual features are consistent with the selected reference profile."

            ],

            risks: [

                "Visual screening should still be complemented by standard nursery inspection."

            ],

            summary:
                "The plant demonstrates strong visual indicators of healthy, vigorous planting material.",

            nextTitle:
                "Suitable for selection",

            nextText:
                "High AI confidence supports selection, subject to normal nursery quality procedures."

        };
    }


    if (scenario === "poor") {

        return {

            score: 38,

            confidence: 89,

            status: "rejected",

            factors: {

                health: 42,
                vigour: 35,
                leaf: 39,
                canopy: 48,
                symptoms: 31,
                damage: 44

            },

            trueType: {

                overall: 82,
                leafShape: 84,
                leafColour: 80,
                canopy: 82,
                growth: 81

            },

            positives: [

                "Some visual characteristics remain consistent with the selected variety."

            ],

            risks: [

                "Poor plant vigour detected.",

                "Significant visible leaf abnormalities are present.",

                "Multiple quality-risk indicators were identified.",

                "Overall health score is below the preferred selection threshold."

            ],

            summary:
                "The plant shows substantial quality-risk indicators despite reasonable visual variety similarity.",

            nextTitle:
                "Not recommended",

            nextText:
                "Do not select this plant as preferred planting material. Inspect other plants in the same batch for similar issues."

        };
    }


    /* DEFAULT QUESTIONABLE */

    return {

        score: 68,

        confidence: 61,

        status: "questionable",

        factors: {

            health: 72,
            vigour: 61,
            leaf: 68,
            canopy: 75,
            symptoms: 64,
            damage: 82

        },

        trueType: {

            overall: 63,
            leafShape: 67,
            leafColour: 61,
            canopy: 66,
            growth: 58

        },

        positives: [

            "Plant remains clearly visible and assessable.",

            "Basic canopy structure is present.",

            "No severe physical damage is apparent."

        ],

        risks: [

            "Moderate leaf discoloration is visible.",

            "Plant vigour is below the preferred range.",

            "True-to-type visual similarity is inconclusive.",

            "AI confidence is not high enough for automatic approval."

        ],

        summary:
            "The plant shows mixed quality indicators and requires expert verification before selection.",

        nextTitle:
            "Expert verification required",

        nextText:
            "The AI result is uncertain. Human review is recommended before making the final selection decision."

    };
}


function createBadImageResult() {

    return {

        score: 0,

        confidence: 0,

        status: "image-insufficient",

        factors: {

            health: 0,
            vigour: 0,
            leaf: 0,
            canopy: 0,
            symptoms: 0,
            damage: 0

        },

        trueType: {

            overall: 0,
            leafShape: 0,
            leafColour: 0,
            canopy: 0,
            growth: 0

        },

        positives: [],

        risks: [

            "The image is too unclear for reliable plant assessment.",

            "Plant characteristics cannot be evaluated with sufficient confidence."

        ],

        summary:
            "The system cannot reliably assess the plant from the submitted image.",

        nextTitle:
            "Capture a clearer image",

        nextText:
            "Retake or upload a better image. The plant is NOT being rejected because of poor image quality."

    };
}


/* =========================================================
   RENDER ANALYSIS
========================================================= */

function renderAnalysis(
    plant
) {

    const ai =
        plant.ai;


    $("#analysisResult")
        .classList.remove("hidden");


    $("#overallScore").textContent =
        ai.status === "image-insufficient"
            ? "--"
            : ai.score;


    $("#scoreRing")
        .style.setProperty(
            "--score",
            ai.score
        );


    $("#resultStatus").textContent =
        statusLabel(
            ai.status
        );


    $("#resultSummary").textContent =
        ai.summary;


    $("#confidenceTag").textContent =
        ai.status === "image-insufficient"
            ? "Confidence unavailable"
            : `AI Confidence ${ai.confidence}%`;


    $("#qualityTag").textContent =
        `Image ${plant.imageQuality.score}%`;


    applyStatusTag(
        $("#confidenceTag"),
        ai.status
    );


    applyStatusTag(
        $("#qualityTag"),
        plant.imageQuality.status === "good"
            ? "suitable"
            : "questionable"
    );


    renderAIFactors(
        ai
    );


    renderEvidence(
        ai
    );


    $("#nextStepTitle").textContent =
        ai.nextTitle;

    $("#nextStepText").textContent =
        ai.nextText;


    const sendButton =
        $("#sendToExpertButton");


    if (
        ai.status === "suitable"
    ) {

        sendButton.innerHTML =
            '<i class="fa-solid fa-user-doctor"></i> Send for Optional Expert Review';

    } else if (
        ai.status === "image-insufficient"
    ) {

        sendButton.innerHTML =
            '<i class="fa-solid fa-camera"></i> Upload Better Image';

    } else {

        sendButton.innerHTML =
            '<i class="fa-solid fa-user-doctor"></i> Send to Expert';

    }
}


function statusLabel(
    status
) {

    const labels = {

        suitable:
            "SUITABLE FOR SELECTION",

        questionable:
            "QUESTIONABLE • REVIEW REQUIRED",

        rejected:
            "NOT RECOMMENDED",

        "image-insufficient":
            "ASSESSMENT NOT POSSIBLE"

    };


    return labels[status] || "ASSESSMENT";
}


function applyStatusTag(
    element,
    status
) {

    element.classList.remove(
        "green-tag",
        "yellow-tag",
        "red-tag",
        "blue-tag"
    );


    if (status === "suitable") {

        element.classList.add(
            "green-tag"
        );

    } else if (
        status === "rejected"
    ) {

        element.classList.add(
            "red-tag"
        );

    } else if (
        status === "questionable"
    ) {

        element.classList.add(
            "yellow-tag"
        );

    } else {

        element.classList.add(
            "blue-tag"
        );
    }
}


/* =========================================================
   AI FACTORS
========================================================= */

function renderAIFactors(
    ai
) {

    const container =
        $("#aiFactors");


    const factors = [

        [
            "Plant Health",
            ai.factors.health,
            "Visible health indicators"
        ],

        [
            "Plant Vigour",
            ai.factors.vigour,
            "Growth and vitality indicators"
        ],

        [
            "Leaf Condition",
            ai.factors.leaf,
            "Leaf colour and appearance"
        ],

        [
            "Canopy Structure",
            ai.factors.canopy,
            "Overall plant architecture"
        ],

        [
            "Symptom Risk",
            ai.factors.symptoms,
            "Visible abnormality screening"
        ],

        [
            "Physical Integrity",
            ai.factors.damage,
            "Visible damage indicators"
        ]

    ];


    container.innerHTML =
        factors.map(
            factor => `

                <div class="ai-factor">

                    <div class="ai-factor-top">

                        <span>${factor[0]}</span>

                        <strong>${factor[1]}%</strong>

                    </div>

                    <div class="progress-track">

                        <span
                            class="progress-fill orange-fill"
                            style="width:${factor[1]}%"
                        ></span>

                    </div>

                    <small>
                        ${factor[2]}
                    </small>

                </div>

            `
        ).join("");
}


/* =========================================================
   EVIDENCE
========================================================= */

function renderEvidence(
    ai
) {

    $("#positiveEvidence").innerHTML =
        ai.positives.length
            ? ai.positives.map(
                item => `
                    <div class="evidence-item evidence-positive">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${item}</span>
                    </div>
                `
            ).join("")
            : `
                <div class="evidence-item">
                    <span>No positive evidence available.</span>
                </div>
            `;


    $("#riskEvidence").innerHTML =
        ai.risks.length
            ? ai.risks.map(
                item => `
                    <div class="evidence-item evidence-risk">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>${item}</span>
                    </div>
                `
            ).join("")
            : `
                <div class="evidence-item">
                    <span>No major risk indicators.</span>
                </div>
            `;
}


/* =========================================================
   TRUE TO TYPE
========================================================= */

function renderTrueType() {

    const plant =
        getCurrentPlant();


    if (!plant) {

        $("#similarityScore").textContent =
            "--%";

        $("#similarityRing")
            .style.background =
                `conic-gradient(
                    var(--sky) 0 0%,
                    rgba(100,116,139,.13) 0
                )`;

        $("#typeAssessedImage").innerHTML = `
            <div class="empty-image-state">
                <i class="fa-solid fa-image"></i>
                <span>Complete an assessment first</span>
            </div>
        `;

        $("#typeFactors").innerHTML =
            emptyTypeFactors();

        $("#typeConclusion").textContent =
            "Complete an assessment to view true-to-type screening.";

        $("#typeConclusionText").textContent =
            "The selected plant's visual characteristics will be compared with the chosen reference profile.";

        return;
    }


    const type =
        plant.ai.trueType;


    $("#similarityScore").textContent =
        `${type.overall}%`;


    $("#similarityRing")
        .style.background =
            `conic-gradient(
                var(--sky) 0 ${type.overall}%,
                rgba(100,116,139,.13) 0
            )`;


    if (plant.imageData) {

        $("#typeAssessedImage").innerHTML = `
            <img
                src="${plant.imageData}"
                alt="Assessed plant"
            >
        `;

    } else {

        $("#typeAssessedImage").innerHTML = `
            <div class="empty-image-state">
                <i class="fa-solid fa-seedling"></i>
                <span>Demo reference assessment</span>
            </div>
        `;
    }


    $("#typeLeaf").textContent =
        type.leafShape >= 80
            ? "Strong match"
            : "Moderate match";


    $("#typeCanopy").textContent =
        type.canopy >= 80
            ? "Strong match"
            : "Moderate match";


    $("#typeGrowth").textContent =
        type.growth >= 80
            ? "Strong match"
            : "Inconclusive";


    const factors = [

        [
            "Leaf Shape",
            type.leafShape
        ],

        [
            "Leaf Colour",
            type.leafColour
        ],

        [
            "Canopy Structure",
            type.canopy
        ],

        [
            "Growth Pattern",
            type.growth
        ]

    ];


    $("#typeFactors").innerHTML =
        factors.map(
            factor => `

                <div class="type-factor">

                    <div class="type-factor-header">

                        <span>
                            ${factor[0]}
                        </span>

                        <strong>
                            ${factor[1]}%
                        </strong>

                    </div>

                    <div class="progress-track">

                        <span
                            class="progress-fill blue-fill"
                            style="width:${factor[1]}%"
                        ></span>

                    </div>

                </div>

            `
        ).join("");


    if (type.overall >= 80) {

        $("#typeConclusion").textContent =
            "Visually consistent with the selected variety.";

        $("#typeConclusionText").textContent =
            "The assessed plant shows strong visual similarity across the reference characteristics. Expert or validated reference confirmation is still recommended.";

    } else if (
        type.overall >= 60
    ) {

        $("#typeConclusion").textContent =
            "Visual similarity is inconclusive.";

        $("#typeConclusionText").textContent =
            "The plant should not be automatically accepted on visual similarity alone. Expert verification or additional evidence is recommended.";

    } else {

        $("#typeConclusion").textContent =
            "Low visual similarity with the reference profile.";

        $("#typeConclusionText").textContent =
            "The plant requires closer inspection before being considered true-to-type.";
    }
}


function emptyTypeFactors() {

    return [

        "Leaf Shape",

        "Leaf Colour",

        "Canopy Structure",

        "Growth Pattern"

    ].map(
        name => `

            <div class="type-factor">

                <div class="type-factor-header">

                    <span>${name}</span>

                    <strong>--</strong>

                </div>

                <div class="progress-track">

                    <span
                        class="progress-fill blue-fill"
                        style="width:0%"
                    ></span>

                </div>

            </div>
        `
    ).join("");
}


/* =========================================================
   EXPERT QUEUE
========================================================= */

function renderExpertQueue() {

    const container =
        $("#expertQueue");


    const pending =
        state.plants.filter(
            plant =>
                plant.expert.status === "pending" ||
                plant.expert.status === "additional-image"
        );


    $("#queueCount").textContent =
        `${pending.length} Pending`;


    if (!pending.length) {

        container.innerHTML = `
            <div class="empty-list">
                <i class="fa-solid fa-circle-check"></i>
                <br><br>
                No pending expert cases.
            </div>
        `;

        $("#expertCasePanel").innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>

                <h2>Queue Clear</h2>

                <p>
                    All currently submitted cases have been reviewed.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        pending.map(
            plant => `

                <div
                    class="queue-item ${
                        state.selectedExpertCase === plant.id
                            ? "selected"
                            : ""
                    }"
                    data-expert-case="${plant.id}"
                >

                    <div class="queue-item-top">

                        <strong>
                            ${plant.id}
                        </strong>

                        <span class="queue-score">
                            ${plant.ai.score}%
                        </span>

                    </div>

                    <div class="queue-item-bottom">

                        <span>
                            ${plant.nursery}
                        </span>

                        <span>
                            ${statusLabel(plant.ai.status)}
                        </span>

                    </div>

                </div>

            `
        ).join("");


    $$("[data-expert-case]").forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const id =
                        item.dataset.expertCase;

                    state.selectedExpertCase =
                        id;

                    saveState();

                    renderExpertQueue();

                    renderExpertCase(
                        getPlant(id)
                    );
                }
            );
        }
    );


    if (
        state.selectedExpertCase &&
        pending.some(
            p =>
                p.id === state.selectedExpertCase
        )
    ) {

        renderExpertCase(
            getPlant(
                state.selectedExpertCase
            )
        );

    } else {

        state.selectedExpertCase =
            pending[0].id;

        saveState();

        renderExpertQueue();

        renderExpertCase(
            pending[0]
        );
    }
}


/* =========================================================
   EXPERT CASE
========================================================= */

function renderExpertCase(
    plant
) {

    if (!plant) return;


    const ai =
        plant.ai;


    $("#expertCasePanel").innerHTML = `

        <div class="expert-case-header">

            <div>

                <span class="eyebrow">
                    CASE UNDER REVIEW
                </span>

                <h2>
                    ${plant.id}
                </h2>

                <div class="expert-case-meta">

                    <span class="meta-chip">
                        ${plant.nursery}
                    </span>

                    <span class="meta-chip">
                        ${plant.variety}
                    </span>

                    <span class="meta-chip">
                        Batch: ${plant.batch}
                    </span>

                </div>

            </div>

            <span class="status-tag ${statusClass(ai.status)}">
                ${statusLabel(ai.status)}
            </span>

        </div>


        <div class="expert-evidence-layout">

            <div>

                <div class="expert-image">

                    ${
                        plant.imageData
                            ? `
                                <img
                                    src="${plant.imageData}"
                                    alt="${plant.id}"
                                >
                            `
                            : `
                                <div class="expert-no-image">
                                    Demo case<br>
                                    Image preview unavailable
                                </div>
                            `
                    }

                </div>

            </div>


            <div>

                <div class="expert-factors">

                    ${expertFactor(
                        "Image Quality",
                        plant.imageQuality.score + "%"
                    )}

                    ${expertFactor(
                        "AI Suitability",
                        ai.score + "%"
                    )}

                    ${expertFactor(
                        "AI Confidence",
                        ai.confidence + "%"
                    )}

                    ${expertFactor(
                        "True-to-Type",
                        ai.trueType.overall + "%"
                    )}

                    ${expertFactor(
                        "Plant Health",
                        ai.factors.health + "%"
                    )}

                    ${expertFactor(
                        "Plant Vigour",
                        ai.factors.vigour + "%"
                    )}

                </div>


                <div class="expert-explanation">

                    <strong>
                        <i class="fa-solid fa-lightbulb"></i>
                        AI EXPLANATION
                    </strong>

                    <p>
                        ${ai.summary}
                    </p>

                    <p style="margin-top:7px">
                        <strong style="display:inline;color:var(--orange)">
                            Main evidence:
                        </strong>
                        ${ai.positives.join(" ")}
                    </p>

                    <p style="margin-top:7px">
                        <strong style="display:inline;color:var(--yellow)">
                            Risk indicators:
                        </strong>
                        ${ai.risks.join(" ")}
                    </p>

                </div>

            </div>

        </div>


        <div class="expert-decision">

            <h3>
                Expert Decision
            </h3>

            <div class="decision-buttons">

                <button
                    class="decision-button approve"
                    data-decision="Approve"
                    data-id="${plant.id}"
                >
                    <i class="fa-solid fa-check"></i>
                    Approve
                </button>

                <button
                    class="decision-button hold"
                    data-decision="Hold"
                    data-id="${plant.id}"
                >
                    <i class="fa-solid fa-pause"></i>
                    Hold
                </button>

                <button
                    class="decision-button reject"
                    data-decision="Reject"
                    data-id="${plant.id}"
                >
                    <i class="fa-solid fa-xmark"></i>
                    Reject
                </button>

                <button
                    class="decision-button request"
                    data-decision="Request Image"
                    data-id="${plant.id}"
                >
                    <i class="fa-solid fa-camera"></i>
                    Better Image
                </button>

            </div>


            <textarea
                class="expert-comment"
                id="expertComment"
                placeholder="Add expert reason / observation..."
            >${escapeHTML(
                plant.expert.comment || ""
            )}</textarea>


            <button
                class="primary-button full-width"
                id="submitExpertDecision"
                style="margin-top:10px"
            >
                <i class="fa-solid fa-circle-check"></i>
                Submit Expert Decision
            </button>

        </div>

    `;


    $$("[data-decision]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    $$("[data-decision]").forEach(
                        item =>
                            item.classList.remove(
                                "selected-decision"
                            )
                    );

                    button.classList.add(
                        "selected-decision"
                    );

                    window.selectedExpertDecision =
                        button.dataset.decision;
                }
            );
        }
    );


    $("#submitExpertDecision")
        .addEventListener(
            "click",
            () => {

                submitExpertDecision(
                    plant.id
                );
            }
        );
}


function expertFactor(
    label,
    value
) {

    return `

        <div class="expert-factor">

            <span>${label}</span>

            <strong>${value}</strong>

        </div>

    `;
}


function statusClass(
    status
) {

    if (status === "suitable")
        return "green-tag";

    if (status === "rejected")
        return "red-tag";

    if (status === "questionable")
        return "yellow-tag";

    return "blue-tag";
}


/* =========================================================
   EXPERT DECISION
========================================================= */

function submitExpertDecision(
    plantId
) {

    const decision =
        window.selectedExpertDecision;


    if (!decision) {

        showToast(
            "Decision required",
            "Choose Approve, Hold, Reject or Better Image."
        );

        return;
    }


    const plant =
        getPlant(plantId);


    if (!plant) return;


    const comment =
        $("#expertComment").value.trim();


    if (!comment) {

        showToast(
            "Reason required",
            "Please add a short expert observation."
        );

        return;
    }


    if (
        decision === "Request Image"
    ) {

        plant.expert.status =
            "additional-image";

        plant.expert.decision =
            "Request Better Image";

        plant.expert.comment =
            comment;

        plant.finalStatus =
            "additional-image";

        plant.finalReason =
            comment;

        plant.nextAction =
            "Upload a clearer image for expert reassessment.";

    } else {

        plant.expert.status =
            decision.toLowerCase();

        plant.expert.decision =
            decision;

        plant.expert.comment =
            comment;


        if (decision === "Approve") {

            plant.finalStatus =
                "suitable";

            plant.finalReason =
                comment;

            plant.nextAction =
                "Proceed with normal nursery selection procedures.";

        } else if (
            decision === "Hold"
        ) {

            plant.finalStatus =
                "questionable";

            plant.finalReason =
                comment;

            plant.nextAction =
                "Keep the plant on hold and perform further verification.";

        } else {

            plant.finalStatus =
                "rejected";

            plant.finalReason =
                comment;

            plant.nextAction =
                "Do not select this plant and inspect related batch material.";
        }

    }


    saveState();


    showToast(
        "Expert decision saved",
        `${plant.id} has been updated across the connected system.`
    );


    window.selectedExpertDecision =
        null;


    state.selectedExpertCase =
        null;

    saveState();


    renderDashboard();

    renderExpertQueue();

    renderReports();

    updateExpertBadge();


    setTimeout(
        () => {

            showView(
                "reports"
            );

        },
        500
    );
}


/* =========================================================
   SEND TO EXPERT
========================================================= */

function sendCurrentToExpert() {

    const plant =
        getCurrentPlant();


    if (!plant) {

        showToast(
            "No assessment",
            "Complete an assessment first."
        );

        return;
    }


    if (
        plant.ai.status ===
        "image-insufficient"
    ) {

        showView(
            "assessment"
        );

        $("#uploadZone")
            .scrollIntoView({
                behavior: "smooth"
            });

        showToast(
            "Better image required",
            "The plant was not rejected. Upload a clearer image."
        );

        return;
    }


    plant.expert.status =
        "pending";


    saveState();


    renderExpertQueue();

    updateExpertBadge();


    showToast(
        "Sent to expert",
        `${plant.id} is now in the expert review queue.`
    );


    setTimeout(
        () => {

            showView(
                "expert"
            );

        },
        400
    );
}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const container =
        $("#reportsList");


    const plants =
        [...state.plants];


    if (!plants.length) {

        container.innerHTML = `
            <div class="glass-panel empty-state">
                <div class="empty-state-icon">
                    <i class="fa-solid fa-file-circle-check"></i>
                </div>
                <h2>No reports yet</h2>
                <p>
                    Complete an assessment to generate a connected report.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        plants.map(
            plant =>
                createReportHTML(
                    plant
                )
        ).join("");


    $$("[data-print-report]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    printPlantReport(
                        button.dataset.printReport
                    );
                }
            );
        }
    );


    $$("[data-open-report]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const plant =
                        getPlant(
                            button.dataset.openReport
                        );

                    if (!plant) return;

                    state.currentPlantId =
                        plant.id;

                    saveState();

                    showView(
                        "assessment"
                    );

                    renderAnalysis(
                        plant
                    );
                }
            );
        }
    );
}


function createReportHTML(
    plant
) {

    const final =
        getFinalStatus(
            plant
        );


    const finalLabel =
        final.label;


    return `

        <article class="report-card glass-panel">

            <div class="report-top">

                <div>

                    <span class="eyebrow">
                        PLANT ASSESSMENT REPORT
                    </span>

                    <h2>
                        ${plant.id}
                    </h2>

                    <div class="expert-case-meta">

                        <span class="meta-chip">
                            ${plant.nursery}
                        </span>

                        <span class="meta-chip">
                            ${plant.variety}
                        </span>

                        <span class="meta-chip">
                            ${formatDate(
                                plant.createdAt
                            )}
                        </span>

                    </div>

                </div>

                <span class="final-decision ${final.className}">
                    ${finalLabel}
                </span>

            </div>


            <div class="report-summary">

                <div class="report-metric">
                    <span>AI Suitability</span>
                    <strong>
                        ${plant.ai.score}%
                    </strong>
                </div>

                <div class="report-metric">
                    <span>AI Confidence</span>
                    <strong>
                        ${plant.ai.confidence}%
                    </strong>
                </div>

                <div class="report-metric">
                    <span>True-to-Type</span>
                    <strong>
                        ${plant.ai.trueType.overall}%
                    </strong>
                </div>

                <div class="report-metric">
                    <span>Expert Decision</span>
                    <strong>
                        ${plant.expert.decision || "Pending"}
                    </strong>
                </div>

            </div>


            <div class="report-reason">

                <strong>
                    <i class="fa-solid fa-lightbulb"></i>
                    DECISION REASON
                </strong>

                <p>
                    ${
                        plant.finalReason
                        ||
                        plant.ai.summary
                    }
                </p>

            </div>


            <div class="timeline">

                ${timelineStep(
                    "1",
                    "Image",
                    true
                )}

                ${timelineStep(
                    "2",
                    "AI",
                    true
                )}

                ${timelineStep(
                    "3",
                    "Expert",
                    plant.expert.status !== "pending"
                )}

                ${timelineStep(
                    "4",
                    "Final",
                    Boolean(
                        plant.finalStatus
                    )
                )}

            </div>


            <div class="report-actions">

                <button
                    class="secondary-button small"
                    data-open-report="${plant.id}"
                >
                    <i class="fa-solid fa-eye"></i>
                    View Assessment
                </button>

                <button
                    class="primary-button"
                    data-print-report="${plant.id}"
                >
                    <i class="fa-solid fa-print"></i>
                    Print Report
                </button>

            </div>

        </article>

    `;
}


function timelineStep(
    number,
    label,
    done
) {

    return `

        <div class="timeline-step">

            <div
                class="timeline-node ${
                    done ? "done" : ""
                }"
            >
                ${
                    done
                        ? '<i class="fa-solid fa-check"></i>'
                        : number
                }
            </div>

            <div class="timeline-line"></div>

        </div>

    `;
}


/* =========================================================
   FINAL STATUS
========================================================= */

function getFinalStatus(
    plant
) {

    if (
        plant.finalStatus ===
        "suitable"
    ) {

        return {
            label:
                "🟢 APPROVED FOR SELECTION",

            className:
                "suitable"
        };
    }


    if (
        plant.finalStatus ===
        "rejected"
    ) {

        return {
            label:
                "🔴 NOT RECOMMENDED",

            className:
                "rejected"
        };
    }


    if (
        plant.finalStatus ===
        "questionable"
    ) {

        return {
            label:
                "🟡 HOLD / FURTHER VERIFICATION",

            className:
                "questionable"
        };
    }


    if (
        plant.finalStatus ===
        "additional-image"
    ) {

        return {
            label:
                "⚠️ ADDITIONAL IMAGE REQUIRED",

            className:
                "pending"
        };
    }


    if (
        plant.ai.status ===
        "image-insufficient"
    ) {

        return {
            label:
                "⚠️ ASSESSMENT NOT POSSIBLE",

            className:
                "pending"
        };
    }


    if (
        plant.ai.status ===
        "suitable"
    ) {

        return {
            label:
                "🟢 AI-SUITABLE",

            className:
                "suitable"
        };
    }


    if (
        plant.ai.status ===
        "rejected"
    ) {

        return {
            label:
                "🔴 AI NOT RECOMMENDED",

            className:
                "rejected"
        };
    }


    return {

        label:
            "🟡 EXPERT REVIEW REQUIRED",

        className:
            "questionable"
    };
}


/* =========================================================
   PRINT REPORT
========================================================= */

function bindPrint() {

    $("#printLatestButton")
        .addEventListener(
            "click",
            () => {

                const plant =
                    getCurrentPlant()
                    || state.plants[0];

                if (plant) {

                    printPlantReport(
                        plant.id
                    );

                } else {

                    showToast(
                        "No report",
                        "Complete an assessment first."
                    );
                }
            }
        );
}


function printPlantReport(
    plantId
) {

    const plant =
        getPlant(
            plantId
        );


    if (!plant) return;


    const final =
        getFinalStatus(
            plant
        );


    $("#printReport").innerHTML = `

        <div class="print-header">

            <div>

                <div class="print-brand">
                    Orange Q AI
                </div>

                <div>
                    AI-Assisted Orange Plant Quality Assessment
                </div>

            </div>

            <div>
                <strong>
                    Assessment Report
                </strong>
                <br>
                ${formatDate(
                    plant.createdAt
                )}
            </div>

        </div>


        <div class="print-section">

            <h3>Plant Information</h3>

            <div class="print-grid">

                <div>
                    <strong>Plant ID</strong><br>
                    ${plant.id}
                </div>

                <div>
                    <strong>Batch</strong><br>
                    ${plant.batch}
                </div>

                <div>
                    <strong>Nursery / Source</strong><br>
                    ${plant.nursery}
                </div>

                <div>
                    <strong>Variety</strong><br>
                    ${plant.variety}
                </div>

            </div>

        </div>


        <div class="print-section">

            <h3>Image Quality</h3>

            <div class="print-grid">

                <div>
                    Score:
                    <strong>
                        ${plant.imageQuality.score}%
                    </strong>
                </div>

                <div>
                    Status:
                    <strong>
                        ${plant.imageQuality.status}
                    </strong>
                </div>

            </div>

        </div>


        <div class="print-section">

            <h3>AI Assessment</h3>

            <div class="print-grid">

                <div>
                    AI Suitability:
                    <strong>
                        ${plant.ai.score}%
                    </strong>
                </div>

                <div>
                    AI Confidence:
                    <strong>
                        ${plant.ai.confidence}%
                    </strong>
                </div>

                <div>
                    Health:
                    <strong>
                        ${plant.ai.factors.health}%
                    </strong>
                </div>

                <div>
                    Vigour:
                    <strong>
                        ${plant.ai.factors.vigour}%
                    </strong>
                </div>

                <div>
                    Leaf Condition:
                    <strong>
                        ${plant.ai.factors.leaf}%
                    </strong>
                </div>

                <div>
                    Canopy:
                    <strong>
                        ${plant.ai.factors.canopy}%
                    </strong>
                </div>

            </div>

        </div>


        <div class="print-section">

            <h3>True-to-Type Screening</h3>

            <p>
                Visual similarity:
                <strong>
                    ${plant.ai.trueType.overall}%
                </strong>
            </p>

            <p style="margin-top:8px">
                This is an AI-assisted visual screening result and
                should not be interpreted as conclusive genetic
                or varietal identification.
            </p>

        </div>


        <div class="print-section">

            <h3>Expert Review</h3>

            <p>
                Decision:
                <strong>
                    ${
                        plant.expert.decision
                        || "Pending"
                    }
                </strong>
            </p>

            <p style="margin-top:8px">
                ${
                    plant.expert.comment
                    || "No expert comment recorded."
                }
            </p>

        </div>


        <div class="print-section">

            <h3>FINAL DECISION</h3>

            <h2>
                ${final.label}
            </h2>

            <p style="margin-top:10px">
                ${
                    plant.finalReason
                    ||
                    plant.ai.summary
                }
            </p>

            <p style="margin-top:10px">
                <strong>Recommended Next Step:</strong>
                ${
                    plant.nextAction
                    ||
                    plant.ai.nextText
                }
            </p>

        </div>

    `;


    window.print();
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const total =
        state.plants.length;


    const suitable =
        state.plants.filter(
            plant =>
                getDashboardCategory(
                    plant
                ) === "suitable"
        ).length;


    const questionable =
        state.plants.filter(
            plant =>
                getDashboardCategory(
                    plant
                ) === "questionable"
        ).length;


    const rejected =
        state.plants.filter(
            plant =>
                getDashboardCategory(
                    plant
                ) === "rejected"
        ).length;


    $("#totalPlants").textContent =
        total;

    $("#suitablePlants").textContent =
        suitable;

    $("#pendingPlants").textContent =
        state.plants.filter(
            plant =>
                plant.expert.status === "pending" ||
                plant.expert.status === "additional-image"
        ).length;

    $("#rejectedPlants").textContent =
        rejected;


    $("#donutTotal").textContent =
        total;


    $("#legendSuitable").textContent =
        suitable;

    $("#legendQuestionable").textContent =
        questionable;

    $("#legendRejected").textContent =
        rejected;


    updateDonut(
        total,
        suitable,
        questionable,
        rejected
    );


    renderRecentAssessments();
}


function getDashboardCategory(
    plant
) {

    if (
        plant.finalStatus ===
        "rejected"
    ) return "rejected";


    if (
        plant.finalStatus ===
        "suitable"
    ) return "suitable";


    if (
        plant.ai.status ===
        "rejected"
    ) return "rejected";


    if (
        plant.ai.status ===
        "suitable"
    ) return "suitable";


    return "questionable";
}


function updateDonut(
    total,
    suitable,
    questionable,
    rejected
) {

    if (!total) {

        $("#donutChart").style.background =
            `conic-gradient(
                rgba(100,116,139,.13) 0 100%
            )`;

        return;
    }


    const suitableDeg =
        suitable / total * 360;

    const questionableDeg =
        questionable / total * 360;


    $("#donutChart").style.background =
        `conic-gradient(
            var(--green) 0 ${suitableDeg}deg,
            var(--yellow) ${suitableDeg}deg
                ${suitableDeg + questionableDeg}deg,
            var(--red) ${suitableDeg + questionableDeg}deg
                360deg
        )`;
}


function renderRecentAssessments() {

    const container =
        $("#recentAssessments");


    const plants =
        state.plants.slice(
            0,
            6
        );


    if (!plants.length) {

        container.innerHTML = `
            <div class="empty-list">
                No assessments yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        plants.map(
            plant => {

                const category =
                    getDashboardCategory(
                        plant
                    );


                return `

                    <div class="recent-item">

                        <span
                            class="recent-status ${category}"
                        ></span>

                        <div class="recent-details">

                            <strong>
                                ${plant.id}
                            </strong>

                            <small>
                                ${plant.nursery}
                                •
                                ${formatDate(
                                    plant.createdAt
                                )}
                            </small>

                        </div>

                        <span class="recent-score">

                            ${
                                plant.ai.status ===
                                "image-insufficient"
                                    ? "--"
                                    : plant.ai.score + "%"
                            }

                        </span>

                    </div>

                `;
            }
        ).join("");
}


/* =========================================================
   EXPLANATION MODAL
========================================================= */

function openExplanation() {

    const plant =
        getCurrentPlant();


    if (!plant) return;


    const ai =
        plant.ai;


    $("#explanationContent").innerHTML = `

        <div class="explanation-section">

            <h3>
                Positive indicators
            </h3>

            ${
                ai.positives.map(
                    item => `
                        <div class="explanation-item">
                            <i class="fa-solid fa-circle-check"></i>
                            <span>${item}</span>
                        </div>
                    `
                ).join("")
            }

        </div>


        <div class="explanation-section">

            <h3>
                Risk / uncertainty indicators
            </h3>

            ${
                ai.risks.map(
                    item => `
                        <div class="explanation-item">
                            <i
                                class="fa-solid fa-triangle-exclamation"
                                style="color:var(--yellow)"
                            ></i>
                            <span>${item}</span>
                        </div>
                    `
                ).join("")
            }

        </div>


        <div class="explanation-section">

            <h3>
                Decision logic
            </h3>

            <div class="explanation-item">

                <i
                    class="fa-solid fa-route"
                    style="color:var(--sky)"
                ></i>

                <span>
                    ${
                        ai.nextText
                    }
                </span>

            </div>

        </div>

    `;


    openModal(
        "explanationModal"
    );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function bindNotifications() {

    $("#notificationButton")
        .addEventListener(
            "click",
            () => {

                const pending =
                    state.plants.filter(
                        plant =>
                            plant.expert.status === "pending" ||
                            plant.expert.status === "additional-image"
                    );


                $("#notificationContent").innerHTML =
                    pending.length

                        ? pending.map(
                            plant => `
                                <div class="notification-item">

                                    <i class="fa-solid fa-user-doctor"></i>

                                    <div>

                                        <strong>
                                            Expert review required
                                        </strong>

                                        <p>
                                            ${plant.id}
                                            has an AI result requiring human verification.
                                        </p>

                                    </div>

                                </div>
                            `
                        ).join("")

                        : `
                            <div class="notification-item">

                                <i class="fa-solid fa-circle-check"></i>

                                <div>

                                    <strong>
                                        No pending alerts
                                    </strong>

                                    <p>
                                        The current review queue is clear.
                                    </p>

                                </div>

                            </div>
                        `;


                openModal(
                    "notificationModal"
                );
            }
        );
}


/* =========================================================
   MODALS
========================================================= */

function bindModalControls() {

    $$("[data-close-modal]")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        closeModal(
                            button.dataset.closeModal
                        );
                    }
                );
            }
        );


    $$(".modal-overlay")
        .forEach(
            overlay => {

                overlay.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            overlay
                        ) {

                            overlay.classList.remove(
                                "open"
                            );
                        }
                    }
                );
            }
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                $$(".modal-overlay")
                    .forEach(
                        modal =>
                            modal.classList.remove(
                                "open"
                            )
                    );
            }
        }
    );
}


function openModal(
    id
) {

    $(`#${id}`)
        .classList.add(
            "open"
        );
}


function closeModal(
    id
) {

    $(`#${id}`)
        .classList.remove(
            "open"
        );
}


/* =========================================================
   EXPERT BADGE
========================================================= */

function updateExpertBadge() {

    const pending =
        state.plants.filter(
            plant =>
                plant.expert.status === "pending" ||
                plant.expert.status === "additional-image"
        ).length;


    $("#expertBadge").textContent =
        pending;
}


/* =========================================================
   HELPERS
========================================================= */

function getPlant(
    id
) {

    return state.plants.find(
        plant =>
            plant.id === id
    );
}


function getCurrentPlant() {

    return getPlant(
        state.currentPlantId
    );
}


function delay(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


function formatDate(
    iso
) {

    if (!iso) return "--";


    const date =
        new Date(iso);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function escapeHTML(
    text
) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    title,
    message
) {

    $("#toastTitle").textContent =
        title;

    $("#toastMessage").textContent =
        message;


    $("#toast").classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                $("#toast")
                    .classList.remove(
                        "show"
                    );

            },
            3500
        );
}


/* =========================================================
   GLOBAL DEMO HELP
========================================================= */

window.resetOrangeQAI =
    function() {

        localStorage.removeItem(
            STORAGE_KEY
        );

        location.reload();
    };


/* =========================================================
   INITIAL CURRENT PLANT
========================================================= */

if (
    !state.currentPlantId &&
    state.plants.length
) {

    state.currentPlantId =
        state.plants[0].id;

    saveState();
}
