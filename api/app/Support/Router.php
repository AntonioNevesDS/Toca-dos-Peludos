<?php

declare(strict_types=1);

namespace App\Support;

final class Router
{
    private array $routes = [];

    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, array $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        $handler = $this->routes[$method][$path] ?? null;

        if (!$handler) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Rota não encontrada"
            ]);
            return;
        }

        [$class, $action] = $handler;
        (new $class())->$action();
    }
}