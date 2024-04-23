export interface MailProps {
    from?: string;
    to: string;
    subject?: string;
    template?: string;
    attachments?: object[];
  }
  
  export interface MailOptions {
    to: string;
    token: string;
    email?: string;
    password?: string;
  }
  