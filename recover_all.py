import json
import glob
import os

logs = glob.glob(r'c:\Users\ACER\.gemini\antigravity\brain\*\.system_generated\logs\overview.txt')

def find_latest_full_file(target_filename):
    candidates = []
    for log in logs:
        try:
            with open(log, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        if data.get('source') == 'MODEL':
                            for tool in data.get('tool_calls', []):
                                if tool['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                                    args = tool['args']
                                    if target_filename in args.get('TargetFile', ''):
                                        if 'CodeContent' in args:
                                            content = args['CodeContent']
                                        elif 'ReplacementContent' in args:
                                            content = args['ReplacementContent']
                                        elif 'ReplacementChunks' in args:
                                            # Skip chunks since we want full file
                                            continue
                                        else:
                                            continue
                                        
                                        if content and '<truncated' not in content:
                                            mtime = os.path.getmtime(log)
                                            candidates.append((mtime, content, log))
                    except:
                        pass
        except:
            pass
            
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0]
    return None

preview = find_latest_full_file('EditorPreview.tsx')
if preview:
    print('Found full EditorPreview in', preview[2])
    with open(r'c:\Users\ACER\pojok-potret\components\editor\EditorPreview.tsx', 'w', encoding='utf-8') as f:
        f.write(preview[1])
else:
    print('No full EditorPreview found in model tool calls.')

panel = find_latest_full_file('EditorRightPanel.tsx')
if panel:
    print('Found full EditorRightPanel in', panel[2])
    with open(r'c:\Users\ACER\pojok-potret\components\editor\EditorRightPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(panel[1])
else:
    print('No full EditorRightPanel found in model tool calls.')
