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
    let date = new Date();
    date = date.toString().split(" ");
    document.querySelector("#date-text").innerHTML = date[0];
    document.querySelector("#date-month").innerHTML = date[1];
    document.querySelector("#date-number").innerHTML = date[2];
    document.querySelector("#date-year").innerHTML = date[3];
  }

  function actualizarContador() {
    const completadas = tareas.filter((t) => t.completada).length;
    contador.textContent = `${completadas} / ${tareas.length} tareas completadas`;
  }

  function refrescarListaTareas() {
    todoList.innerHTML = "";
    tareas.forEach((tarea, index) => {
      const li = document.createElement("li");
      li.className = "tarea" + (tarea.completada ? " completada" : "");

      const p = document.createElement("p");
      p.textContent = tarea.texto;

      p.addEventListener("click", () => {
        if (!li.classList.contains("editando")) {
          tarea.completada = !tarea.completada;
          guardarTareas();
          refrescarListaTareas();
          actualizarContador();
        }
      });

      const botones = document.createElement("div");
      botones.classList.add("botones");

      const editarBtn = document.createElement("button");
      editarBtn.textContent = "Editar";
      editarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        activarModoEdicion(index, li, p);
      });
      botones.appendChild(editarBtn);

      const eliminarBtn = document.createElement("button");
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

    li.classList.add("editando");
    span.innerHTML = `<textarea rows="3">${tarea.texto}</textarea>`;

    const guardarBtn = document.createElement("button");
    guardarBtn.textContent = "Guardar";
    guardarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nuevoTexto = span.querySelector("textarea").value.trim();
      if (nuevoTexto) {
        tarea.texto = nuevoTexto;
        li.classList.remove("editando");
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
