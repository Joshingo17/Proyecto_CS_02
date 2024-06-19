const Ingresar = () => {
    const User = document.getElementById('txt_usuario').value.trim();
    const Pass = document.getElementById('txt_contraseña').value.trim();

    console.log('Usuario ingresado:', User);
    console.log('Contraseña ingresada:', Pass);

    if (User === "" || Pass === "") {
        alert("Por favor, ingresa usuario y contraseña.");
        return;
    }

    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRVtDMMVkf8FHd7gLGgGmEycXUzNDeR8uN50lxDFxoBCjDAY0vQzxmQ_HEvH_qNlvyGVeYtq-qmi4zX/pub?gid=0&single=true&output=csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo CSV');
            }
            return response.text();
        })
        .then(data => {
            console.log('Datos CSV brutos:', data);
            const parsedData = parseCSV(data);
            console.log('Usuarios obtenidos:', parsedData);
            const Aux_a = parsedData.find(u => u.Usuario === User && u['Contraseña'] === Pass);
            console.log('Usuario válido:', Aux_a);

            document.getElementById("txt_usuario").value = "";
            document.getElementById("txt_contraseña").value = "";

            if (Aux_a) {
                localStorage.setItem('authenticated', 'true');
                localStorage.setItem('nombreUsuario', Aux_a['Nombre Completo']);

                alert(`Bienvenid@, ${Aux_a['Nombre Completo']}`);

                switch (parseInt(Aux_a.Nivel)) {
                    case 0:
                        console.log('Redirigiendo a ip_administrador.html');
                        window.location.href = 'html/ip_administrador.html';
                        break;
                    case 1:
                        console.log('Redirigiendo a ip_mecanico.html');
                        window.location.href = 'html/ip_mecanico.html';
                        break;
                    case 2:
                        console.log('Redirigiendo a ip_cliente.html');
                        window.location.href = 'html/ip_cliente.html';
                        break;
                    default:
                        console.error('Nivel de usuario no válido');
                }
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        })
        .catch(error => {
            console.error('Error al cargar el archivo CSV:', error);
            alert('Hubo un problema al intentar cargar los datos. Por favor, intenta de nuevo más tarde.');
        });
}

const parseCSV = (data) => {
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