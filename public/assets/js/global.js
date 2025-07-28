// Configuración de estilos para los botones de alertify
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";

// Configuración de textos para los botones de alertify
alertify.defaults.glossary.title = "Atención";
alertify.defaults.glossary.ok = `<i class="fas fa-check"></i> Aceptar`;
alertify.defaults.glossary.cancel = `<i class="fas fa-times"></i> Cancelar`;

const btnLogout = document.getElementById('btnLogout');

$(document).on({
  ajaxStart: function() {
    $("#loading, #loadingHttp").removeClass('d-none');
  },
  ajaxStop: function() {
    $("#loading, #loadingHttp").addClass('d-none');
  },
  ajaxError: function(funcion, request, settings){
    $("#loading, #loadingHttp").removeClass('d-none');
    if (request && request.responseJSON) {
      if (request.responseJSON.errorsList) {
        alertify.alert(request.responseJSON.title || "Error", request.responseJSON.errorsList, function(){
          this.destroy();
        });
      } else if (request.responseJSON.message) {
        alertify.alert(request.responseJSON.title || "Error", request.responseJSON.message, function(){
          this.destroy();
        });
      } else {
        alertify.error('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
      }
    } else {
      alertify.error('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
    }
    console.error(funcion);
    console.error(request);
    console.error(settings);
  }
});

// Agregar esta configuración al inicio de tu archivo JavaScript
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': document.querySelector('meta[name="X-CSRF-TOKEN"]')?.content || ''
  }
});

window.onerror = function() {
  $("#loading, #loadingHttp").addClass('d-none');
};

document.addEventListener('DOMContentLoaded', function() {
  
  btnLogout.addEventListener('click', function() {
    alertify.confirm('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', function() {
      $.ajax({
        url: routeBase + 'auth/logout',
        type: 'POST',
        success: (data) => {
          if (data.status === 'success') {
            window.location.href = '/';
          }
        }
      });
    }, function() {
      return;
    });
  });

  //Solo permite alfanumerico
	$(document).on("keypress", ".onlyLetters", function (e) {
		key = e.keyCode || e.which;
		tecla = String.fromCharCode(key).toLowerCase();
		letras = "abcdefghijklmnopqrstuvwxyz-_1234567890*+";
		especiales = "8-37-39-46";

		if ($(e.target).hasClass('validenie')) letras += 'ñ';

		if ($(e.target).hasClass('validSemicolon')) letras += '.,';

		if ($(e.target).hasClass('validSlash')) letras += '/';

		tecla_especial = false
		for (var i in especiales) {
			if (key == especiales[i]) {
				tecla_especial = true;
				break;
			}
		}

		if (letras.indexOf(tecla) == -1 && !tecla_especial) {
			return false;
		}
	});

  $(document).on("keypress", ".onlySpaceLetters", function (e) {
		key = e.keyCode || e.which;
		tecla = String.fromCharCode(key).toLowerCase();
		letras = "abcdefghijklmnopqrstuvwxyz1234567890 ";
		especiales = "8-37-39-46";

		tecla_especial = false
		for (var i in especiales) {
			if (key == especiales[i]) {
				tecla_especial = true;
				break;
			}
		}

		if (letras.indexOf(tecla) == -1 && !tecla_especial) {
			return false;
		}
	});
});