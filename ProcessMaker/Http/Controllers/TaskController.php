<?php

namespace ProcessMaker\Http\Controllers;

use Illuminate\Http\Request;
use ProcessMaker\Http\Controllers\Controller;

class TaskController extends Controller
{
    public function index()
  {
      return view('tasks.index');
  }
  public function create()
  {
    return view('tasks.create');
  }
  public function show()
  {
    return view('tasks.show');
  }
}
