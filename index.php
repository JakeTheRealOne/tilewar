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

      <span class="user-name" id="user-name">Non connecté</span>
      <button class="btn btn-secondary" id="logout-btn" style="display:none;">Déconnexion</button>
    </div>
  </header>

  <main class="main-layout">


    <section class="panel panel-form" id="auth-section">
      <h2>Compte utilisateur</h2>

      <!-- Inscription -->
      <form id="register-form">
        <h3>Inscription</h3>
        <div class="form-row">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" required>
        </div>
        <div class="form-row">
          <label for="register-password">Mot de passe</label>
          <input type="password" id="register-password" required>
        </div>
        <button type="submit">S'inscrire</button>
        <p class="form-error" id="register-error"></p>
        <p class="form-success" id="register-success"></p>
      </form>

      <!-- Connexion -->
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
            <select type="text" id="category" name="category">
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


      <!-- <h2>Recherche / filtres</h2>
      <form id="filter-form">

      </form> -->
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


  <div class="modal hidden" id="edit-modal">

  </div>

  <script src="app.js"></script>
</body>

</html>