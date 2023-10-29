function cambiarTamanoMatriz(inputId, rows, cols) {
    const matrizInput = document.getElementById(inputId);
    matrizInput.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("div");
        row.className = "matrix-row";

        for (let j = 0; j < cols; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.id = `${inputId}-${i}-${j}`;
            input.placeholder = `${i + 1},${j + 1}`;
            row.appendChild(input);
        }

        matrizInput.appendChild(row);
    }
}

// Función para obtener los valores de entrada y construir una matriz
function obtenerMatriz(inputId, rows, cols) {
    const matriz = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const inputValue = parseFloat(document.getElementById(`${inputId}-${i}-${j}`).value);
            row.push(inputValue);
        }
        matriz.push(row);
    }

    return matriz;
}

function mostrarResultado(resultadoDiv, resultado) {
    if (resultado) {
        resultadoDiv.textContent = "Resultado: ";
        if (typeof resultado === 'string') {
            resultadoDiv.textContent += resultado;
        } else {
            const resultText = resultado.map(row => row.join(', ')).join('\n');
            resultadoDiv.textContent += resultText;
        }
    } else {
        resultadoDiv.textContent = "No se puede calcular el resultado.";
    }
}

// Función para limpiar los campos de entrada de la matriz inversa
function limpiarInversa() {
    const inputElements = document.querySelectorAll("#inversaInput input");
    inputElements.forEach((input) => (input.value = ""));
    document.getElementById("inversa-result").textContent = "";
}

// Función para limpiar los campos de entrada de la multiplicación de matrices
function limpiarMultiplicacion() {
    const inputElements1 = document.querySelectorAll("#multiplyInput1 input");
    const inputElements2 = document.querySelectorAll("#multiplyInput2 input");
    inputElements1.forEach((input) => (input.value = ""));
    inputElements2.forEach((input) => (input.value = ""));
    document.getElementById("multiply-result").textContent = "";
}

// Función para limpiar los campos de entrada del sistema de ecuaciones
function limpiarSistema() {
    const inputElements = document.querySelectorAll("#sistemaInput input");
    inputElements.forEach((input) => (input.value = ""));
    document.getElementById("sistema-result").textContent = "";
}

// Función para calcular la inversa de una matriz
function calcularInversa() {
    const size = parseInt(document.getElementById("inversa-size").value);
    const inputId = "inversaInput";
    const matriz = obtenerMatriz(inputId, size, size);
    const resultadoDiv = document.getElementById("inversa-result");

    if (size === 2) {
        const determinante = matriz[0][0] * matriz[1][1] - matriz[0][1] * matriz[1][0];
        if (determinante !== 0) {
            const inversa = [
                [matriz[1][1] / determinante, -matriz[0][1] / determinante],
                [-matriz[1][0] / determinante, matriz[0][0] / determinante]
            ];
            mostrarResultado(resultadoDiv, inversa);
        } else {
            mostrarResultado(resultadoDiv, null);
        }
    } else if (size === 3) {
        try {
            const mathMatrix = math.matrix(matriz);
            const inversa = math.inv(mathMatrix);
            mostrarResultado(resultadoDiv, inversa.toArray());
        } catch (error) {
            mostrarResultado(resultadoDiv, null);
        }
    } else {
        mostrarResultado(resultadoDiv, null);
    }
}

// Función para multiplicar dos matrices
function multiplicarMatrices() {
    const size = parseInt(document.getElementById("multiply-size").value);
    const inputId1 = "multiplyInput1";
    const inputId2 = "multiplyInput2";
    const matriz1 = obtenerMatriz(inputId1, size, size);
    const matriz2 = obtenerMatriz(inputId2, size, size);
    const resultadoDiv = document.getElementById("multiply-result");

    if (size === 2) {
        const result = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += matriz1[i][k] * matriz2[k][j];
                }
                row.push(sum);
            }
            result.push(row);
        }
        mostrarResultado(resultadoDiv, result);
    } else if (size === 3) {
        try {
            const mathMatrix1 = math.matrix(matriz1);
            const mathMatrix2 = math.matrix(matriz2);
            const resultado = math.multiply(mathMatrix1, mathMatrix2);
            mostrarResultado(resultadoDiv, resultado.toArray());
        } catch (error) {
            mostrarResultado(resultadoDiv, null);
        }
    } else {
        mostrarResultado(resultadoDiv, null);
    }
}

// Implementación del método de Cramer para resolver sistemas de ecuaciones 2x2 y 3x3

function resolverSistema() {
    const size = parseInt(document.getElementById("sistema-size").value);
    const selectedMethod = document.querySelector('input[name="method"]:checked').value;
    const resultadoDiv = document.getElementById("sistema-result");
    resultadoDiv.innerHTML = "";

    const matrizSistema = obtenerMatriz("sistemaInput", size, size + 1);

    if (size === 2) {
        if (selectedMethod === "gauss-jordan") {
            // Implementación de Gauss-Jordan para 2x2
            const detA = matrizSistema[0][0] * matrizSistema[1][1] - matrizSistema[0][1] * matrizSistema[1][0];
            if (detA !== 0) {
                const x = (matrizSistema[0][2] * matrizSistema[1][1] - matrizSistema[0][1] * matrizSistema[1][2]) / detA;
                const y = (matrizSistema[0][0] * matrizSistema[1][2] - matrizSistema[0][2] * matrizSistema[1][0]) / detA;
                mostrarResultado(resultadoDiv, `Solución única: x = ${x}, y = ${y}`);
            } else {
                mostrarResultado(resultadoDiv, "Sin solución o soluciones infinitas");
            }
        } else if (selectedMethod === "cramer") {
            const a = matrizSistema[0][0];
            const b = matrizSistema[0][1];
            const c = matrizSistema[1][0];
            const d = matrizSistema[1][1];
            const ex = matrizSistema[0][2];
            const ey = matrizSistema[1][2];

            const detA = a * d - b * c;

            if (detA !== 0) {
                const detX = ex * d - b * ey;
                const detY = a * ey - ex * c;

                const x = detX / detA;
                const y = detY / detA;

                mostrarResultado(resultadoDiv, `Solución única: x = ${x}, y = ${y}`);
            } else {
                mostrarResultado(resultadoDiv, "Sin solución o soluciones infinitas");
            }
        }
    } else if (size === 3) {
        if (selectedMethod === "gauss-jordan") {
            // Implementación de Gauss-Jordan para 3x3
            for (let i = 0; i < 3; i++) {
                // Escalonamiento
                for (let j = 0; j < 3; j++) {
                    if (j !== i) {
                        const factor = matrizSistema[j][i] / matrizSistema[i][i];
                        for (let k = 0; k < 4; k++) {
                            matrizSistema[j][k] -= factor * matrizSistema[i][k];
                        }
                    }
                }
            }

            // Resolución
            const x = matrizSistema[0][3] / matrizSistema[0][0];
            const y = matrizSistema[1][3] / matrizSistema[1][1];
            const z = matrizSistema[2][3] / matrizSistema[2][2];
            if (isFinite(x) && isFinite(y) && isFinite(z)) {
                mostrarResultado(resultadoDiv, `Solución única: x = ${x}, y = ${y}, z = ${z}`);
            } else {
                mostrarResultado(resultadoDiv, "Sin solución o soluciones infinitas");
            }
        } else if (selectedMethod === "cramer") {
            // Implementación de Cramer para 3x3
            const a = obtenerDeterminante3x3(matrizSistema.slice(0, 3).map(row => row.slice(0, 3)));
            if (a === 0) {
                mostrarResultado(resultadoDiv, "Sin solución o soluciones infinitas");
                return;
            }
            const detX = obtenerDeterminante3x3(matrizSistema.map)((row, i) => row.map((val, j) => (j === 0 ? matrizSistema[i][3] : val)));
            const detY = obtenerDeterminante3x3(matrizSistema.map)((row, i) => row.map((val, j) => (j === 1 ? matrizSistema[i][3] : val)));
            const detZ = obtenerDeterminante3x3(matrizSistema.map)((row, i) => row.map((val, j) => (j === 2 ? matrizSistema[i][3] : val)));
            
            const x = detX / a;
            const y = detY / a;
            const z = detZ / a;

            mostrarResultado(resultadoDiv, `Solución única: x = ${x}, y = ${y}, z = ${z}`);
        }
    } else if (size === 4) {
        if (selectedMethod === "gauss-jordan") {
            // Implementación de Gauss-Jordan para 4x4
            for (let i = 0; i < 4; i++) {
                // Escalonamiento
                for (let j = 0; j < 4; j++) {
                    if (j !== i) {
                        const factor = matrizSistema[j][i] / matrizSistema[i][i];
                        for (let k = 0; k < 5; k++) {
                            matrizSistema[j][k] -= factor * matrizSistema[i][k];
                        }
                    }
                }
            }

            // Soluciones
            const soluciones = [];
            for (let i = 0; i < 4; i++) {
                const x = matrizSistema[i][4] / matrizSistema[i][i];
                soluciones.push(`x${i + 1} = ${x}`);
            }
            
            mostrarResultado(resultadoDiv, soluciones.join("<br>"));
        }
    }
}



document.getElementById("inversa-size").addEventListener("change", function () {
    const size = parseInt(this.value);
    cambiarTamanoMatriz("inversaInput", size, size);
});

document.getElementById("multiply-size").addEventListener("change", function () {
    const size = parseInt(this.value);
    cambiarTamanoMatriz("multiplyInput1", size, size);
    cambiarTamanoMatriz("multiplyInput2", size, size);
});

document.getElementById("sistema-size").addEventListener("change", function () {
    const size = parseInt(this.value);
    cambiarTamanoMatriz("sistemaInput", size, size + 1);
});
