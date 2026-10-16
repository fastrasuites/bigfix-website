<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions\Handler;
use Illuminate\Foundation\Configuration\Kernel;

$app = new Application(
    $_ENV['APP_BASE_DIRECTORY'] ?? dirname(__DIR__)
);

$app->configure([
    'app',
    'database',
]);

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    Handler::class
);

return $app;
