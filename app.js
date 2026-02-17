const TASKS_PER_PAGE = 15;
let currentPage = 1;

// À adapter : utilisateur courant et catégorie par défaut
const CURRENT_EMAIL = 'test@example.com';
const CURRENT_PASSWORD = 'motdepasse';
const DEFAULT_CAT_ID = 1;

document.addEventListener('DOMContentLoaded', () => {
  ecouteurEvenement();
  chargementEtAffichageTache();
});


// ----------- Chargement des tuiles (version simple) -----------

// Comme tile.php n’a pas encore d’endpoint "list", cette fonction devra
// être adaptée quand on ajoutera une route pour lister toutes les tuiles.
// Pour l’instant, on affiche juste un message.

async function chargementEtAffichageTache() {
  const grid = document.getElementById('tasks-grid');
  const compteur = document.getElementById('task-count');

  grid.innerHTML = '<p>La liste des tâches sera disponible une fois l’API de liste implémentée.</p>';
  if (compteur) compteur.textContent = '0 tâche';
}


// ----------- Rendu d’une liste de tuiles -----------

function renduTache(tasks) {
  const grid = document.getElementById('tasks-grid');
  grid.innerHTML = '';

  if (!tasks || tasks.length === 0) {
    grid.innerHTML = '<p>Aucune tâche trouvée.</p>';
    return;
  }

  tasks.forEach(task => {
    grid.appendChild(creationTuileTache(task));
  });
}

function creationTuileTache(task) {
  const article = document.createElement('article');

  article.className = 'task-tile';
  article.dataset.id = task.id;

  article.innerHTML = `
    <header class="task-header">
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      <span class="task-date">${task.due_date || ''}</span>
    </header>
    <div class="task-meta">
      <span class="task-category">Catégorie : ${escapeHtml(task.category || '—')}</span>
      <span class="task-status ${statusClass(task.status || 'todo')}">
        ${statusLabel(task.status || 'todo')}
      </span>
    </div>
    <p class="task-description">
      ${escapeHtml(task.description || task.content || '')}
    </p>
    <footer class="task-footer">
      <span class="task-owner">Par: ${escapeHtml(task.author_email || CURRENT_EMAIL)}</span>
      <div class="task-actions">
        <button class="btn btn-small btn-outline edit-task">Modifier</button>
        <button class="btn btn-small btn-danger delete-task">Supprimer</button>
      </div>
    </footer>
  `;

  article.querySelector('.edit-task').addEventListener('click', () => modifTache(task));
  article.querySelector('.delete-task').addEventListener('click', () => effacerTache(task.id));

  return article;
}


// ----------- Helpers statut -----------

function statusClass(status) {
  if (status === 'doing') return 'status-doing';
  if (status === 'done') return 'status-done';
  return 'status-todo';
}

function statusLabel(status) {
  if (status === 'doing') return 'En cours';
  if (status === 'done') return 'Terminée';
  return 'À faire';
}

function escapeHtml(str) {
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


// ----------- Écouteurs d’événements -----------

function ecouteurEvenement() {
  const taskForm = document.getElementById('task-form');
  const filterApply = document.getElementById('filter-apply');
  const filterReset = document.getElementById('filter-reset');
  const editForm = document.getElementById('edit-form');
  const editClose = document.getElementById('edit-close');
  const editCancel = document.getElementById('edit-cancel');

  if (taskForm) {
    taskForm.addEventListener('submit', creationTache);
  }
  if (filterApply) {
    filterApply.addEventListener('click', () => {
      currentPage = 1;
      chargementEtAffichageTache();
    });
  }
  if (filterReset) {
    filterReset.addEventListener('click', () => {
      document.getElementById('filter-form').reset();
      currentPage = 1;
      chargementEtAffichageTache();
    });
  }
  if (editForm) {
    editForm.addEventListener('submit', soumissionModif);
  }
  if (editClose) {
    editClose.addEventListener('click', fermerModifTache);
  }
  if (editCancel) {
    editCancel.addEventListener('click', fermerModifTache);
  }
}


// ----------- Création d’une tuile (tile.php?action=create) -----------

async function creationTache(event) {
  event.preventDefault();
  const errorEl = document.getElementById('form-error');
  if (errorEl) errorEl.textContent = '';

  const title = document.getElementById('title').value.trim();
  const due_date = document.getElementById('due_date').value; // pas utilisé côté backend
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();
  const priority = document.getElementById('priority').value;
  const status = document.getElementById('status').value;

  if (!title || !description) {
    if (errorEl) errorEl.textContent = 'Titre et description sont obligatoires.';
    return;
  }

  try {
    const res = await fetch('server_side/server/tile.php?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CURRENT_EMAIL,
        password: CURRENT_PASSWORD,
        title: title,
        content: description,
        cat_id: DEFAULT_CAT_ID
      })
    });

    const data = await res.json();
    if (data.return !== 322500) {
      throw new Error('Erreur backend : code ' + data.return + '.');
}

    event.target.reset();
    currentPage = 1;
    chargementEtAffichageTache();
  } catch (err) {
    console.error(err);
    if (errorEl) errorEl.textContent = err.message;
  }
}


// ----------- Modification (modale) -----------

function modifTache(task) {
  const modal = document.getElementById('edit-modal');
  if (!modal) return;

  document.getElementById('edit-id').value = task.id;
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-date').value = task.due_date || '';
  document.getElementById('edit-category').value = task.category || '';
  document.getElementById('edit-description').value = task.description || task.content || '';
  document.getElementById('edit-priority').value = task.priority || 'medium';
  document.getElementById('edit-status').value = task.status || 'todo';

  const errorEl = document.getElementById('edit-error');
  if (errorEl) errorEl.textContent = '';

  modal.classList.remove('hidden');
}

function fermerModifTache() {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.classList.add('hidden');
}


// ATTENTION : tile.php n’a pas encore d’endpoint update.
// soumissionModif est préparée mais ne fonctionnera que si vous
// ajoutez une action=update côté PHP.

async function soumissionModif(event) {
  event.preventDefault();

  const errorEl = document.getElementById('edit-error');
  if (errorEl) errorEl.textContent = '';

  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const due_date = document.getElementById('edit-date').value;
  const category = document.getElementById('edit-category').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const priority = document.getElementById('edit-priority').value;
  const status = document.getElementById('edit-status').value;

  if (!title || !description) {
    if (errorEl) errorEl.textContent = 'Titre et description sont obligatoires.';
    return;
  }

  // Exemple de future requête si ajout action=update dans tile.php :
  /*
  try {
    const res = await fetch('server_side/server/tile.php?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CURRENT_EMAIL,
        password: CURRENT_PASSWORD,
        tile_id: id,
        title: title,
        content: description,
        cat_id: DEFAULT_CAT_ID
      })
    });
    const data = await res.json();
    if (data.return !== 322500) {
      throw new Error('Erreur backend (code ' + data.return + ').');
    }
    fermerModifTache();
    chargementEtAffichageTache();
  } catch (err) {
    console.error(err);
    if (errorEl) errorEl.textContent = err.message;
  }
  */
}


// ----------- Suppression (tile.php?action=delete) -----------

async function effacerTache(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;

  try {
    const res = await fetch('server_side/server/tile.php?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CURRENT_EMAIL,
        password: CURRENT_PASSWORD,
        tile_id: id
      })
    });
    const data = await res.json();
    if (data.return !== 322500) {
      throw new Error('Erreur backend (code ' + data.return + ').');
    }
    chargementEtAffichageTache();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
