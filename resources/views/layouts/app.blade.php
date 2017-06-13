<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'DFSCombine - Daily Fantasy Sports Tools') }}</title>

    <!-- Styles -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">

    <link href="/css/app.css" rel="stylesheet">

    <!-- Scripts -->
    <script src="/js/jquery-1.10.2.min.js"></script>
    <script src="/js/angular.min.js"></script>
    <script src="/js/ui-bootstrap-tpls-2.3.1.min.js"></script>
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42534210-10', 'auto');
      ga('send', 'pageview');

    </script>
</head>
<body>
    <div>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                  <div class="navbar-header">
                    <!-- Collapsed Hamburger -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!-- Branding Image -->
                    <a class="navbar-brand" href="{{ url('/') }}">DFSCombine</a>
                  </div>
                </div>

                <div class="collapse navbar-collapse" id="app-navbar-collapse">
                    <!-- Left Side Of Navbar -->
                    <ul class="nav navbar-nav">
                      <li><a href="{{ url('/NBA') }}">NBA - FD</a></li>
                      <li><a href="{{ url('/WNBA') }}">WNBA - FD</a></li>
                      <li><a href="{{ url('/NBADK') }}">NBA - DK</a></li>
                      <li><a href="{{ url('/NFL') }}">NFL - FD</a></li>
                      <li><a href="{{ url('/NHL') }}">NHL - FD</a></li>
                      <li><a href="{{ url('/NHLDK') }}">NHL - DK</a></li>
                      <li><a href="{{ url('/MLB') }}">MLB - FD</a></li>
                      <li><a href="{{ url('/MLBDK') }}">MLB - DK</a></li>
                    </ul>
                    <!-- Right Side Of Navbar -->
                    <ul class="nav navbar-nav navbar-right">
                        <!-- Authentication Links -->
                        @if (Auth::guest())
                            <li><a href="{{ url('/termsofservice') }}">Terms</a></li>
                            <li><a href="{{ url('/privacypolicy') }}">Privacy</a></li>
                            <li><a href="{{ url('/login') }}">Login</a></li>
                            <li><a href="{{ url('/register') }}">Register</a></li>
                        @else
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    {{ Auth::user()->email }} <span class="caret"></span>
                                </a>

                                <ul class="dropdown-menu" role="menu">
                                  <li><a href="{{ url('/termsofservice') }}">Terms</a></li>
                                  <li><a href="{{ url('/privacypolicy') }}">Privacy</a></li>
                                  <li>
                                    <a href="{{ url('/account') }}">Account</a>
                                  </li>
                                    <li>
                                        <a href="{{ url('/logout') }}"
                                            onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                            Logout
                                        </a>

                                        <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>

        @yield('content')
    </div>
    <!-- Scripts -->

    <script src="/js/bootstrap.min.js"></script>
</body>
</html>
