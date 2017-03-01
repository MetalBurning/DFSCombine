const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

 elixir(function(mix) {
     mix.webpack(
       'NBA/NBAController.js',
       './public/js/AngularControllers/NBA'
     );
     mix.webpack(
       'NBA/NBADraftKingsController.js',
       './public/js/AngularControllers/NBA'
     );
     mix.webpack(
       'NBA/NBA.js',
       './public/js/AngularControllers/NBA'
     );
 });

 elixir(function(mix) {
   mix.webpack(
     'NFL/NFLController.js',
     './public/js/AngularControllers/NFL'
   );
 });
