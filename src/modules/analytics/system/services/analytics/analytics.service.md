## Analytics Service
A service that allows you to set analytics tags for various web analytics services, such as faceebook pixel, google analytics, etc.

 - **Analytics tag** - this is script of web analytics services to add **convertion events** tracking in application.
 -  **Convertion events** - these are the names of events in the analytics service that determine the achievement of the conversion goal.

## Usage
The first step is to add the analytics code to the **index.tpl** file in project:

 - **Google**: https://developers.google.com/analytics/devguides/collection/gtagjs?hl=ru
 - **Facebook**: https://developers.facebook.com/docs/facebook-pixel/implementation

For analytics to be triggered by certain events, you need to fill in the **base.config** as follows:
``` ts
analytics: {
	use: true,
	tags: [
		name: 'facebookPixel',
		use: true,
		methodName:  'fbq',
		events: [
			{
				event: 'REGISTRATION',
				type: 'track',
				name: 'Lead',
				params: {
					country: 'Russia',
				},
			}
		],
	]
}
```
### `analytics` Properties
 - `use: boolean` - Enable Analytics Service
-  `tags: ITag[]` - Array of tags of web analytics systems
### `tags` Properties
- `name: string` -  Name of tag
- `use: boolean` - Enable the tag
-  `methodName: TMethodName` - The name of the web analytics system method that is called to generate any conversion event. Each system has its own unique method name
- `events: ITagEvent[]` - An array of app events and their associated conversion events
### `events` Properties
- `event: string` - App event name
- `type: TFacebookPixelEventType | TGtagEventType` -  The type of event that is passed to the conversion event generation method
- `name: string` - Conversion event name
- `params: IEventParams` - Conversion event parameters
