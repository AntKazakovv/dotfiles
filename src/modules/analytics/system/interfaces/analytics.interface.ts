import {IIndexing} from 'wlc-engine/modules/core';

export interface ITagEventTrigger {
    /**
    * Trigger name
    *
    * @example
    * name: "valueRange",
    */
   name: string;
   /**
    * Start value of trigger
    *
    * @example
    * startValue: {
    *   EUR: 20,
    *   USD: 30,
    * }
    *
    */
   startValue?: number | IIndexing<number>;
   /**
    * End value of trigger
    *
    * @example
    * startValue: {
    *   EUR: 70,
    *   USD: 80,
    * }
    */
   endValue?: number | IIndexing<number>;
}

/**
 * Types of events. The first parameter
 * of the method to generate conversion events.
 * Each service has its own types
 */
export type TFacebookPixelEventType = 'track' | 'trackCustom';
export type TGtagEventType = 'event';

export interface IEventParams {
    value?: number;
    [key: string]: string | number;
}

export interface ITagEvent {
    /**
     * App event name
     *
     * @example
     * <pre>
     * event: 'DEPOSIT',
     * </pre>
     */
    event: string;
    /**
     * The type of event that is
     * passed to the conversion event generation method
     */
    type: TFacebookPixelEventType | TGtagEventType;
    /**
     * Conversion event name
     *
     * @example
     * <pre>
     * name: "Purchase",
     * </pre>
     */
    name: string;
    /**
     * Conversion event parameters
     *
     *  @example
     *  <pre>
     *  params?: {
     *      "currency": "USD",
     *      "value": 30.00,
     *  }
     */
    params?: IEventParams;
}
export interface ITag {
    /**
     * Name of tag
     */
    name: string;
    /**
     * Enable/disable the tag
     */
    use: boolean;
    /**
     * The name of the web analytics system
     * method that is called to generate any
     * conversion event. Each system has its
     * own unique method name
     */
    methodName: TMethodName;
    /**
     * An array of app events and their
     * associated conversion events
     *
     *  @example
     * <pre>
     * events: [
     *   {
     *      event: "REGISTRATION",
     *      type: "event",
     *      name: "sign_up",
     *   }
     * ],
     * </pre>
     */
    events: ITagEvent[];
}

export interface IAnalytics {
    /**
     * Enable/disable analytics
     */
    use?: boolean;
    /**
     * Array of tags of web analytics systems
     */
    tags?: ITag[];
}




