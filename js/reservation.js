
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
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your offer has been submitted",
            showConfirmButton: false,
            timer: 2500
        });
    });
} else {
    console.error('No se encontró el botón de envío con el ID submit-button');
}
