import os, re, json

src_dir = r'frontend/src'
exclude = 'LiveMap.jsx'

hex_pattern = re.compile(r'#[0-9a-fA-F]{3,8}')
arbitrary_px_pattern = re.compile(r'(text-\[\d+px\]|rounded-\[\d+px\]|bg-\[#[0-9a-fA-F]{3,8}\]|text-\[#[0-9a-fA-F]{3,8}\]|border-\[#[0-9a-fA-F]{3,8}\])')
spec_pattern = re.compile(r'\(Section\s*[\d\.]+\)|\(Item\s*[\d\.]+\)|\(Req\s*[\d\.]+\)|Section\s+\d|Item\s+\d', re.IGNORECASE)
marketing_pattern = re.compile(r'\b(seamless|empower|ecosystem|unlock|excellence)\b', re.IGNORECASE)
all_caps_pattern = re.compile(r'\b(HEALTHY|CRITICAL|ON TRIP|PENDING|COMPLETED|DISPATCHED|IN PROGRESS|ACTIVE|INACTIVE|LOW LEVEL|ONTRIP|IN_PROGRESS)\b')

file_violations = {}

for root, dirs, files in os.walk(src_dir):
    for f in sorted(files):
        if f == exclude or not (f.endswith('.jsx') or f.endswith('.js')):
            continue
        path = os.path.join(root, f)
        rel = os.path.relpath(path, 'frontend/src').replace('\\', '/')
        
        with open(path, 'r', encoding='utf-8', errors='ignore') as file_obj:
            lines = file_obj.readlines()
            
        v_list = []
        for lno, line in enumerate(lines, 1):
            cl = line.strip()
            if not cl or cl.startswith('//') or cl.startswith('/*') or cl.startswith('*'):
                continue
                
            # Rule 1: Hex or text-[Npx]
            arb_px = arbitrary_px_pattern.findall(line)
            if arb_px:
                v_list.append({'line': lno, 'rule': 'Rule 1 (Arbitrary px/hex)', 'desc': f"Custom arbitrary values: {', '.join(arb_px)}"})
            elif hex_pattern.search(line) and not line.strip().startswith('import'):
                if 'style=' in line or 'color' in line.lower() or '#' in line:
                    v_list.append({'line': lno, 'rule': 'Rule 1 (Hex code)', 'desc': f"Hardcoded hex code: {', '.join(hex_pattern.findall(line))}"})

            # Rule 3: backdrop-blur / shadow-2xl / glassmorphism
            if 'backdrop-blur' in line or 'shadow-2xl' in line:
                v_list.append({'line': lno, 'rule': 'Rule 3 (Card Effects)', 'desc': 'Heavy shadow or backdrop-blur present'})
                
            # Rule 5: uppercase / tracking-wider on headings/labels
            if ('uppercase' in line or 'tracking-wider' in line or 'tracking-wide' in line) and not '<th' in line:
                v_list.append({'line': lno, 'rule': 'Rule 5 (Typography Casing/Spacing)', 'desc': 'Uppercase or wide letter-spacing used'})
                
            # Rule 6: All-caps status / raw enum
            if all_caps_pattern.search(line) and not 'const' in line and not 'case' in line:
                m_enum = all_caps_pattern.search(line).group(0)
                v_list.append({'line': lno, 'rule': 'Rule 6 (Raw Enum / All-Caps Badge)', 'desc': f"Raw enum or all-caps text: {m_enum}"})
                
            # Rule 8: Internal references
            spec_m = spec_pattern.search(line)
            if spec_m:
                v_list.append({'line': lno, 'rule': 'Rule 8 (Internal Spec Ref)', 'desc': f"Internal reference present: {spec_m.group(0)}"})
                
            # Rule 9: Marketing words
            mkg_m = marketing_pattern.search(line)
            if mkg_m:
                v_list.append({'line': lno, 'rule': 'Rule 9 (Marketing Words)', 'desc': f"Marketing word present: {mkg_m.group(0)}"})

        if v_list:
            file_violations[rel] = v_list

print(f"Scanned {len(file_violations)} files with rule checkpoints.")

with open('scratch/ui_rules_audit.json', 'w', encoding='utf-8') as out:
    json.dump(file_violations, out, indent=2)
