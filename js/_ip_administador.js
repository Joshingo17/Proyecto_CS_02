document.addEventListener('DOMContentLoaded', function () {
    var authenticated = localStorage.getItem('authenticated');
    if (authenticated !== 'true') {
        alert('Debe iniciar sesión primero.');
        window.location.href = '../index.html';
        return;
    } else {
        var nombreUsuario = localStorage.getItem('nombreUsuario');
        if (nombreUsuario) {
            document.getElementById('nombreUsuario').textContent = nombreUsuario;
            cargarDatos();
        }
    }
});

function Cerrar() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('authenticated');
    window.location.href = '../index.html';
    alert('Cerrando...');
}

function cargarDatos() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRVtDMMVkf8FHd7gLGgGmEycXUzNDeR8uN50lxDFxoBCjDAY0vQzxmQ_HEvH_qNlvyGVeYtq-qmi4zX/pub?gid=0&single=true&output=csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo CSV');
            }
            return response.text();
        })
        .then(data => {
            const parsedData = parseCSV(data);
            console.log('Datos CSV parseados:', parsedData);
            llenarTabla(parsedData);
        })
        .catch(error => {
            console.error('Error al cargar el archivo CSV:', error);
            alert('Hubo un problema al intentar cargar los datos. Por favor, intenta de nuevo más tarde.');
        });
}

function parseCSV(data) {
    const rows = data.split('\n').filter(row => row.trim() !== '');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
        const values = row.split(',');
        let obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return obj;
    });
}

function llenarTabla(data) {
    const tbody = document.querySelector('#tablaAdministradores tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Usuario']}</td>
            <td>${row['Contraseña']}</td>
            <td>${row['Nombre Completo']}</td>
            <td>${row['Correo']}</td>
            <td>${row['Nivel']}</td>
            <td>${row['Rol']}</td>
        `;
        tbody.appendChild(tr);
    });
}
