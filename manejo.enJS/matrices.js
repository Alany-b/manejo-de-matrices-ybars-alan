// ============================================================
//   SISTEMA DE GESTIÓN DE CALIFICACIONES - JavaScript (Node.js)
//   Ejecutar con: node calificaciones.js
// ============================================================
 
const readline = require('readline');  // módulo de Node para leer la consola
 
// Interfaz para leer del teclado
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
 
// Función auxiliar: hace una pregunta y espera respuesta (devuelve una Promesa)
function preguntar(texto) {
    return new Promise(resolve => rl.question(texto, resolve));
}
 
// ------------------------------------------------------------
// ESTRUCTURA DE DATOS INICIAL
// Igual que Python: lista de [nombre, [[materia, nota], ...]]
// ------------------------------------------------------------
const alumnos = [
    ['Juan',  [['Matematicas', 8], ['Lengua', 9], ['Sociales', 7], ['Naturales', 7]]],
    ['Ana',   [['Lengua', 9], ['Matematicas', 10], ['Sociales', 8], ['Naturales', 6]]],
    ['Luis',  [['Lengua', 6], ['Sociales', 8], ['Matematicas', 7], ['Naturales', 6]]],
    ['Maria', [['Lengua', 9], ['Sociales', 10], ['Naturales', 10], ['Matematicas', 9]]]
];
 
// ============================================================
// FUNCIONES AUXILIARES
// ============================================================
 
function buscarAlumno(nombre) {
    // Recorre la lista y busca por nombre (sin importar mayúsculas)
    for (const alumno of alumnos) {
        if (alumno[0].toLowerCase() === nombre.toLowerCase()) {
            return alumno;   // retorna el alumno encontrado
        }
    }
    return null;   // no encontrado
}
 
function buscarMateria(materias, nombreMateria) {
    for (const materia of materias) {
        if (materia[0].toLowerCase() === nombreMateria.toLowerCase()) {
            return materia;
        }
    }
    return null;
}
 
function calcularPromedio(materias) {
    if (materias.length === 0) return 0;
    let total = 0;
    for (const materia of materias) {
        total += materia[1];       // materia[1] es la nota
    }
    return total / materias.length;
}
 
// ============================================================
// OPCIÓN 1 - VER ALUMNOS
// ============================================================
 
function verAlumnos() {
    console.log('\n' + '='.repeat(45));
    console.log('         LISTA DE ALUMNOS Y NOTAS');
    console.log('='.repeat(45));
 
    if (alumnos.length === 0) {
        console.log('No hay alumnos registrados.');
        return;
    }
 
    for (const alumno of alumnos) {
        const nombre   = alumno[0];
        const materias = alumno[1];
        const promedio = calcularPromedio(materias);
 
        console.log(`\n👤 Alumno: ${nombre}`);
        console.log(`   ${'Materia'.padEnd(15)} ${'Nota'.padStart(5)}`);
        console.log(`   ${'-'.repeat(22)}`);
        for (const materia of materias) {
            console.log(`   ${materia[0].padEnd(15)} ${String(materia[1]).padStart(5)}`);
        }
        console.log(`   ${'─'.repeat(22)}`);
        console.log(`   Promedio: ${promedio.toFixed(2)}`);   // 2 decimales
    }
 
    // ⭐ BONUS: mejor promedio
    let mejorAlumno = null;
    let mejorProm   = -1;
    for (const alumno of alumnos) {
        const prom = calcularPromedio(alumno[1]);
        if (prom > mejorProm) {
            mejorProm   = prom;
            mejorAlumno = alumno[0];
        }
    }
    console.log('\n' + '='.repeat(45));
    console.log(`🏆 Mejor promedio: ${mejorAlumno} (${mejorProm.toFixed(2)})`);
 
    // ⭐ BONUS: ranking ordenado por promedio
    console.log('\n📊 Ranking por promedio:');
    // [...alumnos] crea una copia para no modificar el original
    const ordenados = [...alumnos].sort((a, b) => calcularPromedio(b[1]) - calcularPromedio(a[1]));
    ordenados.forEach((alumno, i) => {
        const prom = calcularPromedio(alumno[1]);
        console.log(`   ${i + 1}. ${alumno[0].padEnd(10)} ${prom.toFixed(2)}`);
    });
 
    console.log('='.repeat(45));
}
 
// ============================================================
// OPCIÓN 2 - AGREGAR ALUMNO
// ============================================================
 
async function agregarAlumno() {
    console.log('\n--- Agregar Alumno ---');
    const nombre = (await preguntar('Ingrese el nombre del alumno: ')).trim();
 
    if (nombre === '') {
        console.log('❌ El nombre no puede estar vacío.');
        return;
    }
 
    if (buscarAlumno(nombre) !== null) {
        console.log(`⚠️  El alumno '${nombre}' ya está registrado.`);
        return;
    }
 
    const materias = [];
    console.log("Ingrese las materias y notas (escriba 'fin' para terminar):");
 
    while (true) {
        const nombreMateria = (await preguntar("  Nombre de la materia (o 'fin'): ")).trim();
        if (nombreMateria.toLowerCase() === 'fin') break;
        if (nombreMateria === '') {
            console.log('  ❌ El nombre de la materia no puede estar vacío.');
            continue;
        }
 
        // Pedir nota con validación
        let nota;
        while (true) {
            const input = await preguntar(`  Nota para ${nombreMateria}: `);
            nota = parseInt(input);
            if (!isNaN(nota) && nota >= 0 && nota <= 10) break;
            console.log('  ❌ Ingrese un número entero entre 0 y 10.');
        }
 
        materias.push([nombreMateria, nota]);
    }
 
    if (materias.length === 0) {
        console.log('❌ No se ingresaron materias. Alumno no agregado.');
        return;
    }
 
    alumnos.push([nombre, materias]);
    console.log(`✅ Alumno '${nombre}' agregado con éxito.`);
}
 
// ============================================================
// OPCIÓN 3 - AGREGAR O MODIFICAR NOTA
// ============================================================
 
async function agregarModificarNota() {
    console.log('\n--- Agregar o Modificar Nota ---');
    const nombre = (await preguntar('Ingrese el nombre del alumno: ')).trim();
 
    const alumno = buscarAlumno(nombre);
 
    if (alumno === null) {
        console.log(`❌ El alumno '${nombre}' no está registrado.`);
        return;
    }
 
    console.log(`✅ Alumno '${alumno[0]}' encontrado.`);
    console.log('   Materias actuales:');
    for (const materia of alumno[1]) {
        console.log(`   - ${materia[0]}: ${materia[1]}`);
    }
 
    const nombreMateria = (await preguntar('Ingrese el nombre de la materia: ')).trim();
 
    // Validar nota
    let nota;
    while (true) {
        const input = await preguntar(`Ingrese la nota para '${nombreMateria}': `);
        nota = parseInt(input);
        if (!isNaN(nota) && nota >= 0 && nota <= 10) break;
        console.log('❌ Ingrese un número entero entre 0 y 10.');
    }
 
    const materia = buscarMateria(alumno[1], nombreMateria);
 
    if (materia !== null) {
        // La materia existe → modificar
        const notaAnterior = materia[1];
        materia[1] = nota;
        console.log(`✅ Nota de '${nombreMateria}' actualizada: ${notaAnterior} → ${nota}`);
    } else {
        // La materia no existe → agregar
        alumno[1].push([nombreMateria, nota]);
        console.log(`✅ Materia '${nombreMateria}' con nota ${nota} agregada a '${alumno[0]}'.`);
    }
}
 
// ============================================================
// MENÚ PRINCIPAL
// ============================================================
 
function mostrarMenu() {
    console.log('\n' + '='.repeat(35));
    console.log('   GESTIÓN DE CALIFICACIONES');
    console.log('='.repeat(35));
    console.log('  1. Ver alumnos');
    console.log('  2. Agregar alumno');
    console.log('  3. Agregar o modificar notas');
    console.log('  4. Salir');
    console.log('='.repeat(35));
}
 
async function main() {
    console.log('Bienvenido al sistema de calificaciones');
 
    while (true) {
        mostrarMenu();
        const opcion = (await preguntar('Seleccione una opción: ')).trim();
 
        if (opcion === '1') {
            verAlumnos();
        } else if (opcion === '2') {
            await agregarAlumno();
        } else if (opcion === '3') {
            await agregarModificarNota();
        } else if (opcion === '4') {
            console.log('¡Hasta luego! 👋');
            rl.close();   // cerramos la interfaz de lectura
            break;
        } else {
            console.log('❌ Opción inválida. Ingrese 1, 2, 3 o 4.');
        }
    }
}
 
// Punto de entrada
main();