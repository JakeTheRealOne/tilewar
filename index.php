<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Gestionnaire de tâches</title>

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="styles.css">


</head>
<body>
<header class="topbar">
  <div class="topbar-left">
    <h1 class="app-title">TaskTiles</h1>

  </div>

  <div class="topbar-right">

    <!-- Remplir plus tard par PHP : nom utilisateur, bouton déconnexion -->

    <span class="user-name">Utilisateur</span>

    <button class="btn btn-secondary">Déconnexion</button>

  </div>

</header>

<main class="main-layout">

  <section class="panel panel-form">

    <h2>Nouvelle tâche</h2>
    <form id="task-form">

      <div class="form-row">

        <label for="title">Titre *</label>

        <input type="text" id="title" name="title" required>
      </div>

      <div class="form-row two-columns">
        <div>
          <label for="due_date">Date d’échéance *</label>

          <input type="date" id="due_date" name="due_date" required>
        </div>
        <div>
          <label for="category">Catégorie</label>
          <input type="text" id="category" name="category" placeholder="Études, Travail…">

        </div>
      </div>

      <div class="form-row">
        <label for="description">Description *</label>

        <textarea id="description" name="description" rows="3" required></textarea>
      </div>

      <div class="form-row two-columns">
        <div>
          <label for="priority">Priorité</label>

          <select id="priority" name="priority">

            <option value="low">Basse</option>

            <option value="medium" selected>Moyenne</option>

            <option value="high">Haute</option>
          </select>
        </div>
        <div>
          <label for="status">Statut</label>

          <select id="status" name="status">
            <option value="todo" selected>À faire</option>

            <option value="doing">En cours</option>

            <option value="done">Terminée</option>

          </select>
        </div>
      </div>

      <p class="form-hint">Les champs marqués d’un * sont obligatoires.</p>

      <p class="form-error" id="form-error"></p>

      <div class="form-actions">

        <button type="submit" class="btn btn-primary">Ajouter la tâche</button>
      </div>
    </form>

    <h2>Recherche / filtres</h2>
    <form id="filter-form">
      <div class="form-row">

        <label for="search-text">Recherche texte</label>

        <input type="text" id="search-text" placeholder="Titre ou description…">
      </div>

      <div class="form-row two-columns">

        <div>
          <label for="filter-category">Catégorie</label>

          <input type="text" id="filter-category" placeholder="Catégorie">
        </div>

        <div>

          <label for="filter-date">Date</label>

          <input type="date" id="filter-date">

        </div>

      </div>
      <div class="form-row two-columns">

        <div>
          <label for="filter-status">Statut</label>
          <select id="filter-status">
            <option value="">Tous</option>

            <option value="todo">À faire</option>
            <option value="doing">En cours</option>

            <option value="done">Terminée</option>
          </select>
        </div>
        <div>
          <label for="filter-user">Utilisateur</label>

          <input type="text" id="filter-user" placeholder="Nom d’utilisateur">

        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" id="filter-apply">Appliquer</button>

        <button type="button" class="btn btn-ghost" id="filter-reset">Réinitialiser</button>
      </div>
    </form>

  </section>

  <section class="panel panel-tasks">

    <div class="panel-header">

      <h2>Mes tâches</h2>

      <span class="task-count" id="task-count">0 tâche</span>
    </div>

    <div id="tasks-grid" class="tasks-grid">

      <!-- Tuiles générées en JS ou en PHP -->
      <article class="task-tile">
        <header class="task-header">

          <h3 class="task-title">Exemple de tâche</h3>
          
          <span class="task-date">2026-02-20</span>
        </header>
        <div class="task-meta">
          <span class="task-category">Catégorie : Université</span>

          <span class="task-status status-todo">À faire</span>
        </div>
        <p class="task-description">

          Implémenter la gestion des tuiles avec pagination et temps réel.
        </p>
        <footer class="task-footer">

          <span class="task-owner">Par: alice</span>

          <div class="task-actions">

            <button class="btn btn-small btn-outline edit-task">Modifier</button>

            <button class="btn btn-small btn-danger delete-task">Supprimer</button>
          </div>

        </footer>
      </article>

    </div>

    <nav class="pagination" id="pagination">

      <!-- Boutons de pages -->

      <button class="page-btn page-btn-disabled">«</button>

      <button class="page-btn page-btn-active">1</button>

      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn">»</button>
    </nav>

  </section>
</main>

<!-- Modal d’édition -->
<div class="modal hidden" id="edit-modal">

  <div class="modal-backdrop"></div>

  <div class="modal-dialog">

    <header class="modal-header">
      <h2>Modifier la tâche</h2>
      <button class="modal-close" id="edit-close" aria-label="Fermer">×</button>
    </header>
    <form id="edit-form" class="modal-body">

      <input type="hidden" id="edit-id" name="id">
      <div class="form-row">

        <label for="edit-title">Titre *</label>

        <input type="text" id="edit-title" name="title" required>

      </div>
      <div class="form-row two-columns">

        <div>

          <label for="edit-date">Date *</label>

          <input type="date" id="edit-date" name="due_date" required>

        </div>

        <div>
          <label for="edit-category">Catégorie</label>
          <input type="text" id="edit-category" name="category">

        </div>
      </div>
      <div class="form-row">

        <label for="edit-description">Description *</label>

        <textarea id="edit-description" name="description" rows="3" required></textarea>

      </div>

      <div class="form-row two-columns">
        <div>

          <label for="edit-priority">Priorité</label>

          <select id="edit-priority" name="priority">

            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>

            <option value="high">Haute</option>

          </select>
        </div>

        <div>

          <label for="edit-status">Statut</label>
          <select id="edit-status" name="status">

            <option value="todo">À faire</option>

            <option value="doing">En cours</option>

            <option value="done">Terminée</option>
          </select>

        </div>
      </div>

      <p class="form-error" id="edit-error"></p>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Enregistrer</button>

        <button type="button" class="btn btn-ghost" id="edit-cancel">Annuler</button>
      </div>

    </form>
  </div>
</div>

<script src="app.js"></script>

</body>
</html>
