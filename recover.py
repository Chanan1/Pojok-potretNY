import os
import glob
import time

history_path = r'C:\Users\ACER\AppData\Roaming\Code\User\History\**\*'

def find_latest_backup(search_string):
    candidates = []
    for filepath in glob.iglob(history_path, recursive=True):
        if os.path.isfile(filepath):
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if search_string in content and '<truncated' not in content:
                        mtime = os.path.getmtime(filepath)
                        candidates.append((mtime, filepath, content))
            except:
                pass
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0]
    return None

print("Searching for EditorPreview...")
preview = find_latest_backup('export function EditorPreview() {')
if preview:
    print(f"Found EditorPreview backup at {preview[1]} modified {time.ctime(preview[0])}")
    with open(r'c:\Users\ACER\pojok-potret\components\editor\EditorPreview.tsx', 'w', encoding='utf-8') as out:
        out.write(preview[2])
else:
    print("EditorPreview backup not found")

print("Searching for EditorRightPanel...")
panel = find_latest_backup('export function EditorRightPanel() {')
if panel:
    print(f"Found EditorRightPanel backup at {panel[1]} modified {time.ctime(panel[0])}")
    with open(r'c:\Users\ACER\pojok-potret\components\editor\EditorRightPanel.tsx', 'w', encoding='utf-8') as out:
        out.write(panel[2])
else:
    print("EditorRightPanel backup not found")
