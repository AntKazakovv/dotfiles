# Social Networks Component
Displays list of available social networks on project for login/register or connect/disconnect functionality.

## Social Networks configuration

Before using current component, this list must be defined in `config/backend/0.site.config.php` in variable `$cfg['social']`. All social networks from the list will be available on the project, so remove or comment redundant items.

Article [Connect with social networks](https://wiki.egamings.com/display/WLC/Connect+with+social+networks) describes how to get configuration and tune social networks for OAuth.

## Component configuration
Component params:

**titlePrefix** - `Continue with` by default. The text which title attribute starts with.

**iconPath** - Relative gstatc path for icons. Default is `gstatic/wlc/icons/social/oauth/`, search icons by network id and svg extension. Be responsible, end path with slash.

**replaceConfig** - Replace networks config. By default, only rename google+ to google.
- `key` - is id of network (from bootstrap request).
- `name` - if defined - replace default name of social network.
- `iconPath` - full path to image, if defined - replace default image path.
