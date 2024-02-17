console.log('Hello world')

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement  = document.querySelector('.mews');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/mews' : 'https://meower-api.now.sh/mews';

loadingElement.style.display = '';

listAllMews();

// giving the created form functionality
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  // storing form data as an object
  const mew = {
    name,
    content
  };

  // closing form after submission
  console.log(mew)
  form.style.display = 'none';
  loadingElement.style.display = '';
  
  // sending form data to backend
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json'
    }
    // resetting the form after submission
  }).then(response => response.json())
    .then(createdMew => {
      form.reset();
      setTimeout(() => {

        form.style.display = '';
      }, 30000)
      listAllMews();
    });
});

// listing all the mews
function listAllMews() {
  mewsElement.innerHTML = '';
  fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
      console.log(mews)
      mews.reverse();
      mews.forEach(mew => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = mew.name;

        const contents = document.createElement('p');
        contents.textContent = mew.content;

        const date = document.createElement('small');
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });
      loadingElement.style.display = 'none'
    });
}