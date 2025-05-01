const { St, Clutter, GObject, Gtk, GLib, Gdk } = imports.gi;
const Main = imports.ui.main;
const Clipboard = St.Clipboard.get_default();
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

let history = [];
let clipboardButton;

function init() {}

function enable() {
    clipboardButton = new PanelMenu.Button(0.0, "Clipboard History");

    let icon = new St.Icon({
        icon_name: 'edit-paste-symbolic',
        style_class: 'system-status-icon',
    });

    clipboardButton.add_child(icon);
    Main.panel.addToStatusArea('clipboard-history', clipboardButton);

    Clipboard.connect('owner-change', () => {
        Clipboard.get_text(St.ClipboardType.CLIPBOARD, (clipboard, text) => {
            if (text && !history.includes(text)) {
                history.unshift(text);
                if (history.length > 10) history.pop(); // keep last 10 items
                updateMenu();
            }
        });
    });

    updateMenu();
}

function updateMenu() {
    clipboardButton.menu.removeAll();

    history.forEach(item => {
        let menuItem = new PopupMenu.PopupMenuItem(item.substring(0, 50));
        menuItem.connect('activate', () => {
            Clipboard.set_text(St.ClipboardType.CLIPBOARD, item);
        });
        clipboardButton.menu.addMenuItem(menuItem);
    });
}

function disable() {
    clipboardButton.destroy();
    clipboardButton = null;
    history = [];
}
