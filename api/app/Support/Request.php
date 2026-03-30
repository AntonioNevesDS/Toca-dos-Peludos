<?php

namespace App\Support;

class Request
{
    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    public static function requireMethod(string $expectedMethod): void
    {
        if (self::method() !== strtoupper($expectedMethod)) {
            JsonResponse::send(false, "Método não permitido. Use {$expectedMethod}.", null, 405);
        }
    }

    public static function json(): array
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!is_array($input)) {
            JsonResponse::send(false, "JSON inválido ou ausente", null, 400);
        }

        return $input;
    }
}