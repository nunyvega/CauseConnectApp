// Get the percentage value from the data attribute of the element with class 'percentage-circle-container'
let percentage = parseFloat(
  document
    .querySelector(".percentage-circle-container")
    .getAttribute("data-percentage")
);

// Get the SVG circle element with class 'progress-ring__progress'
let progress = document.querySelector(".progress-ring__progress");

// Calculate the radius and circumference of the circle
let radius = progress.r.baseVal.value;
let circumference = radius * 2 * Math.PI;

// Set the stroke-dasharray and stroke-dashoffset properties to create the circle progress effect
progress.style.strokeDasharray = `${circumference} ${circumference}`;
progress.style.strokeDashoffset = `${circumference}`;

/**
 * Function to set the progress of the circle based on the given percentage
 * @param {number} percent - The percentage value to set the progress to
 */
function setProgress(percent) {
  // Calculate the stroke-dashoffset value based on the given percentage
  const offset = circumference - (percent / 100) * circumference;
  progress.style.strokeDashoffset = offset;
}

// Set the progress using the percentage value from the data attribute
setProgress(percentage);
