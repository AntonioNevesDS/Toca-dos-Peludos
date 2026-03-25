<?php

declare(strict_types=1);

namespace App\Controllers;

class HealthController
{
    public function index(): void
    {
        echo json_encode([
            "success" => true,
            "message" => "API funcionando perfeitamente"
        ]);
    }
}