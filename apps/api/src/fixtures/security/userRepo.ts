import path from 'path';
import fs from 'fs';

// CWE-89: SQL Injection
export function searchUsersRaw(emailInput: string): string {
  return "SELECT * FROM app_users WHERE email = '" + emailInput + "' AND status = 'ACTIVE';";
}

// CWE-22: Path Traversal
export function downloadUserAttachment(fileName: string): string {
  const filePath = path.join(process.cwd(), 'attachments', fileName);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return "Attachment not found";
}
