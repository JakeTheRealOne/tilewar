<!--Moulay Ali Lablih -->

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset= "UTF-8">
  <title>Gestionnaire de tâches</title>
  <meta name="viewport"  content= "width=device-width, initial-scale=1">

  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <header class="topbar">
    <div class="topbar-left">

      <h1 class="app-title">TaskTiles</h1>
    </div>
    <div class="topbar-right">

      <span class="user-name" id="user-name">Non connecté</span>

      <button class="btn btn-secondary" id="logout-btn" style= "display:none;">Déconnexion</button>
    </div>
  </header>

  <main class="main-layout">


    <section class="panel panel-form" id="auth-section">
      <h2>Compte utilisateur</h2>

      
      <form id="register-form">
        <h3>Inscription</h3>
        <div class="form-row">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" required>
        </div>
        <div class="form-row">
          <label for="register-password">Mot de passe</label>
          <input type="password" id="register-password" >
        </div>
        <button type="submit">S'inscrire</button>
        <p class="form-error" id="register-error"></p>
        <p class="form-success" id="register-success"></p>
      </form>

      
      <form id="login-form">
        <h3>Connexion</h3>
        <div class="form-row">

          <label for="login-email">Email</label>
          <input type="email" id="login-email" required>

        </div>
        <div class="form-row">
          <label for="login-password">Mot de passe</label>
          <input type="password" id="login-password" required>

        </div>
        <button type="submit">Se connecter</button>
        <p class="form-error" id="login-error"></p>
      </form>
    </section>


    <section class="panel panel-form">
      <h2>Nouvelle tâche <span id="auth-warning" style="color:red;display:none;">(Connectez-vous d'abord)</span></h2>
      <form id="task-form">
        <div class="form-row">
          <label for="title">Titre *</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div class="form-row two-columns">
          <!-- <div>
          <label for="due_date">Date d'échéance</label>
          <input type="date" id="due_date" name="due_date">
        </div> -->
          <div>
            <label for="category">Catégorie</label>
            <!-- <input type="text" id="category" name="category" placeholder="Études, Travail…"> -->
            <select id="category" name="category">
              <option value="">Choisir une catégorie</option>
            </select>
          </div>

        </div>
        <div class="form-row">
          <label for="description">Description *</label>

          <textarea id="description" name="description" rows="3" required></textarea>
        </div>
        <!-- <div class="form-row two-columns">
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
        </div> -->
        <p class="form-hint">Les champs marqués d'un * sont obligatoires.</p>

        <p class="form-error" id="form-error"></p>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Ajouter la tâche</button>
        </div>

      </form>


    
    <section class="panel panel-form">
        <h2>Recherche & Filtres</h2>
            <form id="filter-form">
          <div class="form-row">
          <label for="search-input">Rechercher (titre/description)</label>
            <div class="search-container">
            <input type="text" id="search-input" placeholder= "Tapez pour chercher...">

            </div>
              </div>
              <div class="form-row two-columns">
              <div>
            <label for="filter-category">Catégorie</label>

            <select id="filter-category">
          <option value="">Toutes</option>
            </select>
          </div>

          <div>
        <label for="filter-author">Auteur</label>

        <select id="filter-author">
          <option value="">Tous</option>
            </select>
          </div>
         </div>
          <div class="form-row two-columns">
            <div>
        <label for="filter-sort">Trier par</label>
        <select id="filter-sort">

          <option value="date-desc">Date récente</option>
          <option value="date-asc">Date ancienne</option>

          <option value="title-asc">Titre A-Z</option>
          <option value="title-desc">Titre Z-A</option>
            </select>
            </div>
          <div>
            <button type="button" id="filter-apply" class="btn btn-primary">Appliquer</button>
            <button type="button" id="filter-reset" class="btn btn-secondary">Reset</button>
          </div>
       </div>
      </form>
    </section>

    </section>


    <section class="panel panel-tasks">
      <div class="panel-header">
        <h2>Mes tâches</h2>
        <span class="task-count" id="task-count">0 tâche</span>
      </div>
      <div id="tasks-grid" class="tasks-grid">

        <p id="no-tasks">Connectez-vous pour voir vos tâches.</p>
      </div>
      <nav class="pagination" id="pagination">

      </nav>
    </section>
  </main>


  <!--<div class="modal hidden" id="edit-modal">

  </div>-->

  <script src="app.js"></script>
  
  <div class="modal hidden" id="edit-modal">
  <div class="modal-content">
    <header class="modal-header">
      <h3>Modifier la tâche</h3>
      <button class="btn btn-small btn-outline" id="edit-close">✕</button>
    </header>
    <form id="edit-form">
      <input type="hidden" id="edit-id" name="edit-id">
      <div class="form-row">
        <label for="edit-title">Titre</label>
        <input type="text" id="edit-title" name="edit-title" required>
      </div>
      <div class="form-row">
        <label for="edit-category">Catégorie</label>
        <select id="edit-category" name="edit-category">
          
        </select>
      </div>
      <div class="form-row">
        <label for="edit-description">Description</label>
        <textarea id="edit-description" name="edit-description" rows="3" required></textarea>
      </div>
      <p class="form-error" id="edit-error"></p>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Modifier</button>
        <button type="button" id="edit-cancel" class="btn btn-secondary">Annuler</button>
      </div>
    </form>
  </div>
</div>

</body>

</html>
