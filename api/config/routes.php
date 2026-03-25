<?php

declare(strict_types=1);

use App\Controllers\HealthController;
use App\Support\Router;

$router = new Router();

$router->get('/Toca-dos-Peludos/api/public/index.php', [HealthController::class, 'index']);

return $router;