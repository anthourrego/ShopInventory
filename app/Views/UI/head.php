<!doctype html>
<html lang="es">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?= (isset($title) ? "{$title} | " : '') . $Project_Name ?></title>
    <!-- Otros meta tags y estilos -->
    <?= csrf_meta() ?>
    <?php 
      if(isset($css)){
        foreach ($css as $css1) {
          if(is_array($css1)) {
            foreach ($css1 as $css2) {
              echo(link_tag(esc("Library/" . $css2 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
            }
          } else {
            echo(link_tag(esc("Library/" . $css1 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
          }
        }
      }

      if(isset($css_lib)){
        foreach ($css_lib as $css1) {
          if(is_array($css1)) {
            foreach ($css1 as $css2) {
              echo(link_tag(esc("assets/Libraries/" . $css2 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
            }
          } else {
            echo(link_tag(esc("assets/Libraries/" . $css1 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
          }
        }
      }

      if(isset($css_add)){
        foreach ($css_add as $css_add1) {
          if(is_array($css_add1)) {
            foreach ($css_add1 as $css_add2) {
              echo(link_tag(esc("assets/css/{$css_add2}" . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
            }
          } else {
            echo(link_tag(esc("assets/css/{$css_add1}" . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
          }
        }
      }
    ?>
  </head>
  <body>
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="<?= base_url('assets/img/logo-negro.png') ?>" alt="Logo" class="logo">
          <div class="store-info">
            <h1 class="store-name">Shop Inventory</h1>
            <p class="verified-store">
              <i class="fas fa-check-circle"></i> Tienda Verificada
            </p>
          </div>
        </div>
        <button class="search-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </header>

    <!-- Banner -->
    <section class="banner">
      <div class="banner-content">
        <h2 class="banner-title">Todo lo que crees, lo creas!</h2>
        <div class="banner-mascot">
          <i class="fas fa-cat"></i>
        </div>
      </div>
    </section>