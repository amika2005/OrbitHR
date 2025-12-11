// @ts-ignore
import Imap from "imap";
// @ts-ignore
import { simpleParser } from "mailparser";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
  size: number;
}

export interface EmailMessage {
  from: string;
  subject: string;
  body: string;
  date: Date;
  attachments: EmailAttachment[];
}

export async function connectToGmail(email: string, password: string): Promise<Imap> {
  const imap = new Imap({
    user: email,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  });

  return new Promise((resolve, reject) => {
    imap.once("ready", () => resolve(imap));
    imap.once("error", reject);
    imap.connect();
  });
}

export async function fetchUnreadEmails(imap: Imap): Promise<EmailMessage[]> {
  return new Promise((resolve, reject) => {
    imap.openBox("INBOX", false, (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      // Search for unread emails
      imap.search(["UNSEEN"], async (err: any, results: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!results || results.length === 0) {
          resolve([]);
          return;
        }

        const messages: EmailMessage[] = [];
        const fetch = imap.fetch(results, { bodies: "", markSeen: true });

        fetch.on("message", (msg: any) => {
          msg.on("body", async (stream: any) => {
            const parsed = await simpleParser(stream);
            
            const attachments: EmailAttachment[] = [];
            if (parsed.attachments) {
              for (const att of parsed.attachments) {
                // Only process CV files
                const filename = att.filename || "";
                if (
                  filename.endsWith(".pdf") ||
                  filename.endsWith(".docx") ||
                  filename.endsWith(".doc")
                ) {
                  attachments.push({
                    filename,
                    content: att.content,
                    contentType: att.contentType,
                    size: att.size,
                  });
                }
              }
            }

            if (attachments.length > 0) {
              messages.push({
                from: parsed.from?.text || "",
                subject: parsed.subject || "",
                body: parsed.text || "",
                date: parsed.date || new Date(),
                attachments,
              });
            }
          });
        });

        fetch.once("end", () => {
          resolve(messages);
        });

        fetch.once("error", reject);
      });
    });
  });
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cv_inbox",
        resource_type: "raw",
        public_id: `${Date.now()}_${filename}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export function closeConnection(imap: Imap) {
  imap.end();
}
