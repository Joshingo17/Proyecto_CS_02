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
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQi7Q_0Oane4hxZtwES9bRu5lXt0qiPADHrOZRf0XkFFCCuaRLUiR1kwjeA2SZIixce2RzFYhLgs-j5/pub?gid=0&single=true&output=csv')
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
            <td>${row['Cliente']}</td>
            <td>${row['Mecanico']}</td>
            <td>${row['F. Llegada']}</td>
            <td>${row['F. Salida']}</td>
            <td>${row['Estado']}</td>
        `;
        tbody.appendChild(tr);
    });
}
