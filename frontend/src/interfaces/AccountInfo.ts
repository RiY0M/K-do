export interface AccountInfo {
    id: string;
    name: string;
    email: string | null;
}

export interface AccountUpdate {
    name: string;
    // "" removes the e-mail address
    email: string;
    // "" keeps the current password
    newPassword: string;
    // Required to change the e-mail address or the password
    currentPassword: string;
}

export interface UpdatedAccount extends AccountInfo {
    // Masked address the "undo" e-mail was sent to, null if none was sent
    undoEmailSentTo: string | null;
}
