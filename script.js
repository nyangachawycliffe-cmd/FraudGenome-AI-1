const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const transcriptBox = document.getElementById("transcript");
const statusBox = document.getElementById("status");
const resultsBox = document.getElementById("results")
;const audioFileInput = document.getElementById("audioFile");
const audioStatus = document.getElementById("audioStatus");
const transcribeFileBtn = document.getElementById("transcribeFileBtn");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;
let finalTranscript = "";

if (!SpeechRecognition) {
    statusBox.textContent =
        "Speech recognition is not supported by this browser.";

    startBtn.disabled = true;

} else {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        statusBox.textContent = "Status: Listening...";
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = function (event) {

        let interimTranscript = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {
            const spokenWords =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += spokenWords + " ";
            } else {
                interimTranscript += spokenWords;
            }
        }

        transcriptBox.value =
            finalTranscript + interimTranscript;
    };

    recognition.onerror = function (event) {
        statusBox.textContent =
            "Recognition error: " + event.error;
    };

    recognition.onend = function () {
        statusBox.textContent = "Status: Recognition stopped.";
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    startBtn.addEventListener("click", function () {

        finalTranscript = transcriptBox.value.trim();

        if (finalTranscript) {
            finalTranscript += " ";
        }

        try {
            recognition.start();
        } catch (error) {
            statusBox.textContent =
                "Please wait before starting again.";
        }
    });

    stopBtn.addEventListener("click", function () {
        recognition.stop();
    });
}

// Demonstration scam-warning analysis
analyzeBtn.addEventListener("click", function () {

    const message = transcriptBox.value.trim();

    if (!message) {
        resultsBox.textContent =
            "Please record or enter a conversation first.";
        return;
    }

    const rules = [
        {
            pattern: /\b(pin|password|OTP|one[- ]time password)\b/i,
            message: "The conversation mentions sensitive credentials."
        },
        {
            pattern: /\b(send money|transfer money|pay immediately)\b/i,
            message: "The conversation includes a possible payment request."
        },
        {
            pattern: /\b(account.*blocked|account.*suspended)\b/i,
            message: "The conversation may be using an account-threat tactic."
        },
        {
            pattern: /\b(urgent|immediately|right now)\b/i,
            message: "The conversation uses urgency-related language."
        }
    ];

    const warnings = rules.filter(rule =>
        rule.pattern.test(message)
    );

    if (warnings.length > 0) {

        const heading = document.createElement("strong");
        heading.textContent = "Potential warning signs detected:";

        const list = document.createElement("ul");

        warnings.forEach(function (warning) {
            const item = document.createElement("li");
            item.textContent = warning.message;
            list.appendChild(item);
        });

        resultsBox.replaceChildren(heading, list);

        const note = document.createElement("p");
        note.textContent =
            "This is a basic demonstration. These warning signs " +
            "do not prove that the conversation is a scam.";

        resultsBox.appendChild(note);

    } else {

        resultsBox.textContent =
            "No warning signs were detected by this basic demonstration. " +
            "This does not guarantee that the conversation is safe.";
    }
});

// Handle audio file selection
audioFileInput.addEventListener("change", function () {
    const file = audioFileInput.files[0];

    if (!file) {
        audioStatus.textContent = "No audio file selected.";
        return;
    }

    if (!file.type.startsWith("audio/")) {
        audioStatus.textContent = "Please select an audio file.";
        audioFileInput.value = "";
        return;
    }

    audioStatus.textContent = "Selected file: " + file.name;
});

// Handle the transcription button
transcribeFileBtn.addEventListener("click", function () {
    const file = audioFileInput.files[0];

    if (!file) {
        audioStatus.textContent =
            "Please select an audio file first.";
        return;
    }

    audioStatus.textContent =
        "File selected. A transcription engine is needed " +
        "to convert this recording into text.";
});

// Handle audio file selection
audioFileInput.addEventListener("change", function () {
    const file = audioFileInput.files[0];

    if (!file) {
        audioStatus.textContent = "No audio file selected.";
        return;
    }

    if (!file.type.startsWith("audio/")) {
        audioStatus.textContent = "Please select an audio file.";
        audioFileInput.value = "";
        return;
    }

    audioStatus.textContent = "Selected file: " + file.name;
});

// Handle the transcription button
transcribeFileBtn.addEventListener("click", function () {
    const file = audioFileInput.files[0];

    if (!file) {
        audioStatus.textContent =
            "Please select an audio file first.";
        return;
    }

    audioStatus.textContent =
        "File selected. A transcription engine is needed " +
        "to convert this recording into text.";
});