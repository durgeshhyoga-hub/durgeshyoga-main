-- Add Google Drive link to gallery site_content
INSERT INTO site_content (section_key, content)
VALUES ('gallery_drive_link', '{"button_text": "View Full Gallery", "drive_url": "", "enabled": false}')
ON CONFLICT (section_key) DO NOTHING;