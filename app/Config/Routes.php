<?php

use App\Controllers\Home;
use App\Controllers\Libraries;
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', [Home::class, 'index']);

// Route for accessing libraries
$routes->get('Library/(:segment)/(:any)', [[Libraries::class, 'getLibrary'], "$1/$2"]);
