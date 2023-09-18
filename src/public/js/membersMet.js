document.addEventListener("DOMContentLoaded", () => {
    const infoButtons = document.querySelectorAll('.contact-info-btn');
    
    infoButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const userId = e.target.getAttribute('data-user-id');
        const infoDiv = document.getElementById(`contact-info-${userId}`);
        
        if (infoDiv.style.display === 'none' || !infoDiv.style.display) {
          infoDiv.style.display = 'block';
          e.target.textContent = 'Hide Contact Info'; // Change the button text
        } else {
          infoDiv.style.display = 'none';
          e.target.textContent = 'Contact Info'; // Reset the button text
        }
      });
    });
});
