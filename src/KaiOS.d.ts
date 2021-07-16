declare module '*.scss';


interface DOMRequset {
    onsuccess: (result: { target: any }) => void
    onerror: (error: any) => void
}

declare interface HttpProxyInfo {
    httpProxyHost: string | null;
    httpProxyPort: number | null;
}

declare interface SettingsManager {
    createLock: () => SettingsLock;
}

declare interface SettingsLock {
    get: (name: string) => {
        onsuccess: () => void;
        result: { [key: string]: any };
    };
    set: (data: { [key: string]: any }) => void;
}

declare interface InputMethod extends EventTarget {
    // Input Method Manager contain a few global methods expose to apps
    readonly mgmt: InputMethodManager;

    // Fired when the input context changes, include changes from and to null.
    // The new InputContext instance will be available in the event object under |inputcontext| property.
    // When it changes to null it means the app (the user of this API) no longer has the control of the original focused input field.
    // Note that if the app saves the original context, it might get void; implementation decides when to void the input context.
    oninputcontextchange: EventHandler;

    // An "input context" is mapped to a text field that the app is allow to mutate.
    // this attribute should be null when there is no text field currently focused.
    readonly inputcontext?: InputContext;
}

/**
 * Manages the list of IMEs, enables/disables IME and switches to an IME.
 */
declare interface InputMethodManager {
    // Ask the OS to show a list of available IMEs for users to switch from.
    // OS should ignore this request if the app is currently not the active one.
    showAll: () => void;

    // Ask the OS to switch away from the current active Keyboard app.
    // OS should ignore this request if the app is currently not the active one.
    next: () => void;

    // To know if the OS supports IME switching or not.
    // Use case: let the keyboard app knows if it is necessary to show the "IME switching"
    // (globe) button. We have a use case that when there is only one IME enabled, we
    // should not show the globe icon.
    supportsSwitching: () => boolean;

    // Ask the OS to hide the current active Keyboard app. (was: |removeFocus()|)
    // OS should ignore this request if the app is currently not the active one.
    // The OS will void the current input context (if it exists).
    // This method belong to |mgmt| because we would like to allow Keyboard to access to
    // this method w/o a input context.
    hide: () => void;
}

// The input context, which consists of attributes and information of current input field.
// It also hosts the methods available to the keyboard app to mutate the input field represented.
// An "input context" gets void when the app is no longer allowed to interact with the text field,
// e.g., the text field does no longer exist, the app is being switched to background, and etc.
// [JJ] I doubt whether we should have 'name', 'type', etc. here. In the manifest we should
//      have entry points where the keyboard specifies which view to load when going into a
//      certain context. Requiring to do this manually will give extra work.
//      The system should guarantee that the right view is rendered based on entry_points in
//      in manifest (e.g. navigate keyboard to #text/en, or something, based on manifest.
// [Tim] I don't think they are exclusive. A keyboard app might choose to load the same page with the same hash
//      for different types but only to deal with the |type| or |inputmode| difference later.
// [JS] I agree that exposing type etc is a good idea. It's quite likely that the same keyboard
//      app will want to handle multiple different keyboards, for example both for latin text as well as
//      numeric keyboard.
//      But I agree that also enabling the keyboard to declare in the manifest which types it supports
//      is a good idea.
interface InputContext extends EventTarget {
    // The tag name of input field, which is enum of "input", "textarea", or "contenteditable"
    readonly type: DOMString;

    // The type of the input field, which is enum of text, number, password, url, search, email, and so on.
    // See http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#states-of-the-type-attribute
    readonly inputType: DOMString;

    /*
     * The inputmode string, representing the input mode.
     * See http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#input-modalities:-the-inputmode-attribute
     */
    readonly inputMode: DOMString;

    /*
     * The primary language for the input field.
     * It is the value of HTMLElement.lang.
     * See http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#htmlelement
     */
    readonly lang: DOMString;

    /*
     * Get specified range of text content from the input field.
      * @param start The start position of the range. Defaults to 0.
      * @param length The range length. Defaults to the end of the text.
     */
    getText(start: number, length: number): Promise<DOMString>;

    // The start and stop position of the selection.
    readonly selectionStart: number;
    readonly selectionEnd: number;

    // The text before and after the begining of the selected text.
    readonly textBeforeCursor: DOMString;
    readonly textAfterCursor: DOMString;

    /*
     * Set the selection range of the the editable text.
     * Note: This method cannot be used to move the cursor during composition. Calling this
     * method will cancel composition.
     * @param start The beginning of the selected text.
     * @param length The length of the selected text.
     *
     * Note that the start position should be less or equal to the end position.
     * To move the cursor, set the start and end position to the same value.
     *
     * [JJ] I think that this method should return the same info as the selectionchange event
     *      rather than a boolean.
     * [yxl] I don't think so. We could get selection range info by checking the attributes of 
     *      selectionStart and selectionEnd.
     */
    setSelectionRange(start: number, length: number): Promise<void>;

    /* User moves the cursor, or changes the selection with other means. If the text around
     * cursor has changed, but the cursor has not been moved, the IME won't get notification.
     */
    onselectionchange: EventHandler;

    /*
     * Commit text to current input field and replace text around cursor position. It will clear the current composition.
     *
     * @param text The string to be replaced with.
     * @param offset The offset from the cursor position where replacing starts. Defaults to 0.
     * @param length The length of text to replace. Defaults to 0.
     */
    replaceSurroundingText(text: DOMString, offset: number, length: number): Promise<void>;

    /*
     *
     * Delete text around the cursor.
     * @param offset The offset from the cursor position where deletion starts.
     * @param length The length of text to delete.
     */
    deleteSurroundingText(offset: number, length: number): Promise<void>;

    /*
    * Notifies when the text around the cursor is changed, due to either text
    * editing or cursor movement. If the cursor has been moved, but the text around has not
    * changed, the IME won't get notification.
    */
    // [JS] Can you describe how the cursor can be moved without the surrounding text
    //      also changing? Is that really something that can happen?
    // [yxl] For example, if the text field is filled with 'a', wherever the cusor movies the surrounding text is always 'aa...'. Another exmaple, the selection range is changed, but the cursor isn't and the surrouding text won't be changed.
    onsurroundingtextchange: EventHandler;

    /*
      * send a character with its key events.
      * @param modifiers see http://mxr.mozilla.org/mozilla-central/source/dom/interfaces/base/nsIDOMWindowUtils.idl#206
      * @return true if succeeds. Otherwise false if the input context becomes invalid.
      * Alternative: sendKey(KeyboardEvent event), but we will likely waste memory for creating the KeyboardEvent object.
      */
    sendKey(keyCode: number, charCode: number, modifiers: number): Promise<void>;

    /*
     * Set current composing text. This method will start composition or update composition if it
     * has started. The composition will be started right before the cursor position and any
     * selected text will be replaced by the composing text. When the composition is started, 
     * calling this method can update the text and move cursor winthin the range of the composing
     * text.
     * @param text The new composition text to show.
     * @param cursor The new cursor position relative to the start of the composition text. The cursor should
     * be positioned within the composition text. This means the value should be >= 0 and <= the length of
     * composition text. Defaults to the lenght of composition text, i.e., the cursor will be positioned after
     * the composition text.
     *
     * The composing text, which is shown with underlined style to distinguish from the existing text, is used
     * to compose non-ASCII characters from keystrokes, e.g. Pinyin or Hiragana. The composing text is the
     * intermediate text to help input complex character and is not committed to current input field. Therefore
     * if any text operation other than composition is performed, the composition will automatically
     * end. Same apply when the inputContext is lost during a unfinished composition session.
     *
     * To finish composition and commit text to current input field, an IME should call |endComposition|.
     */
    setComposition(text: DOMString, cursor: number): Promise<void>;

    /*
     * End composition, clear the composing text and commit given text to current input field. The text will
     * be committed before the cursor position.
     * @param text The text to commited before cursor position. If empty string is given, no text will be
     * committed.
     *
     * Note that composition always ends automatically if the composition does not
     * explicitly end by calling |endComposition|, but is interrupted by |sendKey|, |setSelectionRange|,
     * |replaceSurroundingText|, |deleteSurroundingText|, user moving the cursor, changing the focus, etc.
     */
    endComposition(text: DOMString): Promise<void>;
};

declare interface Navigator {
    mozWifiManager: {
        getKnownNetworks: () => DOMRequset;
        setHttpProxy: (network: any, info: HttpProxyInfo) => DOMRequset;
    };
    mozApps: {
        mgmt: {
            getAll: () => DOMRequset
        }
    };
    mozSettings: SettingsManager;
    mozInputMethod: InputMethod;
    [key: string]: any;
};

declare interface Window {
    KaiAd: any;
    MozActivity: any;
    Kaipay: any;
};
