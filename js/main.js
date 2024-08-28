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

function displayDepartments(departments) {
    const container = document.getElementById('department-container');

    if (!container) {
        console.error('No se encontró el contenedor con el ID department-container');
        return;
    }

    container.innerHTML = ''; 

    departments.forEach((department, index) => {
        const departmentHTML = `
            <div class="container-fluid text-center p-0">
                <div class="row no-gutters" style="background-color: ${department.backgroundColor};" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                    <div class="col-md-8 col-12 p-0">
                        <div id="${department.carouselId}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner" style="border-radius: 10px;">
                                ${department.images.map((imgSrc, imgIndex) => `
                                    <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
                                        <img src="${imgSrc}" class="d-block custom-carousel-image" alt="Image">
                                    </div>
                                `).join('')}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#${department.carouselId}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon ${department.textColor === 'black' ? 'bg-dark' : ''}" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#${department.carouselId}" data-bs-slide="next">
                                <span class="carousel-control-next-icon ${department.textColor === 'black' ? 'bg-dark' : ''}" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-4 col-12 text-${department.textColor} mt-3 mt-md-0">
                        <h2>${department.view}</h2>
                        <h4>${department.bedrooms}</h4>
                        <p>${department.description}</p>
                        <a href="reservation.html?departmentIndex=${index}" class="btn ${department.backgroundColor === 'black' ? 'btn-light' : 'btn-dark'} mt-3" onclick="storeDepartmentIndex(${index})">Make an Offer</a>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += departmentHTML;
    });
}

function storeDepartmentIndex(index) {
    localStorage.setItem('selectedDepartmentIndex', index);
}

function applyFilter(departments) {
    const filterValue = document.getElementById('viewFilter').value;
    const filteredDepartments = filterValue === 'all' ? departments : departments.filter(department => department.view === filterValue);
    displayDepartments(filteredDepartments);
}

window.onload = function() {
    fetchDepartments().then(departments => {
        
        displayDepartments(departments);

        
        document.getElementById('viewFilter').addEventListener('change', function() {
            applyFilter(departments);
        });
    });
};
