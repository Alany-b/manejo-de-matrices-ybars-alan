# ============================================================
#   SISTEMA DE GESTIÓN DE CALIFICACIONES - Python
# ============================================================

# ------------------------------------------------------------
# ESTRUCTURA DE DATOS INICIAL
# Cada alumno es una lista con: [nombre, [[materia, nota], ...]]
# ------------------------------------------------------------
alumnos = [
    ['Juan',  [['Matematicas', 8], ['Lengua', 9], ['Sociales', 7], ['Naturales', 7]]],
    ['Ana',   [['Lengua', 9], ['Matematicas', 10], ['Sociales', 8], ['Naturales', 6]]],
    ['Luis',  [['Lengua', 6], ['Sociales', 8], ['Matematicas', 7], ['Naturales', 6]]],
    ['Maria', [['Lengua', 9], ['Sociales', 10], ['Naturales', 10], ['Matematicas', 9]]]
]

# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def buscar_alumno(nombre):
    """Busca un alumno por nombre. Retorna el alumno o None."""
    for alumno in alumnos:
        if alumno[0].lower() == nombre.lower():  # comparamos sin importar mayúsculas
            return alumno
    return None  # no lo encontró


def buscar_materia(materias, nombre_materia):
    """Busca una materia en la lista de materias. Retorna la materia o None."""
    for materia in materias:
        if materia[0].lower() == nombre_materia.lower():
            return materia
    return None


def calcular_promedio(materias):
    """Calcula el promedio de notas de un alumno."""
    if len(materias) == 0:
        return 0
    total = 0
    for materia in materias:
        total += materia[1]          # materia[1] es la nota
    return total / len(materias)     # promedio = suma / cantidad


# ============================================================
# OPCIÓN 1 - VER ALUMNOS
# ============================================================

def ver_alumnos():
    print("\n" + "=" * 45)
    print("         LISTA DE ALUMNOS Y NOTAS")
    print("=" * 45)

    if len(alumnos) == 0:
        print("No hay alumnos registrados.")
        return

    for alumno in alumnos:
        nombre  = alumno[0]
        materias = alumno[1]
        promedio = calcular_promedio(materias)

        print(f"\n👤 Alumno: {nombre}")
        print(f"   {'Materia':<15} {'Nota':>5}")
        print(f"   {'-'*22}")
        for materia in materias:
            print(f"   {materia[0]:<15} {materia[1]:>5}")
        print(f"   {'─'*22}")
        print(f"   Promedio: {promedio:.2f}")   # 2 decimales

    # ⭐ BONUS: mostrar el alumno con mejor promedio
    mejor_alumno = None
    mejor_prom   = -1
    for alumno in alumnos:
        prom = calcular_promedio(alumno[1])
        if prom > mejor_prom:
            mejor_prom   = prom
            mejor_alumno = alumno[0]

    print("\n" + "=" * 45)
    print(f"🏆 Mejor promedio: {mejor_alumno} ({mejor_prom:.2f})")

    # ⭐ BONUS: mostrar alumnos ordenados por promedio (de mayor a menor)
    print("\n📊 Ranking por promedio:")
    # sorted() no modifica la lista original; key= le dice cómo ordenar
    ordenados = sorted(alumnos, key=lambda a: calcular_promedio(a[1]), reverse=True)
    for i, alumno in enumerate(ordenados, start=1):
        prom = calcular_promedio(alumno[1])
        print(f"   {i}. {alumno[0]:<10} {prom:.2f}")

    print("=" * 45)


# ============================================================
# OPCIÓN 2 - AGREGAR ALUMNO
# ============================================================

def agregar_alumno():
    print("\n--- Agregar Alumno ---")
    nombre = input("Ingrese el nombre del alumno: ").strip()

    # Validar que no esté vacío
    if nombre == "":
        print("❌ El nombre no puede estar vacío.")
        return

    # Verificar si ya existe
    if buscar_alumno(nombre) is not None:
        print(f"⚠️  El alumno '{nombre}' ya está registrado.")
        return

    # Pedir materias y notas
    materias = []
    print("Ingrese las materias y notas (escriba 'fin' para terminar):")

    while True:
        nombre_materia = input("  Nombre de la materia (o 'fin'): ").strip()
        if nombre_materia.lower() == 'fin':
            break
        if nombre_materia == "":
            print("  ❌ El nombre de la materia no puede estar vacío.")
            continue

        # Pedir nota con validación
        while True:
            try:
                nota = int(input(f"  Nota para {nombre_materia}: "))
                if 0 <= nota <= 10:     # rango válido
                    break
                else:
                    print("  ❌ La nota debe estar entre 0 y 10.")
            except ValueError:
                print("  ❌ Ingrese un número entero.")

        materias.append([nombre_materia, nota])

    if len(materias) == 0:
        print("❌ No se ingresaron materias. Alumno no agregado.")
        return

    # Agregar a la lista principal
    alumnos.append([nombre, materias])
    print(f"✅ Alumno '{nombre}' agregado con éxito.")


# ============================================================
# OPCIÓN 3 - AGREGAR O MODIFICAR NOTA
# ============================================================

def agregar_modificar_nota():
    print("\n--- Agregar o Modificar Nota ---")
    nombre = input("Ingrese el nombre del alumno: ").strip()

    alumno = buscar_alumno(nombre)

    if alumno is None:
        print(f"❌ El alumno '{nombre}' no está registrado.")
        return

    # El alumno existe
    print(f"✅ Alumno '{alumno[0]}' encontrado.")
    print("   Materias actuales:")
    for materia in alumno[1]:
        print(f"   - {materia[0]}: {materia[1]}")

    nombre_materia = input("Ingrese el nombre de la materia: ").strip()
    materia = buscar_materia(alumno[1], nombre_materia)

    # Pedir nota con validación
    while True:
        try:
            nota = int(input(f"Ingrese la nota para '{nombre_materia}': "))
            if 0 <= nota <= 10:
                break
            else:
                print("❌ La nota debe estar entre 0 y 10.")
        except ValueError:
            print("❌ Ingrese un número entero.")

    if materia is not None:
        # La materia YA existe → modificar nota
        nota_anterior = materia[1]
        materia[1] = nota    # actualizamos directamente en la lista
        print(f"✅ Nota de '{nombre_materia}' actualizada: {nota_anterior} → {nota}")
    else:
        # La materia NO existe → agregar
        alumno[1].append([nombre_materia, nota])
        print(f"✅ Materia '{nombre_materia}' con nota {nota} agregada a '{alumno[0]}'.")


# ============================================================
# MENÚ PRINCIPAL
# ============================================================

def mostrar_menu():
    print("\n" + "=" * 35)
    print("   GESTIÓN DE CALIFICACIONES")
    print("=" * 35)
    print("  1. Ver alumnos")
    print("  2. Agregar alumno")
    print("  3. Agregar o modificar notas")
    print("  4. Salir")
    print("=" * 35)


def main():
    print("Bienvenido al sistema de calificaciones")

    while True:               # el ciclo se repite hasta que el usuario elija Salir
        mostrar_menu()
        opcion = input("Seleccione una opción: ").strip()

        if opcion == '1':
            ver_alumnos()
        elif opcion == '2':
            agregar_alumno()
        elif opcion == '3':
            agregar_modificar_nota()
        elif opcion == '4':
            print("¡Hasta luego! 👋")
            break             # salimos del while
        else:
            print("❌ Opción inválida. Ingrese 1, 2, 3 o 4.")


# Punto de entrada del programa
main()