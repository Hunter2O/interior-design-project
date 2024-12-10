function selectDesign(design) {
    localStorage.setItem('selectedDesign', design);
    window.location.href = 'contact.html';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const selectedDesign = localStorage.getItem('selectedDesign');
    if (selectedDesign) {
      document.getElementById('designInput').value = selectedDesign;
    }
  });
  
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const formData = new FormData(this);
  
    fetch('/api/submit-request', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          this.reset();
        }
      })
      .catch((err) => alert('Error submitting your request.'));
  });
  