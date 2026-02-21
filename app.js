const TACHE_PAR_PAGE = 15;
let currentPage = 1;

const DEFAULT_CAT_ID = 1;

let CURRENT_EMAIL = null;

let CURRENT_PASSWORD = null;

let LATEST_CATEGORIES = {};
let LATEST_TILES = {};


document.addEventListener('DOMContentLoaded', () => {
  ecouteurEvenement();

  updateAuthStatus();

  retrieveAllCategoriesAndAllTiles();
});

function updateAuthStatus() {

  const nameEl = document.getElementById('user-name');

  const logoutBtn = document.getElementById('logout-btn');
  const authWarning = document.getElementById('auth-warning');

  const noTasks = document.getElementById('no-tasks');
  if (CURRENT_EMAIL) {
    if (nameEl) nameEl.textContent = CURRENT_EMAIL;

    if (logoutBtn) logoutBtn.style.display = 'inline-block';

    if (authWarning) authWarning.style.display = 'none';

    if (noTasks) noTasks.style.display = 'none';

    chargementEtAffichageTache();

  } else {

    if (nameEl) nameEl.textContent = 'Non connecté';

    if (logoutBtn) logoutBtn.style.display = 'none';

    if (authWarning) authWarning.style.display = 'inline';

    if (noTasks) noTasks.style.display = 'block';
  }
}

async function retrieveAllCategoriesAndAllTiles() {
  try {
    const res = await fetch('server_side/server/all.php?action=categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": CURRENT_EMAIL, "password": CURRENT_PASSWORD })
    });

    const data = await res.json();

    if (data.return == 322500) {
      LATEST_CATEGORIES = data.categories;
      cat_selector = document.getElementById("category");
      cat_selector.innerHTML = "";
      LATEST_CATEGORIES.forEach(item => {
        const cat_option = document.createElement("option");
        cat_option.value = item.id;
        cat_option.textContent = item.title;
        cat_selector.appendChild(cat_option);
      });
    }

  } catch (err) {
    // Pass
  }

  try {
    const res = await fetch('server_side/server/all.php?action=tiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": CURRENT_EMAIL, "password": CURRENT_PASSWORD })
    });

    const data = await res.json();

    if (data.return == 322500) {
      LATEST_TILES = data.tiles;

      const formated_tiles = LATEST_TILES.map(tile => ({
        id: tile.id,
        category: LATEST_CATEGORIES.find(obj => obj.id === tile.cat_id).title || "none",
        content: tile.content,
        title: tile.title,
        author_email: tile.author_email,
      }));

      console.log(
        LATEST_TILES
      );
      console.log("CAT", LATEST_CATEGORIES);
      console.log(formated_tiles);

      renduTache(
        formated_tiles
      );
    }

  } catch (err) {
    // Pass
  }
}

function deconnexion() {

  CURRENT_EMAIL = null;

  CURRENT_PASSWORD = null;
  updateAuthStatus();
}

async function inscriptionUtilisateur(event) {

  event.preventDefault();

  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const errorEl = document.getElementById('register-error');
  const successEl = document.getElementById('register-success');

  clearMessages('register-');

  if (!email || !password) {

    if (errorEl) errorEl.textContent = 'Email et mot de passe obligatoires.';
    return;

  }

  try {

    const res = await fetch('server_side/server/user.php?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })

    });

    const data = await res.json();

    if (data.return === 322500) {
      if (successEl) successEl.textContent = 'Inscription réussie! Connectez-vous.';
      event.target.reset();
    } else if (data.return === 322502) {
      if (errorEl) errorEl.textContent = 'Email déjà utilisé.';
    } else {
      if (errorEl) errorEl.textContent = `Erreur ${data.return}`;
    }
  } catch (err) {
    if (errorEl) errorEl.textContent = 'Erreur réseau.';
  }
}

async function connexionUtilisateur(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  clearMessages('login-');

  if (!email || !password) {

    if (errorEl) errorEl.textContent = 'Email et mot de passe obligatoires.';
    return;
  }

  try {

    const res = await fetch('server_side/server/user.php?action=challenge', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.return === 322500) {

      CURRENT_EMAIL = email;
      CURRENT_PASSWORD = password;

      event.target.reset();

      updateAuthStatus();
      retrieveAllCategoriesAndAllTiles();

    } else if (data.return === 322503) {

      errorEl.textContent = 'Compte inconnu.';
    } else if (data.return === 322504) {
      errorEl.textContent = 'Mot de passe incorrect.';

    } else {
      errorEl.textContent = `Erreur ${data.return}`;
    }
  } catch (err) {
    errorEl.textContent = 'Erreur réseau.';
  }
}

function clearMessages(prefix) {

  const errorEl = document.getElementById(prefix + 'error');
  const successEl = document.getElementById(prefix + 'success');

  if (errorEl) errorEl.textContent = '';

  if (successEl) successEl.textContent = '';

}

async function chargementEtAffichageTache() {

  if (!CURRENT_EMAIL) {

    const grid = document.getElementById('tasks-grid');
    if (grid) grid.innerHTML = '<p>Connectez-vous pour voir vos tâches.</p>';
    return;

  }

  // TODO : appeler tile.php?action=getList quand implémenté
  const grid = document.getElementById('tasks-grid');
  const compteur = document.getElementById('task-count');

  // if (grid) grid.innerHTML = '<p>Liste à implémenter (connecté).</p>';

  if (compteur) compteur.textContent = '0 tâche';
}

function renduTache(tasks) {
  const compteur = document.getElementById('task-count');
  if (compteur) compteur.textContent = `${tasks.length} tâche(s)`;


  const grid = document.getElementById('tasks-grid');

  if (!grid) return;

  grid.innerHTML = '';
  if (!tasks || tasks.length === 0) {

    grid.innerHTML = '<p>Aucune tâche trouvée.</p>';

    return;
  }

  for (task in tasks) {

  }

  tasks.forEach(task => {
    try {
      const element = creationTuileTache(task);
      grid.appendChild(element);
    } catch (err) {
      console.error("Task creation failed", err);
    }
  });
}

function creationTuileTache(task) {
  const article = document.createElement('article');

  article.className = 'task-tile';
  article.dataset.id = task.id || '';

  article.innerHTML = `

    <header class="task-header">

      <h3 class="task-title">${(task.title)}</h3>
      <!-- <span class="task-date">${task.due_date || ''}</span> -->
    </header>
    <div class="task-meta">

      <span class="task-category">Catégorie : ${(task.category || '—')}</span>
      <!-- <span class="task-status ${(task.status || 'todo')}">${statusLabel(task.status || 'todo')}</span> -->
    </div>
    <p class="task-description">${(task.description || task.content || '')}</p>

    <footer class="task-footer">
      <span class="task-owner">Par: ${(task.author_email || '—')}</span>
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

function statusClass(status) {

  return status === 'doing' ? 'status-doing' : status === 'done' ? 'status-done' : 'status-todo';

}

function statusLabel(status) {

  return status === 'doing' ? 'En cours' : status === 'done' ? 'Terminée' : 'À faire';

}



function ecouteurEvenement() {


  document.getElementById('task-form')?.addEventListener('submit', creationTache);


  document.getElementById('filter-apply')?.addEventListener('click', () => {

    currentPage = 1;

    chargementEtAffichageTache();

  });
  document.getElementById('filter-reset')?.addEventListener('click', () => {
    document.getElementById('filter-form')?.reset();

    currentPage = 1;

    chargementEtAffichageTache();
  });


  document.getElementById('edit-form')?.addEventListener('submit', soumissionModif);

  document.getElementById('edit-close')?.addEventListener('click', fermerModifTache);
  document.getElementById('edit-cancel')?.addEventListener('click', fermerModifTache);


  document.getElementById('register-form')?.addEventListener('submit', inscriptionUtilisateur);
  document.getElementById('login-form')?.addEventListener('submit', connexionUtilisateur);

  document.getElementById('logout-btn')?.addEventListener('click', deconnexion);
}

async function creationTache(event) {

  event.preventDefault();

  if (!CURRENT_EMAIL) {

    document.getElementById('form-error').textContent = 'Connectez-vous d\'abord.';

    return;

  }

  const errorEl = document.getElementById('form-error');

  if (errorEl) errorEl.textContent = '';

  const title = document.getElementById('title').value.trim();

  const description = document.getElementById('description').value.trim();
  const currently_selecting_cat = document.getElementById('category').value;

  if (!title || !description) {

    if (errorEl) errorEl.textContent = 'Titre et description obligatoires.';

    return;

  }

  try {

    const res = await fetch('server_side/server/tile.php?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CURRENT_EMAIL,
        password: CURRENT_PASSWORD,
        title,
        content: description,
        cat_id: currently_selecting_cat

      })

    });
    const data = await res.json();

    if (data.return !== 322500) throw new Error(`Code ${data.return}`);

    event.target.reset();

    currentPage = 1;
    chargementEtAffichageTache();
    retrieveAllCategoriesAndAllTiles();

  } catch (err) {

    if (errorEl) errorEl.textContent = err.message;

  }



}

async function effacerTache(id) {
  if (!CURRENT_EMAIL || !confirm('Supprimer ?')) return;

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

    if (data.return !== 322500) throw new Error(`Code ${data.return}`);

    chargementEtAffichageTache();
  } catch (err) {

    alert(err.message);

  }
}

function modifTache(task) {

  const modal = document.getElementById('edit-modal');

  if (!modal || !CURRENT_EMAIL) return;

  document.getElementById('edit-id').value = task.id;
  document.getElementById('edit-title').value = task.title || '';

  document.getElementById('edit-description').value = task.description || task.content || '';


  document.getElementById('edit-error').textContent = '';
  modal.classList.remove('hidden');

}

function fermerModifTache() {
  document.getElementById('edit-modal')?.classList.add('hidden');

}

async function soumissionModif(event) {

  event.preventDefault();
  // TODO : implémenter quand tile.php a action=update
  document.getElementById('edit-error').textContent = 'Update non implémenté.';

}
