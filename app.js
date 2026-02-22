//Moulay Ali Lablih

const TACHE_PAR_PAGE = 15;
let currentPage = 1;

let filterSearch = '';
let filterCategory = '';
let filterAuthor = '';
let filterSort = 'date-desc'; 
let allUsers = [];


const DEFAULT_CAT_ID = 1;

let CURRENT_EMAIL = null;

let CURRENT_PASSWORD = null;

let LATEST_CATEGORIES = {};
let LATEST_TILES = {};


let LAST_UPDATED_CATEGORIES = 0;
let LAST_UPDATED_TILES = 0;


document.addEventListener('DOMContentLoaded', () => {
  ecouteurEvenement();

  updateAuthStatus();
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {

      clearTimeout(timeout);
      func(...args);

    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function pollServer() {
  

  console.log("polling"); 

  try {
    const cat_res = await fetch('server_side/server/all.php?action=categories_last_update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": CURRENT_EMAIL, "password": CURRENT_PASSWORD })
    });

    const data = await cat_res.json();

    if (data.return == 322500 && Math.floor(new Date(data.timestamp).getTime() / 1000) > LAST_UPDATED_CATEGORIES) {
      const ts_int = Math.floor(new Date(data.timestamp).getTime() / 1000);
      LAST_UPDATED_CATEGORIES = ts_int;
      retrieveAllCategories();
    }

  } catch (err) {
    // Pass
  }

  try {
    const cat_res = await fetch('server_side/server/all.php?action=tiles_last_update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": CURRENT_EMAIL, "password": CURRENT_PASSWORD })
    });

    const data = await cat_res.json();

    if (data.return == 322500 && Math.floor(new Date(data.timestamp).getTime() / 1000) > LAST_UPDATED_TILES) {
      const ts_int = Math.floor(new Date(data.timestamp).getTime() / 1000);
      LAST_UPDATED_TILES = ts_int;
      retrieveAllTiles();
    }

  } catch (err) {
    // Pass
  }

}

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

async function retrieveAllCategories() {
  if (!CURRENT_EMAIL || !CURRENT_PASSWORD) {

    console.warn('Pas connecté, pas de catégories');
    return;
  }
  
  try {
    console.log('Envoi catégories:', { email: CURRENT_EMAIL, password: '***' });

    const res = await fetch('server_side/server/all.php?action=categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 

        email: CURRENT_EMAIL, 
        password: CURRENT_PASSWORD 
      })
    });

    const data = await res.json();
    console.log('Réponse catégories:', data);

    if (data.return == 322500 && Array.isArray(data.categories)) {
      LATEST_CATEGORIES = data.categories;
      populateCategorySelect("category");

      populateCategorySelect("edit-category");
    } else {
      console.error('Erreur catégories:', data.return);
    }
  } catch (err) {
    console.error('Fetch catégories échoué:', err);
  }
}


function populateCategorySelect(selectId = "category") {
  const select = document.getElementById(selectId);
  if (!select || LATEST_CATEGORIES.length === 0) return;
  
  select.innerHTML = '<option value="">Choisir une catégorie</option>';
  LATEST_CATEGORIES.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.title;
    select.appendChild(option);
  });
}

function applyFilters(rawTiles) {
  let filtered = [...rawTiles];
  
  if (filterSearch.trim()) {
    const searchLower = filterSearch.toLowerCase();
    filtered = filtered.filter(tile => 
      tile.title.toLowerCase().includes(searchLower) ||
      tile.content.toLowerCase().includes(searchLower)
    );
  }
  
  if (filterCategory && filterCategory !== '') {
    filtered = filtered.filter(tile => tile.cat_id == filterCategory);
  }
  
  if (filterAuthor && filterAuthor !== '') {
    filtered = filtered.filter(tile => tile.author_email === filterAuthor);
  }
  
  filtered.sort((a, b) => {
    switch (filterSort) {
      case 'date-desc': return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'date-asc': return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case 'title-asc': return a.title.localeCompare(b.title);
      case 'title-desc': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });
  
  return filtered;
}

function applyFiltersClick() {
  filterSearch = document.getElementById('search-input')?.value || '';

  filterCategory = document.getElementById('filter-category')?.value || '';
  filterAuthor = document.getElementById('filter-author')?.value || '';
  filterSort = document.getElementById('filter-sort')?.value || 'date-desc';
  
  currentPage = 1;
  refreshFilteredDisplay();
}

function resetFiltersClick() {
  document.getElementById('filter-form')?.reset();

  filterSearch = ''; filterCategory = ''; filterAuthor = ''; filterSort = 'date-desc';
  currentPage = 1;
  refreshFilteredDisplay();
}

function refreshFilteredDisplay() {
  if (!LATEST_TILES.length) return;
  
  const formattedTiles = LATEST_TILES.map(tile => ({
    id: tile.id, category: LATEST_CATEGORIES.find(c => c.id === tile.cat_id)?.title || "none",
    content: tile.content, title: tile.title, description: tile.content,
    cat_id: tile.cat_id, author_email: tile.author_email,
    created_at: tile.created_at || tile.updated_at || '1970-01-01'
  }));
  
  const filteredTiles = applyFilters(formattedTiles);

  renduTache(filteredTiles);
}

async function retrieveAllTiles() {
  try {
    const res = await fetch('server_side/server/all.php?action=tiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": CURRENT_EMAIL, "password": CURRENT_PASSWORD })
    });

    const data = await res.json();

    if (data.return == 322500) {
      LATEST_TILES = data.tiles;
      currentPage = 1; 
      refreshFilteredDisplay();
      
      
      const formated_tiles = LATEST_TILES.map(tile => ({
        id: tile.id,
        category: LATEST_CATEGORIES.find(obj => obj.id === tile.cat_id)?.title || "none",
        content: tile.content,
        title: tile.title,
        description: tile.content, 
        cat_id: tile.cat_id,       
        author_email: tile.author_email,
      }));

      renduTache(formated_tiles);
    }
  } catch (err) {
    // Pass
  }
}


async function retrieveAllCategoriesAndAllTiles() {
  retrieveAllCategories();
  retrieveAllTiles();
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

  if (!email) {
  if (errorEl) errorEl.textContent = 'Email obligatoire.';
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

  
  const grid = document.getElementById('tasks-grid');
  const compteur = document.getElementById('task-count');

  // if (grid) grid.innerHTML = '<p>Liste à implémenter (connecté).</p>';

  // if (compteur) compteur.textContent = '0 tâche';
}

function renduTache(tasks) {
  const compteur = document.getElementById('task-count');
  if (compteur) compteur.textContent = `${tasks.length} tâche(s)`;

  const grid = document.getElementById('tasks-grid');
  const pagination = document.getElementById('pagination');
  
  if (!grid || !pagination) return;

 
  const totalPages = Math.ceil(tasks.length / TACHE_PAR_PAGE);

  const debut = (currentPage - 1) * TACHE_PAR_PAGE;
  const fin = debut + TACHE_PAR_PAGE;

  const tuilesPage = tasks.slice(debut, fin);

  
  grid.innerHTML = '';
  if (tuilesPage.length === 0) {
    grid.innerHTML = '<p>Aucune tâche trouvée.</p>';
    pagination.innerHTML = '';
    return;
  }

  tuilesPage.forEach(task => {
    try {
      const element = creationTuileTache(task);
      grid.appendChild(element);
    } catch (err) {
      console.error("Task creation failed", err);
    }
  });

  
  genererPagination(totalPages, currentPage);
}
function genererPagination(totalPages, pageActuelle) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  let html = '<button class="btn btn-small" id="prev-page" ' + (pageActuelle <= 1 ? 'disabled' : '') + '>← Précédent</button>';

 
  const maxVisible = 5;
  let debutPage = Math.max(1, pageActuelle - Math.floor(maxVisible / 2));
  let finPage = Math.min(totalPages, debutPage + maxVisible - 1);
  
  if (finPage - debutPage + 1 < maxVisible) {
    debutPage = Math.max(1, finPage - maxVisible + 1);
  }

  for (let i = debutPage; i <= finPage; i++) {
    html += `<button class="btn btn-small ${i === pageActuelle ? 'btn-primary' : ''}" data-page="${i}">${i}</button>`;
  }

  html += '<button class="btn btn-small" id="next-page" ' + (pageActuelle >= totalPages ? 'disabled' : '') + '>Suivant →</button>';

  pagination.innerHTML = html;

 
  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (pageActuelle > 1) {
      currentPage--;
      renduTache(LATEST_TILES.map(tile => ({
        id: tile.id,
        category: LATEST_CATEGORIES.find(obj => obj.id === tile.cat_id)?.title || "none",
        content: tile.content,

        title: tile.title,
        description: tile.content, 

        cat_id: tile.cat_id,
        author_email: tile.author_email,

      })));

    }

  });

  document.getElementById('next-page')?.addEventListener('click', () => {

    if (pageActuelle < totalPages) {
      currentPage++;
      renduTache(LATEST_TILES.map(tile => ({
        id: tile.id,
        category: LATEST_CATEGORIES.find(obj => obj.id === tile.cat_id)?.title || "none",
        content: tile.content,

        title: tile.title,
        description: tile.content,

        cat_id: tile.cat_id,
        author_email: tile.author_email,

      })));
    }

  });

 
  pagination.querySelectorAll('button[data-page]').forEach(btn => {

    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);

      renduTache(LATEST_TILES.map(tile => ({
        id: tile.id,
        category: LATEST_CATEGORIES.find(obj => obj.id === tile.cat_id)?.title || "none",
        content: tile.content,

        title: tile.title,
        description: tile.content,

        cat_id: tile.cat_id,
        author_email: tile.author_email,

      })));

    });

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

function fermerModifTache() {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.classList.add('hidden');
}

function ecouteurEvenement() {
 
  document.getElementById('task-form')?.addEventListener('submit', creationTache);

  
  document.getElementById('filter-apply')?.addEventListener('click', applyFiltersClick);
  document.getElementById('filter-reset')?.addEventListener('click', resetFiltersClick);
  
  
  document.getElementById('search-input')?.addEventListener('input', debounce((e) => {
    filterSearch = e.target.value;
    currentPage = 1;
    refreshFilteredDisplay();
  }, 300));

 
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
    retrieveAllCategoriesAndAllTiles();  
    populateCategorySelect();            
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
    retrieveAllCategoriesAndAllTiles();
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

  populateCategorySelect("edit-category");  // ← Remplit le select du modal
  const editCat = document.getElementById('edit-category');
  if (editCat && task.cat_id) editCat.value = task.cat_id;  // Sélectionne la bonne

  document.getElementById('edit-error').textContent = '';
  modal.classList.remove('hidden');
}


async function soumissionModif(event) {
  event.preventDefault();
  
  const errorEl = document.getElementById('edit-error');
  if (errorEl) errorEl.textContent = '';

  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value.trim();
  const description = document.getElementById('edit-description').value.trim();
  const cat_id = document.getElementById('edit-category').value;

  if (!title || !description) {
    if (errorEl) errorEl.textContent = 'Titre et description obligatoires.';
    return;
  }

  try {
    const res = await fetch('server_side/server/tile.php?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: CURRENT_EMAIL,
        password: CURRENT_PASSWORD,
        tile_id: id,
        title,
        content: description,
        cat_id
      })
    });

    const data = await res.json();  // ← AWAIT MANQUANT !
    console.log('Update response:', data); // DEBUG

    if (data.return !== 322500) throw new Error(`Code ${data.return || 'unknown'}`);

    fermerModifTache();
    retrieveAllCategoriesAndAllTiles();
  } catch (err) {
    console.error('Update error:', err);
    if (errorEl) errorEl.textContent = err.message;
  }
}

// SERVER POLLING
setInterval(async () => {
  try {
    await pollServer();
  } catch (err) {
    console.error("Polling error:", err);
  }
}, 15000);
