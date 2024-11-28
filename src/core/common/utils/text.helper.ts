export default class TextHelper {
  public static sanitize(text: string): string {
    if (!text || typeof text !== 'string') {
      return;
    }

    const trimmed = text.trim();
    const noNewLines = this.removeNewLines(trimmed);
    const noSQL = this.escapeSQL(noNewLines);
    return this.escapeHTML(noSQL);
  }

  private static escapeSQL(text: string): string {
    const sqlEscapes: { [key: string]: string } = {
      "'": "''", // Escape single quotes
      '"': '\\"', // Escape double quotes
      ';': '\\;', // Escape semicolons
    };

    // First, escape -- SQL comments
    text = text.replace(/--/g, '\\--');

    // Then, escape the other SQL characters
    return text.replace(/['";]/g, (char) => sqlEscapes[char] || char);
  }

  private static escapeHTML(text: string): string {
    const htmlEscapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }

  private static removeNewLines(text: string): string {
    return text.replace(/(\r\n|\n|\r)/g, ' '); // Removes \n, \r, \r\n
  }
}
