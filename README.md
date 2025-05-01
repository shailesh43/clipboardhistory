# Clipboard History GNOME Extension

A simple yet powerful clipboard manager for GNOME Shell that keeps track of your clipboard history and allows you to quickly access and reuse previously copied items.


## Features

- Maintains a history of up to 20 clipboard text items
- Easily paste previous clipboard entries with a single click
- Simple and intuitive menu interface in the top panel
- Automatic cleanup of older entries when history limit is reached
- One-click option to clear clipboard history
- Lightweight with minimal resource usage
- Compatible with GNOME 46

## Installation

### From GNOME Extensions Website

1. Visit [extensions.gnome.org](https://extensions.gnome.org) and search for "Clipboard History"
2. Toggle the switch to install and enable the extension

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/shailesh43/clipboard-history.git
   ```

2. Copy the extension to your GNOME extensions directory:
   ```bash
   cp -r clipboard-history ~/.local/share/gnome-shell/extensions/clipboardhistory@shailesh43.github.io
   ```

3. Restart GNOME Shell:
   - Press `Alt+F2`
   - Type `r` and press Enter

4. Enable the extension using GNOME Extensions app or with:
   ```bash
   gnome-extensions enable clipboardhistory@shailesh43.github.io
   ```

## Usage

1. Click on the clipboard icon (📋) in the top panel to open the clipboard history menu
2. Select any previous clipboard entry to copy it back to your clipboard
3. Use the "Clear History" option to remove all stored entries

## Development

This extension is developed using JavaScript for GNOME Shell 46. The main components are:

- `extension.js`: Main extension code
- `metadata.json`: Extension metadata and configuration

### Building and Testing

To test changes during development:

1. Make your code changes
2. Enable extension debugging:
   ```bash
   gsettings set org.gnome.shell.extensions.user-theme.enabled false
   ```
3. Look at the log output:
   ```bash
   journalctl -f -o cat /usr/bin/gnome-shell
   ```

## Configuration

The extension currently uses these default settings:
- Maximum history size: 20 items
- Clipboard polling interval: 2 seconds

## Planned Features

- Configurable history size
- Keyboard shortcuts for quick access
- Search functionality for finding specific clipboard items
- Rich text and image support
- Pinning important clipboard items
- Categorization of clipboard entries

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

## Acknowledgments

- Thanks to the GNOME Shell team for their excellent extension API
- Inspired by clipboard managers from various desktop environments

## Contact

- GitHub: [https://github.com/shailesh43](https://github.com/shailesh43)
- Issues: [https://github.com/shailesh43/clipboard-history/issues](https://github.com/shailesh43/clipboard-history/issues)
