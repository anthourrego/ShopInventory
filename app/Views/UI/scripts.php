  <script>
    const routeBase = "<?= base_url(); ?>";
  </script>
  <?php
    if(isset($js)){
      foreach ($js as $js1) {
        if(is_array($js1)) {
          foreach ($js1 as $js2) {
            echo(script_tag(esc("Library/" . $js2 .  (ENVIRONMENT !== 'production' ? '' : ('?' . LIBRARY_RANDOM)))));
          }
        } else {
          echo(script_tag(esc("Library/" . $js1 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
        }
      }
    }

    if(isset($js_lib)){
      foreach ($js_lib as $js1) {
        if(is_array($js1)) {
          foreach ($js1 as $js2) {
            echo(script_tag(esc("assets/Libraries/" . $js2 .  (ENVIRONMENT !== 'production' ? '' : ('?' . LIBRARY_RANDOM)))));
          }
        } else {
          echo(script_tag(esc("assets/Libraries/" . $js1 . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM)))));
        }
      }
    }

    if(isset($js_add)){
      foreach ($js_add as $js_add1) {
        if(is_array($js_add1)) {
          foreach ($js_add1 as $js_add2) {
            echo(script_tag("assets/js/{$js_add2}" . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM))));
          }
        } else {
          echo(script_tag("assets/js/{$js_add1}" . (ENVIRONMENT !== 'production' ? '' :  ('?' . LIBRARY_RANDOM))));
        }
      }
    }
  ?>
  </body>
</html>