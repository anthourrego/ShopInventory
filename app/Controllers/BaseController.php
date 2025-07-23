<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use Config\Database;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    public $content;
    protected $db;
    protected $routes;
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    // protected $session;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        // Preload any models, libraries, etc, here.
        //$this->routes = service("routes");
        $this->db = Database::connect();

        $this->content['Project_Name'] = "Shop Inventory";
        $this->LAlertify();
        $this->LFontAwesome();
        $this->LBootstrap();
    }

    //Librerias personalizadas en assets/Libraries
    public function LJQueryValidation()
    {
        $this->content['js_lib'][] = [
            'jquery-validation/jquery.validate.min.js',
            'jquery-validation/additional-methods.min.js',
            'jquery-validation/messages_es.min.js',
        ];
        
        $this->content['js_add'][] = [
            'validate.js'
        ];
    }

    public function LAlertify()
    {
        $this->content['css_lib'][] = [
            'alertifyjs/css/alertify.min.css',
            'alertifyjs/css/themes/bootstrap.min.css'
        ];

        $this->content['js_lib'][] = [
            'alertifyjs/alertify.min.js'
        ];
    }

    //Librerias personalizadas en el vendor que estan en el controlador de Libraries
    public function LBootstrap()
    {
        $this->content['css'][] = [
            'bootstrap/bootstrap.min.css'
        ];

        $this->content['js'][] = [
            'bootstrap/bootstrap.min.js'
        ];
    }

    public function LFontAwesome()
    {
        $this->content['css'][] = [
            'fontawesome/all.min.css'
        ];
    }


    public function LMoment(){
        $this->content['js'][] = [
            'moment/moment.js',
            'moment-locale/es-mx.js'
        ];
    }

    public function LGlobal()
    {
        $this->content['css_add'][] = [
            'global.css'
        ];

        $this->content['js_add'][] = [
            'global.js'
        ];
    }
}
