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
   mix.webpack(
     'NFL/NFLDraftKingsController.js',
     './public/js/AngularControllers/NFL'
   );
   mix.webpack(
     'NFL/NFL.js',
     './public/js/AngularControllers/NFL'
   );
 });
 
 elixir(function(mix) {
   mix.webpack(
     'NHL/NHLController.js',
     './public/js/AngularControllers/NHL'
   );
   mix.webpack(
     'NHL/NHLDraftKingsController.js',
     './public/js/AngularControllers/NHL'
   );
   mix.webpack(
     'NHL/NHL.js',
     './public/js/AngularControllers/NHL'
   );
 });

 elixir(function(mix) {
   mix.webpack(
     'MLB/MLBController.js',
     './public/js/AngularControllers/MLB'
   );
   mix.webpack(
     'MLB/MLBDraftKingsController.js',
     './public/js/AngularControllers/MLB'
   );
   mix.webpack(
     'MLB/MLB.js',
     './public/js/AngularControllers/MLB'
   );
 });
