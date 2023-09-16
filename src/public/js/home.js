let percentage = parseFloat(document.querySelector('.percentage-circle-container').getAttribute('data-percentage'));

let progress = document.querySelector('.progress-ring__progress');
let radius = progress.r.baseVal.value;
let circumference = radius * 2 * Math.PI;

progress.style.strokeDasharray = `${circumference} ${circumference}`;
progress.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progress.style.strokeDashoffset = offset;
}

// Set the progress using the percentage value from the data attribute
setProgress(percentage);
