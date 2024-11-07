document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.querySelector("#todo-form");
  const todoInput = document.querySelector("#todo-input");
  const todoList = document.querySelector("#todo-list");
  const contador = document.querySelector("#contador");
  const ordenarBtn = document.querySelector("#ordenar");

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  function displayDate() {
    const date = new Date();
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "short" });
    const year = date.getFullYear();

    document.querySelector("#date-text").innerHTML = weekday;
    document.querySelector("#date-number").innerHTML = day;
    document.querySelector("#date-month").innerHTML = month;
    document.querySelector("#date-year").innerHTML = year;
  }

  function actualizarContador() {
    const completadas = tareas.filter((t) => t.completada).length;
    contador.textContent = `${completadas} / ${tareas.length} tareas completadas`;
  }

  function refrescarListaTareas() {
    todoList.innerHTML = "";
    tareas.forEach((tarea, index) => {
      const li = document.createElement("li");
      li.className = "todo" + (tarea.completada ? " done" : "");

      const p = document.createElement("p");
      p.textContent = tarea.texto;

      p.addEventListener("click", () => {
        if (!li.classList.contains("editing")) {
          tarea.completada = !tarea.completada;
          guardarTareas();
          refrescarListaTareas();
          actualizarContador();
        }
      });

      const botones = document.createElement("div");
      botones.classList.add("botones");

      const editarBtn = document.createElement("button");
      editarBtn.classList.add("btn-edit");
      editarBtn.textContent = "Editar";
      editarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        activarModoEdicion(index, li, p);
      });
      botones.appendChild(editarBtn);

      const eliminarBtn = document.createElement("button");
      eliminarBtn.classList.add("btn-delete");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarTarea(index);
      });
      botones.appendChild(eliminarBtn);

      li.appendChild(p);
      li.appendChild(botones);

      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = todoInput.value.trim();
    if (texto) {
      tareas.push({ texto, completada: false });
      todoInput.value = "";
      guardarTareas();
      refrescarListaTareas();
      actualizarContador();
    }
  });

  function activarModoEdicion(index, li, span) {
    const tarea = tareas[index];

    li.classList.add("editing");
    span.innerHTML = `<textarea rows="3">${tarea.texto}</textarea>`;

    const guardarBtn = document.createElement("button");
    guardarBtn.classList.add("btn-save");
    guardarBtn.textContent = "Guardar";
    guardarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nuevoTexto = span.querySelector("textarea").value.trim();
      if (nuevoTexto) {
        tarea.texto = nuevoTexto;
        li.classList.remove("editing");
        guardarTareas();
        refrescarListaTareas();
      }
    });

    const botones = li.querySelector(".botones");
    botones.replaceChild(guardarBtn, botones.firstChild);
  }

  function eliminarTarea(index) {
    tareas.splice(index, 1);
    guardarTareas();
    refrescarListaTareas();
    actualizarContador();
  }

  ordenarBtn.addEventListener("click", () => {
    tareas.sort((a, b) => a.completada - b.completada);
    guardarTareas();
    refrescarListaTareas();
  });

  displayDate();
  refrescarListaTareas();
  actualizarContador();
});
