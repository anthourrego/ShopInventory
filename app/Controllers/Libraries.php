<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Libraries extends BaseController
{
	private $rootVendor = ROOTPATH . "vendor/";

	private $routesLibraries = [
		"jquery"=> [
			"js"=> "components/jquery/"
		],
		"bootstrap"=> [
			"css"=> "twbs/bootstrap/dist/css/",
			"js"=> "twbs/bootstrap/dist/js/"
		],
		"fontawesome"=> [
			"css"=> "fortawesome/font-awesome/css/"
		],
		"adminLTE"=> [
			"css"=> "almasaeed2010/adminlte/dist/css/",
			"js"=> "almasaeed2010/adminlte/dist/js/"
		],
		"dataTables"=> [
			"js" => "datatables.net/datatables.net/js/"
		],
		"dataTables-bs4"=> [
			"css" => "datatables.net/datatables.net-bs4/css/",
			"js" => "datatables.net/datatables.net-bs4/js/"
		],
		"dataTables-buttons"=> [
			"css" => "datatables.net/datatables.net-buttons-bs4/css/",
			"js" => "datatables.net/datatables.net-buttons/js/"
		],
		"dataTables-buttons-bs4"=> [
			"css" => "datatables.net/datatables.net-buttons-bs4/css/",
			"js" => "datatables.net/datatables.net-buttons-bs4/js/"
		],
		"dataTables-scroller"=> [
			"js" => "datatables.net/datatables.net-scroller/js/"
		],
		"dataTables-select"=> [
			"js" => "datatables.net/datatables.net-select/js/"
		],
		"jszip"=> [
			"js" => "stuk/jszip/dist/"
		],
		"pdfmake"=> [
			"js" => "bpampuch/pdfmake/build/"
		],
		"moment"=> [
			"js" => "moment/moment/"
		],
		"moment-locale"=> [
			"js" => "moment/moment/locale/"
		],
		"webfonts"=> [
			"woff" => "fortawesome/font-awesome/webfonts/",
			"woff2" => "fortawesome/font-awesome/webfonts/",
			"ttf" => "fortawesome/font-awesome/webfonts/",
			"eot" => "fortawesome/font-awesome/webfonts/",
			"svg" => "fortawesome/font-awesome/webfonts/"
		],
		"tempusDominus"=> [
			"css" => "tempusdominus/bootstrap-4/build/css/",
			"js" => "tempusdominus/bootstrap-4/build/js/"
		],
		"bootstrapSwitch"=> [
			"js" => "nostalgiaz/bootstrap-switch/dist/js/"
		],
		"select2"=> [
			"css" => "select2/select2/dist/css/",
			"js" => "select2/select2/dist/js/"
		],
		"select2i18n"=> [
			"js" => "select2/select2/dist/js/i18n/"
		],
		"select2BS4"=> [
			"css" => "ttskch/select2-bootstrap4-theme/dist/"
		]
	];

	/**
	 * Método para servir archivos de bibliotecas como Bootstrap
	 *
	 * @param string $package Nombre del paquete (ej. 'twbs')
	 * @param string $lib Nombre de la biblioteca (ej. 'bootstrap')
	 * @param string $file Ruta del archivo (ej. 'dist/js/bootstrap.bundle.min.js')
	 * @return mixed
	 */
	public function getLibrary($package, $file)
	{

		$extension = pathinfo($file, PATHINFO_EXTENSION);
		$allowedExtensions = ['js', 'css', 'map', 'woff', 'woff2', 'ttf', 'eot', 'svg'];
		
		if (!in_array(strtolower($extension), $allowedExtensions)) {
				return $this->response->setStatusCode(404);
		}

		$lib = $this->routesLibraries[$package][$extension] ?? null;

		if (is_null($lib)) {
			return $this->response->setStatusCode(404);
		}
		
		// Convertir slashes para compatibilidad en diferentes SO
		$file = str_replace(['\\', '..', '//'], ['/', '', '/'], $file);

		// Construir la ruta completa al archivo
		$path = $this->rootVendor . $lib . $file;
		
		// Verificar que el path resultante esté dentro del directorio vendor
		$realPath = realpath($path);
		$vendorDir = realpath(ROOTPATH . 'vendor');
		
		if ($realPath === false || strpos($realPath, $vendorDir) !== 0) {
				log_message('error', message: "Intento de acceso a ruta no permitida: {$path}");
				return $this->response->setStatusCode(404);
		}
		
		if (!file_exists($path)) {
				log_message('error', "Archivo no encontrado: {$path}");
				return $this->response->setStatusCode(404);
		}
		
		// Configurar los tipos MIME adecuados
		$mimeTypes = [
				'js' => 'application/javascript',
				'css' => 'text/css',
				'map' => 'application/json',
				'woff' => 'font/woff',
				'woff2' => 'font/woff2',
				'ttf' => 'font/ttf',
				'eot' => 'application/vnd.ms-fontobject',
				'svg' => 'image/svg+xml'
		];
		
		// Enviar el archivo usando la respuesta de CodeIgniter
		$mime = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
		
		// Agregar cache-control para archivos estáticos
		return $this->response
				->setHeader('Content-Type', $mime)
				->setHeader('Cache-Control', 'public, max-age=31536000')
				->setBody(file_get_contents($path));
	}

}
