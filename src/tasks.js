import { getUser } from './auth.js';

const API = 'http://localhost:3000/tasks';

export async function loadTasks() {
  const pendientes = document.getElementById('listaPendientes');
  const realizadas = document.getElementById('listaRealizadas');
  const user = getUser();

  try {
    const res = await fetch(`${API}?assignedTo=${user.username}`);
    const tasks = await res.json();

    pendientes.innerHTML = '';
    realizadas.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      li.innerHTML = `
        <span>${task.title}</span>
        <div>
          <button class="btn btn-sm ${task.status === 'pendiente' ? 'btn-success' : 'btn-warning'} me-2"
            data-id="${task.id}" data-status="${task.status}">
            ${task.status === 'pendiente' ? '✔️ Realizada' : '↩️ Pendiente'}
          </button>
          <button class="btn btn-danger btn-sm" data-id="${task.id}">🗑️</button>
        </div>
      `;

      const lista = task.status === 'pendiente' ? pendientes : realizadas;
      lista.appendChild(li);

      // Agregar eventos
      li.querySelector('.btn-success, .btn-warning').addEventListener('click', () => cambiarEstado(task));
      li.querySelector('.btn-danger').addEventListener('click', () => eliminarTarea(task.id));
    });
  } catch (e) {
    pendientes.innerHTML = realizadas.innerHTML = '<li class="list-group-item">Error al cargar tareas.</li>';
  }
}

export function setupTaskForm() {
  const form = document.getElementById('formTarea');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('descripcion').value.trim();
    const user = getUser();

    if (!title) return;

    const task = {
      title,
      assignedTo: user.username,
      status: 'pendiente'
    };

    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      form.reset();
      loadTasks();
    } catch (err) {
      alert('Error al agregar tarea.');
    }
  });
}

async function eliminarTarea(id) {
  if (confirm('¿Eliminar esta tarea?')) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      loadTasks();
    } catch (err) {
      alert('Error al eliminar tarea.');
    }
  }
}

async function cambiarEstado(task) {
  const nuevoEstado = task.status === 'pendiente' ? 'realizada' : 'pendiente';
  try {
    await fetch(`${API}/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nuevoEstado })
    });
    loadTasks();
  } catch (err) {
    alert('Error al cambiar estado.');
  }
}
