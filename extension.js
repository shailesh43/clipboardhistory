import St from 'gi://St';
import PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import Main from 'resource:///org/gnome/shell/ui/main.js';

let clipboardButton;

export function init() {}

export function enable() {
    clipboardButton = new PanelMenu.Button(0.0, 'Clipboard History');

    const icon = new St.Icon({
        icon_name: 'edit-paste-symbolic',
        style_class: 'system-status-icon',
    });

    clipboardButton.add_child(icon);
    Main.panel.addToStatusArea('clipboard-history', clipboardButton);
}

export function disable() {
    if (clipboardButton) {
        clipboardButton.destroy();
        clipboardButton = null;
    }
}
