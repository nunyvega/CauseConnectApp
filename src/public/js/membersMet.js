document.addEventListener("DOMContentLoaded", () => {
  // Get all the buttons that show contact info
  const infoButtons = document.querySelectorAll('.contact-info-btn');
  
  // Add an event listener to each button
  infoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Get the user ID from the button's data attribute
      const userId = e.target.getAttribute('data-user-id');
      
      // Get the corresponding contact info div for the user
      const infoDiv = document.getElementById(`contact-info-${userId}`);
      
      // Toggle the display of the contact info and update the button text
      if (infoDiv.style.display === 'none' || !infoDiv.style.display) {
        infoDiv.style.display = 'block';
        e.target.textContent = 'Hide Contact Info';
      } else {
        infoDiv.style.display = 'none';
        e.target.textContent = 'Contact Info';
      }
    });
  });
});
