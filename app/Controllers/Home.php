<?php

namespace App\Controllers;

class Home extends BaseController
{
	public function index()
	{
		$this->LJQueryValidation();
		$this->content['title'] = "Inicio";
		$this->content['view'] = "shop";
		return view('UI/viewSimple', $this->content);
	}
}
