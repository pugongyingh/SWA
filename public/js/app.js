const ajax = (method, path, fn) => {
  if (undefined != method &&
    undefined != path &&
    undefined != fn &&
    (typeof fn === 'function')) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        fn(null, {
          text: this.responseText,
          xml: this.responseXML,
          url: this.responseURL,
          type: this.responseType,
          headers: this.getAllResponseHeaders()
        });
      } else {
        switch (this.status.toString()) {
          case '404':
            fn({
              msg: 'error',
              cause: 'Invalid Path',
              state: this.readyState,
              status: this.status
            }, null);
          break;
        }
      }
    };
    xhttp.open(method, path, true);
    xhttp.send();
  }
};

const getCss = (_window) => {
  ajax('get', '../css/main.css', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    const css = document.createElement('style');
    css.setAttribute('rel', 'stylesheet');
    css.innerHTML = data.text;
    _window.document.head.appendChild(css);
  });
};

const getMessageForm = (_window) => {
  ajax('get', '../components/messageform.txt', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    _window.document.body.innerHTML = data.text;
  });
};

const getSocketScript = (_window) => {
  ajax('get', '/socket.io/socket.io.js', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', data.url);
    _window.document.body.appendChild(script);
  });
};
 
const getCkEditor = (_window) => {
  ajax('get', '/js/ckeditor5-build-classic/ckeditor.js', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', data.url);
    _window.document.body.appendChild(script);
    configureCkEditor(_window);
  });
};

const configureCkEditor = (_window) => {
  ajax('get', '/js/ckeditorconfig.js', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    const cke = document.createElement('script');
    cke.setAttribute('src', data.url);
    _window.document.body.appendChild(cke);
   });
};

const getPrivateScript = (_window) => {
  ajax('get', '/js/privatescript.js', (err, data) => {
    if (err) {
      console.log(`\n\t\tMessage: ${err.msg}\n\t\tCause: ${err.cause}\n\t\t
        State: ${err.state}\n\t\tStatus: ${err.status}\n\n`);
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', data.url);
    _window.document.body.appendChild(script);
  });
};

const setPageHead = (_window) => { 
  const el = `
    <title>Private Message</title>   
		<link rel="shortcut icon" {{#if favicon }} href="{{favicon}}" {{else}}href="/favicon.ico"{{/if}} type="image/x-icon" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
    <script defer src="https://use.fontawesome.com/releases/v5.0.10/js/all.js" integrity="sha384-slN8GvtUJGnv6ca26v8EzVaR9DC58QEwsIk9q1QXdCU8Yu8ck/tL/5szYlBbqmS+" crossorigin="anonymous"></script>
		
  `;
  _window.document.head.innerHTML = el;
};

const createPrivateMessage = () => { 
  const _window = window.open('', 'private-window', 'height=500,location=0,menubar=0,status=0,width=500', true);
  setPageHead(_window);
  getCss(_window);
  getMessageForm(_window);
  getSocketScript(_window);
  getPrivateScript(_window);
  getCkEditor(_window);
  const txtScript = `
    
    <script>
      const socket = io.connect();

      const validMessage = (arg) => {
          return (null != arg &&
              undefined != arg &&
              (typeof arg === 'string' &&
                  arg.length > 0));
      };
    </script>
    
  `;
  _window.document.body.innerHTML = `${txtScript}`;
  // alert('private message');
};

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