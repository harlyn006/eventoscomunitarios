document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    updateMenu();
    document.getElementById('registerForm').addEventListener('submit', register);
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('createEventForm').addEventListener('submit', createEvent);
});

let users = [];
let events = [];
let currentUser = null;

function showSection(id) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    users.push({ username, password });
    alert('Usuario registrado con éxito');
    showSection('login');
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    currentUser = users.find(user => user.username === username && user.password === password);
    if (currentUser) {
        showSection('home');
    } else {
        alert('Credenciales incorrectas');
    }
    updateMenu();
}

function logout() {
    currentUser = null;
    showSection('login');
    updateMenu();
}

function createEvent(event) {
    event.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;
    const image = document.getElementById('eventImage').files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        events.push({ title, date, location, description, image: e.target.result, comments: [] });
        alert('Evento creado con éxito');
        displayEvents();
        showSection('home');
    };
    reader.readAsDataURL(image);
}

function displayEvents() {
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = '';
    events.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('card', 'mb-3');
        eventElement.innerHTML = `
            <img src="${event.image}" class="card-img-top" alt="${event.title}">
            <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text">${event.date}</p>
                <p class="card-text">${event.location}</p>
                <p class="card-text">${event.description}</p>
                <button class="btn btn-danger" onclick="deleteEvent(${index})">Eliminar</button>
                <h5 class="mt-3">Comentarios</h5>
                <div id="comments-${index}" class="comments-section">
                    ${event.comments.map(comment => `<p>${comment}</p>`).join('')}
                </div>
                <form onsubmit="addComment(event, ${index})" class="mt-2">
                    <input type="text" class="form-control" placeholder="Añadir comentario" required>
                    <button type="submit" class="btn btn-primary mt-2">Comentar</button>
                </form>
            </div>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

function addComment(event, eventIndex) {
    event.preventDefault();
    const commentInput = event.target.querySelector('input');
    const comment = commentInput.value;
    events[eventIndex].comments.push(comment);
    displayEvents();
}

function filterEvents() {
    const searchTerm = document.getElementById('searchEvents').value.toLowerCase();
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.date.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
    );
    displayFilteredEvents(filteredEvents);
}

function displayFilteredEvents(filteredEvents) {
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = '';
    filteredEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('card', 'mb-3');
        eventElement.innerHTML = `
            <img src="${event.image}" class="card-img-top" alt="${event.title}">
            <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text">${event.date}</p>
                <p class="card-text">${event.location}</p>
                <p class="card-text">${event.description}</p>
                <button class="btn btn-danger" onclick="deleteEvent(${index})">Eliminar</button>
                <h5 class="mt-3">Comentarios</h5>
                <div id="comments-${index}" class="comments-section">
                    ${event.comments.map(comment => `<p>${comment}</p>`).join('')}
                </div>
                <form onsubmit="addComment(event, ${index})" class="mt-2">
                    <input type="text" class="form-control" placeholder="Añadir comentario" required>
                    <button type="submit" class="btn btn-primary mt-2">Comentar</button>
                </form>
            </div>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

function deleteEvent(index) {
    events.splice(index, 1);
    displayEvents();
}

function updateMenu() {
    document.getElementById('createEventLink').style.display = currentUser ? 'block' : 'none';
    document.getElementById('registerLink').style.display = currentUser ? 'none' : 'block';
    document.getElementById('loginLink').style.display = currentUser ? 'none' : 'block';
    document.getElementById('logoutLink').style.display = currentUser ? 'block' : 'none';
}
