// extension.js
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

export default class ClipboardHistoryExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._button = null;
        this._clipboardHistory = [];
        this._clipboardLoop = null;
        this._settings = null;
    }

    enable() {
        // Load settings if they exist
        this._loadSettings();

        // Create panel button with menu
        this._button = new PanelMenu.Button(0.0, 'Clipboard History', false);
        
        // Add icon to the panel
        let icon = new St.Icon({
            icon_name: 'edit-paste-symbolic',
            style_class: 'system-status-icon',
        });
        this._button.add_child(icon);

        // Create empty menu to populate later
        this._createMenu();

        // Add button to the panel
        Main.panel.addToStatusArea('clipboardhistory', this._button);

        // Start clipboard monitoring
        this._startClipboardMonitoring();
    }

    _loadSettings() {
        // Create settings schema path
        let dirPath = this.path;
        let schemaDir = Gio.File.new_for_path(dirPath);
        
        // Default values if settings schema doesn't exist
        this._maxHistorySize = 20;
        this._pollIntervalSeconds = 2;
    }

    _createMenu() {
        // Add empty history section to the menu
        this._historySection = new PopupMenu.PopupMenuSection();
        this._button.menu.addMenuItem(this._historySection);

        // Add separator
        this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Add clear history item
        let clearItem = new PopupMenu.PopupMenuItem(_('Clear History'));
        clearItem.connect('activate', () => {
            this._clipboardHistory = [];
            this._updateMenu();
        });
        this._button.menu.addMenuItem(clearItem);

        // Connect menu opening to refresh the display
        this._button.menu.connect('open-state-changed', (menu, open) => {
            if (open) {
                this._updateMenu();
            }
        });
    }

    _startClipboardMonitoring() {
        const clipboard = St.Clipboard.get_default();

        // Poll clipboard every few seconds
        this._clipboardLoop = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            this._pollIntervalSeconds,
            () => {
                clipboard.get_text(St.ClipboardType.CLIPBOARD, (clipboard, text) => {
                    if (text && text.length > 0 && !this._clipboardHistory.includes(text)) {
                        // Add new item to history
                        this._clipboardHistory.unshift(text);
                        
                        // Limit history size
                        if (this._clipboardHistory.length > this._maxHistorySize) {
                            this._clipboardHistory.pop();
                        }
                        
                        // Update menu if it's open
                        if (this._button.menu.isOpen) {
                            this._updateMenu();
                        }
                    }
                });
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    _updateMenu() {
        // Clear existing menu items
        this._historySection.removeAll();

        if (this._clipboardHistory.length === 0) {
            // Show message when history is empty
            let emptyItem = new PopupMenu.PopupMenuItem(_('(Empty)'));
            emptyItem.sensitive = false;
            this._historySection.addMenuItem(emptyItem);
        } else {
            // Add clipboard history items to menu
            for (let i = 0; i < this._clipboardHistory.length; i++) {
                let text = this._clipboardHistory[i];
                
                // Create truncated display text (first line, max 50 chars)
                let firstLine = text.split('\n')[0];
                let displayText = firstLine.length > 50 
                    ? firstLine.substr(0, 47) + '...' 
                    : firstLine;
                
                // Create menu item
                let item = new PopupMenu.PopupMenuItem(displayText);
                
                // Handle click to copy item back to clipboard
                item.connect('activate', () => {
                    const clipboard = St.Clipboard.get_default();
                    clipboard.set_text(St.ClipboardType.CLIPBOARD, text);
                    
                    // Move item to top of history
                    this._clipboardHistory.splice(i, 1);
                    this._clipboardHistory.unshift(text);
                    
                    // Close menu after selection
                    this._button.menu.close();
                });
                
                this._historySection.addMenuItem(item);
            }
        }
    }

    disable() {
        // Stop clipboard monitoring
        if (this._clipboardLoop) {
            GLib.source_remove(this._clipboardLoop);
            this._clipboardLoop = null;
        }

        // Remove panel button
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }

        // Clear history
        this._clipboardHistory = [];
    }
}

// Helper function for translation
function _(str) {
    return str;
}
