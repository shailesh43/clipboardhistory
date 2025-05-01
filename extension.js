// extension.js
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';

export default class ClipboardHistoryExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._button = null;
        this._clipboardHistory = [];
        this._clipboardLoop = null;
    }

    enable() {
        this._button = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true,
            child: new St.Label({
                text: '📋',
                y_align: Clutter.ActorAlign.CENTER,
            }),
        });

        this._button.connect('button-press-event', () => {
            console.log('📋 Clipboard history:');
            this._clipboardHistory.forEach((item, index) =>
                console.log(`${index + 1}: ${item}`)
            );
        });

        Main.panel.addToStatusArea('clipboardhistory', this._button);

        const clipboard = St.Clipboard.get_default();

        this._clipboardLoop = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            2,
            () => {
                clipboard.get_text(St.ClipboardType.CLIPBOARD, (clip) => {
                    if (clip && !this._clipboardHistory.includes(clip)) {
                        this._clipboardHistory.unshift(clip);
                        if (this._clipboardHistory.length > 10) {
                            this._clipboardHistory.pop();
                        }
                    }
                });
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }

        if (this._clipboardLoop) {
            GLib.source_remove(this._clipboardLoop);
            this._clipboardLoop = null;
        }

        this._clipboardHistory = [];
    }
}
