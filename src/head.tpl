 {% if 'template/additional-header.html' is ondisk %}
        {% include 'additional-header.html' %}
    {% else %}
        {% if 'favicon/' is ondisk %}
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
            <link rel="manifest" href="/favicon/site.webmanifest">
            <link rel="shortcut icon" href="/favicon/favicon.ico" type="image/x-icon"/>
            <meta name="msapplication-TileColor" content="#f17105">
            <meta name="msapplication-TileImage" content="mstile-144x144.png">
            <meta name="theme-color" content="var(--mc-bg)">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="#000000">
            <meta name="msapplication-TileColor" content="#000000">
            <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        {% else %}
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
        {% endif %}
    {% endif %}

 {% if 'template/inline.js' is ondisk %}
    <script type="text/javascript">{% include 'inline.js' %}</script>
 {% endif %}
