<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit4eb9f7c14c74519d617b343474d1869b
{
    public static $prefixLengthsPsr4 = array (
        'B' => 
        array (
            'Box\\Spout\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Box\\Spout\\' => 
        array (
            0 => __DIR__ . '/..' . '/box/spout/src/Spout',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit4eb9f7c14c74519d617b343474d1869b::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit4eb9f7c14c74519d617b343474d1869b::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
