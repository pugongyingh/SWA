// Accordion effect
if (document.querySelector('.accordion')) {
  let accordions = document.querySelectorAll('.accordion');

  accordions.forEach(function(accordion) {
      accordion.addEventListener('click', function(){
          // alert('hah');
          this.classList.toggle('active');
          const panel = this.nextElementSibling;
          if (panel.style.maxHeight){
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
      });
  });
}

// Profile view settings link
function profileSettings() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  // Callout message block
if (document.querySelector('.callout')) {
  const closeBtn = document.querySelector('.close-button');
  closeBtn.addEventListener('click', function() {
    this.parentNode.classList.add('close');
    let timer = setTimeout(() => {
      document.querySelector('.container').removeChild(closeBtn.parentNode);
      clearTimeout(timer);
    }, 500);
  });
}

// Iocallout message block
/* if (document.querySelector('.iocallout')) {
  const closeBtn = document.querySelector('.close-button');
  closeBtn.addEventListener('click', function () {
    // this.parentNode.classList.add('close');
    let timer = setTimeout(() => {
      // document.querySelector('.container').removeChild(closeBtn.parentNode);
      document.querySelector('.iocallout').classList.remove('show');
      document.querySelector('.iocallout').classList.add('close');
      clearTimeout(timer);
    }, 350);
  });
} */

if (document.querySelectorAll('.iocallout')) {
  const icos = document.querySelectorAll('.iocallout');
  icos.forEach(ico => {
    ico.childNodes[3].addEventListener('click', function () {
      this.parentNode.classList.add('close');
    });
  });
}

// Search
if (document.querySelector('.search-link')) {
  const link = document.querySelector('.search-link');

  link.addEventListener('click', () => {
    document.querySelector('.search-form').classList.toggle('show');
  });
}

if (document.querySelector('#message-button')) {
  const btn = document.querySelector('#message-button');
  btn.addEventListener('mousedown', () => { 
    btn.classList.add('mousedown');
    // alert('mouse down');
  });
  btn.addEventListener('mouseup', () => { 
    btn.classList.remove('mousedown');
    // alert('mouse up');
  });
}

// Socket.io
/* if (document.title.toLowerCase().trim() === 'ick jw') {
  const socketio = document.createElement('script');
  const client = document.createElement('script');
  socketio.setAttribute('src', '/socket.io/socket.io.js');
  client.setAttribute('src', '/js/socketio.js');
  document.body.appendChild(socketio);
  document.body.appendChild(client);
} */

