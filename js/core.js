function onEntry(entry) {
  entry.forEach(change => {
      if (change.isIntersecting) {
          change.target.classList.add('element-show');
      }
  });
}

const observerOptions = { threshold: 0.3 };
const observer = new IntersectionObserver(onEntry, observerOptions);
const elements = document.querySelectorAll('.element-text-animation, .element-photo-animation');
elements.forEach(el => observer.observe(el));

document.addEventListener("DOMContentLoaded", function() {
  
  const contactForm = document.getElementById("contactForm");
  
  if (contactForm) {
    
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const sendMessageButton = document.getElementById("sendMessage");
      
      sendMessageButton.disabled = true;
      sendMessageButton.innerText = "Відправка...";

      fetch("submit_form.php", {
          method: "POST",
          body: formData
      })
          .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                return response.text().then(text => { 
                  throw new Error("Помилка сервера: " + text); 
                });
            }
          })
          .then(data => {
              alert(data.message);
              if (data.success) {
                contactForm.reset();
              }
          })
          .catch(error => {
              console.error("Помилка:", error);
              alert("Сталася помилка. Спробуйте пізніше.\n" + error.message);
          })
          .finally(() => {
              sendMessageButton.disabled = false;
              sendMessageButton.innerText = "Відправити";
          });
    });
  }
});