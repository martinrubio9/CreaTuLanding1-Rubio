function fetchDepartments() {
    return fetch('../db/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.departments)
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updatePropertyDetails(department) {
    document.getElementById('property-view').innerText = department.view;
    document.getElementById('property-bedrooms').innerText = department.bedrooms;
    document.getElementById('property-description').innerText = department.description;
}

function calculateTotal() {
    const offerAmount = parseFloat(document.getElementById('offer').value) || 0;
    const salesTaxRate = 0.13;
    const processingFee = 399;
    const cleaningFee = 349;

    const salesTax = offerAmount * salesTaxRate;
    const total = offerAmount + salesTax + processingFee + cleaningFee;

    document.getElementById('salesTax').innerText = salesTax.toFixed(2);
    document.getElementById('total').innerText = total.toFixed(2);
}

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function validateForm() {
    let isValid = true;
    const offerInput = document.getElementById('offer');
    const offerValue = parseFloat(offerInput.value);
    const checkInDate = document.getElementById('check-in').value;
    const checkOutDate = document.getElementById('check-out').value;
    const errorMessages = [];

    // Validar oferta 
    if (isNaN(offerValue) || offerValue <= 0) {
        isValid = false;
        errorMessages.push('El precio de la oferta debe ser un número positivo.');
        offerInput.classList.add('error');
    } else {
        offerInput.classList.remove('error');
    }

    // Validar fechas 
    const today = new Date().toISOString().split('T')[0]; 
    if (!checkInDate || checkInDate < today) {
        isValid = false;
        errorMessages.push('La fecha de check-in debe ser hoy o una fecha futura.');
        document.getElementById('check-in').classList.add('error');
    } else {
        document.getElementById('check-in').classList.remove('error');
    }

    if (!checkOutDate || checkOutDate <= checkInDate) {
        isValid = false;
        errorMessages.push('La fecha de check-out debe ser posterior a la fecha de check-in.');
        document.getElementById('check-out').classList.add('error');
    } else {
        document.getElementById('check-out').classList.remove('error');
    }

    // Mostrar errores si los hay
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    if (!isValid) {
        errorMessages.forEach(message => {
            const errorItem = document.createElement('p');
            errorItem.innerText = message;
            errorContainer.appendChild(errorItem);
        });
    }

    return isValid;
}


const today = new Date().toISOString().split("T")[0];
document.getElementById("checkin").setAttribute("min", today);
document.getElementById("checkout").setAttribute("min", today);

window.onload = function() {
    let departmentIndex = localStorage.getItem('selectedDepartmentIndex');
    
    if (departmentIndex !== null) {
        departmentIndex = parseInt(departmentIndex);
        fetchDepartments().then(departments => {
            updatePropertyDetails(departments[departmentIndex]);
        });
    } else {
        console.error('No department index found in localStorage');
    }

    const offerInput = document.getElementById('offer');
    if (offerInput) {
        offerInput.addEventListener('input', calculateTotal);
    } else {
        console.error('No se encontró el elemento con el ID offer');
    }

};

const submitButton = document.getElementById('submit-button'); 

if (submitButton) {
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); 
        if (validateForm()) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your offer has been submitted",
                showConfirmButton: false,
                timer: 2500
            });
        }
    });
} else {
    console.error('No se encontró el botón de envío con el ID submit-button');
}

document.getElementById('submit-button').addEventListener('click', function (event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const guests = document.getElementById('guests').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const offer = document.getElementById('offer').value;

    
    let errors = [];

    if (!name) errors.push("Please enter your full name.");
    if (!phone.match(/^\d+$/)) errors.push("Phone number should contain numbers only.");
    if (!email) errors.push("Please enter a valid email.");
    if (guests <= 0) errors.push("Number of guests must be a positive number.");
    if (!checkin) errors.push("Please select a check-in date.");
    if (!checkout) errors.push("Please select a check-out date.");
    if (offer < 0) errors.push("Offer amount must be a positive number.");

    
    if (errors.length > 0) {
        Swal.fire({
            icon: "error",
            title: "Validation Errors",
            html: errors.join("<br>"),
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your offer has been submitted",
            showConfirmButton: false,
            timer: 2500,
        });
    }
});

 
// Cargar reservas desde el localStorage al cargar la página
loadReservations();

// Guardar reserva al hacer clic en "Make an Offer"
document.getElementById('submit-button').addEventListener('click', function () {
    const reservation = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        guests: document.getElementById('guests').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        offer: document.getElementById('offer').value,
    };

    // Validar el formulario antes de guardar
    if (!validateReservation(reservation)) {
        return;
    }

    saveReservation(reservation);
    clearForm();
    loadReservations(); // Recargar la lista de reservas
});

// Limpiar todas las reservas
document.getElementById('clear-reservations').addEventListener('click', function () {
    localStorage.removeItem('reservations');
    loadReservations();
});

// Función para guardar reserva
function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    Swal.fire('Your offer has been submitted', '', 'success');
}

// Función para cargar reservas
function loadReservations() {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = ''; // Limpiar lista
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p>No offers available.</p>';
        return;
    }

    reservations.forEach((reservation, index) => {
        const reservationDiv = document.createElement('div');
        reservationDiv.className = 'reservation-item';

        reservationDiv.innerHTML = `
            <p><strong>Reservation ${index + 1}</strong></p>
            <p><strong>Name:</strong> ${reservation.name}</p>
            <p><strong>Phone:</strong> ${reservation.phone}</p>
            <p><strong>Email:</strong> ${reservation.email}</p>
            <p><strong>Guests:</strong> ${reservation.guests}</p>
            <p><strong>Check-in:</strong> ${reservation.checkin}</p>
            <p><strong>Check-out:</strong> ${reservation.checkout}</p>
            <p><strong>Offer:</strong> $${reservation.offer}</p>
            <button class="btn btn-warning btn-sm" onclick="editReservation(${index})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteReservation(${index})">Delete</button>
        `;

        reservationsList.appendChild(reservationDiv);
    });
}

// Función para validar reserva
function validateReservation(reservation) {
    if (!reservation.name || !reservation.phone || !reservation.email || !reservation.guests || !reservation.checkin || !reservation.checkout || !reservation.offer) {
        Swal.fire('Please fill in all required fields.', '', 'error');
        return false;
    }
    return true;
}

// Función para editar una reserva
window.editReservation = function (index) {
    let reservations = JSON.parse(localStorage.getItem('reservations'));
    let reservation = reservations[index];

    document.getElementById('name').value = reservation.name;
    document.getElementById('phone').value = reservation.phone;
    document.getElementById('email').value = reservation.email;
    document.getElementById('guests').value = reservation.guests;
    document.getElementById('checkin').value = reservation.checkin;
    document.getElementById('checkout').value = reservation.checkout;
    document.getElementById('offer').value = reservation.offer;

    reservations.splice(index, 1); // Remover reserva actual para permitir editar
    localStorage.setItem('reservations', JSON.stringify(reservations));
    loadReservations();
};

// Función para borrar una reserva
window.deleteReservation = function (index) {
    let reservations = JSON.parse(localStorage.getItem('reservations'));
    reservations.splice(index, 1);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    loadReservations();
    Swal.fire('Offer Deleted!', '', 'success');
};

// Función para limpiar el formulario después de guardar o editar
function clearForm() {
    document.getElementById('reservationForm').reset();
}

